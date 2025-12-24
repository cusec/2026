import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// Helper function to check if item is within activation period
function isWithinActivationPeriod(item: {
  activationStart?: Date | null;
  activationEnd?: Date | null;
}): boolean {
  const now = new Date();

  if (item.activationStart && item.activationEnd) {
    const startDate = new Date(item.activationStart);
    const endDate = new Date(item.activationEnd);
    return now >= startDate && now <= endDate;
  }

  // If no activation period set, item is always available
  return true;
}

// GET - Fetch all collectibles (Available to all authenticated users)
// For shop display, only returns active collectibles within activation period
export async function GET(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    await connectMongoDB();
    const collectibles = await Collectible.find({}).sort({ createdAt: -1 });

    // If includeAll is true (admin request), return all collectibles
    // Otherwise, filter to only return active collectibles within activation period
    const filteredCollectibles = includeAll
      ? collectibles
      : collectibles.filter(
          (item) => item.active && isWithinActivationPeriod(item)
        );

    return NextResponse.json({
      success: true,
      collectibles: filteredCollectibles,
    });
  } catch (error) {
    console.error("Error fetching collectibles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new collectible (Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      cost,
      purchasable,
      limited,
      remaining,
      active,
      activationStart,
      activationEnd,
      imageData,
      imageContentType,
    } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectMongoDB();

    // Check if name already exists (name must be unique)
    const existingCollectible = await Collectible.findOne({ name });
    if (existingCollectible) {
      return NextResponse.json(
        { error: "A collectible with this name already exists" },
        { status: 400 }
      );
    }

    const collectible = new Collectible({
      name,
      description: description || "",
      cost: cost || 0,
      purchasable: purchasable || false,
      limited: limited || false,
      remaining: remaining || 0,
      active: active !== undefined ? active : true,
      activationStart: activationStart || null,
      activationEnd: activationEnd || null,
      imageData: imageData || null,
      imageContentType: imageContentType || null,
    });

    await collectible.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const newData = sanitizeDataForLogging({
        name: collectible.name,
        description: collectible.description,
        cost: collectible.cost,
        purchasable: collectible.purchasable,
        limited: collectible.limited,
        remaining: collectible.remaining,
        active: collectible.active,
      });

      await logAdminAction({
        adminEmail,
        action: "CREATE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: collectible._id.toString(),
        details: { name: collectible.name },
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      collectible,
    });
  } catch (error) {
    console.error("Error creating collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

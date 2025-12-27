import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch all hunt items (Available only to admins)
export async function GET() {
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

    await connectMongoDB();
    const huntItems = await HuntItem.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      huntItems,
    });
  } catch (error) {
    console.error("Error fetching hunt items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new hunt item (Admin only)
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
      identifier,
      points,
      maxClaims,
      active,
      activationStart,
      activationEnd,
      collectibles,
    } = await request.json();

    if (!name || !identifier) {
      return NextResponse.json(
        { error: "Name and identifier are required" },
        { status: 400 }
      );
    }

    // Validate activation dates if provided
    if (
      (activationStart && !activationEnd) ||
      (!activationStart && activationEnd)
    ) {
      return NextResponse.json(
        {
          error:
            "Both activation start and end dates must be provided, or neither",
        },
        { status: 400 }
      );
    }

    if (activationStart && activationEnd) {
      const startDate = new Date(activationStart);
      const endDate = new Date(activationEnd);
      if (endDate <= startDate) {
        return NextResponse.json(
          { error: "Activation end date must be after start date" },
          { status: 400 }
        );
      }
    }

    await connectMongoDB();

    // Check if identifier already exists
    const existingItem = await HuntItem.findOne({ identifier });
    if (existingItem) {
      return NextResponse.json(
        { error: "Hunt item with this identifier already exists" },
        { status: 400 }
      );
    }

    const huntItem = new HuntItem({
      name,
      description,
      identifier,
      points: points || 0,
      maxClaims: maxClaims !== undefined ? maxClaims : null,
      claimCount: 0,
      active: active !== undefined ? active : true,
      activationStart: activationStart ? new Date(activationStart) : null,
      activationEnd: activationEnd ? new Date(activationEnd) : null,
      collectibles: collectibles || [],
    });

    await huntItem.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const newData = sanitizeDataForLogging({
        name: huntItem.name,
        description: huntItem.description,
        identifier: huntItem.identifier,
        points: huntItem.points,
        maxClaims: huntItem.maxClaims,
        claimCount: huntItem.claimCount,
        active: huntItem.active,
        activationStart: huntItem.activationStart,
        activationEnd: huntItem.activationEnd,
        collectibles: huntItem.collectibles,
      });

      await logAdminAction({
        adminEmail,
        action: "CREATE_HUNT_ITEM",
        resourceType: "huntItem",
        resourceId: huntItem._id.toString(),
        details: { name: huntItem.name, identifier: huntItem.identifier },
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      huntItem,
    });
  } catch (error) {
    console.error("Error creating hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

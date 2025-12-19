import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch all collectibles (Available to all authenticated users)
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const collectibles = await Collectible.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      collectibles,
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
      subtitle,
      description,
      slug,
      points,
      purchasable,
      imageData,
      imageContentType,
    } = await request.json();

    if (!name || !slug || !imageData || !imageContentType) {
      return NextResponse.json(
        { error: "Name, slug, image data and image content type are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if slug already exists
    const existingCollectible = await Collectible.findOne({ slug });
    if (existingCollectible) {
      return NextResponse.json(
        { error: "Collectible with this slug already exists" },
        { status: 400 }
      );
    }

    const collectible = new Collectible({
      name,
      subtitle: subtitle || "",
      description: description || "",
      slug,
      points: points || 0,
      purchasable: purchasable || false,
      imageData,
      imageContentType,
    });

    await collectible.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const newData = sanitizeDataForLogging({
        name: collectible.name,
        subtitle: collectible.subtitle,
        description: collectible.description,
        slug: collectible.slug,
        points: collectible.points,
        purchasable: collectible.purchasable,
      });

      await logAdminAction({
        adminEmail,
        action: "CREATE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: collectible._id.toString(),
        details: { name: collectible.name, slug: collectible.slug },
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

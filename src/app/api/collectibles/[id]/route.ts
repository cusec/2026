import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch a specific collectible
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectMongoDB();
    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      collectible,
    });
  } catch (error) {
    console.error("Error fetching collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a collectible (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const {
      name,
      subtitle,
      description,
      points,
      purchasable,
      imageData,
      imageContentType,
    } = await request.json();

    await connectMongoDB();

    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Store previous data for audit log
    const previousData = sanitizeDataForLogging({
      name: collectible.name,
      subtitle: collectible.subtitle,
      description: collectible.description,
      points: collectible.points,
      purchasable: collectible.purchasable,
    });

    // Update fields (slug cannot be changed)
    if (name !== undefined) collectible.name = name;
    if (subtitle !== undefined) collectible.subtitle = subtitle;
    if (description !== undefined) collectible.description = description;
    if (points !== undefined) collectible.points = points;
    if (purchasable !== undefined) collectible.purchasable = purchasable;
    if (imageData !== undefined) collectible.imageData = imageData;
    if (imageContentType !== undefined)
      collectible.imageContentType = imageContentType;

    await collectible.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const newData = sanitizeDataForLogging({
        name: collectible.name,
        subtitle: collectible.subtitle,
        description: collectible.description,
        points: collectible.points,
        purchasable: collectible.purchasable,
      });

      await logAdminAction({
        adminEmail,
        action: "UPDATE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: collectible._id.toString(),
        details: { name: collectible.name, slug: collectible.slug },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      collectible,
    });
  } catch (error) {
    console.error("Error updating collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a collectible (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await connectMongoDB();

    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Store data for audit log
    const previousData = sanitizeDataForLogging({
      name: collectible.name,
      subtitle: collectible.subtitle,
      description: collectible.description,
      slug: collectible.slug,
      points: collectible.points,
      purchasable: collectible.purchasable,
    });

    await Collectible.findByIdAndDelete(id);

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "DELETE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: id,
        details: { name: collectible.name, slug: collectible.slug },
        previousData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Collectible deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

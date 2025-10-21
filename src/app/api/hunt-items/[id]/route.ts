import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// PUT - Update a hunt item (Admin only - name, description, and points)
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

    const { name, description, points } = await request.json();
    const { id } = await params;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectMongoDB();

    const huntItem = await HuntItem.findById(id);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      name: huntItem.name,
      description: huntItem.description,
      points: huntItem.points,
    });

    // Update only allowed fields (not identifier)
    huntItem.name = name;
    huntItem.description = description;
    huntItem.points = points || 0;

    await huntItem.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      name: huntItem.name,
      description: huntItem.description,
      points: huntItem.points,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "UPDATE_HUNT_ITEM",
        resourceType: "huntItem",
        resourceId: id,
        details: {
          name: huntItem.name,
          identifier: huntItem.identifier,
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      huntItem,
    });
  } catch (error) {
    console.error("Error updating hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hunt item (Admin only)
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

    const huntItem = await HuntItem.findById(id);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Store data for audit logging before deletion
    const deletedData = sanitizeDataForLogging({
      name: huntItem.name,
      description: huntItem.description,
      identifier: huntItem.identifier,
      points: huntItem.points,
    });

    // Delete the hunt item
    await HuntItem.findByIdAndDelete(id);

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "DELETE_HUNT_ITEM",
        resourceType: "huntItem",
        resourceId: id,
        details: {
          name: huntItem.name,
          identifier: huntItem.identifier,
        },
        previousData: deletedData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Hunt item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

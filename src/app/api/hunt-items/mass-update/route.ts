import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// POST - Mass update points for future hunt items (Admin only)
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

    const { pointsChange } = await request.json();

    if (pointsChange === undefined || pointsChange === 0) {
      return NextResponse.json(
        { error: "Points change value is required and cannot be zero" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const now = new Date();

    // Find all hunt items with activation start time in the future
    const futureItems = await HuntItem.find({
      activationStart: { $gt: now },
    });

    if (futureItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No future hunt items found to update",
        updatedCount: 0,
      });
    }

    // Store previous data for audit logging
    const previousData = futureItems.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      points: item.points,
    }));

    // Update all future items
    const updatePromises = futureItems.map(async (item) => {
      const newPoints = Math.max(0, item.points + pointsChange); // Ensure points don't go negative
      item.points = newPoints;
      return item.save();
    });

    await Promise.all(updatePromises);

    // Fetch updated items to return
    const updatedItems = await HuntItem.find({
      _id: { $in: futureItems.map((item) => item._id) },
    });

    const newData = updatedItems.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      points: item.points,
    }));

    // Log admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "MASS_UPDATE_HUNT_ITEMS_POINTS",
        resourceType: "huntItem",
        details: {
          pointsChange,
          itemCount: futureItems.length,
        },
        previousData: sanitizeDataForLogging(previousData),
        newData: sanitizeDataForLogging(newData),
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${futureItems.length} hunt item(s)`,
      updatedCount: futureItems.length,
      updatedItems: newData,
    });
  } catch (error) {
    console.error("Error mass updating hunt items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

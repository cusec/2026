import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// POST - Mass adjust points for all users who claimed a specific hunt item (Admin only)
export async function POST(
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

    const { pointsAdjustment } = await request.json();
    const { id: huntItemId } = await params;

    if (pointsAdjustment === undefined || pointsAdjustment === 0) {
      return NextResponse.json(
        { error: "Points adjustment must be a non-zero number" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Get hunt item info for logging
    const huntItem = await HuntItem.findById(huntItemId);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Find all users who have this hunt item in their claimedItems
    const users = await User.find({
      claimedItems: huntItemId,
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users have claimed this hunt item" },
        { status: 400 }
      );
    }

    // Store previous data for audit logging
    const previousUserPoints = users.map((user) => ({
      email: user.email,
      points: user.points || 0,
    }));

    // Update all users' points
    const updateResults = await Promise.all(
      users.map(async (user) => {
        const previousPoints = user.points || 0;
        // Ensure points don't go below 0
        user.points = Math.max(0, previousPoints + pointsAdjustment);
        await user.save();
        return {
          email: user.email,
          previousPoints,
          newPoints: user.points,
        };
      })
    );

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "MASS_ADJUST_POINTS",
        resourceType: "huntItem",
        resourceId: huntItemId,
        details: {
          huntItemName: huntItem.name,
          huntItemIdentifier: huntItem.identifier,
          pointsAdjustment,
          usersAffected: users.length,
          adjustmentType: pointsAdjustment > 0 ? "add" : "remove",
        },
        previousData: sanitizeDataForLogging({
          userPoints: previousUserPoints,
        }),
        newData: sanitizeDataForLogging({
          userPoints: updateResults,
        }),
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully adjusted points for ${users.length} user(s)`,
      usersAffected: users.length,
      pointsAdjustment,
      results: updateResults,
    });
  } catch (error) {
    console.error("Error mass adjusting points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

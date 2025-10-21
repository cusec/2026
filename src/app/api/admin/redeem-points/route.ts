import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import isVolunteer from "@/lib/isVolunteer";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// POST - Redeem points from a user (Admin or Volunteer only)
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or volunteer
    const isUserAdmin = await isAdmin();
    const isUserVolunteer = await isVolunteer();

    if (!isUserAdmin && !isUserVolunteer) {
      return NextResponse.json(
        { error: "Forbidden: Admin or Volunteer access required" },
        { status: 403 }
      );
    }

    const { userId, pointsToRedeem } = await request.json();

    if (!userId || !pointsToRedeem) {
      return NextResponse.json(
        { error: "User ID and points to redeem are required" },
        { status: 400 }
      );
    }

    if (pointsToRedeem <= 0) {
      return NextResponse.json(
        { error: "Points to redeem must be a positive number" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough points
    if (user.points < pointsToRedeem) {
      return NextResponse.json(
        { error: "User does not have enough points" },
        { status: 400 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      points: user.points,
    });

    // Redeem points (only reduction allowed)
    const newPoints = user.points - pointsToRedeem;
    user.points = newPoints;

    await user.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      points: user.points,
    });

    // Log the action
    const userEmail = session.user.email;
    if (userEmail) {
      const userRole = isUserAdmin ? "Admin" : "Volunteer";

      await logAdminAction({
        adminEmail: userEmail,
        action: "REDEEM_USER_POINTS",
        resourceType: "user",
        targetUserEmail: user.email,
        resourceId: userId,
        details: {
          pointsRedeemed: pointsToRedeem,
          userRole,
          previousPoints: previousData?.points || 0,
          newPoints: newData?.points || 0,
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${pointsToRedeem} points`,
      newPoints: user.points,
      pointsRedeemed: pointsToRedeem,
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

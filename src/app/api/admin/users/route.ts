import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch all users with optional search (Admin only)
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    await connectMongoDB();

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("email name points history claim_attempts createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        historyCount: user.history.length,
        claimAttemptsCount: user.claim_attempts?.length || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      pagination: {
        total: totalUsers,
        offset,
        limit,
        hasMore: offset + limit < totalUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user data (Admin only)
export async function PUT(request: Request) {
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

    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      name: user.name,
      points: user.points,
      historyLength: user.history.length,
      claimAttemptsLength: user.claim_attempts?.length || 0,
    });

    // Apply updates
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.points !== undefined) user.points = updates.points;

    // Handle dangerous operations
    if (updates.clearHistory === true) {
      user.history = [];
      user.points = 0; // Reset points when clearing history
    }

    if (updates.clearClaimAttempts === true) {
      user.claim_attempts = [];
    }

    await user.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      name: user.name,
      points: user.points,
      historyLength: user.history.length,
      claimAttemptsLength: user.claim_attempts?.length || 0,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      let action = "UPDATE_USER";

      if (
        updates.clearHistory === true &&
        updates.clearClaimAttempts === true
      ) {
        action = "CLEAR_USER_HISTORY_AND_ATTEMPTS";
      } else if (updates.clearHistory === true) {
        action = "CLEAR_USER_HISTORY";
      } else if (updates.clearClaimAttempts === true) {
        action = "CLEAR_USER_CLAIM_ATTEMPTS";
      }

      await logAdminAction({
        adminEmail,
        action,
        resourceType: "user",
        targetUserEmail: user.email,
        resourceId: userId,
        details: { updates },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        historyCount: user.history.length,
        claimAttemptsCount: user.claim_attempts?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

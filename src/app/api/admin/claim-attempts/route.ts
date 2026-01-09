import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch claim attempts for monitoring (Admin only)
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
    const email = searchParams.get("email");
    const failedOnly = searchParams.get("failed") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    await connectMongoDB();

    const query = email ? { email } : {};

    // First, get all users with claim attempts for accurate stats
    const users = await User.find(query).select("email name claim_attempts");

    interface ClaimAttemptWithUser {
      userEmail: string;
      userName?: string;
      identifier: string;
      success: boolean;
      timestamp: Date;
      item_id?: string;
    }

    let allClaimAttempts: ClaimAttemptWithUser[] = [];

    users.forEach((user) => {
      if (user.claim_attempts && user.claim_attempts.length > 0) {
        user.claim_attempts.forEach(
          (attempt: {
            identifier: string;
            success: boolean;
            timestamp: Date;
            item_id?: string;
          }) => {
            if (!failedOnly || !attempt.success) {
              allClaimAttempts.push({
                userEmail: user.email,
                userName: user.name,
                identifier: attempt.identifier,
                success: attempt.success,
                timestamp: attempt.timestamp,
                item_id: attempt.item_id?.toString(),
              });
            }
          }
        );
      }
    });

    // Sort by timestamp descending
    allClaimAttempts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate stats from all attempts (before pagination)
    const stats = {
      totalAttempts: allClaimAttempts.length,
      failedAttempts: allClaimAttempts.filter((attempt) => !attempt.success)
        .length,
      successfulAttempts: allClaimAttempts.filter((attempt) => attempt.success)
        .length,
      uniqueUsers: new Set(allClaimAttempts.map((attempt) => attempt.userEmail))
        .size,
    };

    // Apply pagination
    const paginatedAttempts = allClaimAttempts.slice(skip, skip + limit);
    const totalPages = Math.ceil(allClaimAttempts.length / limit);

    return NextResponse.json({
      success: true,
      claimAttempts: paginatedAttempts,
      stats,
      pagination: {
        page,
        limit,
        totalItems: allClaimAttempts.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching claim attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Clear claim attempts for a user (Admin only)
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

    const { userEmail, clearType } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    const validClearTypes = ["failed", "all", "rate-limit"];
    if (!validClearTypes.includes(clearType)) {
      return NextResponse.json(
        {
          error: "Invalid clear type. Must be 'failed', 'all', or 'rate-limit'",
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure claim_attempts array exists
    if (!user.claim_attempts) {
      user.claim_attempts = [];
    }

    // Store previous data for audit logging
    const previousAttempts = [...user.claim_attempts];
    const previousData = sanitizeDataForLogging({
      claimAttemptsCount: user.claim_attempts.length,
      failedAttemptsCount: user.claim_attempts.filter(
        (attempt: { success: boolean }) => !attempt.success
      ).length,
    });

    if (clearType === "failed") {
      // Clear only failed attempts
      user.claim_attempts = user.claim_attempts.filter(
        (attempt: { success: boolean }) => attempt.success
      );
    } else if (clearType === "rate-limit") {
      // Clear only recent failed attempts (last 15 minutes) to reset rate limit
      const now = new Date();
      const windowStart = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago

      user.claim_attempts = user.claim_attempts.filter(
        (attempt: { success: boolean; timestamp: Date }) =>
          attempt.success || new Date(attempt.timestamp) < windowStart
      );
    } else {
      // Clear all attempts
      user.claim_attempts = [];
    }

    await user.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      claimAttemptsCount: user.claim_attempts.length,
      failedAttemptsCount: user.claim_attempts.filter(
        (attempt: { success: boolean }) => !attempt.success
      ).length,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const actionMap = {
        failed: "CLEAR_CLAIM_ATTEMPTS_FAILED",
        all: "CLEAR_CLAIM_ATTEMPTS_ALL",
        "rate-limit": "RESET_RATE_LIMIT",
      };
      const action = actionMap[clearType as keyof typeof actionMap];

      await logAdminAction({
        adminEmail,
        action,
        resourceType: "claimAttempts",
        targetUserEmail: userEmail,
        resourceId: user._id.toString(),
        details: {
          clearType,
          attemptsClearedCount:
            previousAttempts.length - user.claim_attempts.length,
        },
        previousData,
        newData,
        request,
      });
    }

    const messageMap = {
      failed: "failed",
      all: "all",
      "rate-limit": "rate limit (recent failed attempts)",
    };
    const message = messageMap[clearType as keyof typeof messageMap];

    return NextResponse.json({
      success: true,
      message: `Cleared ${message} claim attempts for ${userEmail}`,
    });
  } catch (error) {
    console.error("Error clearing claim attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a claimed item from a user's history (Admin only)
export async function DELETE(request: Request) {
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

    const { userEmail, huntItemId } = await request.json();

    if (!userEmail || !huntItemId) {
      return NextResponse.json(
        { error: "User email and hunt item ID are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const huntItem = await HuntItem.findById(huntItemId);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Check if the item is in the user's claimedItems
    const itemIndex = user.claimedItems.findIndex(
      (id: { toString: () => string }) => id.toString() === huntItemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Hunt item not found in user's claimed items" },
        { status: 400 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      claimedItemsCount: user.claimedItems.length,
      huntItemClaimCount: huntItem.claimCount,
      userPoints: user.points || 0,
    });

    // Remove the item from user's claimedItems
    user.claimedItems.splice(itemIndex, 1);

    // NOTE: Points are NOT updated when removing hunt items manually
    // Admin must manually adjust points if needed

    // Note: We intentionally keep the claim attempt record for audit/history purposes

    await user.save();

    // Decrement the claimCount on the hunt item
    huntItem.claimCount = Math.max(0, (huntItem.claimCount || 0) - 1);
    await huntItem.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      claimedItemsCount: user.claimedItems.length,
      huntItemClaimCount: huntItem.claimCount,
      userPoints: user.points,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "REMOVE_CLAIMED_ITEM",
        resourceType: "claimAttempts",
        targetUserEmail: userEmail,
        resourceId: huntItemId,
        details: {
          huntItemName: huntItem.name,
          huntItemIdentifier: huntItem.identifier,
          huntItemPoints: huntItem.points,
          note: "Points were NOT updated",
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Removed "${huntItem.name}" from ${userEmail}'s claimed items. Note: Points were not updated.`,
    });
  } catch (error) {
    console.error("Error removing claimed item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

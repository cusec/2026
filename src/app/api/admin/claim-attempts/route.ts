import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
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
    const limit = parseInt(searchParams.get("limit") || "100");

    await connectMongoDB();

    const query = email ? { email } : {};

    const users = await User.find(query)
      .select("email name claim_attempts")
      .sort({ "claim_attempts.timestamp": -1 })
      .limit(limit);

    interface ClaimAttemptWithUser {
      userEmail: string;
      userName?: string;
      identifier: string;
      success: boolean;
      timestamp: Date;
      item_id?: string;
    }

    let claimAttempts: ClaimAttemptWithUser[] = [];

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
              claimAttempts.push({
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
    claimAttempts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit after combining all attempts
    claimAttempts = claimAttempts.slice(0, limit);

    const stats = {
      totalAttempts: claimAttempts.length,
      failedAttempts: claimAttempts.filter((attempt) => !attempt.success)
        .length,
      successfulAttempts: claimAttempts.filter((attempt) => attempt.success)
        .length,
      uniqueUsers: new Set(claimAttempts.map((attempt) => attempt.userEmail))
        .size,
    };

    return NextResponse.json({
      success: true,
      claimAttempts,
      stats,
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
      const action =
        clearType === "failed"
          ? "CLEAR_CLAIM_ATTEMPTS_FAILED"
          : "CLEAR_CLAIM_ATTEMPTS_ALL";

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

    return NextResponse.json({
      success: true,
      message: `Cleared ${
        clearType === "failed" ? "failed" : "all"
      } claim attempts for ${userEmail}`,
    });
  } catch (error) {
    console.error("Error clearing claim attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem, User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// Rate limiting configuration
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW_MINUTES = 15;

interface ClaimAttempt {
  identifier: string;
  success: boolean;
  timestamp: Date;
  item_id?: string;
}

// Check if user has exceeded failed claim attempts rate limit
function checkRateLimit(claimAttempts: ClaimAttempt[]) {
  const now = new Date();
  const windowStart = new Date(
    now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  );

  const recentFailedAttempts = claimAttempts.filter(
    (attempt) => !attempt.success && new Date(attempt.timestamp) >= windowStart
  );

  const isRateLimited = recentFailedAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS;
  const remainingAttempts = Math.max(
    0,
    RATE_LIMIT_MAX_ATTEMPTS - recentFailedAttempts.length
  );

  let resetTime = null;
  if (recentFailedAttempts.length > 0) {
    // Find the oldest failed attempt in the window
    const oldestAttempt = recentFailedAttempts.reduce((oldest, current) =>
      new Date(current.timestamp) < new Date(oldest.timestamp)
        ? current
        : oldest
    );
    resetTime = new Date(
      new Date(oldestAttempt.timestamp).getTime() +
        RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
    );
  }

  return {
    isRateLimited,
    remainingAttempts,
    resetTime,
    recentFailedAttempts: recentFailedAttempts.length,
  };
}

// POST - Claim a hunt item by identifier
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { identifier } = await request.json();
    const { id: userId } = await params;

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the user first - ensure the ID matches the authenticated user
    const user = await User.findOne({
      $and: [{ email: session.user.email }, { _id: userId }],
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // Ensure claim_attempts array exists (for existing users who might not have this field)
    if (!user.claim_attempts) {
      user.claim_attempts = [];
    }

    // Check rate limiting for failed attempts
    const rateLimitCheck = checkRateLimit(user.claim_attempts);
    if (rateLimitCheck.isRateLimited) {
      const minutesUntilReset = rateLimitCheck.resetTime
        ? Math.ceil(
            (rateLimitCheck.resetTime.getTime() - new Date().getTime()) /
              (1000 * 60)
          )
        : RATE_LIMIT_WINDOW_MINUTES;

      return NextResponse.json(
        {
          error: `Rate limit exceeded. You have made too many failed claim attempts. Please wait ${minutesUntilReset} minutes before trying again.`,
          rateLimitExceeded: true,
          resetTime: rateLimitCheck.resetTime,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    // Find the hunt item by identifier
    const huntItem = await HuntItem.findOne({ identifier });

    // Create claim attempt record
    const claimAttempt = {
      identifier,
      success: false,
      timestamp: new Date(),
      item_id: huntItem?._id || null,
    };

    if (!huntItem) {
      // Log failed attempt
      user.claim_attempts.push(claimAttempt);
      await user.save();

      // Check how many attempts remaining after this failed attempt
      const updatedRateLimitCheck = checkRateLimit(user.claim_attempts);
      const remainingAttempts = updatedRateLimitCheck.remainingAttempts;

      const errorMessage =
        remainingAttempts > 0
          ? `Hunt item not found. You have ${remainingAttempts} more attempts remaining in the next ${RATE_LIMIT_WINDOW_MINUTES} minutes.`
          : `Hunt item not found. Note: You can make up to ${RATE_LIMIT_MAX_ATTEMPTS} failed attempts every ${RATE_LIMIT_WINDOW_MINUTES} minutes.`;

      return NextResponse.json(
        {
          error: errorMessage,
          remainingAttempts,
          rateLimitInfo: {
            maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
            windowMinutes: RATE_LIMIT_WINDOW_MINUTES,
          },
        },
        { status: 404 }
      );
    }

    // Check if user has already claimed this item
    if (user.history.includes(huntItem._id)) {
      // Log failed attempt (duplicate claim)
      user.claim_attempts.push(claimAttempt);
      await user.save();

      // Check how many attempts remaining after this failed attempt
      const updatedRateLimitCheck = checkRateLimit(user.claim_attempts);
      const remainingAttempts = updatedRateLimitCheck.remainingAttempts;

      const errorMessage =
        remainingAttempts > 0
          ? `You have already claimed this hunt item. You have ${remainingAttempts} more attempts remaining in the next ${RATE_LIMIT_WINDOW_MINUTES} minutes.`
          : `You have already claimed this hunt item. Note: You can make up to ${RATE_LIMIT_MAX_ATTEMPTS} failed attempts every ${RATE_LIMIT_WINDOW_MINUTES} minutes.`;

      return NextResponse.json(
        {
          error: errorMessage,
          remainingAttempts,
          rateLimitInfo: {
            maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
            windowMinutes: RATE_LIMIT_WINDOW_MINUTES,
          },
        },
        { status: 400 }
      );
    }

    // Successful claim - update claim attempt and user data
    claimAttempt.success = true;
    user.claim_attempts.push(claimAttempt);
    user.history.push(huntItem._id);
    user.points += huntItem.points;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Successfully claimed "${huntItem.name}"!`,
      item: {
        name: huntItem.name,
        description: huntItem.description,
        points: huntItem.points,
      },
      newPoints: user.points,
      totalItemsClaimed: user.history.length,
    });
  } catch (error) {
    console.error("Error claiming hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

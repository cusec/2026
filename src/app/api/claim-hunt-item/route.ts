import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem, User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// POST - Claim a hunt item by identifier
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the user first
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Check if user has already claimed this item
    if (user.history.includes(huntItem._id)) {
      // Log failed attempt (duplicate claim)
      user.claim_attempts.push(claimAttempt);
      await user.save();

      return NextResponse.json(
        { error: "You have already claimed this hunt item" },
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

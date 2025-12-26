import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// POST - Redeem a collectible for the current user
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collectibleId } = await request.json();

    if (!collectibleId) {
      return NextResponse.json(
        { error: "Collectible ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the collectible
    const collectible = await Collectible.findById(collectibleId);
    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Check if collectible is purchasable
    if (!collectible.purchasable) {
      return NextResponse.json(
        { error: "This collectible is not available for purchase" },
        { status: 400 }
      );
    }

    // Check if collectible is active
    if (!collectible.active) {
      return NextResponse.json(
        { error: "This collectible is currently not available" },
        { status: 400 }
      );
    }

    // Check if collectible is within activation period
    if (collectible.activationStart && collectible.activationEnd) {
      const now = new Date();
      const startDate = new Date(collectible.activationStart);
      const endDate = new Date(collectible.activationEnd);
      if (now < startDate || now > endDate) {
        return NextResponse.json(
          { error: "This collectible is outside its availability period" },
          { status: 400 }
        );
      }
    }

    // Check if collectible is limited and has remaining stock
    if (collectible.limited && collectible.remaining <= 0) {
      return NextResponse.json(
        { error: "This collectible is sold out" },
        { status: 400 }
      );
    }

    // Find the current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough points
    if (user.points < collectible.cost) {
      return NextResponse.json(
        {
          error: "You do not have enough points",
          required: collectible.cost,
          available: user.points,
        },
        { status: 400 }
      );
    }

    // Deduct points from user
    user.points -= collectible.cost;

    // Add collectible to user's collectibles array with used: false
    if (!user.collectibles) {
      user.collectibles = [];
    }
    user.collectibles.push({
      collectibleId: collectible._id,
      used: false,
      addedAt: new Date(),
    });

    await user.save();

    // Decrement remaining count if limited
    if (collectible.limited) {
      collectible.remaining -= 1;
    }

    collectible.claimCount = (collectible.claimCount || 0) + 1;
    await collectible.save();

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${collectible.name}`,
      redemption: {
        collectible: {
          _id: collectible._id,
          name: collectible.name,
          cost: collectible.cost,
        },
        user: {
          newPoints: user.points,
        },
      },
    });
  } catch (error) {
    console.error("Error redeeming collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

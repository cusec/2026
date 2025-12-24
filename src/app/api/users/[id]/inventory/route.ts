import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, Collectible, ShopItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// GET - Fetch user's inventory (claimed hunt items, shop prizes, and collectibles)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    await connectMongoDB();

    // Find the user and populate their claimed items and shop prizes
    const user = await User.findOne({
      $and: [{ email: session.user.email }, { _id: userId }],
    })
      .populate("claimedItems")
      .populate("shopPrizes");

    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get collectible IDs from the user's collectibles array
    const collectibleIds = (user.collectibles || []).map(
      (c: { collectibleId: string }) => c.collectibleId
    );

    // Fetch all collectibles that the user owns
    const collectibleDocs = await Collectible.find({
      _id: { $in: collectibleIds },
    });

    // Create a map for quick lookup
    const collectibleMap = new Map(
      collectibleDocs.map((doc) => [doc._id.toString(), doc])
    );

    // Build the collectibles array with full data including used status
    const collectiblesWithDetails = (user.collectibles || []).map(
      (userCollectible: {
        collectibleId: { toString: () => string };
        used: boolean;
        addedAt: Date;
        _id: string;
      }) => {
        const collectibleDoc = collectibleMap.get(
          userCollectible.collectibleId.toString()
        );
        return {
          _id: userCollectible._id, // The unique ID for this specific instance
          collectibleId: userCollectible.collectibleId,
          used: userCollectible.used,
          addedAt: userCollectible.addedAt,
          // Include collectible details
          name: collectibleDoc?.name || "Unknown",
          description: collectibleDoc?.description || "",
          cost: collectibleDoc?.cost || 0,
          imageData: collectibleDoc?.imageData || "",
          imageContentType: collectibleDoc?.imageContentType || "",
        };
      }
    );

    return NextResponse.json({
      success: true,
      inventory: {
        claimedItems: user.claimedItems || [],
        shopPrizes: user.shopPrizes || [],
        collectibles: collectiblesWithDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching user inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

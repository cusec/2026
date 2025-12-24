import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, ShopItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import isVolunteer from "@/lib/isVolunteer";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// POST - Redeem a shop item for a user (volunteer/admin only)
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or volunteer
    const adminStatus = await isAdmin();
    const volunteerStatus = await isVolunteer();

    if (!adminStatus && !volunteerStatus) {
      return NextResponse.json(
        { error: "Forbidden: Admin or Volunteer access required" },
        { status: 403 }
      );
    }

    const { shopItemId, userId } = await request.json();

    if (!shopItemId || !userId) {
      return NextResponse.json(
        { error: "Shop prize ID and user ID are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the shop item
    const shopItem = await ShopItem.findById(shopItemId);
    if (!shopItem) {
      return NextResponse.json(
        { error: "Shop prize not found" },
        { status: 404 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough points
    if (user.points < shopItem.cost) {
      return NextResponse.json(
        {
          error: "User does not have enough points",
          required: shopItem.cost,
          available: user.points,
        },
        { status: 400 }
      );
    }

    // Check if item is limited and has remaining stock
    if (shopItem.limited && shopItem.remaining <= 0) {
      return NextResponse.json(
        { error: "This item is sold out" },
        { status: 400 }
      );
    }

    // Deduct points from user
    user.points -= shopItem.cost;

    // Add shop item to user's shopPrizes array
    if (!user.shopPrizes) {
      user.shopPrizes = [];
    }
    user.shopPrizes.push(shopItem._id);

    await user.save();

    // Decrement remaining count if limited
    if (shopItem.limited) {
      shopItem.remaining -= 1;
      await shopItem.save();
    }

    // Log admin/volunteer action
    await logAdminAction({
      adminEmail: session.user.email || "unknown",
      targetUserEmail: user.email,
      action: "REDEEM_SHOP_ITEM",
      resourceType: "shopItem",
      resourceId: shopItem._id.toString(),
      details: sanitizeDataForLogging({
        shopItemName: shopItem.name,
        cost: shopItem.cost,
        userName: user.name,
        userEmail: user.email,
        previousPoints: user.points + shopItem.cost,
        newPoints: user.points,
      }),
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${shopItem.name} for ${
        user.name || user.email
      }`,
      redemption: {
        shopItem: {
          _id: shopItem._id,
          name: shopItem.name,
          cost: shopItem.cost,
        },
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          newPoints: user.points,
        },
      },
    });
  } catch (error) {
    console.error("Error redeeming shop item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

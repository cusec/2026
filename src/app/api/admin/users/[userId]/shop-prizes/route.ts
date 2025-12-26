import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, ShopItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch user's shop prizes (Admin only, grouped with instance IDs)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }
    const { userId } = await params;
    await connectMongoDB();
    const user = await User.findById(userId).populate("shopPrizes");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Return all shop prize instances individually (no grouping)
    return NextResponse.json({
      success: true,
      shopPrizes: user.shopPrizes || [],
    });
  } catch (error) {
    console.error("Error fetching user shop prizes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add a shop prize to user (Admin only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }
    const { userId } = await params;
    const { shopItemId } = await request.json();
    if (!shopItemId) {
      return NextResponse.json(
        { error: "Shop item ID is required" },
        { status: 400 }
      );
    }
    await connectMongoDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const shopItem = await ShopItem.findById(shopItemId);
    if (!shopItem) {
      return NextResponse.json(
        { error: "Shop item not found" },
        { status: 404 }
      );
    }
    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      shopPrizesCount: user.shopPrizes?.length || 0,
    });
    if (!user.shopPrizes) {
      user.shopPrizes = [];
    }
    user.shopPrizes.push(shopItem._id);
    await user.save();
    const newData = sanitizeDataForLogging({
      shopPrizesCount: user.shopPrizes.length,
    });
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "ADD_USER_SHOP_PRIZE",
        resourceType: "shopItem",
        targetUserEmail: user.email,
        resourceId: shopItemId,
        details: { shopItemName: shopItem.name },
        previousData,
        newData,
        request,
      });
    }
    return NextResponse.json({
      success: true,
      message: `Added \"${shopItem.name}\" to ${user.email}'s shop prizes.`,
    });
  } catch (error) {
    console.error("Error adding shop prize to user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a shop prize from user (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }
    const { userId } = await params;
    const { shopPrizeId } = await request.json();
    if (!shopPrizeId) {
      return NextResponse.json(
        { error: "Shop prize ID is required" },
        { status: 400 }
      );
    }
    await connectMongoDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Remove the first matching instance
    const index = user.shopPrizes?.findIndex(
      (id: string) => id.toString() === shopPrizeId
    );
    if (index === undefined || index === -1) {
      return NextResponse.json(
        { error: "Shop prize not found in user's shop prizes" },
        { status: 404 }
      );
    }
    // Update shop prize claim count
    const shopItem = await ShopItem.findById(shopPrizeId);
    if (shopItem) {
      shopItem.claimCount = Math.max((shopItem.claimCount || 1) - 1, 0);
      await shopItem.save();
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      shopPrizesCount: user.shopPrizes.length,
    });
    user.shopPrizes.splice(index, 1);
    await user.save();
    const newData = sanitizeDataForLogging({
      shopPrizesCount: user.shopPrizes.length,
    });
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "REMOVE_USER_SHOP_PRIZE",
        resourceType: "shopItem",
        targetUserEmail: user.email,
        resourceId: shopPrizeId,
        details: { shopItemName: shopItem?.name || "" },
        previousData,
        newData,
        request,
      });
    }
    return NextResponse.json({
      success: true,
      message: `Removed shop prize from ${user.email}'s shop prizes.`,
    });
  } catch (error) {
    console.error("Error removing shop prize from user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

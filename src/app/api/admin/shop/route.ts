import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { ShopItem } from "@/lib/models";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";
import { auth0 } from "@/lib/auth0";

// POST - Create a new shop item (admin only)
export async function POST(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const {
      name,
      description,
      cost,
      limited,
      remaining,
      moderated,
      imageSlug,
    } = body;

    if (!name || !description || cost === undefined || !imageSlug) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, description, cost, imageSlug",
        },
        { status: 400 }
      );
    }

    const shopItem = new ShopItem({
      name,
      description,
      cost,
      limited: limited || false,
      remaining: remaining || 0,
      moderated: moderated || false,
      imageSlug,
    });

    await shopItem.save();

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "CREATE_SHOP_ITEM",
      resourceType: "shopItem",
      resourceId: shopItem._id.toString(),
      newData: sanitizeDataForLogging({
        name,
        description,
        cost,
        limited,
        remaining,
        moderated,
        imageSlug,
      }),
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Shop item created successfully",
      shopItem: {
        _id: shopItem._id,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        limited: shopItem.limited,
        remaining: shopItem.remaining,
        moderated: shopItem.moderated,
        imageSlug: shopItem.imageSlug,
      },
    });
  } catch (error) {
    console.error("Error creating shop item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a shop item (admin only)
export async function PUT(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { itemId, updates } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const shopItem = await ShopItem.findById(itemId);
    if (!shopItem) {
      return NextResponse.json(
        { error: "Shop item not found" },
        { status: 404 }
      );
    }

    const previousData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      moderated: shopItem.moderated,
      imageSlug: shopItem.imageSlug,
    });

    // Apply updates
    if (updates.name !== undefined) shopItem.name = updates.name;
    if (updates.description !== undefined)
      shopItem.description = updates.description;
    if (updates.cost !== undefined) shopItem.cost = updates.cost;
    if (updates.limited !== undefined) shopItem.limited = updates.limited;
    if (updates.remaining !== undefined) shopItem.remaining = updates.remaining;
    if (updates.moderated !== undefined) shopItem.moderated = updates.moderated;
    if (updates.imageSlug !== undefined) shopItem.imageSlug = updates.imageSlug;

    await shopItem.save();

    const newData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      moderated: shopItem.moderated,
      imageSlug: shopItem.imageSlug,
    });

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "UPDATE_SHOP_ITEM",
      resourceType: "shopItem",
      resourceId: itemId,
      previousData,
      newData,
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Shop item updated successfully",
      shopItem: {
        _id: shopItem._id,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        limited: shopItem.limited,
        remaining: shopItem.remaining,
        moderated: shopItem.moderated,
        imageSlug: shopItem.imageSlug,
      },
    });
  } catch (error) {
    console.error("Error updating shop item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a shop item (admin only)
export async function DELETE(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const shopItem = await ShopItem.findById(itemId);
    if (!shopItem) {
      return NextResponse.json(
        { error: "Shop item not found" },
        { status: 404 }
      );
    }

    const previousData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      moderated: shopItem.moderated,
      imageSlug: shopItem.imageSlug,
    });

    await ShopItem.findByIdAndDelete(itemId);

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "DELETE_SHOP_ITEM",
      resourceType: "shopItem",
      resourceId: itemId,
      previousData,
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Shop item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

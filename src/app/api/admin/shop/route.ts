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
      active,
      activationStart,
      activationEnd,
      imageData,
      imageContentType,
    } = body;

    if (!name || !description || cost === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, description, cost",
        },
        { status: 400 }
      );
    }

    // Validate image content type if image is provided
    if (imageData && imageContentType) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageContentType)) {
        return NextResponse.json(
          { error: "Invalid image type. Allowed types: PNG, JPEG, GIF, WebP" },
          { status: 400 }
        );
      }
    }

    const shopItem = new ShopItem({
      name,
      description,
      cost,
      limited: limited || false,
      remaining: remaining || 0,
      active: active !== undefined ? active : true,
      activationStart: activationStart || null,
      activationEnd: activationEnd || null,
      imageData: imageData || null,
      imageContentType: imageContentType || null,
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
        active,
        activationStart,
        activationEnd,
        imageContentType,
        // Don't log the full image data, just note it exists
        hasImage: true,
      }),
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Shop prize created successfully",
      shopItem: {
        _id: shopItem._id,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        limited: shopItem.limited,
        remaining: shopItem.remaining,
        active: shopItem.active,
        activationStart: shopItem.activationStart,
        activationEnd: shopItem.activationEnd,
        imageData: shopItem.imageData,
        imageContentType: shopItem.imageContentType,
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
        { error: "Shop prize not found" },
        { status: 404 }
      );
    }

    const previousData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      active: shopItem.active,
      activationStart: shopItem.activationStart,
      activationEnd: shopItem.activationEnd,
      imageContentType: shopItem.imageContentType,
      hasImage: !!shopItem.imageData,
    });

    // Apply updates
    if (updates.name !== undefined) shopItem.name = updates.name;
    if (updates.description !== undefined)
      shopItem.description = updates.description;
    if (updates.cost !== undefined) shopItem.cost = updates.cost;
    if (updates.limited !== undefined) shopItem.limited = updates.limited;
    if (updates.remaining !== undefined) shopItem.remaining = updates.remaining;
    if (updates.active !== undefined) shopItem.active = updates.active;
    if (updates.activationStart !== undefined)
      shopItem.activationStart = updates.activationStart;
    if (updates.activationEnd !== undefined)
      shopItem.activationEnd = updates.activationEnd;
    // Handle image updates (including removal when null is passed)
    if ("imageData" in updates) {
      if (updates.imageData === null) {
        // Remove image
        shopItem.imageData = null;
        shopItem.imageContentType = null;
      } else if (updates.imageData && updates.imageContentType) {
        // Validate image content type
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(updates.imageContentType)) {
          return NextResponse.json(
            {
              error: "Invalid image type. Allowed types: PNG, JPEG, GIF, WebP",
            },
            { status: 400 }
          );
        }
        shopItem.imageData = updates.imageData;
        shopItem.imageContentType = updates.imageContentType;
      }
    }

    await shopItem.save();

    const newData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      active: shopItem.active,
      activationStart: shopItem.activationStart,
      activationEnd: shopItem.activationEnd,
      imageContentType: shopItem.imageContentType,
      hasImage: !!shopItem.imageData,
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
      message: "Shop prize updated successfully",
      shopItem: {
        _id: shopItem._id,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        limited: shopItem.limited,
        remaining: shopItem.remaining,
        active: shopItem.active,
        activationStart: shopItem.activationStart,
        activationEnd: shopItem.activationEnd,
        imageData: shopItem.imageData,
        imageContentType: shopItem.imageContentType,
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
        { error: "Shop prize not found" },
        { status: 404 }
      );
    }

    const previousData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      active: shopItem.active,
      activationStart: shopItem.activationStart,
      activationEnd: shopItem.activationEnd,
      imageContentType: shopItem.imageContentType,
      hasImage: !!shopItem.imageData,
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
      message: "Shop prize deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { ShopItem, User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// DELETE - Delete a shop item (Admin only, only if not redeemed by any user)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await connectMongoDB();

    const shopItem = await ShopItem.findById(id);
    if (!shopItem) {
      return NextResponse.json(
        { error: "Shop item not found" },
        { status: 404 }
      );
    }

    // Check if any user has redeemed this shop item
    const usersWithPrize = await User.find({ shopPrizes: id }).limit(1);
    if (usersWithPrize.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete: This shop prize has already been redeemed by at least one user." },
        { status: 400 }
      );
    }

    // Store data for audit log
    const previousData = sanitizeDataForLogging({
      name: shopItem.name,
      description: shopItem.description,
      cost: shopItem.cost,
      limited: shopItem.limited,
      remaining: shopItem.remaining,
      active: shopItem.active,
      activationStart: shopItem.activationStart,
      activationEnd: shopItem.activationEnd,
    });

    await ShopItem.findByIdAndDelete(id);

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "DELETE_SHOP_ITEM",
        resourceType: "shopItem",
        resourceId: id,
        details: { name: shopItem.name },
        previousData,
        request,
      });
    }

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

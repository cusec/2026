import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// POST - Add a hunt item to user (Admin only)
// NOTE: Points are NOT updated when adding hunt items manually
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
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

    const { userId } = await params;
    const { huntItemId } = await request.json();

    if (!huntItemId) {
      return NextResponse.json(
        { error: "Hunt item ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the hunt item exists
    const huntItem = await HuntItem.findById(huntItemId);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Check if user already has this hunt item
    const alreadyHas = user.claimedItems.some(
      (id: { toString: () => string }) => id.toString() === huntItemId
    );

    if (alreadyHas) {
      return NextResponse.json(
        { error: "User already has this hunt item claimed" },
        { status: 400 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      claimedItemsCount: user.claimedItems?.length || 0,
      huntItemClaimCount: huntItem.claimCount || 0,
    });

    // Add the hunt item to user's claimedItems
    user.claimedItems.push(huntItem._id);

    // NOTE: Points are NOT updated when adding hunt items manually
    await user.save();

    // Increment the claim count on the hunt item
    huntItem.claimCount = (huntItem.claimCount || 0) + 1;
    await huntItem.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      claimedItemsCount: user.claimedItems.length,
      huntItemClaimCount: huntItem.claimCount,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "ADD_USER_HUNT_ITEM",
        resourceType: "huntItem",
        targetUserEmail: user.email,
        resourceId: huntItemId,
        details: {
          huntItemName: huntItem.name,
          huntItemIdentifier: huntItem.identifier,
          note: "Points were NOT updated",
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Added "${huntItem.name}" to ${user.email}'s claimed items. Note: Points were not updated.`,
    });
  } catch (error) {
    console.error("Error adding hunt item to user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

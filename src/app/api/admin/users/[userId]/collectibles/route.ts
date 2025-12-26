import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch user's collectibles (Admin only)
export async function GET(
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

    await connectMongoDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      collectibles: collectiblesWithDetails,
    });
  } catch (error) {
    console.error("Error fetching user collectibles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add a collectible to user (Admin only)
// NOTE: Points are NOT updated when adding collectibles manually
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
    const { collectibleId } = await request.json();

    if (!collectibleId) {
      return NextResponse.json(
        { error: "Collectible ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the collectible exists
    const collectible = await Collectible.findById(collectibleId);
    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      collectiblesCount: user.collectibles?.length || 0,
    });

    // Ensure collectibles array exists
    if (!user.collectibles) {
      user.collectibles = [];
    }

    // Add the collectible (duplicates allowed with new structure)
    user.collectibles.push({
      collectibleId: collectible._id,
      used: false,
      addedAt: new Date(),
    });

    // NOTE: Points are NOT updated when adding collectibles manually
    await user.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      collectiblesCount: user.collectibles.length,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "ADD_USER_COLLECTIBLE",
        resourceType: "collectible",
        targetUserEmail: user.email,
        resourceId: collectibleId,
        details: {
          collectibleName: collectible.name,
          note: "Points were NOT updated",
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Added "${collectible.name}" to ${user.email}'s collectibles. Note: Points were not updated.`,
    });
  } catch (error) {
    console.error("Error adding collectible to user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a collectible from user (Admin only)
// NOTE: Points are NOT updated when removing collectibles manually
export async function DELETE(
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
    const { instanceId } = await request.json();

    if (!instanceId) {
      return NextResponse.json(
        { error: "Instance ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the collectible instance in the user's collectibles
    const instanceIndex = user.collectibles?.findIndex(
      (c: { _id: { toString: () => string } }) =>
        c._id.toString() === instanceId
    );

    if (instanceIndex === undefined || instanceIndex === -1) {
      return NextResponse.json(
        { error: "Collectible instance not found in user's collectibles" },
        { status: 404 }
      );
    }

    // Get the collectible details for logging
    const collectibleInstance = user.collectibles[instanceIndex];
    const collectible = await Collectible.findById(
      collectibleInstance.collectibleId
    );

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      collectiblesCount: user.collectibles.length,
    });

    // Remove the collectible instance
    user.collectibles.splice(instanceIndex, 1);

    // NOTE: Points are NOT updated when removing collectibles manually
    await user.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      collectiblesCount: user.collectibles.length,
    });

    // Decrement claimCount on the collectible
    if (collectible) {
      collectible.claimCount = Math.max((collectible.claimCount || 1) - 1, 0);
      await collectible.save();
    }

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "REMOVE_USER_COLLECTIBLE",
        resourceType: "collectible",
        targetUserEmail: user.email,
        resourceId: instanceId,
        details: {
          collectibleName: collectible?.name || "Unknown",
          note: "Points were NOT updated",
        },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Removed collectible from ${user.email}'s collectibles. Note: Points were not updated.`,
    });
  } catch (error) {
    console.error("Error removing collectible from user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a collectible's used status (Admin only)
export async function PATCH(
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
    const { instanceId, used } = await request.json();

    if (!instanceId) {
      return NextResponse.json(
        { error: "Instance ID is required" },
        { status: 400 }
      );
    }

    if (typeof used !== "boolean") {
      return NextResponse.json(
        { error: "Used status must be a boolean" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the collectible instance in the user's collectibles
    const instanceIndex = user.collectibles?.findIndex(
      (c: { _id: { toString: () => string } }) =>
        c._id.toString() === instanceId
    );

    if (instanceIndex === undefined || instanceIndex === -1) {
      return NextResponse.json(
        { error: "Collectible instance not found in user's collectibles" },
        { status: 404 }
      );
    }

    // Get the collectible details for logging
    const collectibleInstance = user.collectibles[instanceIndex];
    const collectible = await Collectible.findById(
      collectibleInstance.collectibleId
    );

    // Store previous data for audit logging
    const previousUsed = collectibleInstance.used;

    // Update the used status
    user.collectibles[instanceIndex].used = used;
    await user.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "UPDATE_USER_COLLECTIBLE_USED",
        resourceType: "collectible",
        targetUserEmail: user.email,
        resourceId: instanceId,
        details: {
          collectibleName: collectible?.name || "Unknown",
          previousUsed,
          newUsed: used,
        },
        previousData: { used: previousUsed },
        newData: { used },
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Updated collectible used status to ${used}.`,
      used,
    });
  } catch (error) {
    console.error("Error updating collectible used status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

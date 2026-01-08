import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem, Collectible } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";
import { Types } from "mongoose";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// GET - Fetch a specific collectible
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectMongoDB();
    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      collectible,
    });
  } catch (error) {
    console.error("Error fetching collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a collectible (Admin only)
export async function PUT(
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
    const {
      name,
      description,
      cost,
      discountedCost,
      purchasable,
      limited,
      remaining,
      active,
      activationStart,
      activationEnd,
      imageData,
      imageContentType,
      removeImage,
    } = await request.json();

    await connectMongoDB();

    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Store previous data for audit log
    const previousData = sanitizeDataForLogging({
      name: collectible.name,
      description: collectible.description,
      cost: collectible.cost,
      discountedCost: collectible.discountedCost,
      purchasable: collectible.purchasable,
      limited: collectible.limited,
      remaining: collectible.remaining,
      active: collectible.active,
      activationStart: collectible.activationStart,
      activationEnd: collectible.activationEnd,
      imageUrl: collectible.imageUrl,
    });

    // Update fields
    if (name !== undefined) collectible.name = name;
    if (description !== undefined) collectible.description = description;
    if (cost !== undefined) collectible.cost = cost;
    if (discountedCost !== undefined)
      collectible.discountedCost = discountedCost;
    if (purchasable !== undefined) collectible.purchasable = purchasable;
    if (limited !== undefined) collectible.limited = limited;
    if (remaining !== undefined) collectible.remaining = remaining;
    if (active !== undefined) collectible.active = active;
    if (activationStart !== undefined)
      collectible.activationStart = activationStart;
    if (activationEnd !== undefined) collectible.activationEnd = activationEnd;

    // Handle image updates with Cloudinary
    if (removeImage === true) {
      // Delete old image from Cloudinary if it exists
      if (collectible.imagePublicId) {
        await deleteImage(collectible.imagePublicId);
      }
      collectible.imageUrl = null;
      collectible.imagePublicId = null;
    } else if (imageData && imageContentType) {
      // Delete old image from Cloudinary if it exists
      if (collectible.imagePublicId) {
        await deleteImage(collectible.imagePublicId);
      }
      // Upload new image to Cloudinary
      const uploadResult = await uploadImage(
        imageData,
        imageContentType,
        "collectibles"
      );
      if (uploadResult) {
        collectible.imageUrl = uploadResult.secure_url;
        collectible.imagePublicId = uploadResult.public_id;
      }
    }

    await collectible.save();

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      const newData = sanitizeDataForLogging({
        name: collectible.name,
        description: collectible.description,
        cost: collectible.cost,
        discountedCost: collectible.discountedCost,
        purchasable: collectible.purchasable,
        limited: collectible.limited,
        remaining: collectible.remaining,
        active: collectible.active,
        activationStart: collectible.activationStart,
        activationEnd: collectible.activationEnd,
        imageUrl: collectible.imageUrl,
      });

      await logAdminAction({
        adminEmail,
        action: "UPDATE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: collectible._id.toString(),
        details: { name: collectible.name },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      collectible,
    });
  } catch (error) {
    console.error("Error updating collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a collectible (Admin only)
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

    const collectible = await Collectible.findById(id);

    if (!collectible) {
      return NextResponse.json(
        { error: "Collectible not found" },
        { status: 404 }
      );
    }

    // Store data for audit log
    const previousData = sanitizeDataForLogging({
      name: collectible.name,
      description: collectible.description,
      cost: collectible.cost,
      discountedCost: collectible.discountedCost,
      purchasable: collectible.purchasable,
      limited: collectible.limited,
      remaining: collectible.remaining,
      active: collectible.active,
      activationStart: collectible.activationStart,
      activationEnd: collectible.activationEnd,
      imageUrl: collectible.imageUrl,
    });

    // Check if any user owns this collectible
    const usersWithCollectible = await (
      await import("@/lib/models")
    ).User.find({ "collectibles.collectibleId": id }).limit(1);
    if (usersWithCollectible.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete: This collectible has already been redeemed by at least one user.",
        },
        { status: 400 }
      );
    }

    // Remove the collectible from any hunt items that have it within their collectibles array
    const huntItems = await HuntItem.find({ collectibles: id });
    for (const huntItem of huntItems) {
      huntItem.collectibles = huntItem.collectibles.filter(
        (collectibleId: Types.ObjectId) => collectibleId.toString() !== id
      );
      await huntItem.save();
    }

    // Delete image from Cloudinary if it exists
    if (collectible.imagePublicId) {
      await deleteImage(collectible.imagePublicId);
    }

    await Collectible.findByIdAndDelete(id);

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "DELETE_COLLECTIBLE",
        resourceType: "collectible",
        resourceId: id,
        details: {
          name: collectible.name,
          relatedHuntItemsUpdated: huntItems.map((item) => item._id.toString()),
        },
        previousData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Collectible deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting collectible:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

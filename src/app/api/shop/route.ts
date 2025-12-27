import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { ShopItem } from "@/lib/models";

// Helper function to check if item is within activation period
function isWithinActivationPeriod(item: {
  activationStart?: Date | null;
  activationEnd?: Date | null;
}): boolean {
  const now = new Date();

  if (item.activationStart && item.activationEnd) {
    const startDate = new Date(item.activationStart);
    const endDate = new Date(item.activationEnd);
    return now >= startDate && now <= endDate;
  }

  // If no activation period set, item is always available
  return true;
}

// GET - Fetch shop items
// For public display, only returns active items within activation period
// Admins can pass includeAll=true to see all items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    await connectMongoDB();

    const shopItems = await ShopItem.find({}).sort({ createdAt: -1 });

    // If includeAll is true (admin request), return all items
    // Otherwise, filter to only return active items within activation period
    const filteredItems = includeAll
      ? shopItems
      : shopItems.filter(
          (item) => item.active && isWithinActivationPeriod(item)
        );

    return NextResponse.json({
      success: true,
      shopItems: filteredItems.map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        cost: item.cost,
        discountedCost: item.discountedCost,
        limited: item.limited,
        remaining: item.remaining,
        active: item.active,
        activationStart: item.activationStart,
        activationEnd: item.activationEnd,
        imageData: item.imageData,
        imageContentType: item.imageContentType,
        claimCount: item.claimCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

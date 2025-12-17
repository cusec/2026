import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { ShopItem } from "@/lib/models";

// GET - Fetch all shop items (public)
export async function GET() {
  try {
    await connectMongoDB();

    const shopItems = await ShopItem.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      shopItems: shopItems.map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        cost: item.cost,
        limited: item.limited,
        remaining: item.remaining,
        moderated: item.moderated,
        imageSlug: item.imageSlug,
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

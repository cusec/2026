import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// GET - Fetch all hunt items
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const huntItems = await HuntItem.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      huntItems,
    });
  } catch (error) {
    console.error("Error fetching hunt items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new hunt item
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, identifier, points } = await request.json();

    if (!name || !identifier) {
      return NextResponse.json(
        { error: "Name and identifier are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if identifier already exists
    const existingItem = await HuntItem.findOne({ identifier });
    if (existingItem) {
      return NextResponse.json(
        { error: "Hunt item with this identifier already exists" },
        { status: 400 }
      );
    }

    const huntItem = new HuntItem({
      name,
      description,
      identifier,
      points: points || 0,
    });

    await huntItem.save();

    return NextResponse.json({
      success: true,
      huntItem,
    });
  } catch (error) {
    console.error("Error creating hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

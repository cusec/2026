import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// PUT - Update a hunt item (only name, description, and points)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, points } = await request.json();
    const { id } = params;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectMongoDB();

    const huntItem = await HuntItem.findById(id);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    // Update only allowed fields (not identifier)
    huntItem.name = name;
    huntItem.description = description;
    huntItem.points = points || 0;

    await huntItem.save();

    return NextResponse.json({
      success: true,
      huntItem,
    });
  } catch (error) {
    console.error("Error updating hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hunt item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectMongoDB();

    const huntItem = await HuntItem.findByIdAndDelete(id);
    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hunt item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hunt item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

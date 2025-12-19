import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// GET - Fetch user's inventory (claimed hunt items and collectibles)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    await connectMongoDB();

    // Find the user and populate their claimed items and collectibles
    const user = await User.findOne({
      $and: [{ email: session.user.email }, { _id: userId }],
    })
      .populate("claimedItems")
      .populate("collectibles");

    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inventory: {
        claimedItems: user.claimedItems || [],
        collectibles: user.collectibles || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

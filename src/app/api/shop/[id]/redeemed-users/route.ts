import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch all users who have redeemed a specific shop item (Admin only)
export async function GET(
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

    const { id: shopItemId } = await params;

    await connectMongoDB();

    // Find all users who have this shop item in their shopPrizes
    const users = await User.find({
      shopPrizes: shopItemId,
    })
      .select("email name points updatedAt createdAt")
      .lean();

    // Map users with their data
    const redeemedUsers = users.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      points: user.points || 0,
      // We don't have exact redemption time stored, use updatedAt as approximation
      redeemedAt: user.updatedAt || user.createdAt,
    }));

    // Sort by most recent first
    redeemedUsers.sort(
      (a, b) =>
        new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      redeemedUsers,
      totalCount: redeemedUsers.length,
    });
  } catch (error) {
    console.error("Error fetching redeemed users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

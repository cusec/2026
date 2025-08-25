import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch user history with hunt item details (Admin only)
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

    const user = await User.findById(userId).populate({
      path: "history",
      select: "name description identifier points createdAt",
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        history: user.history,
        claim_attempts: user.claim_attempts || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

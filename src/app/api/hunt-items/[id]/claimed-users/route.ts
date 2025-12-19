import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch all users who have claimed a specific hunt item (Admin only)
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

    const { id: huntItemId } = await params;

    await connectMongoDB();

    // Find all users who have this hunt item in their claimedItems
    const users = await User.find({
      claimedItems: huntItemId,
    })
      .select("email name points claim_attempts")
      .lean();

    // Extract the claim time for this specific item from claim_attempts
    const claimedUsers = users.map((user) => {
      // Find the successful claim attempt for this hunt item
      const claimAttempt = user.claim_attempts?.find(
        (attempt: { item_id?: { toString: () => string }; success: boolean }) =>
          attempt.item_id?.toString() === huntItemId && attempt.success
      );

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        points: user.points || 0,
        claimedAt: claimAttempt?.timestamp || user.createdAt,
      };
    });

    // Sort by claim time descending (most recent first)
    claimedUsers.sort(
      (a, b) =>
        new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      claimedUsers,
      totalCount: claimedUsers.length,
    });
  } catch (error) {
    console.error("Error fetching claimed users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

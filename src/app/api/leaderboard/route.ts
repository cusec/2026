import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { User } from "@/lib/models";

// GET - Get top 10 users for leaderboard (with dynamically calculated points)
export async function GET() {
  try {
    await connectMongoDB();

    // Find all users and populate their claimed items to calculate points
    const users = await User.find({ name: { $exists: true, $ne: null } })
      .populate("claimedItems", "points")
      .lean();

    // Calculate points for each user from their claimed items minus redeemed points
    const usersWithPoints = users
      .map((user) => {
        const earnedPoints = (user.claimedItems || []).reduce(
          (sum: number, item: { points?: number }) => sum + (item.points || 0),
          0
        );
        // Subtract redeemed points from earned points
        const availablePoints = earnedPoints - (user.redeemedPoints || 0);
        return {
          name: user.name,
          points: availablePoints,
        };
      })
      .filter((user) => user.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    const leaderboard = usersWithPoints.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      score: user.points,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

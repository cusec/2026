import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { User } from "@/lib/models";

// GET - Get top 10 users for leaderboard
export async function GET() {
  try {
    await connectMongoDB();

    // Find top 10 users with highest points, only return name and points
    const topUsers = await User.find({}, { name: 1, points: 1, _id: 0 })
      .sort({ points: -1 })
      .limit(10)
      .lean();

    // Filter out users without names and ensure they have points > 0
    const leaderboard = topUsers
      .filter((user) => user.name && user.points > 0)
      .map((user, index) => ({
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

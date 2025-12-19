import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { User } from "@/lib/models";

// GET - Get top 10 users for leaderboard (using stored points)
export async function GET() {
  try {
    await connectMongoDB();

    // Find users with positive points, sorted by points descending
    const users = await User.find({
      name: { $exists: true, $ne: null },
      points: { $gt: 0 },
    })
      .select("name points")
      .sort({ points: -1 })
      .limit(10)
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      score: user.points || 0,
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

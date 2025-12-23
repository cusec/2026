import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { User, HuntItem } from "@/lib/models";
import { Types } from "mongoose";

// GET - Get top 10 users for leaderboard (calculated from claimed items)
export async function GET() {
  try {
    await connectMongoDB();

    // Strategy: Fetch all hunt items once, then calculate points in-memory
    // This is efficient for 200-400 users because:
    // 1. Only 2 DB queries (huntItems + users)
    // 2. HuntItems are typically few (20-100 items)
    // 3. In-memory Map lookup is O(1)

    // Step 1: Get all hunt items and create a points lookup map
    const huntItems = await HuntItem.find({}).select("_id points").lean();

    const huntItemPointsMap = new Map<string, number>();
    for (const item of huntItems) {
      const itemId = item._id as Types.ObjectId;
      huntItemPointsMap.set(itemId.toString(), item.points || 0);
    }

    // Step 2: Get all users with claimed items
    const users = await User.find({
      name: { $exists: true, $ne: null },
      claimedItems: { $exists: true, $not: { $size: 0 } },
    })
      .select("name claimedItems")
      .lean();

    // Step 3: Calculate points for each user from their claimed items
    const usersWithCalculatedPoints = users.map((user) => {
      const calculatedPoints = (user.claimedItems || []).reduce(
        (sum: number, itemId: Types.ObjectId) => {
          const points = huntItemPointsMap.get(itemId.toString()) || 0;
          return sum + points;
        },
        0
      );

      return {
        name: user.name,
        score: calculatedPoints,
      };
    });

    // Step 4: Sort by score descending and take top 10
    const leaderboard = usersWithCalculatedPoints
      .filter((user) => user.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        score: user.score,
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

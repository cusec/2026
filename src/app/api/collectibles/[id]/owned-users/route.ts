import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch all users who have a specific collectible (Admin only)
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

    const { id: collectibleId } = await params;

    await connectMongoDB();

    // Find all users who have this collectible in their collectibles array
    const users = await User.find({
      "collectibles.collectibleId": collectibleId,
    })
      .select("email name points collectibles")
      .lean();

    // Map users with their collectible-specific data
    const ownedUsers = users.map((user) => {
      // Find the specific collectible entry for this user
      const collectibleEntry = user.collectibles?.find(
        (c: {
          collectibleId: { toString: () => string };
          used: boolean;
          addedAt: Date;
        }) => c.collectibleId?.toString() === collectibleId
      );

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        points: user.points || 0,
        used: collectibleEntry?.used || false,
        addedAt: collectibleEntry?.addedAt || null,
      };
    });

    // Sort by most recent first
    ownedUsers.sort((a, b) => {
      if (!a.addedAt && !b.addedAt) return 0;
      if (!a.addedAt) return 1;
      if (!b.addedAt) return -1;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      ownedUsers,
      totalCount: ownedUsers.length,
    });
  } catch (error) {
    console.error("Error fetching collectible owners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

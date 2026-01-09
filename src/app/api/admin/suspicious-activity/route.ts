import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

interface ClaimAttempt {
  identifier: string;
  success: boolean;
  timestamp: Date;
  item_id?: string;
}

interface SuspiciousPattern {
  claim1Time: Date;
  claim2Time: Date;
  timeDiffMinutes: number;
  item1Identifier: string;
  item2Identifier: string;
}

// Exclusion list: identifiers that can legitimately be claimed in quick succession
const EXCLUDED_IDENTIFIERS = [
  "SPONSOR-RBC-OMNI-25",
  "25-SPONSOR-COMPULSION-OMNI",
  "AI-OR-NOT-GAME-OMNI-2026",
  "STICKY-OMMI-WALL-2026",
  "WHITEBOARD-DEBUG-OMNI-CUSEC",
  "CSE-OMNI-HOTEL-CODE",
];

// GET - Analyze top 100 users for suspicious claim patterns (Admin only)
export async function GET() {
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

    await connectMongoDB();

    // Get all hunt items (without QR codes) to calculate point values
    const huntItems = await HuntItem.find({})
      .select("_id points identifier name")
      .lean();

    const huntItemsMap = new Map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      huntItems.map((item: any) => [
        item._id.toString(),
        {
          points: item.points || 0,
          identifier: item.identifier,
          name: item.name,
        },
      ])
    );

    // Get users with their claimed items and claim attempts
    const users = await User.find({
      claimedItems: { $exists: true, $not: { $size: 0 } },
    })
      .select("email name points claimedItems claim_attempts")
      .lean();

    // Calculate total points from claimed hunt items for each user
    const usersWithCalculatedPoints = users.map((user) => {
      const claimedItemIds = (user.claimedItems || []).map(
        (id: { toString: () => string }) => id.toString()
      );

      const totalClaimedPoints = claimedItemIds.reduce(
        (sum: number, itemId: string) => {
          const item = huntItemsMap.get(itemId);
          return sum + (item?.points || 0);
        },
        0
      );

      // Get successful claims sorted by timestamp
      const successfulClaims = (user.claim_attempts || [])
        .filter((attempt: ClaimAttempt) => attempt.success === true)
        .sort(
          (a: ClaimAttempt, b: ClaimAttempt) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      // Analyze for suspicious patterns (successful claims less than 5 minutes apart)
      // Excludes certain identifiers that can legitimately be claimed quickly
      const suspiciousPatterns: SuspiciousPattern[] = [];
      for (let i = 1; i < successfulClaims.length; i++) {
        const prevClaim = successfulClaims[i - 1];
        const currClaim = successfulClaims[i];

        // Skip if either claim is in the exclusion list
        if (
          EXCLUDED_IDENTIFIERS.includes(prevClaim.identifier) ||
          EXCLUDED_IDENTIFIERS.includes(currClaim.identifier)
        ) {
          continue;
        }

        const timeDiff =
          (new Date(currClaim.timestamp).getTime() -
            new Date(prevClaim.timestamp).getTime()) /
          (1000 * 60); // in minutes

        if (timeDiff < 5) {
          suspiciousPatterns.push({
            claim1Time: prevClaim.timestamp,
            claim2Time: currClaim.timestamp,
            timeDiffMinutes: Math.round(timeDiff * 100) / 100,
            item1Identifier: prevClaim.identifier,
            item2Identifier: currClaim.identifier,
          });
        }
      }

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        displayPoints: user.points || 0,
        calculatedPoints: totalClaimedPoints,
        claimedItemsCount: claimedItemIds.length,
        successfulClaimsCount: successfulClaims.length,
        suspiciousPatterns,
        isSuspicious: suspiciousPatterns.length > 0,
        suspiciousCount: suspiciousPatterns.length,
      };
    });

    // Sort by calculated points (descending) and take top 100
    const top100Users = usersWithCalculatedPoints
      .sort((a, b) => b.calculatedPoints - a.calculatedPoints)
      .slice(0, 100);

    // Re-sort: suspicious users first, then by calculated points
    const sortedUsers = top100Users.sort((a, b) => {
      // First, sort by suspicious status (suspicious first)
      if (a.isSuspicious && !b.isSuspicious) return -1;
      if (!a.isSuspicious && b.isSuspicious) return 1;
      // Then by suspicious count (more suspicious patterns first)
      if (a.suspiciousCount !== b.suspiciousCount) {
        return b.suspiciousCount - a.suspiciousCount;
      }
      // Then by calculated points
      return b.calculatedPoints - a.calculatedPoints;
    });

    const stats = {
      totalAnalyzed: top100Users.length,
      suspiciousUsers: top100Users.filter((u) => u.isSuspicious).length,
      totalSuspiciousPatterns: top100Users.reduce(
        (sum, u) => sum + u.suspiciousCount,
        0
      ),
    };

    return NextResponse.json({
      success: true,
      users: sortedUsers,
      stats,
    });
  } catch (error) {
    console.error("Error analyzing suspicious activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

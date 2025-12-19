import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { findOrCreateUser, getUserByEmail } from "@/lib/userService";

// GET - Get current user profile
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;

    if (!email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate points from claimed items minus redeemed points
    const earnedPoints = (user.claimedItems || []).reduce(
      (sum: number, item: { points?: number }) => sum + (item.points || 0),
      0
    );
    const points = earnedPoints - (user.redeemedPoints || 0);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        linked_email: user.linked_email || null,
        points,
        claimedItems: user.claimedItems,
        claimAttemptsCount: user.claim_attempts?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in user GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or initialize current user
export async function POST() {
  console.log("POST /api/users called");

  try {
    const session = await auth0.getSession();
    console.log("Session:", session ? "Found" : "Not found");

    if (!session?.user) {
      console.log("No user in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = session.user;
    console.log("User data from session:", { email, name });

    if (!email) {
      console.log("No email in user session");
      return NextResponse.json(
        { error: "Missing required user information" },
        { status: 400 }
      );
    }

    console.log("Calling findOrCreateUser with:", { email, name });
    const user = await findOrCreateUser({
      email,
      name,
    });
    console.log("User found/created:", user ? "Success" : "Failed");

    // Calculate points from claimed items minus redeemed points
    const earnedPoints = (user.claimedItems || []).reduce(
      (sum: number, item: { points?: number }) => sum + (item.points || 0),
      0
    );
    const points = earnedPoints - (user.redeemedPoints || 0);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        linked_email: user.linked_email || null,
        points,
        claimedItems: user.claimedItems,
        claimAttemptsCount: user.claim_attempts?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

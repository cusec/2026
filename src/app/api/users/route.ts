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

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        linked_email: user.linked_email || null,
        points: user.points,
        history: user.history,
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

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        linked_email: user.linked_email || null,
        points: user.points,
        history: user.history,
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

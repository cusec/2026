// Helper to sanitize input (basic XSS and injection prevention)
function sanitizeInput(input: string) {
  return input
    .replace(/[<>"'`]/g, "") // Remove angle brackets and quotes
    .replace(/[\\]/g, "") // Remove backslashes
    .replace(/\s{2,}/g, " ") // Collapse multiple spaces
    .trim();
}
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User, RegisteredUser } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// POST - Link email to user account (only if not already linked)
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email: userEmail } = session.user;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    let { linked_email, name, discord_handle } = await request.json();
    linked_email = sanitizeInput(linked_email);
    name = sanitizeInput(name);
    discord_handle = sanitizeInput(discord_handle);

    if (!linked_email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(linked_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a linked email
    if (user.linked_email) {
      return NextResponse.json(
        {
          error: "Email already linked",
          message:
            "You already have a linked email. Please contact an administrator if you need to change it.",
        },
        { status: 409 }
      );
    }

    // Check if the linked email is already in use by another user
    const existingUser = await User.findOne({ linked_email: linked_email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Check if the linked email belongs to more than 1 registered user (school/personal/email)
    const registeredUsers = await RegisteredUser.find({
      $or: [
        { linkedEmail: linked_email },
        { studentEmail: linked_email },
        { personalEmail: linked_email },
      ],
    });
    if (registeredUsers.length > 1) {
      return NextResponse.json(
        {
          error: "Email associated with multiple tickets",
        },
        { status: 409 }
      );
    }
    if (registeredUsers.length === 0) {
      return NextResponse.json(
        {
          error: "Email not associated with any ticket",
        },
        { status: 409 }
      );
    }

    // Ensure that this registered user has not already been linked
    const regUser = registeredUsers[0];
    if (regUser.isLinked) {
      return NextResponse.json(
        {
          error: "This ticket has already been used to link an account",
        },
        { status: 409 }
      );
    }

    // Update the user with the linked email, display name, and discord handle
    user.linked_email = linked_email;
    user.name = name;
    user.discord_handle = discord_handle || null;
    await user.save();

    // Mark the registered user as linked
    regUser.isLinked = true;
    await regUser.save();

    return NextResponse.json({
      success: true,
      message: "Email linked successfully",
      linked_email: user.linked_email,
      registered_user_name: regUser.name,
      name: user.name,
      account_email: user.email,
      discord_handle: user.discord_handle,
    });
  } catch (error) {
    console.error("Error linking email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get current user's linked email status
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email: userEmail } = session.user;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      linked_email: user.linked_email || undefined,
      has_linked_email: !!user.linked_email,
    });
  } catch (error) {
    console.error("Error getting linked email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

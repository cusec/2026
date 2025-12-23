import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";

// PUT - Update user's Discord handle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { discord_handle } = await request.json();

    await connectMongoDB();

    // Find the user - only allow users to update their own discord handle
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the requesting user is updating their own profile
    if (user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden: Cannot update another user's profile" },
        { status: 403 }
      );
    }

    // Update the discord handle
    user.discord_handle = discord_handle?.trim() || null;
    await user.save();

    return NextResponse.json({
      success: true,
      discord_handle: user.discord_handle,
    });
  } catch (error) {
    console.error("Error updating Discord handle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { User } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import isVolunteer from "@/lib/isVolunteer";

// GET - Search users by name, email, linked_email, or discord_handle (volunteer/admin only)
export async function GET(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or volunteer
    const adminStatus = await isAdmin();
    const volunteerStatus = await isVolunteer();

    if (!adminStatus && !volunteerStatus) {
      return NextResponse.json(
        { error: "Forbidden: Admin or Volunteer access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!search || search.length < 2) {
      return NextResponse.json({
        success: true,
        users: [],
        message: "Please enter at least 2 characters to search",
      });
    }

    await connectMongoDB();

    // Build search query to search across name, email, linked_email, and discord_handle
    const query = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { linked_email: { $regex: search, $options: "i" } },
        { discord_handle: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .select("_id email name linked_email discord_handle points")
      .limit(limit)
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name || "No name",
        linked_email: user.linked_email || null,
        discord_handle: user.discord_handle || null,
        points: user.points || 0,
      })),
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

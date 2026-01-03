import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { RegisteredUser } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";

// GET - Fetch registered users with optional search (Admin only)
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "200");
    const offset = parseInt(searchParams.get("offset") || "0");

    await connectMongoDB();

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { linkedEmail: { $regex: search, $options: "i" } },
          { studentEmail: { $regex: search, $options: "i" } },
          { personalEmail: { $regex: search, $options: "i" } },
        ],
      };
    }

    const registeredUsers = await RegisteredUser.find(query)
      .sort({ name: 1 })
      .skip(offset)
      .limit(limit);

    const totalRegisteredUsers = await RegisteredUser.countDocuments(query);

    return NextResponse.json({
      success: true,
      registeredUsers: registeredUsers.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          linkedEmail: user.linkedEmail,
          studentEmail: user.studentEmail || null,
          personalEmail: user.personalEmail || null,
          isLinked: user.isLinked,
        };
      }),
      pagination: {
        total: totalRegisteredUsers,
        offset,
        limit,
        hasMore: offset + limit < totalRegisteredUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching registered users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update registered user data (Admin only - only isLinked field)
export async function PUT(request: Request) {
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

    const { userId, isLinked } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (typeof isLinked !== "boolean") {
      return NextResponse.json(
        { error: "isLinked must be a boolean value" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const registeredUser = await RegisteredUser.findById(userId);
    if (!registeredUser) {
      return NextResponse.json(
        { error: "Registered user not found" },
        { status: 404 }
      );
    }

    // Store previous data for audit logging
    const previousData = sanitizeDataForLogging({
      name: registeredUser.name,
      linkedEmail: registeredUser.linkedEmail,
      isLinked: registeredUser.isLinked,
    });

    // Update only isLinked field
    registeredUser.isLinked = isLinked;

    await registeredUser.save();

    // Store new data for audit logging
    const newData = sanitizeDataForLogging({
      name: registeredUser.name,
      linkedEmail: registeredUser.linkedEmail,
      isLinked: registeredUser.isLinked,
    });

    // Log the admin action
    const adminEmail = session.user.email;
    if (adminEmail) {
      await logAdminAction({
        adminEmail,
        action: "UPDATE_REGISTERED_USER_LINKED_STATUS",
        resourceType: "user",
        targetUserEmail: registeredUser.linkedEmail,
        resourceId: userId,
        details: { isLinked },
        previousData,
        newData,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registered user updated successfully",
      registeredUser: {
        _id: registeredUser._id,
        name: registeredUser.name,
        linkedEmail: registeredUser.linkedEmail,
        studentEmail: registeredUser.studentEmail || null,
        personalEmail: registeredUser.personalEmail || null,
        isLinked: registeredUser.isLinked,
      },
    });
  } catch (error) {
    console.error("Error updating registered user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

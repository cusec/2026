import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { Notice } from "@/lib/models";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction, sanitizeDataForLogging } from "@/lib/adminAuditLogger";
import { auth0 } from "@/lib/auth0";

// GET - Fetch all notices (admin)
export async function GET() {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await connectMongoDB();

    const notices = await Notice.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      notices: notices.map((notice) => ({
        _id: notice._id,
        title: notice.title,
        description: notice.description,
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new notice (admin only)
export async function POST(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, description" },
        { status: 400 }
      );
    }

    const notice = new Notice({
      title,
      description,
    });

    await notice.save();

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "CREATE_NOTICE",
      resourceType: "notice" as never,
      resourceId: notice._id.toString(),
      newData: sanitizeDataForLogging({
        title,
        description,
      }),
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Notice created successfully",
      notice: {
        _id: notice._id,
        title: notice.title,
        description: notice.description,
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a notice (admin only)
export async function PUT(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { _id, title, description } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Notice ID is required" },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, description" },
        { status: 400 }
      );
    }

    const existingNotice = await Notice.findById(_id);
    if (!existingNotice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const previousData = {
      title: existingNotice.title,
      description: existingNotice.description,
    };

    existingNotice.title = title;
    existingNotice.description = description;
    await existingNotice.save();

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "UPDATE_NOTICE",
      resourceType: "notice" as never,
      resourceId: _id,
      previousData: sanitizeDataForLogging(previousData),
      newData: sanitizeDataForLogging({ title, description }),
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Notice updated successfully",
      notice: {
        _id: existingNotice._id,
        title: existingNotice.title,
        description: existingNotice.description,
        createdAt: existingNotice.createdAt,
        updatedAt: existingNotice.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notice (admin only)
export async function DELETE(request: Request) {
  try {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Notice ID is required" },
        { status: 400 }
      );
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const previousData = {
      title: notice.title,
      description: notice.description,
    };

    await Notice.findByIdAndDelete(id);

    // Log admin action
    await logAdminAction({
      adminEmail,
      action: "DELETE_NOTICE",
      resourceType: "notice" as never,
      resourceId: id,
      previousData: sanitizeDataForLogging(previousData),
      request,
    });

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

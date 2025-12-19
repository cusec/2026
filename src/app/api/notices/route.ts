import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { Notice } from "@/lib/models";

// GET - Fetch all notices (public)
export async function GET() {
  try {
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

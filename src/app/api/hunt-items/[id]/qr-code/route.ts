import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { HuntItem } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch QR codes for a specific hunt item (Admin only)
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

    const { id } = await params;

    await connectMongoDB();

    // Only fetch the qrCodes field for efficiency
    const huntItem = await HuntItem.findById(id).select("qrCodes name");

    if (!huntItem) {
      return NextResponse.json(
        { error: "Hunt item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qrCodes: huntItem.qrCodes || {},
      name: huntItem.name,
    });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

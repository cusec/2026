import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { AdminAuditLog } from "@/lib/models";
import connectMongoDB from "@/lib/mongodb";
import isAdmin from "@/lib/isAdmin";

// GET - Fetch admin audit logs (Admin only)
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
    const adminEmail = searchParams.get("adminEmail") || "";
    const targetUserEmail = searchParams.get("targetUserEmail") || "";
    const action = searchParams.get("action") || "";
    const resourceType = searchParams.get("resourceType") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await connectMongoDB();

    // Build search query
    const query: Record<string, unknown> = {};

    if (adminEmail) {
      query.adminEmail = { $regex: adminEmail, $options: "i" };
    }

    if (targetUserEmail) {
      query.targetUserEmail = { $regex: targetUserEmail, $options: "i" };
    }

    if (action) {
      query.action = { $regex: action, $options: "i" };
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    // Date range filter
    if (startDate || endDate) {
      const dateQuery: { $gte?: Date; $lte?: Date } = {};
      if (startDate) {
        dateQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        dateQuery.$lte = new Date(endDate);
      }
      query.createdAt = dateQuery;
    }

    const auditLogs = await AdminAuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalLogs = await AdminAuditLog.countDocuments(query);

    // Get summary statistics
    const stats = await AdminAuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          uniqueAdmins: { $addToSet: "$adminEmail" },
          uniqueTargetUsers: { $addToSet: "$targetUserEmail" },
          actionBreakdown: {
            $push: "$action",
          },
        },
      },
      {
        $project: {
          totalActions: 1,
          uniqueAdminsCount: { $size: "$uniqueAdmins" },
          uniqueTargetUsersCount: {
            $size: {
              $filter: {
                input: "$uniqueTargetUsers",
                cond: { $ne: ["$$this", null] },
              },
            },
          },
          actionBreakdown: 1,
        },
      },
    ]);

    // Count actions by type
    const actionCounts = await AdminAuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      auditLogs: auditLogs.map((log) => ({
        _id: log._id,
        adminEmail: log.adminEmail,
        targetUserEmail: log.targetUserEmail,
        action: log.action,
        resourceType: log.resourceType,
        resourceId: log.resourceId,
        details: log.details,
        previousData: log.previousData,
        newData: log.newData,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      })),
      pagination: {
        total: totalLogs,
        offset,
        limit,
        hasMore: offset + limit < totalLogs,
      },
      statistics: {
        summary: stats[0] || {
          totalActions: 0,
          uniqueAdminsCount: 0,
          uniqueTargetUsersCount: 0,
        },
        actionCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

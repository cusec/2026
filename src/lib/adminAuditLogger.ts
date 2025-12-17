import { AdminAuditLog } from "./models";
import connectMongoDB from "./mongodb";

type LoggableData = Record<string, unknown> | null | undefined;

interface LogAdminActionParams {
  adminEmail: string;
  action: string;
  resourceType:
    | "user"
    | "huntItem"
    | "claimAttempts"
    | "scheduleItem"
    | "shopItem";
  targetUserEmail?: string;
  resourceId?: string;
  details?: LoggableData;
  previousData?: LoggableData;
  newData?: LoggableData;
  request?: Request;
}

export async function logAdminAction({
  adminEmail,
  action,
  resourceType,
  targetUserEmail,
  resourceId,
  details,
  previousData,
  newData,
  request,
}: LogAdminActionParams): Promise<void> {
  try {
    await connectMongoDB();

    // Extract IP address and user agent from request if available
    let ipAddress: string | undefined;
    let userAgent: string | undefined;

    if (request) {
      // Try to get IP from various headers
      ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        request.headers.get("x-client-ip") ||
        undefined;

      userAgent = request.headers.get("user-agent") || undefined;
    }

    const auditLog = new AdminAuditLog({
      adminEmail,
      targetUserEmail,
      action,
      resourceType,
      resourceId,
      details,
      previousData,
      newData,
      ipAddress,
      userAgent,
    });

    await auditLog.save();
  } catch (error) {
    // Log the error but don't throw to avoid breaking the main operation
    console.error("Failed to log admin action:", error);
  }
}

// Helper function to create detailed action descriptions
export function createActionDescription(
  action: string,
  resourceType: string,
  details?: LoggableData
): string {
  switch (action) {
    case "UPDATE_USER":
      const updates = (details?.updates as Record<string, unknown>) || {};
      const updateFields = Object.keys(updates).join(", ");
      return `Updated user fields: ${updateFields}`;

    case "CLEAR_USER_HISTORY":
      return "Cleared user history and reset points to 0";

    case "CLEAR_USER_CLAIM_ATTEMPTS":
      return "Cleared user claim attempts";

    case "CLEAR_USER_HISTORY_AND_ATTEMPTS":
      return "Cleared user history, claim attempts, and reset points to 0";

    case "CREATE_HUNT_ITEM":
      const itemName = (details as { name?: string })?.name || "Unknown";
      return `Created hunt item: ${itemName}`;

    case "UPDATE_HUNT_ITEM":
      const updatedItemName = (details as { name?: string })?.name || "Unknown";
      return `Updated hunt item: ${updatedItemName}`;

    case "DELETE_HUNT_ITEM":
      const deletedItemName = (details as { name?: string })?.name || "Unknown";
      return `Deleted hunt item: ${deletedItemName}`;

    case "CLEAR_CLAIM_ATTEMPTS_ALL":
      return "Cleared all claim attempts for user";

    case "CLEAR_CLAIM_ATTEMPTS_FAILED":
      return "Cleared failed claim attempts for user";

    default:
      return `${action} on ${resourceType}`;
  }
}

// Helper function to sanitize data for logging (remove sensitive information)
export function sanitizeDataForLogging(data: unknown): LoggableData {
  if (!data || typeof data !== "object") {
    return data as LoggableData;
  }

  const sanitized = { ...(data as Record<string, unknown>) };

  // Remove sensitive fields that shouldn't be logged
  delete sanitized.password;
  delete sanitized.__v;
  delete sanitized._id; // Keep objectId strings but remove the actual ObjectId

  return sanitized;
}

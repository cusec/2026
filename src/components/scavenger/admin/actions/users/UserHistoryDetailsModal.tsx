"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Trophy,
  Hash,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface HuntItem {
  _id: string;
  name: string;
  description: string;
  identifier: string;
  points: number;
  createdAt: string;
}

interface ClaimAttempt {
  identifier: string;
  success: boolean;
  timestamp: string;
  item_id?: string;
}

interface UserHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string;
  userEmail: string;
}

const UserHistoryDetailsModal = ({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
}: UserHistoryDetailsModalProps) => {
  const [userHistory, setUserHistory] = useState<HuntItem[]>([]);
  const [claimAttempts, setClaimAttempts] = useState<ClaimAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  // Rate limit calculation
  const calculateRateLimit = () => {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago

    const recentFailedAttempts = claimAttempts.filter(
      (attempt) =>
        !attempt.success && new Date(attempt.timestamp) >= windowStart
    );

    return {
      recentFailedAttempts: recentFailedAttempts.length,
      isRateLimited: recentFailedAttempts.length >= 10,
      remainingAttempts: Math.max(0, 10 - recentFailedAttempts.length),
    };
  };

  const clearClaimAttempts = async (
    clearType: "failed" | "all" | "rate-limit"
  ) => {
    if (!userEmail) return;

    const confirmMessages = {
      failed: `Clear all failed claim attempts for ${userName || userEmail}?`,
      all: `⚠️ Clear ALL claim attempts for ${
        userName || userEmail
      }?\n\nThis will remove the complete audit trail.`,
      "rate-limit": `Reset rate limit for ${
        userName || userEmail
      }?\n\nThis will clear failed attempts from the last 15 minutes, allowing them to try again.`,
    };

    const confirmed = window.confirm(confirmMessages[clearType]);
    if (!confirmed) return;

    try {
      setIsClearing(true);

      const response = await fetch("/api/admin/claim-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          clearType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        await fetchUserHistory();
      } else {
        setError(data.error || "Failed to clear claim attempts");
      }
    } catch (err) {
      setError("Failed to clear claim attempts");
      console.error("Error clearing claim attempts:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const removeClaimedItem = async (huntItemId: string, itemName: string) => {
    if (!userEmail) return;

    const confirmed = window.confirm(
      `⚠️ Remove "${itemName}" from ${userName || userEmail}'s history?\n\n` +
        `This will:\n` +
        `• Permanently remove this item from their claimed history\n` +
        `• Deduct the points associated with this item\n` +
        `• Decrease the claim count on this hunt item\n\n` +
        `This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setRemovingItemId(huntItemId);

      const response = await fetch("/api/admin/claim-attempts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          huntItemId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        await fetchUserHistory();
      } else {
        setError(data.error || "Failed to remove claimed item");
      }
    } catch (err) {
      setError("Failed to remove claimed item");
      console.error("Error removing claimed item:", err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const fetchUserHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUserHistory(data.user.history || []);
        setClaimAttempts(data.user.claim_attempts || []);
      } else {
        setError(data.error || "Failed to fetch user history");
      }
    } catch (err) {
      setError("Failed to fetch user history");
      console.error("Error fetching user history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const handleClose = () => {
    setUserHistory([]);
    setClaimAttempts([]);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`History: ${userName || userEmail}`}
      className="max-w-2xl text-dark-mode"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : (
          <>
            {/* Claimed Items Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Claimed Items ({userHistory.length})
              </h3>

              {userHistory.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No items claimed yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userHistory.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {item.identifier}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                            <Trophy className="w-3 h-3" />+{item.points}
                          </span>
                          <button
                            onClick={() => removeClaimedItem(item._id, item.name)}
                            disabled={removingItemId === item._id}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove this claimed item"
                          >
                            {removingItemId === item._id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Claim Attempts Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Claim Attempts ({
                    claimAttempts.slice(-10).length
                  } of {claimAttempts.length})
                </h3>

                {/* Rate Limit Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => clearClaimAttempts("rate-limit")}
                    disabled={isClearing}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400 text-sm"
                    title="Reset Rate Limit (Clear recent failed attempts)"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isClearing ? "animate-spin" : ""}`}
                    />
                    Reset Rate Limit
                  </button>
                  {/* <button
                    onClick={() => clearClaimAttempts("failed")}
                    disabled={isClearing}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 text-sm"
                    title="Clear all failed attempts"
                  >
                    <XCircle className="w-3 h-3" />
                    Clear Failed
                  </button> */}
                </div>
              </div>

              {/* Rate Limit Status */}
              {claimAttempts.length > 0 &&
                (() => {
                  const rateLimitInfo = calculateRateLimit();
                  return (
                    <div
                      className={`mb-4 p-3 rounded-lg border ${
                        rateLimitInfo.isRateLimited
                          ? "border-red-200 bg-red-50"
                          : rateLimitInfo.recentFailedAttempts > 5
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {rateLimitInfo.isRateLimited ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800">
                              Rate Limited: {rateLimitInfo.recentFailedAttempts}
                              /10 failed attempts in last 15 minutes
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">
                              {rateLimitInfo.remainingAttempts} attempts
                              remaining ({rateLimitInfo.recentFailedAttempts}/10
                              failed in last 15 minutes)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {claimAttempts.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No claim attempts recorded</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {claimAttempts
                    .slice(-10) // Show last 10 attempts
                    .reverse() // Most recent first
                    .map((attempt, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          attempt.success
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {attempt.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <code className="text-sm bg-gray-100 px-1 rounded">
                              {attempt.identifier}
                            </code>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                attempt.success
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {attempt.success ? "Success" : "Failed"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(attempt.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserHistoryDetailsModal;

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
  Plus,
  Info,
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

interface AvailableHuntItem {
  _id: string;
  name: string;
  description: string;
  identifier: string;
  points: number;
  active: boolean;
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
  const [availableHuntItems, setAvailableHuntItems] = useState<
    AvailableHuntItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
      `⚠️ Remove "${itemName}" from ${
        userName || userEmail
      }'s claimed items?\n\n` +
        `This will:\n` +
        `• Permanently remove this item from their claimed items\n` +
        `• Decrease the claim count on this hunt item\n\n` +
        `⚠️ Note: The user's points will NOT be changed. To adjust points, manually edit them in the user settings.\n\n` +
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
        setUserHistory(data.user.claimedItems || data.user.history || []);
        setClaimAttempts(data.user.claim_attempts || []);
      } else {
        setError(data.error || "Failed to fetch user claimed items");
      }
    } catch (err) {
      setError("Failed to fetch user claimed items");
      console.error("Error fetching user claimed items:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableHuntItems = async () => {
    try {
      const response = await fetch("/api/hunt-items");
      const data = await response.json();

      if (data.success) {
        setAvailableHuntItems(data.huntItems || []);
      }
    } catch (err) {
      console.error("Error fetching available hunt items:", err);
    }
  };

  const addHuntItem = async (huntItemId: string) => {
    if (!userId) return;

    try {
      setIsAdding(true);

      const response = await fetch(`/api/admin/users/${userId}/hunt-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ huntItemId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        await fetchUserHistory();
      } else {
        setError(data.error || "Failed to add hunt item");
      }
    } catch (err) {
      setError("Failed to add hunt item");
      console.error("Error adding hunt item:", err);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserHistory();
      fetchAvailableHuntItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const handleClose = () => {
    setUserHistory([]);
    setClaimAttempts([]);
    setShowAddPanel(false);
    setError(null);
    onClose();
  };

  // Get hunt items the user doesn't have yet
  const unclaimedhuntItems = availableHuntItems.filter(
    (item) => !userHistory.some((claimed) => claimed._id === item._id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Claimed Items: ${userName || userEmail}`}
      className="max-w-2xl text-dark-mode"
    >
      <div className="space-y-6">
        {/* Warning about points */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p>
                <strong>Important:</strong> Adding or removing hunt items will{" "}
                <strong>NOT</strong> change the user&apos;s points. To manually
                adjust points, edit them in the user settings.
              </p>
              <p className="mt-1">
                Adding a hunt item will also <strong>NOT</strong> add any linked
                collectibles. This must be done manually via the Collectibles
                panel.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading claimed items...</p>
          </div>
        ) : (
          <>
            {/* Claimed Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Claimed Items ({userHistory.length})
                </h3>
                <button
                  onClick={() => setShowAddPanel(!showAddPanel)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Hunt Item
                </button>
              </div>

              {/* Add Hunt Item Panel */}
              {showAddPanel && (
                <div className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Click on a hunt item to add it. Each hunt item can only be
                      claimed once per user.
                    </p>
                  </div>

                  {unclaimedhuntItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No more hunt items available to add (user has claimed all
                      items or no items exist).
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {unclaimedhuntItems.map((item) => (
                        <button
                          key={item._id}
                          onClick={() => addHuntItem(item._id)}
                          disabled={isAdding}
                          className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition disabled:opacity-50 disabled:cursor-wait text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.identifier} • {item.points} pts
                            </p>
                          </div>
                          {!item.active && (
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded shrink-0">
                              Inactive
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {isAdding && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-sm text-green-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Adding hunt item...
                    </div>
                  )}
                </div>
              )}

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
                            onClick={() =>
                              removeClaimedItem(item._id, item.name)
                            }
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

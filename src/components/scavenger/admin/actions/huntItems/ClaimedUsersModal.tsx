"use client";

import { useState, useEffect } from "react";
import {
  Users,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  Mail,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface ClaimedUser {
  _id: string;
  email: string;
  name?: string;
  claimedAt: string;
  points: number;
}

interface ClaimedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  huntItemId: string;
  huntItemName: string;
  huntItemPoints: number;
}

const ClaimedUsersModal = ({
  isOpen,
  onClose,
  huntItemId,
  huntItemName,
  huntItemPoints,
}: ClaimedUsersModalProps) => {
  const [claimedUsers, setClaimedUsers] = useState<ClaimedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchClaimedUsers = async () => {
    if (!huntItemId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/hunt-items/${huntItemId}/claimed-users`
      );
      const data = await response.json();

      if (data.success) {
        setClaimedUsers(data.claimedUsers);
      } else {
        setError(data.error || "Failed to fetch claimed users");
      }
    } catch (err) {
      setError("Failed to fetch claimed users");
      console.error("Error fetching claimed users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && huntItemId) {
      fetchClaimedUsers();
      setPointsAdjustment(0);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, huntItemId]);

  const handleMassPointsAdjustment = async (adjustment: number) => {
    if (adjustment === 0 || claimedUsers.length === 0) return;

    const action = adjustment > 0 ? "add" : "remove";
    const absAdjustment = Math.abs(adjustment);

    const confirmed = window.confirm(
      `⚠️ Mass Points Adjustment\n\n` +
        `This will ${action} ${absAdjustment} points ${
          adjustment > 0 ? "to" : "from"
        } ${claimedUsers.length} user(s) who claimed "${huntItemName}".\n\n` +
        `Are you sure you want to proceed?`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(
        `/api/hunt-items/${huntItemId}/mass-adjust-points`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointsAdjustment: adjustment }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          `Successfully ${
            action === "add" ? "added" : "removed"
          } ${absAdjustment} points ${adjustment > 0 ? "to" : "from"} ${
            data.usersAffected
          } user(s)`
        );
        setPointsAdjustment(0);
        // Refresh the user list to show updated points
        await fetchClaimedUsers();
      } else {
        setError(data.error || "Failed to adjust points");
      }
    } catch (err) {
      setError("Failed to adjust points");
      console.error("Error adjusting points:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setClaimedUsers([]);
    setError(null);
    setSuccessMessage(null);
    setPointsAdjustment(0);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Users Who Claimed: ${huntItemName}`}
      className="max-w-3xl text-dark-mode"
    >
      <div className="space-y-6 p-4">
        {/* Item Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Hunt Item:</strong> {huntItemName} |{" "}
            <strong>Points Value:</strong> {huntItemPoints} |{" "}
            <strong>Total Claimed:</strong> {claimedUsers.length}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Mass Points Adjustment */}
        {claimedUsers.length > 0 && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">
                Mass Points Adjustment
              </h3>
            </div>
            <p className="text-xs text-amber-700 mb-3">
              Adjust points for all {claimedUsers.length} user(s) who claimed
              this item. Use positive numbers to add points, negative to remove.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPointsAdjustment((prev) => prev - 1)}
                  disabled={isSubmitting}
                  className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={pointsAdjustment}
                  onChange={(e) =>
                    setPointsAdjustment(parseInt(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center bg-white text-gray-900"
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => setPointsAdjustment((prev) => prev + 1)}
                  disabled={isSubmitting}
                  className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => handleMassPointsAdjustment(pointsAdjustment)}
                disabled={isSubmitting || pointsAdjustment === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:bg-gray-400 ${
                  pointsAdjustment > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : pointsAdjustment < 0
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400"
                }`}
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : pointsAdjustment > 0 ? (
                  <Plus size={16} />
                ) : (
                  <Minus size={16} />
                )}
                {pointsAdjustment > 0
                  ? `Add ${pointsAdjustment} pts to all`
                  : pointsAdjustment < 0
                  ? `Remove ${Math.abs(pointsAdjustment)} pts from all`
                  : "Enter adjustment"}
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Claimed Users ({claimedUsers.length})
            </h3>
            <button
              onClick={fetchClaimedUsers}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-2">Loading claimed users...</p>
            </div>
          ) : claimedUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                No users have claimed this item yet
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {claimedUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-3 border border-gray-200 rounded-lg bg-white flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {user.email}
                      </span>
                      {user.name && (
                        <span className="text-sm text-gray-500">
                          ({user.name})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Claimed: {formatDate(user.claimedAt)}
                      </span>
                      <span>
                        Current Points: <strong>{user.points}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClaimedUsersModal;

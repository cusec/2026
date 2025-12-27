"use client";

import { useState, useEffect } from "react";
import { Users, RefreshCw, Clock, Mail, Sparkles } from "lucide-react";
import Modal from "@/components/ui/modal";

interface OwnedUser {
  _id: string;
  email: string;
  name?: string;
  addedAt: string | null;
  points: number;
  used: boolean;
}

interface CollectibleUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectibleId: string;
  collectibleName: string;
  collectibleCost: number;
}

const CollectibleUsersModal = ({
  isOpen,
  onClose,
  collectibleId,
  collectibleName,
  collectibleCost,
}: CollectibleUsersModalProps) => {
  const [ownedUsers, setOwnedUsers] = useState<OwnedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedUsers = async () => {
    if (!collectibleId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/collectibles/${collectibleId}/owned-users`
      );
      const data = await response.json();

      if (data.success) {
        setOwnedUsers(data.ownedUsers);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching owned users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && collectibleId) {
      fetchOwnedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, collectibleId]);

  const handleClose = () => {
    setOwnedUsers([]);
    setError(null);
    onClose();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Users Who Own: ${collectibleName}`}
      className="max-w-3xl text-dark-mode"
    >
      <div className="space-y-6 p-4">
        {/* Item Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Collectible:</strong> {collectibleName} |{" "}
              <strong>Cost:</strong> {collectibleCost} points |{" "}
              <strong>Total Owned:</strong> {ownedUsers.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Users ({ownedUsers.length})
            </h3>
            <button
              onClick={fetchOwnedUsers}
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
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : ownedUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No users own this collectible yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ownedUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-3 border rounded-lg bg-white flex items-center justify-between`}
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
                        Added: {formatDate(user.addedAt)}
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

export default CollectibleUsersModal;

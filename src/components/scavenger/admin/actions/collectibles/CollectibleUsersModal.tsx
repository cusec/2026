"use client";

import { useState, useEffect } from "react";
import {
  Users,
  RefreshCw,
  Clock,
  Mail,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface OwnedUser {
  _id: string;
  email: string;
  name?: string;
  addedAt: string | null;
  points: number;
  used: boolean;
  count: number;
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
  const [copied, setCopied] = useState(false);

  const copyUsersToClipboard = () => {
    // Create the list with each user appearing count times
    const lines: string[] = [];
    ownedUsers.forEach((user) => {
      const line = user.name ? user.name : user.email;
      for (let i = 0; i < user.count; i++) {
        lines.push(line);
      }
    });

    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  // Calculate total collectibles count
  const totalCollectiblesCount = ownedUsers.reduce(
    (sum, user) => sum + user.count,
    0
  );

  return (
    <Modal
      simple={true}
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
              <strong>Unique Users:</strong> {ownedUsers.length} |{" "}
              <strong>Total Count:</strong> {totalCollectiblesCount}
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
            <div className="flex gap-2">
              <button
                onClick={copyUsersToClipboard}
                disabled={loading || ownedUsers.length === 0}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Names
                  </>
                )}
              </button>
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
                      {user.count > 1 && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                          x{user.count}
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

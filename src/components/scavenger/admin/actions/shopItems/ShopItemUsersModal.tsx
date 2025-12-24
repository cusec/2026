"use client";

import { useState, useEffect } from "react";
import { Users, RefreshCw, Clock, Mail, Gift } from "lucide-react";
import Modal from "@/components/ui/modal";

interface RedeemedUser {
  _id: string;
  email: string;
  name?: string;
  redeemedAt: string;
  points: number;
}

interface ShopItemUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopItemId: string;
  shopItemName: string;
  shopItemCost: number;
}

const ShopItemUsersModal = ({
  isOpen,
  onClose,
  shopItemId,
  shopItemName,
  shopItemCost,
}: ShopItemUsersModalProps) => {
  const [redeemedUsers, setRedeemedUsers] = useState<RedeemedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRedeemedUsers = async () => {
    if (!shopItemId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/shop/${shopItemId}/redeemed-users`);
      const data = await response.json();

      if (data.success) {
        setRedeemedUsers(data.redeemedUsers);
      } else {
        setError(data.error || "Failed to fetch redeemed users");
      }
    } catch (err) {
      setError("Failed to fetch redeemed users");
      console.error("Error fetching redeemed users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && shopItemId) {
      fetchRedeemedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shopItemId]);

  const handleClose = () => {
    setRedeemedUsers([]);
    setError(null);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Users Who Redeemed: ${shopItemName}`}
      className="max-w-3xl text-dark-mode"
    >
      <div className="space-y-6 p-4">
        {/* Item Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-purple-800">
              <strong>Shop Prize:</strong> {shopItemName} |{" "}
              <strong>Cost:</strong> {shopItemCost} points |{" "}
              <strong>Total Redeemed:</strong> {redeemedUsers.length}
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
              Redeemed Users ({redeemedUsers.length})
            </h3>
            <button
              onClick={fetchRedeemedUsers}
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
              <p className="text-gray-600 mt-2">Loading redeemed users...</p>
            </div>
          ) : redeemedUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                No users have redeemed this item yet
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {redeemedUsers.map((user) => (
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
                        Redeemed: {formatDate(user.redeemedAt)}
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

export default ShopItemUsersModal;

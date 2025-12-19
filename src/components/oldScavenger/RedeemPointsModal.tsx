"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/modal";

interface User {
  _id: string;
  email: string;
  name: string;
  points: number;
}

interface RedeemPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RedeemPointsModal = ({ isOpen, onClose }: RedeemPointsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search users function
  const searchUsers = async (search: string) => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/users?search=${encodeURIComponent(search)}&limit=20`
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users");
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRedeemPoints = async () => {
    if (!selectedUser || pointsToRedeem <= 0) {
      setError("Please select a user and enter a valid points amount");
      return;
    }

    if (pointsToRedeem > selectedUser.points) {
      setError("Cannot redeem more points than the user has");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/redeem-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          pointsToRedeem,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to redeem points");
      }

      const data = await response.json();
      setSuccess(
        `Successfully redeemed ${pointsToRedeem} points from ${selectedUser.name}. New balance: ${data.newPoints} points.`
      );

      // Update selected user points
      setSelectedUser({ ...selectedUser, points: data.newPoints });

      // Update user in the list
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id
            ? { ...user, points: data.newPoints }
            : user
        )
      );

      setPointsToRedeem(0);
    } catch (err) {
      console.error("Error redeeming points:", err);
      setError(err instanceof Error ? err.message : "Failed to redeem points");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setUsers([]);
    setSelectedUser(null);
    setPointsToRedeem(0);
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Redeem Points">
      <div className="space-y-6">
        {/* Search Users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Users
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter email or name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {searchLoading && (
            <p className="text-sm text-gray-500 mt-1">Searching...</p>
          )}
        </div>

        {/* User List */}
        {users.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select User
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md dark:border-gray-600">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                    selectedUser?._id === user._id
                      ? "bg-primary/10 border-primary"
                      : ""
                  }`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-sm font-semibold text-primary">
                    {user.points} points
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected User Info */}
        {selectedUser && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Selected User
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedUser.name} ({selectedUser.email})
            </p>
            <p className="text-sm font-semibold text-primary">
              Current Points: {selectedUser.points}
            </p>
          </div>
        )}

        {/* Points to Redeem */}
        {selectedUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Points to Redeem
            </label>
            <input
              type="number"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
              min="1"
              max={selectedUser.points}
              placeholder="Enter points to redeem..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {selectedUser.points} points
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRedeemPoints}
            disabled={!selectedUser || pointsToRedeem <= 0 || loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redeeming..." : "Redeem Points"}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RedeemPointsModal;

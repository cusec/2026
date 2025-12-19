"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Save,
  X,
  AlertTriangle,
  Users as UsersIcon,
  History,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import UserHistoryDetailsModal from "./UserHistoryDetailsModal";

interface User {
  _id: string;
  email: string;
  name?: string;
  linked_email?: string | null;
  points: number;
  historyCount: number;
  claimAttemptsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UsersManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsersManagementModal = ({
  isOpen,
  onClose,
}: UsersManagementModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    points: 0,
    linked_email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "100",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (isOpen) {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const startEdit = (user: User) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name || "",
      points: user.points,
      linked_email: user.linked_email || "",
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", points: 0, linked_email: "" });
  };

  const saveUser = async (userId: string) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          updates: {
            name: editForm.name,
            points: editForm.points,
            linked_email: editForm.linked_email || null,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  name: editForm.name,
                  points: editForm.points,
                  linked_email: editForm.linked_email || null,
                }
              : user
          )
        );
        setEditingUser(null);
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      setError("Failed to update user");
      console.error("Error updating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearUserHistory = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `⚠️ DANGEROUS ACTION ⚠️\n\nThis will permanently clear ALL history and reset points to 0 for user: ${userName}\n\nThis action cannot be undone. Are you sure?`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          updates: { clearHistory: true },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, points: 0, historyCount: 0 } : user
          )
        );
      } else {
        setError(data.error || "Failed to clear user history");
      }
    } catch (err) {
      setError("Failed to clear user history");
      console.error("Error clearing user history:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearClaimAttempts = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `Clear all claim attempts for user: ${userName}?\n\nThis will remove the audit trail of their claim attempts. Not recommended unless necessary.`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          updates: { clearClaimAttempts: true },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, claimAttemptsCount: 0 } : user
          )
        );
      } else {
        setError(data.error || "Failed to clear claim attempts");
      }
    } catch (err) {
      setError("Failed to clear claim attempts");
      console.error("Error clearing claim attempts:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showUserHistory = (user: User) => {
    setSelectedUser(user);
    setHistoryModalOpen(true);
  };

  const handleClose = () => {
    setUsers([]);
    setSearchTerm("");
    setEditingUser(null);
    setError(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Users Management"
        className="max-w-6xl text-dark-mode"
      >
        <div className="space-y-6">
          {/* Header with search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Users list */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Users ({users.length})
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    {editingUser === user._id ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                              placeholder="Enter name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Points
                            </label>
                            <input
                              type="number"
                              value={editForm.points}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  points: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Linked Email
                            </label>
                            <input
                              type="email"
                              value={editForm.linked_email}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  linked_email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                              placeholder="Enter linked email (optional)"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveUser(user._id)}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">
                              {user.name || "No name"}
                            </h4>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>
                              Points: <strong>{user.points}</strong>
                            </span>
                            <span>
                              Items: <strong>{user.historyCount}</strong>
                            </span>
                            <span>
                              Attempts:{" "}
                              <strong>{user.claimAttemptsCount}</strong>
                            </span>
                            <span>
                              Linked:{" "}
                              <strong>{user.linked_email || "None"}</strong>
                            </span>
                            <span>
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showUserHistory(user)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            title="View History"
                          >
                            <History className="w-3 h-3" />
                            History & Claim Attempts
                          </button>
                          <button
                            onClick={() => startEdit(user)}
                            disabled={editingUser !== null || isSubmitting}
                            className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400 text-sm"
                            title="Edit User"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          {/* <button
                            onClick={() =>
                              clearClaimAttempts(
                                user._id,
                                user.name || user.email
                              )
                            }
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 text-sm"
                            title="Clear Claim Attempts (Not Recommended)"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Clear Attempts
                          </button>
                          <button
                            onClick={() =>
                              clearUserHistory(
                                user._id,
                                user.name || user.email
                              )
                            }
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                            title="Clear History & Points (DANGEROUS)"
                          >
                            <Trash2 className="w-3 h-3" />
                            Clear History
                            <AlertTriangle className="w-3 h-3" />
                          </button> */}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <strong>Admin Controls Warning</strong>
            </div>
            <ul className="space-y-1 ml-6">
              <li>
                • <strong>Clear History</strong>: Permanently removes all
                claimed items and resets points to 0
              </li>
              <li>
                • <strong>Clear Attempts</strong>: Removes audit trail of claim
                attempts (not recommended)
              </li>
              <li>• These actions cannot be undone</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* User History Details Modal */}
      <UserHistoryDetailsModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        userId={selectedUser?._id || null}
        userName={selectedUser?.name || ""}
        userEmail={selectedUser?.email || ""}
      />
    </>
  );
};

export default UsersManagementModal;

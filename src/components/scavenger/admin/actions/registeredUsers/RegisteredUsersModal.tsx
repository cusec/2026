"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users as UsersIcon,
  RefreshCw,
  Mail,
  GraduationCap,
  User,
  Check,
  X as XIcon,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface RegisteredUser {
  _id: string;
  name: string;
  linkedEmail: string;
  studentEmail?: string | null;
  personalEmail?: string | null;
  isLinked: boolean;
}

interface RegisteredUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisteredUsersModal = ({
  isOpen,
  onClose,
}: RegisteredUsersModalProps) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRegisteredUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "100",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/registered-users?${params}`);
      const data = await response.json();

      if (data.success) {
        setRegisteredUsers(data.registeredUsers);
      } else {
        setError(data.error || "Failed to fetch registered users");
      }
    } catch (err) {
      setError("Failed to fetch registered users");
      console.error("Error fetching registered users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRegisteredUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (isOpen) {
        fetchRegisteredUsers();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const toggleIsLinked = async (userId: string, currentValue: boolean) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/admin/registered-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          isLinked: !currentValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setRegisteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isLinked: !currentValue } : user
          )
        );
      } else {
        setError(data.error || "Failed to update registered user");
      }
    } catch (err) {
      setError("Failed to update registered user");
      console.error("Error updating registered user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      simple={true}
      title="Ticket Owners Management"
      className="max-w-6xl text-dark-mode"
    >
      <div className="space-y-6">
        {/* Header with search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, linked email, school email, or personal email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <button
            onClick={fetchRegisteredUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
              Registered Users
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading registered users...</p>
            </div>
          ) : registeredUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No registered users found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {registeredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <h4 className="font-semibold text-gray-900">
                          {user.name}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">Linked Email:</span>
                          <span>{user.linkedEmail}</span>
                        </div>
                        {user.studentEmail && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">School Email:</span>
                            <span>{user.studentEmail}</span>
                          </div>
                        )}
                        {user.personalEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Personal Email:</span>
                            <span>{user.personalEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleIsLinked(user._id, user.isLinked)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          user.isLinked
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={
                          user.isLinked
                            ? "Click to mark as not linked"
                            : "Click to mark as linked"
                        }
                      >
                        {user.isLinked ? (
                          <>
                            <Check className="w-4 h-4" />
                            Linked
                          </>
                        ) : (
                          <>
                            <XIcon className="w-4 h-4" />
                            Not Linked
                          </>
                        )}
                      </button>
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

export default RegisteredUsersModal;

"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Trophy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldAlert,
} from "lucide-react";

interface SuspiciousPattern {
  claim1Time: string;
  claim2Time: string;
  timeDiffMinutes: number;
  item1Identifier: string;
  item2Identifier: string;
}

interface SuspiciousUser {
  _id: string;
  email: string;
  name?: string;
  displayPoints: number;
  calculatedPoints: number;
  claimedItemsCount: number;
  successfulClaimsCount: number;
  suspiciousPatterns: SuspiciousPattern[];
  isSuspicious: boolean;
  suspiciousCount: number;
}

interface Stats {
  totalAnalyzed: number;
  suspiciousUsers: number;
  totalSuspiciousPatterns: number;
}

interface SuspiciousActivityMonitorProps {
  isVisible: boolean;
}

const SuspiciousActivityMonitor = ({
  isVisible,
}: SuspiciousActivityMonitorProps) => {
  const [users, setUsers] = useState<SuspiciousUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const fetchSuspiciousActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/suspicious-activity");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      } else {
        setError(data.error || "Failed to fetch suspicious activity data");
      }
    } catch (err) {
      setError("Failed to fetch suspicious activity data");
      console.error("Error fetching suspicious activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchSuspiciousActivity();
    }
  }, [isVisible]);

  const toggleExpanded = (userId: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6 text-dark-mode">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Analyzing top 100 participants by claimed hunt item points for
          suspicious claim patterns (successful claims &lt; 5 minutes apart).
        </p>
        <button
          onClick={fetchSuspiciousActivity}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analyzing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600">Users Analyzed</div>
            <div className="text-lg font-semibold text-blue-800">
              {stats.totalAnalyzed}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              stats.suspiciousUsers > 0
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div
              className={`text-sm ${
                stats.suspiciousUsers > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              Suspicious Users
            </div>
            <div
              className={`text-lg font-semibold ${
                stats.suspiciousUsers > 0 ? "text-red-800" : "text-green-800"
              }`}
            >
              {stats.suspiciousUsers}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              stats.totalSuspiciousPatterns > 0
                ? "bg-orange-50 border-orange-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div
              className={`text-sm ${
                stats.totalSuspiciousPatterns > 0
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              Suspicious Patterns
            </div>
            <div
              className={`text-lg font-semibold ${
                stats.totalSuspiciousPatterns > 0
                  ? "text-orange-800"
                  : "text-green-800"
              }`}
            >
              {stats.totalSuspiciousPatterns}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Users List */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {loading && users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Analyzing user activity...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users with claimed items found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`${
                  user.isSuspicious ? "bg-red-50" : "bg-white"
                } transition-colors`}
              >
                {/* User Row */}
                <div
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    user.isSuspicious ? "hover:bg-red-100" : ""
                  }`}
                  onClick={() => user.isSuspicious && toggleExpanded(user._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      {user.isSuspicious ? (
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                      ) : (
                        <Shield className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {user.name || user.email}
                          </span>
                          {user.isSuspicious && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-red-200 text-red-800 rounded">
                              {user.suspiciousCount} suspicious
                            </span>
                          )}
                        </div>
                        {user.name && (
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold">
                            {user.calculatedPoints} pts
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.claimedItemsCount} items claimed
                        </div>
                      </div>
                      {user.isSuspicious && (
                        <button className="p-1">
                          {expandedUsers.has(user._id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {user.isSuspicious && expandedUsers.has(user._id) && (
                  <div className="px-4 pb-4 bg-red-50 border-t border-red-200">
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Suspicious Claim Patterns (under 5 minutes apart)
                      </h4>
                      <div className="space-y-2">
                        {user.suspiciousPatterns.map((pattern, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white rounded border border-red-200 text-sm"
                          >
                            <div className="flex items-center gap-2 text-red-700">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">
                                {pattern.timeDiffMinutes} minutes apart
                              </span>
                            </div>
                            <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Claim 1:</span>{" "}
                                <code className="bg-gray-100 px-1 rounded">
                                  {pattern.item1Identifier}
                                </code>
                                <div className="text-gray-400">
                                  {formatTime(pattern.claim1Time)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Claim 2:</span>{" "}
                                <code className="bg-gray-100 px-1 rounded">
                                  {pattern.item2Identifier}
                                </code>
                                <div className="text-gray-400">
                                  {formatTime(pattern.claim2Time)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        💡 Users are sorted by suspicious activity first, then by total points
        from claimed items. Click on suspicious users to see details.
      </div>
    </div>
  );
};

export default SuspiciousActivityMonitor;

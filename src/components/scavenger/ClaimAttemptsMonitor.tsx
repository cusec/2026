"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface ClaimAttempt {
  userEmail: string;
  userName?: string;
  identifier: string;
  success: boolean;
  timestamp: string;
  item_id?: string;
}

interface ClaimAttemptsStats {
  totalAttempts: number;
  failedAttempts: number;
  successfulAttempts: number;
  uniqueUsers: number;
}

interface ClaimAttemptsMonitorProps {
  isVisible: boolean;
}

const ClaimAttemptsMonitor = ({ isVisible }: ClaimAttemptsMonitorProps) => {
  const [claimAttempts, setClaimAttempts] = useState<ClaimAttempt[]>([]);
  const [stats, setStats] = useState<ClaimAttemptsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFailedOnly, setShowFailedOnly] = useState(false);

  const fetchClaimAttempts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "50",
        ...(showFailedOnly && { failed: "true" }),
      });

      const response = await fetch(`/api/admin/claim-attempts?${params}`);
      const data = await response.json();

      if (data.success) {
        setClaimAttempts(data.claimAttempts);
        setStats(data.stats);
      } else {
        setError(data.error || "Failed to fetch claim attempts");
      }
    } catch (err) {
      setError("Failed to fetch claim attempts");
      console.error("Error fetching claim attempts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchClaimAttempts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, showFailedOnly]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={fetchClaimAttempts}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showFailedOnly}
            onChange={(e) => setShowFailedOnly(e.target.checked)}
            className="rounded"
          />
          Show failed attempts only
        </label>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Total
            </div>
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              {stats.totalAttempts}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
            <div className="text-lg font-semibold text-red-800 dark:text-red-200">
              {stats.failedAttempts}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400">
              Success
            </div>
            <div className="text-lg font-semibold text-green-800 dark:text-green-200">
              {stats.successfulAttempts}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Users
            </div>
            <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">
              {stats.uniqueUsers}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Attempts List */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {claimAttempts.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No claim attempts found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {claimAttempts.map((attempt, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attempt.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {attempt.userName || attempt.userEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(attempt.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Identifier:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    {attempt.identifier}
                  </code>
                </div>
                {attempt.userEmail !==
                  (attempt.userName || attempt.userEmail) && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {attempt.userEmail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        💡 Monitor for potential brute force attempts or suspicious patterns
      </div>
    </div>
  );
};

export default ClaimAttemptsMonitor;

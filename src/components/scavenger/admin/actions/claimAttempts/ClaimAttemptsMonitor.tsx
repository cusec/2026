"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

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

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ClaimAttemptsMonitorProps {
  isVisible: boolean;
}

const ClaimAttemptsMonitor = ({ isVisible }: ClaimAttemptsMonitorProps) => {
  const [claimAttempts, setClaimAttempts] = useState<ClaimAttempt[]>([]);
  const [stats, setStats] = useState<ClaimAttemptsStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFailedOnly, setShowFailedOnly] = useState(false);
  const [identifierSearch, setIdentifierSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const ITEMS_PER_PAGE = 25;

  const fetchClaimAttempts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        page: page.toString(),
        ...(showFailedOnly && { failed: "true" }),
        ...(identifierSearch && { identifier: identifierSearch }),
      });

      const response = await fetch(`/api/admin/claim-attempts?${params}`);
      const data = await response.json();

      if (data.success) {
        setClaimAttempts(data.claimAttempts);
        setStats(data.stats);
        setPagination(data.pagination);
        setCurrentPage(page);
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
      fetchClaimAttempts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, showFailedOnly, identifierSearch]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchClaimAttempts(page);
    }
  };

  const handleSearch = () => {
    setIdentifierSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setIdentifierSearch("");
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6 text-dark-mode">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => fetchClaimAttempts(currentPage)}
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

      {/* Identifier Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by identifier (case-insensitive)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
        >
          Search
        </button>
        {identifierSearch && (
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {identifierSearch && (
        <div className="text-sm text-gray-600">
          Filtering by identifier: <code className="bg-gray-100 px-1 rounded">{identifierSearch}</code>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600">Total</div>
            <div className="text-lg font-semibold text-blue-800">
              {stats.totalAttempts}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-600">Failed</div>
            <div className="text-lg font-semibold text-red-800">
              {stats.failedAttempts}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600">Success</div>
            <div className="text-lg font-semibold text-green-800">
              {stats.successfulAttempts}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600">Users</div>
            <div className="text-lg font-semibold text-purple-800">
              {stats.uniqueUsers}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Attempts List */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
        {claimAttempts.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500">
            No claim attempts found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {claimAttempts.map((attempt, index) => (
              <div key={index} className="p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attempt.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-sm text-gray-900">
                      {attempt.userName || attempt.userEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(attempt.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Identifier:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {attempt.identifier}
                  </code>
                </div>
                {attempt.userEmail !==
                  (attempt.userName || attempt.userEmail) && (
                  <div className="mt-1 text-xs text-gray-500">
                    {attempt.userEmail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)} of{" "}
            {pagination.totalItems} attempts
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={!pagination.hasPrevPage || loading}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(pagination.totalPages)}
              disabled={!pagination.hasNextPage || loading}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        💡 Monitor for potential brute force attempts or suspicious patterns
      </div>
    </div>
  );
};

export default ClaimAttemptsMonitor;

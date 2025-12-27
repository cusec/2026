"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  _id: string;
  adminEmail: string;
  targetUserEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 20;

const AuditLogsModal = ({ isOpen, onClose }: AuditLogsModalProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    adminEmail: "",
    targetUserEmail: "",
    action: "",
    resourceType: "",
    startDate: "",
    endDate: "",
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const fetchAuditLogs = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            searchParams.set(key, value.toString());
          }
        });

        searchParams.set("limit", ITEMS_PER_PAGE.toString());
        searchParams.set("offset", ((page - 1) * ITEMS_PER_PAGE).toString());

        const response = await fetch(`/api/admin/audit-logs?${searchParams}`);
        const data = await response.json();

        if (data.success) {
          setAuditLogs(data.auditLogs);
          setTotalCount(data.pagination?.total || 0);
        } else {
          setError(data.error || "Failed to fetch audit logs");
        }
      } catch (err) {
        setError("Failed to fetch audit logs");
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (isOpen) {
      fetchAuditLogs(currentPage);
    }
  }, [isOpen, currentPage, fetchAuditLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAuditLogs(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionColor = (action: string) => {
    if (action.includes("DELETE")) return "text-red-600 bg-red-50";
    if (action.includes("CREATE")) return "text-green-600 bg-green-50";
    if (action.includes("UPDATE")) return "text-blue-600 bg-blue-50";
    if (action.includes("CLEAR")) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black text-dark-mode bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-scroll">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Admin Audit Logs
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="text"
                value={filters.adminEmail}
                onChange={(e) =>
                  handleFilterChange("adminEmail", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                placeholder="Filter by admin email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target User Email
              </label>
              <input
                type="text"
                value={filters.targetUserEmail}
                onChange={(e) =>
                  handleFilterChange("targetUserEmail", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                placeholder="Filter by target user"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="CLEAR">Clear</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                value={filters.resourceType}
                onChange={(e) =>
                  handleFilterChange("resourceType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              >
                <option value="">All Types</option>
                <option value="user">User</option>
                <option value="huntItem">Hunt Item</option>
                <option value="claimAttempts">Claim Attempts</option>
                <option value="scheduleItem">Schedule Item</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div className="h-96 overflow-y-auto">
            {loading && auditLogs.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm text-gray-600">
                          {log.resourceType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(log.createdAt)}
                        </span>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="text-gray-900">
                        <strong>Admin:</strong> {log.adminEmail}
                      </div>
                      {log.targetUserEmail && (
                        <div className="text-gray-600">
                          <strong>Target:</strong> {log.targetUserEmail}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {auditLogs.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No audit logs found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing{" "}
                {auditLogs.length > 0
                  ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                  : 0}{" "}
                to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
                {totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex flex-wrap items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        } disabled:opacity-50`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Audit Log Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-96">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto text-gray-900">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsModal;

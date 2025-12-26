"use client";

import { useState, useEffect } from "react";
import {
  Gem,
  Plus,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface UserCollectible {
  _id: string;
  collectibleId: string;
  used: boolean;
  addedAt: string;
  name: string;
  description: string;
  slug: string;
  cost: number;
  imageData: string;
  imageContentType: string;
}

interface AvailableCollectible {
  _id: string;
  name: string;
  description: string;
  slug: string;
  cost: number;
  imageData: string;
  imageContentType: string;
}

interface UserCollectiblesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string;
  userEmail: string;
}

// Helper function to get image source from collectible
const getCollectibleImageSrc = (
  imageData: string,
  imageContentType: string
): string | null => {
  if (imageData && imageContentType) {
    return `data:${imageContentType};base64,${imageData}`;
  }
  return null;
};

const UserCollectiblesModal = ({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
}: UserCollectiblesModalProps) => {
  const [userCollectibles, setUserCollectibles] = useState<UserCollectible[]>(
    []
  );
  const [availableCollectibles, setAvailableCollectibles] = useState<
    AvailableCollectible[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [togglingUsedId, setTogglingUsedId] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const fetchUserCollectibles = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}/collectibles`);
      const data = await response.json();

      if (data.success) {
        setUserCollectibles(data.collectibles || []);
      } else {
        setError(data.error || "Failed to fetch user collectibles");
      }
    } catch (err) {
      setError("Failed to fetch user collectibles");
      console.error("Error fetching user collectibles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCollectibles = async () => {
    try {
      const response = await fetch("/api/collectibles?includeAll=true");
      const data = await response.json();

      if (data.success) {
        setAvailableCollectibles(data.collectibles || []);
      }
    } catch (err) {
      console.error("Error fetching available collectibles:", err);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserCollectibles();
      fetchAvailableCollectibles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const addCollectible = async (collectibleId: string) => {
    if (!userId) return;

    try {
      setIsAdding(true);

      const response = await fetch(`/api/admin/users/${userId}/collectibles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectibleId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the collectibles list
        await fetchUserCollectibles();
      } else {
        setError(data.error || "Failed to add collectible");
      }
    } catch (err) {
      setError("Failed to add collectible");
      console.error("Error adding collectible:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const removeCollectible = async (
    instanceId: string,
    collectibleName: string
  ) => {
    if (!userId) return;

    const confirmed = window.confirm(
      `Remove "${collectibleName}" from ${
        userName || userEmail
      }'s collectibles?\n\n` +
        `⚠️ Note: This will NOT change the user's points. To adjust points, manually edit them in the user settings.`
    );
    if (!confirmed) return;

    try {
      setRemovingId(instanceId);

      const response = await fetch(`/api/admin/users/${userId}/collectibles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instanceId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the collectibles list
        await fetchUserCollectibles();
      } else {
        setError(data.error || "Failed to remove collectible");
      }
    } catch (err) {
      setError("Failed to remove collectible");
      console.error("Error removing collectible:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const toggleUsedStatus = async (instanceId: string, currentUsed: boolean) => {
    if (!userId) return;

    try {
      setTogglingUsedId(instanceId);

      const response = await fetch(`/api/admin/users/${userId}/collectibles`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instanceId, used: !currentUsed }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately for better UX
        setUserCollectibles((prev) =>
          prev.map((c) =>
            c._id === instanceId ? { ...c, used: !currentUsed } : c
          )
        );
      } else {
        setError(data.error || "Failed to update used status");
      }
    } catch (err) {
      setError("Failed to update used status");
      console.error("Error updating used status:", err);
    } finally {
      setTogglingUsedId(null);
    }
  };

  const handleClose = () => {
    setUserCollectibles([]);
    setError(null);
    setShowAddPanel(false);
    onClose();
  };

  // Count duplicates
  const collectibleCounts = userCollectibles.reduce((acc, item) => {
    acc[item.collectibleId] = (acc[item.collectibleId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Collectibles: ${userName || userEmail}`}
      className="max-w-3xl text-dark-mode"
    >
      <div className="space-y-6">
        {/* Warning about points */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Important:</strong> Adding or removing collectibles here
              will <strong>NOT</strong> change the user&apos;s points. To update
              points, manually edit them in the user settings.
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading collectibles...</p>
          </div>
        ) : (
          <>
            {/* Add Collectible Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-600" />
                User Collectibles ({userCollectibles.length})
              </h3>
              <button
                onClick={() => setShowAddPanel(!showAddPanel)}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Collectible
              </button>
            </div>

            {/* Add Collectible Panel */}
            {showAddPanel && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Click on a collectible to add it. You can add the same
                    collectible multiple times by clicking repeatedly.
                  </p>
                </div>

                {availableCollectibles.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No collectibles available in the database.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {availableCollectibles.map((collectible) => (
                      <button
                        key={collectible._id}
                        onClick={() => addCollectible(collectible._id)}
                        disabled={isAdding}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition disabled:opacity-50 disabled:cursor-wait text-left"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-200">
                          {collectible.imageData && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                getCollectibleImageSrc(
                                  collectible.imageData,
                                  collectible.imageContentType
                                ) || ""
                              }
                              alt={collectible.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {collectible.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isAdding && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-purple-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Adding collectible...
                  </div>
                )}
              </div>
            )}

            {/* User's Collectibles List */}
            {userCollectibles.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Gem className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-600">No collectibles yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Click &quot;Add Collectible&quot; to add items to this
                  user&apos;s collection.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {userCollectibles.map((collectible) => (
                  <div
                    key={collectible._id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                      {collectible.imageData && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            getCollectibleImageSrc(
                              collectible.imageData,
                              collectible.imageContentType
                            ) || ""
                          }
                          alt={collectible.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {collectible.name}
                        </h4>
                        {collectibleCounts[collectible.collectibleId] > 1 && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                            x{collectibleCounts[collectible.collectibleId]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Added:{" "}
                        {new Date(collectible.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Used toggle */}
                    <button
                      onClick={() =>
                        toggleUsedStatus(collectible._id, collectible.used)
                      }
                      disabled={togglingUsedId === collectible._id}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        collectible.used
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={
                        collectible.used ? "Mark as unused" : "Mark as used"
                      }
                    >
                      {togglingUsedId === collectible._id ? (
                        <RefreshCw className="w-3 h-3 animate-spin inline" />
                      ) : collectible.used ? (
                        "Used"
                      ) : (
                        "Unused"
                      )}
                    </button>
                    <button
                      onClick={() =>
                        removeCollectible(collectible._id, collectible.name)
                      }
                      disabled={removingId === collectible._id}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove this collectible"
                    >
                      {removingId === collectible._id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserCollectiblesModal;

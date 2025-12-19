"use client";

import { useState, useEffect } from "react";
import { Package, Gem, X } from "lucide-react";
import Modal from "@/components/ui/modal";
import { HuntItem, Collectible } from "@/lib/interface";

interface InventoryModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryResponse {
  success: boolean;
  inventory: {
    claimedItems: HuntItem[];
    collectibles: Collectible[];
  };
}

// Helper function to get image source from collectible
const getCollectibleImageSrc = (item: Collectible): string | null => {
  if (item.imageData && item.imageContentType) {
    return `data:${item.imageContentType};base64,${item.imageData}`;
  }
  return null;
};

interface InventoryModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryResponse {
  success: boolean;
  inventory: {
    claimedItems: HuntItem[];
    collectibles: Collectible[];
  };
}

const InventoryModal = ({ userId, isOpen, onClose }: InventoryModalProps) => {
  const [claimedItems, setClaimedItems] = useState<HuntItem[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}/inventory`);
      const data: InventoryResponse = await response.json();

      if (data.success) {
        setClaimedItems(data.inventory.claimedItems || []);
        setCollectibles(data.inventory.collectibles || []);
      } else {
        throw new Error("Failed to load inventory");
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 max-w-[90vw] md:max-w-2xl bg-dark-mode/90 text-light-mode rounded-2xl max-h-[80vh]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Your Inventory
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-mode/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-mode mx-auto mb-4"></div>
            <p className="text-light-mode/70">Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchInventory}
              className="px-4 py-2 bg-light-mode/10 hover:bg-light-mode/20 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Hunt Items Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 sticky top-0 bg-dark-mode/90 py-2">
                <Package className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">
                  Hunt Items ({claimedItems.length})
                </h3>
              </div>
              {claimedItems.length === 0 ? (
                <div className="text-center py-6 bg-light-mode/5 rounded-lg">
                  <Package className="w-12 h-12 mx-auto mb-2 text-light-mode/30" />
                  <p className="text-light-mode/50">
                    No hunt items claimed yet.
                  </p>
                  <p className="text-light-mode/40 text-sm mt-1">
                    Scan QR codes to claim items!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {claimedItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-light-mode/10 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-light-mode/60 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-accent font-bold">
                          {item.points}
                        </span>
                        <span className="text-light-mode/60 text-sm ml-1">
                          pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-light-mode/20"></div>

            {/* Collectibles Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 sticky top-0 bg-dark-mode/90 py-2">
                <Gem className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">
                  Collectibles ({collectibles.length})
                </h3>
              </div>
              {collectibles.length === 0 ? (
                <div className="text-center py-6 bg-light-mode/5 rounded-lg">
                  <Gem className="w-12 h-12 mx-auto mb-2 text-light-mode/30" />
                  <p className="text-light-mode/50">No collectibles yet.</p>
                  <p className="text-light-mode/40 text-sm mt-1">
                    Claim hunt items or purchase from the shop!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {collectibles.map((collectible) => (
                    <div
                      key={collectible._id}
                      className="flex items-center gap-4 p-4 bg-light-mode/10 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCollectibleImageSrc(collectible) || ""}
                          alt={collectible.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {collectible.name}
                        </p>
                        {collectible.subtitle && (
                          <p className="text-sm text-light-mode/60 truncate">
                            {collectible.subtitle}
                          </p>
                        )}
                        {collectible.description && (
                          <p className="text-xs text-light-mode/40 mt-1 line-clamp-2">
                            {collectible.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InventoryModal;

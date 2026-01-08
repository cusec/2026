"use client";

import { useState, useEffect } from "react";
import { Package, Gem, X, Gift } from "lucide-react";
import Modal from "@/components/ui/modal";
import { HuntItem, ShopItem } from "@/lib/interface";

// Extended collectible interface for inventory (includes instance-specific fields)
interface InventoryCollectible {
  _id: string;
  collectibleId: string;
  used: boolean;
  addedAt: string;
  name: string;
  description: string;
  cost: number;
  imageUrl?: string;
}

interface InventoryModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryResponse {
  success: boolean;
  inventory: {
    claimedItems: HuntItem[];
    shopPrizes: ShopItem[];
    collectibles: InventoryCollectible[];
  };
}

// Helper function to get image source from shop item
const getShopItemImageSrc = (item: ShopItem): string | null => {
  if (item.imageUrl) {
    return item.imageUrl;
  }
  return null;
};

// Interface for grouped collectibles
interface GroupedCollectible {
  name: string;
  description: string;
  imageUrl?: string;
  available: number;
  used: number;
}

// Helper function to group collectibles by name
const groupCollectiblesByName = (
  collectibles: InventoryCollectible[]
): GroupedCollectible[] => {
  const grouped = new Map<string, GroupedCollectible>();

  for (const collectible of collectibles) {
    const existing = grouped.get(collectible.name);
    if (existing) {
      if (collectible.used) {
        existing.used++;
      } else {
        existing.available++;
      }
    } else {
      grouped.set(collectible.name, {
        name: collectible.name,
        description: collectible.description,
        imageUrl: collectible.imageUrl,
        available: collectible.used ? 0 : 1,
        used: collectible.used ? 1 : 0,
      });
    }
  }

  return Array.from(grouped.values());
};

const InventoryModal = ({ userId, isOpen, onClose }: InventoryModalProps) => {
  const [claimedItems, setClaimedItems] = useState<HuntItem[]>([]);
  const [shopPrizes, setShopPrizes] = useState<ShopItem[]>([]);
  const [collectibles, setCollectibles] = useState<InventoryCollectible[]>([]);
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
        setShopPrizes(data.inventory.shopPrizes || []);
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
      className="mx-4 overflow-y-hidden max-w-[90vw] md:max-w-2xl bg-dark-mode/85 text-light-mode rounded-2xl max-h-[80vh]"
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
          <div className="overflow-y-scroll space-y-6 max-h-[60vh] pr-2">
            {/* Hunt Items Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 top-0 py-2">
                <Package className="w-5 h-5 text-sea" />
                <h3 className="text-lg font-semibold">
                  Hunt Items ({claimedItems.length})
                </h3>
              </div>
              {claimedItems.length === 0 ? (
                <div className="text-center py-6 rounded-lg">
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
                      className="flex items-center gap-4 p-4 border-l border-light-mode/40"
                    >
                      <div className="w-10 h-10 hidden md:flex rounded-full bg-light-mode/10  items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-light-mode" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold wrap-break-word text-light-mode">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-sm text-light-mode/60 wrap-break-word">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-light-mode font-bold">
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

            {/* Shop Prizes Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 top-0 py-2">
                <Gift className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">
                  Shop Prizes ({shopPrizes.length})
                </h3>
              </div>
              {shopPrizes.length === 0 ? (
                <div className="text-center py-6 rounded-lg">
                  <Gift className="w-12 h-12 mx-auto mb-2 text-light-mode/30" />
                  <p className="text-light-mode/50">
                    No shop prizes redeemed yet.
                  </p>
                  <p className="text-light-mode/40 text-sm mt-1">
                    Visit the shop to redeem prizes!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {shopPrizes.map((prize) => (
                    <div
                      key={prize._id}
                      className="flex items-center gap-4 p-4 border-l border-light-mode/40"
                    >
                      {getShopItemImageSrc(prize) && (
                        <div className="w-10 h-10 hidden md:flex rounded-full overflow-hidden shrink-0 bg-light-mode/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getShopItemImageSrc(prize)!}
                            alt={prize.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold wrap-break-word text-light-mode">
                          {prize.count || 0 > 1 ? `(${prize.count}x) ` : ""}
                          {prize.name}
                        </p>
                        {prize.description && (
                          <p className="text-sm text-light-mode/60 wrap-break-word">
                            {prize.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-light-mode font-bold">
                          {prize.cost}
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
              <div className="flex items-center gap-2 mb-4 top-0 py-2">
                <Gem className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-semibold">
                  Collectibles ({collectibles.length})
                </h3>
              </div>
              {collectibles.length === 0 ? (
                <div className="text-center py-6 rounded-lg">
                  <Gem className="w-12 h-12 mx-auto mb-2 text-light-mode/30" />
                  <p className="text-light-mode/50">No collectibles yet.</p>
                  <p className="text-light-mode/40 text-sm mt-1">
                    Claim hunt items or purchase from the shop!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {groupCollectiblesByName(collectibles).map((collectible) => (
                    <div
                      key={collectible.name}
                      className="flex items-center gap-4 p-4 border-l border-light-mode/40"
                    >
                      {collectible.imageUrl && (
                          <div className="w-10 h-10 hidden md:flex rounded-full overflow-hidden shrink-0 bg-light-mode/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={collectible.imageUrl}
                              alt={collectible.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold wrap-break-word text-light-mode">
                          {collectible.name}
                        </p>
                        {collectible.description && (
                          <p className="text-xs text-light-mode/60 mt-1 wrap-break-word">
                            {collectible.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-light-mode">
                          <span className="text-light-mode/60 text-sm">
                            Available:{" "}
                          </span>
                          <span className="font-bold">
                            {collectible.available}
                          </span>
                        </div>
                        <div className="text-light-mode">
                          <span className="text-light-mode/60 text-sm">
                            Used:{" "}
                          </span>
                          <span className="font-bold">{collectible.used}</span>
                        </div>
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

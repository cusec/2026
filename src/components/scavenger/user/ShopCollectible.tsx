"use client";

import { useState } from "react";
import { Collectible } from "@/lib/interface";
import Modal from "@/components/ui/modal";
import { Loader2 } from "lucide-react";

interface ShopCollectibleProps {
  collectible: Collectible;
  userPoints: number;
  onRedeemSuccess?: (newPoints: number) => void;
}

// Helper function to get image source from collectible
const getCollectibleImageSrc = (item: Collectible): string | null => {
  if (item.imageData && item.imageContentType) {
    return `data:${item.imageContentType};base64,${item.imageData}`;
  }
  return null;
};

const ShopCollectible = ({
  collectible,
  userPoints,
  onRedeemSuccess,
}: ShopCollectibleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const canAfford = userPoints >= collectible.cost;

  const isSoldOut = collectible.limited && collectible.remaining <= 0;

  const openModal = () => {
    setIsModalOpen(true);
    setRedeemError(null);
    setRedeemSuccess(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRedeemError(null);
    setRedeemSuccess(null);
  };

  const handleRedeem = async () => {
    if (!canAfford) return;

    setIsRedeeming(true);
    setRedeemError(null);

    try {
      const response = await fetch("/api/collectibles/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectibleId: collectible._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRedeemSuccess(data.message);
        // Update points after successful redemption
        onRedeemSuccess?.(data.redemption.user.newPoints);
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setRedeemError(data.error || "Failed to purchase collectible");
      }
    } catch (error) {
      console.error("Error purchasing collectible:", error);
      setRedeemError("Failed to purchase collectible. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-light-mode/70 rounded-lg border transition-all duration-200 hover:shadow-md text-dark-mode">
        <div className="flex items-center space-x-4">
          {getCollectibleImageSrc(collectible) && (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getCollectibleImageSrc(collectible)!}
                alt={collectible.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-semibold">{collectible.name}</p>
            <p className="text-sm">{collectible.cost} points</p>
            {isSoldOut && (
              <span className="text-xs text-red-600 font-medium">Sold out</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openModal}
            className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
          >
            More Info
          </button>
        </div>
      </div>

      {/* Collectible Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={collectible.name}
        className="max-w-md text-dark-mode"
      >
        {redeemSuccess ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold mb-2">
              ✓ {redeemSuccess}
            </div>
            <p className="text-sm text-gray-600">
              Check your inventory to see your new collectible!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Collectible Image */}
            {getCollectibleImageSrc(collectible) && (
              <div className="w-full h-32 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCollectibleImageSrc(collectible)!}
                  alt={collectible.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            {collectible.description && (
              <p className="text-gray-700">{collectible.description}</p>
            )}

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Cost:</span>
                <span className="text-primary font-bold">
                  {collectible.cost} points
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Your Points:</span>
                <span className={canAfford ? "text-green-600" : "text-red-600"}>
                  {userPoints} points
                </span>
              </div>
              {collectible.limited && (
                <div className="flex justify-between">
                  <span className="font-medium">Availability:</span>
                  <span
                    className={
                      collectible.remaining > 0
                        ? "text-orange-600"
                        : "text-red-600"
                    }
                  >
                    {collectible.remaining > 0
                      ? `${collectible.remaining} remaining`
                      : "Sold out"}
                  </span>
                </div>
              )}
            </div>

            {/* Sold Out Warning */}
            {isSoldOut && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                This collectible is sold out.
              </div>
            )}

            {/* Points Warning */}
            {!canAfford && !isSoldOut && (
              <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                You need {collectible.cost - userPoints} more points to purchase
                this collectible.
              </div>
            )}

            {/* Error Message */}
            {redeemError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {redeemError}
              </div>
            )}

            {/* Redeem Button */}
            <button
              onClick={handleRedeem}
              disabled={!canAfford || isRedeeming || isSoldOut}
              className="w-full py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Purchasing...
                </>
              ) : isSoldOut ? (
                "Sold Out"
              ) : canAfford ? (
                "Purchase Collectible"
              ) : (
                "Not Enough Points"
              )}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ShopCollectible;

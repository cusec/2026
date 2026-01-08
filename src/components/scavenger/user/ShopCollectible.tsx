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
  if (item.imageUrl) {
    return item.imageUrl;
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

  const canAfford =
    collectible.discountedCost != null
      ? userPoints >= collectible.discountedCost
      : userPoints >= collectible.cost;

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
      <div
        onClick={openModal}
        className="flex flex-col backdrop-blur-sm sm:flex-row gap-2 mx-auto justify-center items-center text-center p-2 bg-dark-mode/85 h-62 w-62 sm:h-32 sm:w-95 rounded-2xl border-2 border-light-mode/20 text-light-mode hover:scale-101 transition-transform transition-duration-200"
      >
        {getCollectibleImageSrc(collectible) && (
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getCollectibleImageSrc(collectible)!}
              alt={collectible.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div
          className={`flex flex-col gap-2 pl-1 ${
            collectible.imageUrl
              ? "items-center md:items-start"
              : "items-center"
          }`}
        >
          <p>{collectible.name}</p>

          <div className="flex items-center justify-center space-x-1 text-xs md:text-sm">
            <div className="flex items-center justify-center px-2 py-1 rounded-full bg-light-mode/20">
              {collectible.discountedCost != null ? (
                <>
                  <s>{collectible.cost} </s>&nbsp;
                  {`-> ${collectible.discountedCost}`}
                </>
              ) : (
                <>{collectible.cost}</>
              )}
            </div>

            {collectible.limited && (
              <span className="bg-accent/80 px-2 py-1 rounded-full">
                {collectible.remaining} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collectible Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          collectible.discountedCost != null
            ? `${collectible.name} (Price Updated)`
            : collectible.name
        }
        className="max-w-md text-light-mode bg-dark-mode/85"
      >
        {redeemSuccess ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold mb-2">
              ✓ {redeemSuccess}
            </div>
            <p className="text-sm">
              Check your inventory to see your new collectible!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Collectible Image */}
            {getCollectibleImageSrc(collectible) && (
              <div className="w-50 h-50 mx-auto rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCollectibleImageSrc(collectible)!}
                  alt={collectible.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            {collectible.description && <p>{collectible.description}</p>}

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Cost:</span>
                <span className="font-medium">
                  {collectible.discountedCost != null ? (
                    <>
                      <s>{collectible.cost} </s>&nbsp;
                      {`-> ${collectible.discountedCost}`}
                    </>
                  ) : (
                    <>{collectible.cost}</>
                  )}{" "}
                  points
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
              <div className="p-3 bg-light-mode/70 text-dark-mode rounded-lg text-sm">
                You need{" "}
                {Math.abs(
                  (collectible.discountedCost ?? collectible.cost) - userPoints
                )}{" "}
                more points to purchase this collectible.
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
              className="w-full cursor-pointer py-2 text-white bg-light-mode/5 rounded-lg hover:bg-light-mode/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

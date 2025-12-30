"use client";

import { useState, useEffect } from "react";
import { QrCode, Keyboard, X } from "lucide-react";
import Modal from "@/components/ui/modal";
import ScannerPage from "./ScannerPage";

interface ClaimResult {
  success: boolean;
  message: string;
  item?: {
    name: string;
    description: string;
    points: number;
  };
  collectibles?: {
    _id: string;
    name: string;
  }[];
  newPoints?: number;
  totalItemsClaimed?: number;
  remainingAttempts?: number;
  rateLimitExceeded?: boolean;
  resetTime?: string;
  rateLimitInfo?: {
    maxAttempts: number;
    windowMinutes: number;
  };
}

type ClaimMethod = "select" | "manual" | "scan";

interface ItemClaimProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdate?: (newPoints: number) => void;
}

const ItemClaim = ({
  userId,
  isOpen,
  onClose,
  onPointsUpdate,
}: ItemClaimProps) => {
  const [claimMethod, setClaimMethod] = useState<ClaimMethod>("select");
  // Auto-claim if identifier is present in query param
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;
    const url = new URL(window.location.href);
    const identifier = url.searchParams.get("identifier");
    if (identifier) {
      // Remove identifier from URL (without reload)
      url.searchParams.delete("identifier");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
      // Auto-claim
      claimHuntItem(identifier);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const claimHuntItem = async (itemIdentifier: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setClaimResult(null);

      const response = await fetch(`/api/users/${userId}/hunt-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: itemIdentifier }),
      });

      const data = await response.json();

      if (data.success) {
        setClaimResult({
          success: true,
          message: data.message,
          item: data.item,
          collectibles: data.collectibles,
          newPoints: data.newPoints,
          totalItemsClaimed: data.totalItemsClaimed,
        });

        if (data.newPoints !== undefined) {
          onPointsUpdate?.(data.newPoints);
        }
      } else {
        setClaimResult({
          success: false,
          message: data.error || "Failed to claim hunt item",
          remainingAttempts: data.remainingAttempts,
          rateLimitExceeded: data.rateLimitExceeded,
          resetTime: data.resetTime,
          rateLimitInfo: data.rateLimitInfo,
        });
      }
    } catch (err) {
      setError("Failed to claim hunt item. Please try again.");
      console.error("Error claiming hunt item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanSuccess = async (scannedIdentifier: string) => {
    await claimHuntItem(scannedIdentifier);
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    setClaimMethod("select");
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await claimHuntItem(manualCode.trim());
  };

  const handleClose = () => {
    setClaimResult(null);
    setError(null);
    setClaimMethod("select");
    setManualCode("");
    onClose();
  };

  const resetToSelect = () => {
    setClaimResult(null);
    setError(null);
    setClaimMethod("select");
    setManualCode("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 max-w-[80vw] md:max-w-lg bg-dark-mode/90 text-light-mode rounded-2xl"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Claim Hunt Item</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-light-mode/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Selection */}
        {claimMethod === "select" && !claimResult && !error && (
          <div className="space-y-4">
            <p className="text-light-mode/70 text-center mb-6">
              Choose how you want to claim your item
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setClaimMethod("manual")}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-light-mode/10 hover:bg-light-mode/20 rounded-xl transition font-semibold"
              >
                <Keyboard className="w-5 h-5" />
                Enter Code
              </button>
              <button
                onClick={() => setClaimMethod("scan")}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-light-mode/10 hover:bg-light-mode/20 rounded-xl transition font-semibold"
              >
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </button>
            </div>
          </div>
        )}

        {/* Manual Entry */}
        {claimMethod === "manual" && !claimResult && !error && (
          <div className="space-y-4">
            <button
              onClick={resetToSelect}
              className="text-light-mode/70 hover:text-light-mode text-sm flex items-center gap-1 transition"
            >
              ← Back
            </button>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-light-mode/80">
                  Item Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter the item code..."
                  className="w-full px-4 py-3 bg-light-mode/10 border border-light-mode/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-light-mode/20 focus:border-light-mode text-light-mode placeholder-light-mode/40"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !manualCode.trim()}
                className="w-full px-6 py-3 bg-light-mode/10 hover:bg-light-mode/20 disabled:opacity-50 disabled:cursor-not-allowed text-light-mode font-semibold rounded-xl transition"
              >
                {isSubmitting ? "Claiming..." : "Claim Item"}
              </button>
            </form>
          </div>
        )}

        {/* QR Scanner */}
        {claimMethod === "scan" && !claimResult && !error && (
          <div className="space-y-4">
            <button
              onClick={resetToSelect}
              className="text-light-mode/70 hover:text-light-mode text-sm flex items-center gap-1 transition"
            >
              ← Back
            </button>
            <ScannerPage
              isOpen={true}
              onClose={resetToSelect}
              onScanSuccess={handleScanSuccess}
              onError={handleScanError}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
            <button
              onClick={resetToSelect}
              className="px-6 py-3 bg-light-mode/10 hover:bg-light-mode/20 rounded-xl transition font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Claim Result */}
        {claimResult && (
          <div className="text-center space-y-4">
            {claimResult.success ? (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-400 font-semibold text-lg mb-3">
                  🎉 Item Claimed!
                </p>
                {claimResult.item && (
                  <div className="mb-3">
                    <p className="font-bold text-light-mode">
                      {claimResult.item.name}
                    </p>
                    <p className="text-sm text-light-mode/70 mt-1">
                      {claimResult.item.description}
                    </p>
                    <p className="text-accent font-semibold mt-3 text-lg">
                      +{claimResult.item.points} points
                    </p>
                  </div>
                )}
                {claimResult.collectibles &&
                  claimResult.collectibles.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-green-500/30">
                      <p className="text-green-300 font-semibold mb-2">
                        🎁 Collectibles Earned!
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {claimResult.collectibles.map((c) => (
                          <span
                            key={c._id}
                            className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                <p className="text-sm text-light-mode/80 mt-3">
                  Total Points:{" "}
                  <span className="font-bold text-accent">
                    {claimResult.newPoints}
                  </span>
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 font-semibold mb-2">
                  {claimResult.message}
                </p>
                {claimResult.rateLimitExceeded && claimResult.resetTime && (
                  <p className="text-sm text-light-mode/60">
                    Try again after:{" "}
                    {new Date(claimResult.resetTime).toLocaleTimeString()}
                  </p>
                )}
                {claimResult.remainingAttempts !== undefined &&
                  !claimResult.rateLimitExceeded && (
                    <p className="text-sm text-light-mode/60">
                      Remaining attempts: {claimResult.remainingAttempts}
                    </p>
                  )}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              {!claimResult.rateLimitExceeded && (
                <button
                  onClick={resetToSelect}
                  className="px-6 py-3 bg-light-mode/10 hover:bg-light-mode/20 rounded-xl transition font-semibold"
                >
                  {claimResult.success ? "Claim Another" : "Try Again"}
                </button>
              )}
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-light-mode/2 hover:bg-light-mode/12 text-light-mode rounded-xl transition font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ItemClaim;

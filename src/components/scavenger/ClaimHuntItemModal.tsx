"use client";

import { useState } from "react";
import { QrCode, Type, CheckCircle, AlertCircle } from "lucide-react";
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
  newPoints?: number;
  totalItemsClaimed?: number;
}

interface ClaimHuntItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: (newPoints: number, totalItems: number) => void;
}

const ClaimHuntItemModal = ({
  isOpen,
  onClose,
  onClaimSuccess,
}: ClaimHuntItemModalProps) => {
  const [claimMethod, setClaimMethod] = useState<"scan" | "manual">("manual");
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Reset state when modal opens/closes
  const handleModalClose = () => {
    setIdentifier("");
    setClaimResult(null);
    setError(null);
    setIsSubmitting(false);
    setIsScannerOpen(false);
    onClose();
  };

  // Claim hunt item by identifier
  const claimHuntItem = async (itemIdentifier: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setClaimResult(null);

      const response = await fetch("/api/claim-hunt-item", {
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
          newPoints: data.newPoints,
          totalItemsClaimed: data.totalItemsClaimed,
        });

        // Update parent component with new points and total items
        if (
          data.newPoints !== undefined &&
          data.totalItemsClaimed !== undefined
        ) {
          onClaimSuccess(data.newPoints, data.totalItemsClaimed);
        }
      } else {
        setClaimResult({
          success: false,
          message: data.error || "Failed to claim hunt item",
        });
      }
    } catch (err) {
      setError("Failed to claim hunt item. Please try again.");
      console.error("Error claiming hunt item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manual identifier submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter an identifier");
      return;
    }
    await claimHuntItem(identifier.trim());
  };

  // Handle QR code scan
  const handleQRScan = async () => {
    setClaimMethod("scan");
    setIsScannerOpen(true);
  };

  // Handle successful QR scan
  const handleScanSuccess = async (scannedIdentifier: string) => {
    setIdentifier(scannedIdentifier);
    setIsScannerOpen(false);
    // Automatically attempt to claim with the scanned identifier
    await claimHuntItem(scannedIdentifier);
  };

  // Handle QR scan error
  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    setIsScannerOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Claim Hunt Item"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Method Selection */}
        {!claimResult && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => setClaimMethod("manual")}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  claimMethod === "manual"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <Type size={20} />
                <span className="font-medium">Enter Code</span>
              </button>
              <button
                onClick={handleQRScan}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  claimMethod === "scan"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <QrCode size={20} />
                <span className="font-medium">Scan QR</span>
              </button>
            </div>

            {/* Manual Entry Form */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {claimMethod === "scan"
                    ? "Scan QR Code or Enter Identifier"
                    : "Hunt Item Identifier"}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={
                    claimMethod === "scan"
                      ? "Scanned QR code will appear here or enter manually"
                      : "Enter the identifier"
                  }
                  disabled={isSubmitting}
                />
                {claimMethod === "scan" && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <QrCode size={20} />
                      Open Camera Scanner
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      📱 Use your device camera to scan QR codes
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!identifier.trim() || isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? "Claiming..." : "Claim Item"}
              </button>
            </form>
          </div>
        )}

        {/* Claim Result */}
        {claimResult && (
          <div className="text-center space-y-4">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                claimResult.success
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-red-100 dark:bg-red-900/20"
              }`}
            >
              {claimResult.success ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              )}
            </div>

            <div>
              <h3
                className={`text-lg font-semibold ${
                  claimResult.success
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {claimResult.success ? "Success!" : "Failed"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {claimResult.message}
              </p>
            </div>

            {claimResult.success && claimResult.item && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  {claimResult.item.name}
                </h4>
                {claimResult.item.description && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {claimResult.item.description}
                  </p>
                )}
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mt-2">
                  +{claimResult.item.points} points
                </p>
                {claimResult.newPoints !== undefined && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Total Points: {claimResult.newPoints}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setClaimResult(null);
                  setIdentifier("");
                  setError(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Claim Another
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner */}
      <ScannerPage
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        onError={handleScanError}
      />
    </Modal>
  );
};

export default ClaimHuntItemModal;

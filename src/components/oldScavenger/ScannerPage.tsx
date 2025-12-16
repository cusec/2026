"use client";

import { useState, useEffect, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X, Camera, CameraOff, RotateCcw } from "lucide-react";

interface ScanResult {
  rawValue: string;
}

interface ScannerPageProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (identifier: string) => void;
  onError?: (error: string) => void;
}

const ScannerPage = ({
  isOpen,
  onClose,
  onScanSuccess,
  onError,
}: ScannerPageProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const requestCameraPermission = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      // Stop the stream immediately since QrScanner will handle it
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
      setIsScanning(true);
    } catch (err) {
      console.error("Camera permission error:", err);
      let errorMessage = "Camera access denied";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Camera access denied. Please allow camera permissions and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera is not supported on this device.";
        } else {
          errorMessage = err.message || "Failed to access camera";
        }
      }

      setError(errorMessage);
      setHasPermission(false);
      onError?.(errorMessage);
    }
  }, [facingMode, onError]);

  // Request camera permission when component mounts
  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    }
  }, [isOpen, requestCameraPermission]);

  const handleScan = (result: ScanResult[]) => {
    if (result?.length > 0) {
      const scannedText = result[0]?.rawValue;
      console.log("QR Code scanned:", scannedText);

      // Stop scanning
      setIsScanning(false);

      // Call the success callback with the scanned identifier
      onScanSuccess(scannedText);

      // Close the scanner
      onClose();
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scanner error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to scan QR code";
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setIsScanning(false);
    setTimeout(() => {
      requestCameraPermission();
    }, 100);
  };

  const handleClose = () => {
    setIsScanning(false);
    setHasPermission(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <h2 className="text-lg font-semibold">Scan QR Code</h2>
        <div className="flex items-center gap-2">
          {hasPermission && (
            <button
              onClick={toggleCamera}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Switch Camera"
            >
              <RotateCcw size={20} />
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scanner Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-white text-center max-w-md">
            <div className="flex items-center justify-center mb-2">
              <CameraOff size={24} className="text-red-400" />
            </div>
            <p className="text-sm">{error}</p>
            <button
              onClick={requestCameraPermission}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {hasPermission === null && !error && (
          <div className="text-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Requesting camera access...</p>
          </div>
        )}

        {hasPermission && isScanning && !error && (
          <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-lg overflow-hidden">
              {/* QR Scanner */}
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode,
                  width: { ideal: 640 },
                  height: { ideal: 480 },
                }}
              />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white"></div>

                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
              </div>
            </div>

            <div className="mt-4 text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <Camera size={20} className="mr-2" />
                <span className="text-sm font-medium">
                  Position QR code within the frame
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Using {facingMode === "user" ? "front" : "back"} camera
              </p>
            </div>
          </div>
        )}

        {hasPermission === false && !error && (
          <div className="text-center text-white">
            <CameraOff size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Camera Access Required</p>
            <p className="text-sm text-gray-300 mb-4">
              Please allow camera access to scan QR codes
            </p>
            <button
              onClick={requestCameraPermission}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Enable Camera
            </button>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-4 bg-black text-center text-gray-300 text-sm">
        <p>Point your camera at a QR code to scan it automatically</p>
      </div>
    </div>
  );
};

export default ScannerPage;

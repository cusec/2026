"use client";

import { on } from "events";
import { X } from "lucide-react";
import { useZxing } from "react-zxing";

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
  const { ref } = useZxing({
    onResult(result) {
      if (result) {
        const scannedText = result.getText();

        try {
          const url = new URL(scannedText);
          const identifier = url.searchParams.get("identifier");
          if (identifier) {
            // Only allow alphanumeric, dash, underscore, and max 64 chars
            const safeIdentifier = identifier.match(/^[a-zA-Z0-9_-]{1,64}$/);
            if (safeIdentifier) {
              onScanSuccess(identifier);
              onClose();
            } else {
              onError?.("Invalid identifier format in QR code.");
            }
          }
        } catch {
          // Nothing, keep scanning
        }
      }
    },
    constraints: {
      video: {
        facingMode: "environment",
      },
    },
  });

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Scanner Content */}
      <div className="flex flex-col items-center justify-center p-4 mx-auto max-w-[85vw] md:max-w-[60vw] h-full">
        <div className="w-full justify-around items-center text-center flex mb-4">
          <h2 className="text-lg font-semibold ">Scan QR Code</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-light-mode/10 hover:bg-light-mode/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <video ref={ref} className="border border-light-mode" />
        <div className="text-xs sm:text-sm">
          <p className="w-full mt-4 text-center">
            If you don&apos;t see your camera feed above, please ensure your
            browser has permission to access your camera & it isn&apos;t being
            used by another application.
          </p>
          <p className="w-full mt-4 text-center">
            You can also use your device&apos;s camera app to scan the QR code
            directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;

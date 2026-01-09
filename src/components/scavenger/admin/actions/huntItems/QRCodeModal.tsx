"use client";

import Modal from "@/components/ui/modal";
import { HuntItem } from "@/lib/interface";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HuntItem | null;
  onError: (error: string) => void;
}

interface QRCodes {
  localhost?: string;
  production?: string;
  staging?: string;
}

const QRCodeModal = ({ isOpen, onClose, item, onError }: QRCodeModalProps) => {
  const [env, setEnv] = useState<"production" | "staging" | "localhost">(
    "production"
  );
  const [qrCodes, setQrCodes] = useState<QRCodes | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch QR codes when modal opens or item changes
  useEffect(() => {
    if (isOpen && item?._id) {
      const fetchQRCodes = async () => {
        setLoading(true);
        setFetchError(null);
        setQrCodes(null);

        try {
          const response = await fetch(`/api/hunt-items/${item._id}/qr-code`);
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || "Failed to fetch QR codes");
          }

          setQrCodes(data.qrCodes);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch QR codes";
          setFetchError(errorMessage);
          onError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchQRCodes();
    }
  }, [isOpen, item?._id, onError]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQrCodes(null);
      setFetchError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!item) return null;

  return (
    <Modal
      simple={true}
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code for ${item.name}`}
      className="max-w-md text-dark-mode"
    >
      <div className="text-center space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Environment</label>
          <select
            value={env}
            onChange={(e) =>
              setEnv(e.target.value as "production" | "staging" | "localhost")
            }
            className="px-3 py-2 border rounded"
            disabled={loading}
          >
            <option value="production">Production (2026.cusec.net)</option>
            <option value="staging" disabled>
              Staging
            </option>
            <option value="localhost" disabled>
              Localhost
            </option>
          </select>
        </div>
        <div className="flex justify-center min-h-[250px] items-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" size={32} />
              <span>Loading QR code...</span>
            </div>
          ) : fetchError ? (
            <div className="text-red-500 p-4">
              <p>{fetchError}</p>
            </div>
          ) : qrCodes && qrCodes[env] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={qrCodes[env]}
              alt={`QR Code for ${item.identifier}`}
              className="border rounded-lg"
              style={{ maxWidth: 250, maxHeight: 250 }}
            />
          ) : (
            <div className="text-gray-500 p-4">
              <p>QR code not available for this environment.</p>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          <strong>Identifier:</strong> {item.identifier}
        </p>
        <p className="text-xs text-gray-500">
          Long-press or right-click the QR code to save the image.
        </p>
      </div>
    </Modal>
  );
};

export default QRCodeModal;

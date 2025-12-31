"use client";

import Modal from "@/components/ui/modal";
import { HuntItem } from "@/lib/interface";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HuntItem | null;
  onError: (error: string) => void;
}

import { useState } from "react";

const QRCodeModal = ({ isOpen, onClose, item, onError }: QRCodeModalProps) => {
  const [env, setEnv] = useState<"production" | "staging" | "localhost">(
    "production"
  );
  if (!item) return null;

  if (!item.qrCodes || !item.qrCodes[env]) {
    onError("QR code not available for the selected environment.");
    return null;
  }

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
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.qrCodes?.[env] || ""}
            alt={`QR Code for ${item.identifier}`}
            className="border rounded-lg"
            style={{ maxWidth: 250, maxHeight: 250 }}
          />
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

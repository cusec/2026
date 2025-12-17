"use client";

import { Download } from "lucide-react";
import Modal from "@/components/ui/modal";
import { HuntItem } from "@/lib/interface";
import { generateAndDownloadQR, getQRCodeURL } from "@/lib/qrCode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HuntItem | null;
  onError: (error: string) => void;
}

const QRCodeModal = ({ isOpen, onClose, item, onError }: QRCodeModalProps) => {
  if (!item) return null;

  const handleDownload = async () => {
    try {
      await generateAndDownloadQR(item.identifier, item.name);
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Failed to download QR code"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code for ${item.name}`}
      className="max-w-md"
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getQRCodeURL(item.identifier)}
            alt={`QR Code for ${item.identifier}`}
            className="border rounded-lg"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Identifier:</strong> {item.identifier}
        </p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <Download size={16} />
          Download QR Code
        </button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;

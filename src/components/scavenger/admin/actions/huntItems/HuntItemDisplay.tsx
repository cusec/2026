"use client";

import { Edit2, Trash2, QrCode, Clock, Power } from "lucide-react";
import { HuntItem } from "@/lib/interface";

interface HuntItemDisplayProps {
  item: HuntItem;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

// Helper to format date for display
const formatDateDisplay = (dateStr: string | null): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString();
};

// Get the current activation status
const getActivationStatus = (
  item: HuntItem
): { active: boolean; reason: string } => {
  if (!item.active) {
    return { active: false, reason: "Manually disabled" };
  }
  if (item.activationStart && item.activationEnd) {
    const now = new Date();
    const start = new Date(item.activationStart);
    const end = new Date(item.activationEnd);
    if (now < start) {
      return {
        active: false,
        reason: `Starts ${formatDateDisplay(item.activationStart)}`,
      };
    }
    if (now > end) {
      return {
        active: false,
        reason: `Ended ${formatDateDisplay(item.activationEnd)}`,
      };
    }
  }
  return { active: true, reason: "Active" };
};

const HuntItemDisplay = ({
  item,
  onEdit,
  onDelete,
  onShowQR,
}: HuntItemDisplayProps) => {
  const status = getActivationStatus(item);
  const isCurrentlyActive = status.active;

  return (
    <div
      className={`flex justify-between items-start ${
        !isCurrentlyActive ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h4
            className={`font-medium ${
              isCurrentlyActive ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {item.name}
          </h4>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {item.points} pts
          </span>
          {/* Active/Inactive Badge */}
          <span
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
              isCurrentlyActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <Power size={12} />
            {isCurrentlyActive ? "Active" : "Inactive"}
          </span>
        </div>
        {item.description && (
          <p
            className={`text-sm mb-2 ${
              isCurrentlyActive ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {item.description}
          </p>
        )}
        <p className="text-xs text-gray-500">ID: {item.identifier}</p>

        {/* Show activation window if set */}
        {(item.activationStart || item.activationEnd) && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>
              {formatDateDisplay(item.activationStart)} -{" "}
              {formatDateDisplay(item.activationEnd)}
            </span>
          </div>
        )}

        {/* Show status reason if inactive */}
        {!isCurrentlyActive && (
          <p className="text-xs text-red-600 mt-1">{status.reason}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onShowQR}
          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Show QR Code"
        >
          <QrCode size={16} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Edit Item"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default HuntItemDisplay;

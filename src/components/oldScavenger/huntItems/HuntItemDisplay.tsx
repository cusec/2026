"use client";

import { Edit2, Trash2, QrCode } from "lucide-react";
import { HuntItem } from "@/lib/interface";

interface HuntItemDisplayProps {
  item: HuntItem;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

const HuntItemDisplay = ({
  item,
  onEdit,
  onDelete,
  onShowQR,
}: HuntItemDisplayProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {item.name}
          </h4>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
            {item.points} pts
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {item.description}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          ID: {item.identifier}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onShowQR}
          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
          title="Show QR Code"
        >
          <QrCode size={16} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          title="Edit Item"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Delete Item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default HuntItemDisplay;

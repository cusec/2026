"use client";

import { Edit, Trash2 } from "lucide-react";
import { ShopItem } from "@/lib/interface";

interface ShopItemDisplayProps {
  item: ShopItem;
  onEdit: () => void;
  onDelete: () => void;
}

const ShopItemDisplay = ({ item, onEdit, onDelete }: ShopItemDisplayProps) => {
  const imageSrc =
    item.imageData && item.imageContentType
      ? `data:${item.imageContentType};base64,${item.imageData}`
      : null;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        {/* Image */}
        {imageSrc && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.cost} points
            </span>
            {item.limited && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.remaining > 0
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.remaining > 0
                  ? `${item.remaining} remaining`
                  : "Sold out"}
              </span>
            )}
            {!item.active && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Inactive
              </span>
            )}
            {(item.activationStart || item.activationEnd) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Time-limited
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onDelete}
          className={`p-2 rounded-lg transition-colors ${
            item.claimCount > 0
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-red-600 hover:bg-red-100"
          }`}
          title="Delete"
          disabled={item.claimCount > 0}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ShopItemDisplay;

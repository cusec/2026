"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Collectible } from "@/lib/interface";

interface CollectibleDisplayProps {
  item: Collectible;
  onEdit: () => void;
  onDelete: () => void;
}

const CollectibleDisplay = ({
  item,
  onEdit,
  onDelete,
}: CollectibleDisplayProps) => {
  const getImageSrc = () => {
    if (item.imageData && item.imageContentType) {
      return `data:${item.imageContentType};base64,${item.imageData}`;
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Image thumbnail */}
          {imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              {item.purchasable && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  In Shop
                </span>
              )}
              {!item.active && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Inactive
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {item.cost} points
              </span>
              {item.limited && (
                <span
                  className={`px-2 py-1 rounded ${
                    item.remaining > 0
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.remaining > 0
                    ? `${item.remaining} remaining`
                    : "Sold out"}
                </span>
              )}
              {(item.activationStart || item.activationEnd) && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  Time-limited
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4 shrink-0">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit collectible"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete collectible"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectibleDisplay;

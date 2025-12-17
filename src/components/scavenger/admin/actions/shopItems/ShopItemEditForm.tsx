"use client";

import { ShopItem } from "@/lib/interface";
import Image from "next/image";

interface ShopItemEditFormProps {
  item: ShopItem;
  onSave: (item: ShopItem) => void;
  onCancel: () => void;
  onChange: (item: ShopItem) => void;
}

const ShopItemEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: ShopItemEditFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        {/* Image Preview */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
          <Image
            src={`/images/shop/${item.imageSlug}`}
            alt={item.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => onChange({ ...item, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (points)
              </label>
              <input
                type="number"
                value={item.cost}
                onChange={(e) =>
                  onChange({ ...item, cost: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) =>
                onChange({ ...item, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Slug
            </label>
            <input
              type="text"
              value={item.imageSlug}
              onChange={(e) => onChange({ ...item, imageSlug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`limited-${item._id}`}
                checked={item.limited}
                onChange={(e) =>
                  onChange({ ...item, limited: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor={`limited-${item._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Limited
              </label>
            </div>

            {item.limited && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remaining
                </label>
                <input
                  type="number"
                  value={item.remaining}
                  onChange={(e) =>
                    onChange({
                      ...item,
                      remaining: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  min={0}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`moderated-${item._id}`}
                checked={item.moderated}
                onChange={(e) =>
                  onChange({ ...item, moderated: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor={`moderated-${item._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Moderated
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onSave(item)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShopItemEditForm;

"use client";

import { ShopItemFormData } from "@/lib/interface";

interface ShopItemAddFormProps {
  formData: ShopItemFormData;
  setFormData: (data: ShopItemFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ShopItemAddForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ShopItemAddFormProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium mb-4 text-gray-900">
        Add New Shop Item
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Enter item name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost (points) *
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cost: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Enter cost in points"
              min={0}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter item description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Slug *
          </label>
          <input
            type="text"
            value={formData.imageSlug}
            onChange={(e) =>
              setFormData({ ...formData, imageSlug: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="e.g., item-image.png"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Image should be in /public/images/shop/
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="limited"
              checked={formData.limited}
              onChange={(e) =>
                setFormData({ ...formData, limited: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
              disabled={isSubmitting}
            />
            <label
              htmlFor="limited"
              className="text-sm font-medium text-gray-700"
            >
              Limited Quantity
            </label>
          </div>

          {formData.limited && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining
              </label>
              <input
                type="number"
                value={formData.remaining}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remaining: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Quantity"
                min={0}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="moderated"
              checked={formData.moderated}
              onChange={(e) =>
                setFormData({ ...formData, moderated: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
              disabled={isSubmitting}
            />
            <label
              htmlFor="moderated"
              className="text-sm font-medium text-gray-700"
            >
              Requires Approval
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            disabled={
              !formData.name ||
              !formData.description ||
              !formData.imageSlug ||
              isSubmitting
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Item"}
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopItemAddForm;

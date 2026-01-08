"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Users, Trash2 } from "lucide-react";
import { ShopItem } from "@/lib/interface";
import ShopItemUsersModal from "./ShopItemUsersModal";

// Extended ShopItem for editing with file support
interface EditableShopItem extends ShopItem {
  imageFile?: File;
  removeImage?: boolean;
}

interface ShopItemEditFormProps {
  item: ShopItem;
  onSave: (item: EditableShopItem) => void;
  onCancel: () => void;
  onChange: (item: EditableShopItem) => void;
}

// Helper to format date for datetime-local input
// Converts UTC datetime to local time for display
const formatDateForInput = (dateStr: string | null): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  // Get local time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ShopItemEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: ShopItemEditFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // Track the current editing item with extended properties
  const [editingItem, setEditingItem] = useState<EditableShopItem>(item);

  // Initialize image preview from existing URL
  useEffect(() => {
    if (item.imageUrl) {
      setImagePreview(item.imageUrl);
    }
    setEditingItem({ ...item, imageFile: undefined, removeImage: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item._id]); // Only run when item changes (based on _id)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload PNG, JPEG, GIF, or WebP images.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum size is 5MB.");
      return;
    }

    // Create preview URL and store file
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const updatedItem = {
      ...editingItem,
      imageFile: file,
      removeImage: false,
    };
    setEditingItem(updatedItem);
    onChange(updatedItem);
  };

  const handleRemoveImage = () => {
    const updatedItem = {
      ...editingItem,
      imageUrl: undefined,
      imageFile: undefined,
      removeImage: true,
    };
    setEditingItem(updatedItem);
    onChange(updatedItem);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (updates: Partial<EditableShopItem>) => {
    const updatedItem = { ...editingItem, ...updates };
    setEditingItem(updatedItem);
    onChange(updatedItem);
  };

  const getImageSrc = () => {
    return imagePreview;
  };

  const imageSrc = getImageSrc();

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        {/* Image Preview and Upload */}
        <div className="relative">
          {imageSrc ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title="Change image"
              >
                <Upload size={10} />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
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
                value={editingItem.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (points)
              </label>
              <input
                type="number"
                value={editingItem.cost}
                onChange={(e) =>
                  handleChange({ cost: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Cost (optional)
              </label>
              <input
                type="number"
                value={editingItem.discountedCost ?? ""}
                onChange={(e) =>
                  handleChange({
                    discountedCost: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter cost in points"
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editingItem.description}
              onChange={(e) => handleChange({ description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`limited-${editingItem._id}`}
                checked={editingItem.limited}
                onChange={(e) => handleChange({ limited: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor={`limited-${editingItem._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Limited
              </label>
            </div>

            {editingItem.limited && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remaining
                </label>
                <input
                  type="number"
                  value={editingItem.remaining}
                  onChange={(e) =>
                    handleChange({
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
                id={`active-${editingItem._id}`}
                checked={editingItem.active}
                onChange={(e) => handleChange({ active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor={`active-${editingItem._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Active
              </label>
            </div>
          </div>

          {/* Activation Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activation Start (Montreal Time)
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(editingItem.activationStart)}
                onChange={(e) =>
                  handleChange({
                    activationStart: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activation End (Montreal Time)
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(editingItem.activationEnd)}
                onChange={(e) =>
                  handleChange({
                    activationEnd: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            If both dates are set, the item will only be available during this
            period.
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onSave(editingItem)}
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
        <button
          onClick={() => setShowUsersModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Users size={16} />
          View Users
        </button>
      </div>

      {/* Users Modal */}
      <ShopItemUsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        shopItemId={item._id}
        shopItemName={item.name}
        shopItemCost={item.cost}
      />
    </div>
  );
};

export default ShopItemEditForm;

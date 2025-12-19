"use client";

import { useRef, useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { ShopItem } from "@/lib/interface";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize image preview from existing data
  useEffect(() => {
    if (item.imageData && item.imageContentType) {
      setImagePreview(`data:${item.imageContentType};base64,${item.imageData}`);
    }
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

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Remove the data URL prefix to store just the base64 data
      const base64Data = base64.split(",")[1];
      onChange({
        ...item,
        imageData: base64Data,
        imageContentType: file.type,
      });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const getImageSrc = () => {
    if (imagePreview) {
      return imagePreview;
    }
    if (item.imageData && item.imageContentType) {
      return `data:${item.imageContentType};base64,${item.imageData}`;
    }
    return null;
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

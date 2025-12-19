"use client";

import { useRef, useState, useEffect } from "react";
import { Save, X, Upload } from "lucide-react";
import { Collectible } from "@/lib/interface";

interface CollectibleEditFormProps {
  item: Collectible;
  onSave: (item: Collectible) => void;
  onCancel: () => void;
  onChange: (item: Collectible) => void;
}

const CollectibleEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: CollectibleEditFormProps) => {
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
  const isFormValid = item.name && item.imageData;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Name
        </label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Subtitle
        </label>
        <input
          type="text"
          value={item.subtitle}
          onChange={(e) => onChange({ ...item, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Description
        </label>
        <textarea
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Points
        </label>
        <input
          type="number"
          value={item.points}
          onChange={(e) =>
            onChange({ ...item, points: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          min={0}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Image
        </label>
        <div className="flex items-center gap-3">
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
              className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
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
          <p className="text-xs text-gray-500">
            PNG, JPEG, GIF, WebP (max 5MB)
          </p>
        </div>
      </div>

      {/* Purchasable Toggle */}
      <div className="flex items-center gap-3">
        <label className="block text-sm font-medium text-dark-mode">
          Purchasable
        </label>
        <button
          type="button"
          onClick={() => onChange({ ...item, purchasable: !item.purchasable })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            item.purchasable ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              item.purchasable ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm ${
            item.purchasable ? "text-green-600" : "text-gray-500"
          }`}
        >
          {item.purchasable ? "Visible in Shop" : "Not in Shop"}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        Slug: {item.slug} (cannot be changed)
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onSave(item)}
          disabled={!isFormValid}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          <Save size={16} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CollectibleEditForm;

"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { CollectibleFormData } from "@/lib/interface";

interface CollectibleAddFormProps {
  formData: CollectibleFormData;
  setFormData: (data: CollectibleFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CollectibleAddForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CollectibleAddFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      setFormData({
        ...formData,
        imageData: base64Data,
        imageContentType: file.type,
      });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData({
      ...formData,
      imageData: "",
      imageContentType: "",
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormValid = formData.name && formData.imageData;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium mb-4 text-gray-900">
        Add New Collectible
      </h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter collectible name"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost (points)
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
            disabled={isSubmitting}
            min={0}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={clearImage}
                disabled={isSubmitting}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPEG, GIF, WebP (max 5MB)
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
        </div>

        {/* Purchasable Toggle */}
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium text-gray-700">
            Purchasable
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, purchasable: !formData.purchasable })
            }
            disabled={isSubmitting}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.purchasable ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.purchasable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              formData.purchasable ? "text-green-600" : "text-gray-500"
            }`}
          >
            {formData.purchasable ? "Visible in Shop" : "Not in Shop"}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          If enabled, this collectible will appear in the shop and can be
          purchased with points.
        </p>

        {/* Limited Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
        </div>

        {/* Active Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded"
            disabled={isSubmitting}
          />
          <label
            htmlFor="active"
            className="text-sm font-medium text-gray-700"
          >
            Active
          </label>
        </div>

        {/* Activation Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activation Start (optional)
            </label>
            <input
              type="datetime-local"
              value={formData.activationStart || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activationStart: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activation End (optional)
            </label>
            <input
              type="datetime-local"
              value={formData.activationEnd || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activationEnd: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          If both dates are set, the collectible will only be available during this period.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Collectible"}
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

export default CollectibleAddForm;

"use client";

import { useRef, useState, useEffect } from "react";
import { Save, X, Upload, Users, Trash2 } from "lucide-react";
import { Collectible } from "@/lib/interface";
import CollectibleUsersModal from "./CollectibleUsersModal";

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
  const [showUsersModal, setShowUsersModal] = useState(false);

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

  const handleRemoveImage = () => {
    // Use null (not undefined) to signal explicit removal to the API
    onChange({
      ...item,
      imageData: null as unknown as string | undefined,
      imageContentType: null as unknown as string | undefined,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
  const isFormValid = item.name;

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
          Cost (points)
        </label>
        <input
          type="number"
          value={item.cost}
          onChange={(e) =>
            onChange({ ...item, cost: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          min={0}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discounted Cost (Optional)
        </label>
        <input
          type="number"
          value={item.discountedCost ?? ""}
          onChange={(e) =>
            onChange({
              ...item,
              discountedCost: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          placeholder="Enter cost in points"
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

      {/* Limited Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`limited-${item._id}`}
            checked={item.limited}
            onChange={(e) => onChange({ ...item, limited: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor={`limited-${item._id}`}
            className="text-sm font-medium text-gray-700"
          >
            Limited Quantity
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
      </div>

      {/* Active Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`active-${item._id}`}
          checked={item.active}
          onChange={(e) => onChange({ ...item, active: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label
          htmlFor={`active-${item._id}`}
          className="text-sm font-medium text-gray-700"
        >
          Active
        </label>
      </div>

      {/* Activation Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activation Start
          </label>
          <input
            type="datetime-local"
            value={
              item.activationStart
                ? new Date(item.activationStart).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              onChange({
                ...item,
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
            Activation End
          </label>
          <input
            type="datetime-local"
            value={
              item.activationEnd
                ? new Date(item.activationEnd).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              onChange({
                ...item,
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
        If both dates are set, the collectible will only be available during
        this period.
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
        <button
          onClick={() => setShowUsersModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Users size={16} />
          View Users
        </button>
      </div>

      {/* Users Modal */}
      <CollectibleUsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        collectibleId={item._id}
        collectibleName={item.name}
        collectibleCost={item.cost}
      />
    </div>
  );
};

export default CollectibleEditForm;

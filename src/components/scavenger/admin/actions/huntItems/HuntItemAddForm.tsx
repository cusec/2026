"use client";

import { HuntItemFormData } from "@/lib/interface";

interface HuntItemAddFormProps {
  formData: HuntItemFormData;
  setFormData: (data: HuntItemFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Helper to format date for datetime-local input
const formatDateForInput = (dateStr: string | null): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16);
};

// Validation helper
const validateDates = (
  start: string | null,
  end: string | null
): string | null => {
  if ((start && !end) || (!start && end)) {
    return "Both activation start and end dates must be provided, or neither";
  }
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate <= startDate) {
      return "Activation end date must be after start date";
    }
  }
  return null;
};

const HuntItemAddForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: HuntItemAddFormProps) => {
  const dateError = validateDates(
    formData.activationStart,
    formData.activationEnd
  );
  const isFormValid = formData.name && formData.identifier && !dateError;

  const handleClearDates = () => {
    setFormData({
      ...formData,
      activationStart: null,
      activationEnd: null,
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium mb-4 text-gray-900">
        Add New Hunt Item
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
            placeholder="Enter item name"
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
            placeholder="Enter item description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identifier *
          </label>
          <input
            type="text"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter unique identifier"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points
          </label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) =>
              setFormData({
                ...formData,
                points: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter points value"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max. Claims
          </label>
          <input
            type="number"
            value={formData.maxClaims ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxClaims: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Leave empty for unlimited"
            disabled={isSubmitting}
            min={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of times this item can be claimed. Leave empty for
            unlimited claims.
          </p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium text-gray-700">
            Active
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, active: !formData.active })
            }
            disabled={isSubmitting}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.active ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              formData.active ? "text-green-600" : "text-gray-500"
            }`}
          >
            {formData.active ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Activation Time Window */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Activation Time Window (Optional)
            </label>
            {(formData.activationStart || formData.activationEnd) && (
              <button
                type="button"
                onClick={handleClearDates}
                disabled={isSubmitting}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear Dates
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            If set, the item will only be claimable during this time window (in
            addition to being active).
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Date/Time
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(formData.activationStart)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activationStart: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Date/Time
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(formData.activationEnd)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activationEnd: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-xs text-red-600 mt-2">{dateError}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
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

export default HuntItemAddForm;

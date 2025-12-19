"use client";

import { useState } from "react";
import { Save, X, Users } from "lucide-react";
import { HuntItem } from "@/lib/interface";
import ClaimedUsersModal from "./ClaimedUsersModal";

interface HuntItemEditFormProps {
  item: HuntItem;
  onSave: (item: HuntItem) => void;
  onCancel: () => void;
  onChange: (item: HuntItem) => void;
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

const HuntItemEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: HuntItemEditFormProps) => {
  const [showClaimedUsersModal, setShowClaimedUsersModal] = useState(false);
  const dateError = validateDates(item.activationStart, item.activationEnd);
  const isFormValid = item.name && !dateError;

  const handleClearDates = () => {
    onChange({
      ...item,
      activationStart: null,
      activationEnd: null,
    });
  };

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
          Points
        </label>
        <input
          type="number"
          value={item.points}
          onChange={(e) =>
            onChange({ ...item, points: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
          min={0}
        />
        <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-xs text-red-700 flex items-start gap-1">
            <span>
              Editing points is <strong>highly not recommended</strong>.
              Changing point values could cause discrepancies for players who
              have already claimed this item and create inequality for future
              claimers. Consider using Max Claims, Active toggle, or Activation
              Time to manage item availability instead.
            </span>
          </p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-mode mb-1">
          Max. Claims
        </label>
        <input
          type="number"
          value={item.maxClaims ?? ""}
          onChange={(e) =>
            onChange({
              ...item,
              maxClaims: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-dark-mode"
          placeholder="Leave empty for unlimited"
          min={1}
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum number of times this item can be claimed. Leave empty for
          unlimited.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Current Claim Count:{" "}
          <span className="font-semibold">{item.claimCount ?? 0}</span>
        </p>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <label className="block text-sm font-medium text-dark-mode">
          Active
        </label>
        <button
          type="button"
          onClick={() => onChange({ ...item, active: !item.active })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            item.active ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              item.active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm ${
            item.active ? "text-green-600" : "text-gray-500"
          }`}
        >
          {item.active ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Activation Time Window */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-dark-mode">
            Activation Time Window (Optional)
          </label>
          {(item.activationStart || item.activationEnd) && (
            <button
              type="button"
              onClick={handleClearDates}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear Dates
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3">
          If set, the item will only be claimable during this time window.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date/Time
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(item.activationStart)}
              onChange={(e) =>
                onChange({
                  ...item,
                  activationStart: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-dark-mode text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-mode mb-1">
              End Date/Time
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(item.activationEnd)}
              onChange={(e) =>
                onChange({
                  ...item,
                  activationEnd: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-dark-mode text-sm"
            />
          </div>
        </div>
        {dateError && <p className="text-xs text-red-600 mt-2">{dateError}</p>}
      </div>

      <p className="text-xs text-gray-500">
        Identifier: {item.identifier} (cannot be changed)
      </p>
      <div className="flex flex-wrap gap-2">
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
          onClick={() => setShowClaimedUsersModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Users size={16} />
          Claimed by Users ({item.claimCount ?? 0})
        </button>
      </div>

      {/* Claimed Users Modal */}
      <ClaimedUsersModal
        isOpen={showClaimedUsersModal}
        onClose={() => setShowClaimedUsersModal(false)}
        huntItemId={item._id}
        huntItemName={item.name}
        huntItemPoints={item.points}
      />
    </div>
  );
};

export default HuntItemEditForm;

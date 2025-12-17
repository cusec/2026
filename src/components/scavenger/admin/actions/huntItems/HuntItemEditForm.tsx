"use client";

import { Save, X } from "lucide-react";
import { HuntItem } from "@/lib/interface";

interface HuntItemEditFormProps {
  item: HuntItem;
  onSave: (item: HuntItem) => void;
  onCancel: () => void;
  onChange: (item: HuntItem) => void;
}

const HuntItemEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: HuntItemEditFormProps) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Points
        </label>
        <input
          type="number"
          value={item.points}
          onChange={(e) =>
            onChange({ ...item, points: parseInt(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <p className="text-xs text-gray-500">
        Identifier: {item.identifier} (cannot be changed)
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(item)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default HuntItemEditForm;

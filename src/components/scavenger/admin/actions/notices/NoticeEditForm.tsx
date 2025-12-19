"use client";

import { Notice } from "@/lib/interface";

interface NoticeEditFormProps {
  item: Notice;
  onSave: (item: Notice) => void;
  onCancel: () => void;
  onChange: (item: Notice) => void;
}

const NoticeEditForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: NoticeEditFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          placeholder="Enter notice title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          placeholder="Enter notice description"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(item)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!item.title || !item.description}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NoticeEditForm;

"use client";

import { NoticeFormData } from "@/lib/interface";

interface NoticeAddFormProps {
  formData: NoticeFormData;
  setFormData: (data: NoticeFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const NoticeAddForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NoticeAddFormProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium mb-4 text-gray-900">Add New Notice</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Enter notice title"
            disabled={isSubmitting}
          />
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
            placeholder="Enter notice description"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting || !formData.title || !formData.description}
          >
            {isSubmitting ? "Creating..." : "Create Notice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeAddForm;

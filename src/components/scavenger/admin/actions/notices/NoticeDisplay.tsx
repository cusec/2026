"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Notice } from "@/lib/interface";

interface NoticeDisplayProps {
  item: Notice;
  onEdit: () => void;
  onDelete: () => void;
}

const NoticeDisplay = ({ item, onEdit, onDelete }: NoticeDisplayProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
        <p className="text-gray-600 mt-1">{item.description}</p>
        {item.createdAt && (
          <p className="text-xs text-gray-400 mt-2">
            Created: {new Date(item.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit notice"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete notice"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default NoticeDisplay;

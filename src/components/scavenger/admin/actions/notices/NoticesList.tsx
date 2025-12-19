"use client";

import { Notice } from "@/lib/interface";
import NoticeDisplay from "./NoticeDisplay";
import NoticeEditForm from "./NoticeEditForm";

interface NoticesListProps {
  items: Notice[];
  loading: boolean;
  editingItem: Notice | null;
  onEdit: (item: Notice) => void;
  onSave: (item: Notice) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditingItemChange: (item: Notice) => void;
}

const NoticesList = ({
  items,
  loading,
  editingItem,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onEditingItemChange,
}: NoticesListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading notices...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No notices found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="p-4 border border-gray-200 rounded-lg bg-white"
        >
          {editingItem?._id === item._id ? (
            <NoticeEditForm
              item={editingItem}
              onSave={onSave}
              onCancel={onCancelEdit}
              onChange={onEditingItemChange}
            />
          ) : (
            <NoticeDisplay
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item._id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NoticesList;

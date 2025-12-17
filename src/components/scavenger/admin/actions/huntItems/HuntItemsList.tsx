"use client";

import { HuntItem } from "@/lib/interface";
import HuntItemDisplay from "./HuntItemDisplay";
import HuntItemEditForm from "./HuntItemEditForm";

interface HuntItemsListProps {
  items: HuntItem[];
  loading: boolean;
  editingItem: HuntItem | null;
  onEdit: (item: HuntItem) => void;
  onSave: (item: HuntItem) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onShowQR: (item: HuntItem) => void;
  onEditingItemChange: (item: HuntItem) => void;
}

const HuntItemsList = ({
  items,
  loading,
  editingItem,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onShowQR,
  onEditingItemChange,
}: HuntItemsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading hunt items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hunt items found.</p>
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
            <HuntItemEditForm
              item={editingItem}
              onSave={onSave}
              onCancel={onCancelEdit}
              onChange={onEditingItemChange}
            />
          ) : (
            <HuntItemDisplay
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item._id)}
              onShowQR={() => onShowQR(item)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default HuntItemsList;

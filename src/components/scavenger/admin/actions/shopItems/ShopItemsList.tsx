"use client";

import { ShopItem } from "@/lib/interface";
import ShopItemDisplay from "./ShopItemDisplay";
import ShopItemEditForm from "./ShopItemEditForm";

interface ShopItemsListProps {
  items: ShopItem[];
  loading: boolean;
  editingItem: ShopItem | null;
  onEdit: (item: ShopItem) => void;
  onSave: (item: ShopItem) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditingItemChange: (item: ShopItem) => void;
}

const ShopItemsList = ({
  items,
  loading,
  editingItem,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onEditingItemChange,
}: ShopItemsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading shop prizes...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No shop prizes found.</p>
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
            <ShopItemEditForm
              item={editingItem}
              onSave={onSave}
              onCancel={onCancelEdit}
              onChange={onEditingItemChange}
            />
          ) : (
            <ShopItemDisplay
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

export default ShopItemsList;

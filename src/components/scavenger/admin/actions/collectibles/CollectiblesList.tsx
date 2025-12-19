"use client";

import { Collectible } from "@/lib/interface";
import CollectibleDisplay from "./CollectibleDisplay";
import CollectibleEditForm from "./CollectibleEditForm";

interface CollectiblesListProps {
  items: Collectible[];
  loading: boolean;
  editingItem: Collectible | null;
  onEdit: (item: Collectible) => void;
  onSave: (item: Collectible) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditingItemChange: (item: Collectible | null) => void;
}

const CollectiblesList = ({
  items,
  loading,
  editingItem,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onEditingItemChange,
}: CollectiblesListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No collectibles found.</p>
        <p className="text-sm mt-1">Create your first collectible above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {items.map((item) => (
        <div key={item._id}>
          {editingItem?._id === item._id ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CollectibleEditForm
                item={editingItem}
                onSave={onSave}
                onCancel={onCancelEdit}
                onChange={onEditingItemChange}
              />
            </div>
          ) : (
            <CollectibleDisplay
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => {
                if (
                  confirm(
                    `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
                  )
                ) {
                  onDelete(item._id);
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CollectiblesList;

"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import Modal from "@/components/ui/modal";

interface HuntItem {
  _id: string;
  name: string;
  description: string;
  identifier: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface HuntItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HuntItemsModal = ({ isOpen, onClose }: HuntItemsModalProps) => {
  const [huntItems, setHuntItems] = useState<HuntItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HuntItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    identifier: "",
    points: 0,
  });

  // Fetch hunt items
  const fetchHuntItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hunt-items");
      const data = await response.json();

      if (data.success) {
        setHuntItems(data.huntItems);
      } else {
        setError(data.error || "Failed to fetch hunt items");
      }
    } catch (err) {
      setError("Failed to fetch hunt items");
      console.error("Error fetching hunt items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new hunt item
  const createHuntItem = async () => {
    try {
      const response = await fetch("/api/hunt-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setHuntItems([data.huntItem, ...huntItems]);
        setFormData({ name: "", description: "", identifier: "", points: 0 });
        setShowAddForm(false);
      } else {
        setError(data.error || "Failed to create hunt item");
      }
    } catch (err) {
      setError("Failed to create hunt item");
      console.error("Error creating hunt item:", err);
    }
  };

  // Update hunt item
  const updateHuntItem = async (item: HuntItem) => {
    try {
      const response = await fetch(`/api/hunt-items/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          points: item.points,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHuntItems(
          huntItems.map((huntItem) =>
            huntItem._id === item._id ? data.huntItem : huntItem
          )
        );
        setEditingItem(null);
      } else {
        setError(data.error || "Failed to update hunt item");
      }
    } catch (err) {
      setError("Failed to update hunt item");
      console.error("Error updating hunt item:", err);
    }
  };

  // Delete hunt item
  const deleteHuntItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hunt item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/hunt-items/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setHuntItems(huntItems.filter((item) => item._id !== id));
      } else {
        setError(data.error || "Failed to delete hunt item");
      }
    } catch (err) {
      setError("Failed to delete hunt item");
      console.error("Error deleting hunt item:", err);
    }
  };

  // Reset form and state when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchHuntItems();
      setError(null);
      setEditingItem(null);
      setShowAddForm(false);
      setFormData({ name: "", description: "", identifier: "", points: 0 });
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Hunt Items"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add New Item Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Hunt Items ({huntItems.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add New Item
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h4 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
              Add New Hunt Item
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Identifier *
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter unique identifier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter points value"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createHuntItem}
                  disabled={!formData.name || !formData.identifier}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  Create Item
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: "",
                      description: "",
                      identifier: "",
                      points: 0,
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hunt Items List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Loading hunt items...
              </p>
            </div>
          ) : huntItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No hunt items found.
              </p>
            </div>
          ) : (
            huntItems.map((item) => (
              <div
                key={item._id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                {editingItem?._id === item._id ? (
                  <EditItemForm
                    item={editingItem}
                    onSave={updateHuntItem}
                    onCancel={() => setEditingItem(null)}
                    onChange={setEditingItem}
                  />
                ) : (
                  <ItemDisplay
                    item={item}
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => deleteHuntItem(item._id)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

// Component for displaying an item
const ItemDisplay = ({
  item,
  onEdit,
  onDelete,
}: {
  item: HuntItem;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex justify-between items-start">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {item.name}
        </h4>
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
          {item.points} pts
        </span>
      </div>
      {item.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {item.description}
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-500">
        ID: {item.identifier}
      </p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// Component for editing an item
const EditItemForm = ({
  item,
  onSave,
  onCancel,
  onChange,
}: {
  item: HuntItem;
  onSave: (item: HuntItem) => void;
  onCancel: () => void;
  onChange: (item: HuntItem) => void;
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Name
      </label>
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        rows={3}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Points
      </label>
      <input
        type="number"
        value={item.points}
        onChange={(e) =>
          onChange({ ...item, points: parseInt(e.target.value) || 0 })
        }
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-500">
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

export default HuntItemsModal;

"use client";

import { Plus } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useShopItems } from "./shopItemsDAO";
import ShopItemAddForm from "./ShopItemAddForm";
import ShopItemsList from "./ShopItemsList";

interface ShopItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopItemsModal = ({ isOpen, onClose }: ShopItemsModalProps) => {
  const {
    shopItems,
    loading,
    error,
    editingItem,
    showAddForm,
    formData,
    isSubmitting,
    setError,
    setEditingItem,
    setShowAddForm,
    setFormData,
    createShopItem,
    updateShopItem,
    deleteShopItem,
  } = useShopItems(isOpen);

  // Handle form submission
  const handleCreateItem = async () => {
    await createShopItem();
  };

  // Handle form cancellation
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      name: "",
      description: "",
      cost: 0,
      limited: false,
      remaining: 0,
      active: true,
      activationStart: null,
      activationEnd: null,
      imageData: "",
      imageContentType: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Shop Prizes"
      className="max-w-4xl max-h-[70vh] text-dark-mode"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add New Item Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Shop Prizes ({shopItems.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            Add New Item
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <ShopItemAddForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateItem}
            onCancel={handleCancelAdd}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Shop Items List */}
        <ShopItemsList
          items={shopItems}
          loading={loading}
          editingItem={editingItem}
          onEdit={setEditingItem}
          onSave={updateShopItem}
          onCancelEdit={() => setEditingItem(null)}
          onDelete={deleteShopItem}
          onEditingItemChange={setEditingItem}
        />
      </div>
    </Modal>
  );
};

export default ShopItemsModal;

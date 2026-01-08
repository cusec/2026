"use client";

import { Plus } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useCollectibles } from "./collectiblesDAO";
import CollectibleAddForm from "./CollectibleAddForm";
import CollectiblesList from "./CollectiblesList";

interface CollectiblesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectiblesModal = ({ isOpen, onClose }: CollectiblesModalProps) => {
  const {
    collectibles,
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
    createCollectible,
    updateCollectible,
    deleteCollectible,
  } = useCollectibles(isOpen);

  // Handle form submission
  const handleCreateItem = async () => {
    await createCollectible();
  };

  // Handle form cancellation
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      name: "",
      description: "",
      cost: 0,
      discountedCost: null,
      purchasable: false,
      limited: false,
      remaining: 0,
      active: true,
      activationStart: null,
      activationEnd: null,
      imageFile: undefined,
      imageUrl: undefined,
      removeImage: false,
    });
  };

  return (
    <Modal
      simple={true}
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Collectibles"
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

        {/* Add New Collectible Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Collectibles ({collectibles.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            Add New Collectible
          </button>
        </div>

        {/* Add New Collectible Form */}
        {showAddForm && (
          <CollectibleAddForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateItem}
            onCancel={handleCancelAdd}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Collectibles List */}
        <CollectiblesList
          items={collectibles}
          loading={loading}
          editingItem={editingItem}
          onEdit={setEditingItem}
          onSave={updateCollectible}
          onCancelEdit={() => setEditingItem(null)}
          onDelete={deleteCollectible}
          onEditingItemChange={setEditingItem}
        />
      </div>
    </Modal>
  );
};

export default CollectiblesModal;

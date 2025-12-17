"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/modal";
import { HuntItem } from "@/lib/interface";
import { useHuntItems } from "./huntItemsDAO";
import HuntItemAddForm from "./HuntItemAddForm";
import HuntItemsList from "./HuntItemsList";
import QRCodeModal from "./QRCodeModal";

interface HuntItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HuntItemsModal = ({ isOpen, onClose }: HuntItemsModalProps) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState<HuntItem | null>(null);

  const {
    huntItems,
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
    createHuntItem,
    updateHuntItem,
    deleteHuntItem,
  } = useHuntItems(isOpen);

  // Show QR code in modal
  const showQRCode = (item: HuntItem) => {
    setSelectedQrItem(item);
    setQrModalOpen(true);
  };

  // Handle form submission
  const handleCreateItem = async () => {
    await createHuntItem();
  };

  // Handle form cancellation
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({ name: "", description: "", identifier: "", points: 0 });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Hunt Items"
        className="max-w-4xl max-h-[70vh]"
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
              Hunt Items ({huntItems.length})
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
            <HuntItemAddForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateItem}
              onCancel={handleCancelAdd}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Hunt Items List */}
          <HuntItemsList
            items={huntItems}
            loading={loading}
            editingItem={editingItem}
            onEdit={setEditingItem}
            onSave={updateHuntItem}
            onCancelEdit={() => setEditingItem(null)}
            onDelete={deleteHuntItem}
            onShowQR={showQRCode}
            onEditingItemChange={setEditingItem}
          />
        </div>
      </Modal>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        item={selectedQrItem}
        onError={setError}
      />
    </>
  );
};

export default HuntItemsModal;

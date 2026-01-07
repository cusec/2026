"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter hunt items based on search query
  const filteredHuntItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return huntItems;
    }
    
    const query = searchQuery.toLowerCase();
    return huntItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [huntItems, searchQuery]);

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
    setFormData({
      name: "",
      description: "",
      identifier: "",
      points: 0,
      active: false,
      activationStart: null,
      activationEnd: null,
      maxClaims: null,
      collectibles: [],
    });
  };

  return (
    <>
      <Modal
        simple={true}
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Hunt Items"
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
            <h3 className="text-lg font-medium text-dark-mode">
              Hunt Items ({filteredHuntItems.length}{searchQuery && ` of ${huntItems.length}`})
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search hunt items by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
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
            items={filteredHuntItems}
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

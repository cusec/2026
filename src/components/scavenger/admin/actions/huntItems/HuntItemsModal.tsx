"use client";

import { useState, useMemo } from "react";
import { Plus, Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
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
  const [showMassUpdate, setShowMassUpdate] = useState(false);
  const [massUpdatePoints, setMassUpdatePoints] = useState<number>(0);
  const [isMassUpdating, setIsMassUpdating] = useState(false);
  const [massUpdateResult, setMassUpdateResult] = useState<string | null>(null);

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
    massUpdateFuturePoints,
  } = useHuntItems(isOpen);

  // Filter hunt items based on search query
  const filteredHuntItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return huntItems;
    }

    const query = searchQuery.toLowerCase();
    return huntItems.filter((item) => item.name.toLowerCase().includes(query));
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

  // Handle mass update
  const handleMassUpdate = async () => {
    if (massUpdatePoints === 0) return;

    setIsMassUpdating(true);
    setMassUpdateResult(null);

    const result = await massUpdateFuturePoints(massUpdatePoints);

    setMassUpdateResult(result.message);
    setIsMassUpdating(false);

    if (result.success && result.updatedCount > 0) {
      // Reset form after successful update
      setTimeout(() => {
        setMassUpdatePoints(0);
        setMassUpdateResult(null);
        setShowMassUpdate(false);
      }, 3000);
    }
  };

  // Count future items for display
  const futureItemsCount = useMemo(() => {
    const now = new Date();
    return huntItems.filter(
      (item) => item.activationStart && new Date(item.activationStart) > now
    ).length;
  }, [huntItems]);

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
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium text-dark-mode">
              Hunt Items ({filteredHuntItems.length}
              {searchQuery && ` of ${huntItems.length}`})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMassUpdate(!showMassUpdate)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={isSubmitting || isMassUpdating}
              >
                <TrendingUp size={16} />
                Mass Update
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add New Item
              </button>
            </div>
          </div>

          {/* Mass Update Panel */}
          {showMassUpdate && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-purple-900">
                  Mass Update Future Items
                </h4>
                <button
                  onClick={() => {
                    setShowMassUpdate(false);
                    setMassUpdatePoints(0);
                    setMassUpdateResult(null);
                  }}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-purple-700">
                Update points for all hunt items with activation start time in
                the future.
                <br />
                <span className="font-medium">
                  {futureItemsCount} item(s)
                </span>{" "}
                will be affected.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMassUpdatePoints((prev) => prev - 5)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    disabled={isMassUpdating}
                  >
                    <TrendingDown size={16} />
                  </button>
                  <input
                    type="number"
                    value={massUpdatePoints}
                    onChange={(e) =>
                      setMassUpdatePoints(parseInt(e.target.value) || 0)
                    }
                    className="w-24 px-3 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 text-center"
                    placeholder="Points"
                    disabled={isMassUpdating}
                  />
                  <button
                    onClick={() => setMassUpdatePoints((prev) => prev + 5)}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    disabled={isMassUpdating}
                  >
                    <TrendingUp size={16} />
                  </button>
                </div>
                <span className="text-sm text-purple-700">
                  {massUpdatePoints > 0 && `+${massUpdatePoints}`}
                  {massUpdatePoints < 0 && massUpdatePoints}
                  {massUpdatePoints === 0 && "0"} points
                </span>
                <button
                  onClick={handleMassUpdate}
                  disabled={
                    massUpdatePoints === 0 ||
                    isMassUpdating ||
                    futureItemsCount === 0
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMassUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {massUpdateResult && (
                <p
                  className={`text-sm ${
                    massUpdateResult.includes("Successfully")
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {massUpdateResult}
                </p>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
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

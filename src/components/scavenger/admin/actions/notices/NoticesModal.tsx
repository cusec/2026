"use client";

import { Plus } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useNotices } from "./noticesDAO";
import NoticeAddForm from "./NoticeAddForm";
import NoticesList from "./NoticesList";

interface NoticesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoticesModal = ({ isOpen, onClose }: NoticesModalProps) => {
  const {
    notices,
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
    createNotice,
    updateNotice,
    deleteNotice,
  } = useNotices(isOpen);

  // Handle form submission
  const handleCreateItem = async () => {
    await createNotice();
  };

  // Handle form cancellation
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Notices"
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

        {/* Add New Notice Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Notices ({notices.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            Add New Notice
          </button>
        </div>

        {/* Add New Notice Form */}
        {showAddForm && (
          <NoticeAddForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateItem}
            onCancel={handleCancelAdd}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Notices List */}
        <NoticesList
          items={notices}
          loading={loading}
          editingItem={editingItem}
          onEdit={setEditingItem}
          onSave={updateNotice}
          onCancelEdit={() => setEditingItem(null)}
          onDelete={deleteNotice}
          onEditingItemChange={setEditingItem}
        />
      </div>
    </Modal>
  );
};

export default NoticesModal;

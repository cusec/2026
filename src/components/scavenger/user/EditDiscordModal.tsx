"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import Modal from "@/components/ui/modal";

interface EditDiscordModalProps {
  userId: string;
  currentHandle: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newHandle: string | null) => void;
}

const EditDiscordModal = ({
  userId,
  currentHandle,
  isOpen,
  onClose,
  onSave,
}: EditDiscordModalProps) => {
  const [handle, setHandle] = useState(currentHandle || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}/discord`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discord_handle: handle.trim() || null }),
      });

      const data = await response.json();

      if (data.success) {
        onSave(data.discord_handle);
        onClose();
      } else {
        setError(data.error || "Failed to update Discord handle");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error updating Discord handle:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHandle(currentHandle || "");
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 max-w-sm bg-dark-mode/95 text-light-mode rounded-xl"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Discord Handle</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-light-mode/10 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            setError(null);
          }}
          placeholder="@discordHandle"
          className="w-full px-3 py-2 bg-light-mode/10 border border-light-mode/30 rounded-lg text-light-mode outline-none focus:border-light-mode/50 mb-3"
          disabled={isSubmitting}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-light-mode rounded-lg bg-light-mode/5 hover:bg-light-mode/15 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditDiscordModal;

"use client";

import { useState, useEffect } from "react";
import { HuntItem, HuntItemFormData } from "@/lib/interface";

const emptyFormData: HuntItemFormData = {
  name: "",
  description: "",
  identifier: "",
  points: 0,
  maxClaims: null,
  active: true,
  activationStart: null,
  activationEnd: null,
};

export const useHuntItems = (isOpen: boolean) => {
  const [huntItems, setHuntItems] = useState<HuntItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HuntItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<HuntItemFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch hunt items
  const fetchHuntItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/hunt-items");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch hunt items");
      }

      setHuntItems(data.huntItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch hunt items"
      );
      console.error("Error fetching hunt items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new hunt item
  const createHuntItem = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/hunt-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create hunt item");
      }

      setHuntItems([data.huntItem, ...huntItems]);
      setFormData(emptyFormData);
      setShowAddForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create hunt item"
      );
      console.error("Error creating hunt item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update hunt item (note: points are not updated - they are immutable after creation)
  const updateHuntItem = async (item: HuntItem) => {
    try {
      setError(null);

      const response = await fetch(`/api/hunt-items/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          // Note: points are not sent - they cannot be changed after creation
          maxClaims: item.maxClaims,
          active: item.active,
          activationStart: item.activationStart,
          activationEnd: item.activationEnd,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update hunt item");
      }

      setHuntItems(
        huntItems.map((huntItem) =>
          huntItem._id === item._id ? data.huntItem : huntItem
        )
      );
      setEditingItem(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update hunt item"
      );
      console.error("Error updating hunt item:", err);
    }
  };

  // Delete hunt item
  const deleteHuntItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hunt item?")) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`/api/hunt-items/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete hunt item");
      }

      setHuntItems(huntItems.filter((item) => item._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete hunt item"
      );
      console.error("Error deleting hunt item:", err);
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      fetchHuntItems();
      setError(null);
      setEditingItem(null);
      setShowAddForm(false);
      setFormData(emptyFormData);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return {
    // State
    huntItems,
    loading,
    error,
    editingItem,
    showAddForm,
    formData,
    isSubmitting,

    // Actions
    setError,
    setEditingItem,
    setShowAddForm,
    setFormData,
    createHuntItem,
    updateHuntItem,
    deleteHuntItem,
    fetchHuntItems,
  };
};

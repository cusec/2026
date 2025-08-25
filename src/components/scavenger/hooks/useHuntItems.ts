"use client";

import { useState, useEffect } from "react";
import { HuntItem, HuntItemFormData } from "../types/huntItem";
import { HuntItemService } from "../utils/huntItemService";

const emptyFormData: HuntItemFormData = {
  name: "",
  description: "",
  identifier: "",
  points: 0,
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
      const items = await HuntItemService.fetchHuntItems();
      setHuntItems(items);
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
      const newItem = await HuntItemService.createHuntItem(formData);
      setHuntItems([newItem, ...huntItems]);
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

  // Update hunt item
  const updateHuntItem = async (item: HuntItem) => {
    try {
      setError(null);
      const updatedItem = await HuntItemService.updateHuntItem(item);
      setHuntItems(
        huntItems.map((huntItem) =>
          huntItem._id === item._id ? updatedItem : huntItem
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
      await HuntItemService.deleteHuntItem(id);
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

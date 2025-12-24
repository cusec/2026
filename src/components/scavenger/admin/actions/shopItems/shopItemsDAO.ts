"use client";

import { useState, useEffect } from "react";
import { ShopItem, ShopItemFormData } from "@/lib/interface";

const emptyFormData: ShopItemFormData = {
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
};

export const useShopItems = (isOpen: boolean) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ShopItemFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch shop items
  const fetchShopItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/shop?includeAll=true");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch shop items");
      }

      setShopItems(data.shopItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch shop items"
      );
      console.error("Error fetching shop items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new shop item
  const createShopItem = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/admin/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create shop item");
      }

      setShopItems([data.shopItem, ...shopItems]);
      setFormData(emptyFormData);
      setShowAddForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create shop item"
      );
      console.error("Error creating shop item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update shop item
  const updateShopItem = async (item: ShopItem) => {
    try {
      setError(null);

      const response = await fetch("/api/admin/shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item._id,
          updates: {
            name: item.name,
            description: item.description,
            cost: item.cost,
            limited: item.limited,
            remaining: item.remaining,
            active: item.active,
            activationStart: item.activationStart,
            activationEnd: item.activationEnd,
            imageData: item.imageData,
            imageContentType: item.imageContentType,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update shop item");
      }

      setShopItems(
        shopItems.map((shopItem) =>
          shopItem._id === item._id ? data.shopItem : shopItem
        )
      );
      setEditingItem(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update shop item"
      );
      console.error("Error updating shop item:", err);
    }
  };

  // Delete shop item
  const deleteShopItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shop item?")) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`/api/admin/shop?itemId=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete shop item");
      }

      setShopItems(shopItems.filter((item) => item._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete shop item"
      );
      console.error("Error deleting shop item:", err);
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      fetchShopItems();
      setError(null);
      setEditingItem(null);
      setShowAddForm(false);
      setFormData(emptyFormData);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return {
    // State
    shopItems,
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
    createShopItem,
    updateShopItem,
    deleteShopItem,
    fetchShopItems,
  };
};

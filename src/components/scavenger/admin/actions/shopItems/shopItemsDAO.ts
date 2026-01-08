"use client";

import { useState, useEffect } from "react";
import { ShopItem, ShopItemFormData } from "@/lib/interface";

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const emptyFormData: ShopItemFormData = {
  name: "",
  description: "",
  cost: 0,
  discountedCost: null,
  limited: false,
  remaining: 0,
  active: true,
  activationStart: null,
  activationEnd: null,
  imageFile: undefined,
  imageUrl: undefined,
  removeImage: false,
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

      // Prepare form data for API - convert file to base64 if present
      let imageData: string | undefined;
      let imageContentType: string | undefined;

      if (formData.imageFile) {
        const base64 = await fileToBase64(formData.imageFile);
        imageData = base64.split(",")[1]; // Remove data URL prefix
        imageContentType = formData.imageFile.type;
      }

      const response = await fetch("/api/admin/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          cost: formData.cost,
          discountedCost: formData.discountedCost,
          limited: formData.limited,
          remaining: formData.remaining,
          active: formData.active,
          activationStart: formData.activationStart,
          activationEnd: formData.activationEnd,
          imageData,
          imageContentType,
        }),
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
  const updateShopItem = async (
    item: ShopItem & { imageFile?: File; removeImage?: boolean }
  ) => {
    try {
      setError(null);

      // Prepare image data for API
      let imageData: string | null | undefined;
      let imageContentType: string | undefined;
      let removeImage = false;

      if (item.removeImage) {
        removeImage = true;
      } else if (item.imageFile) {
        const base64 = await fileToBase64(item.imageFile);
        imageData = base64.split(",")[1]; // Remove data URL prefix
        imageContentType = item.imageFile.type;
      }

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
            discountedCost: item.discountedCost,
            limited: item.limited,
            remaining: item.remaining,
            active: item.active,
            activationStart: item.activationStart,
            activationEnd: item.activationEnd,
            ...(removeImage ? { removeImage: true } : {}),
            ...(imageData ? { imageData, imageContentType } : {}),
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
    if (!confirm("Are you sure you want to delete this shop prize?")) {
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

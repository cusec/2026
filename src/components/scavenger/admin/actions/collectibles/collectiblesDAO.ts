"use client";

import { useState, useEffect } from "react";
import { Collectible, CollectibleFormData } from "@/lib/interface";

const emptyFormData: CollectibleFormData = {
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
};

export const useCollectibles = (isOpen: boolean) => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Collectible | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CollectibleFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch collectibles
  const fetchCollectibles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/collectibles?includeAll=true");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch collectibles");
      }

      setCollectibles(data.collectibles);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch collectibles"
      );
      console.error("Error fetching collectibles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new collectible
  const createCollectible = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Convert file to base64 if provided
      let imageData: string | undefined;
      let imageContentType: string | undefined;

      if (formData.imageFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.imageFile!);
        });
        imageData = base64.split(",")[1];
        imageContentType = formData.imageFile.type;
      }

      const response = await fetch("/api/collectibles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          cost: formData.cost,
          discountedCost: formData.discountedCost,
          purchasable: formData.purchasable,
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
        throw new Error(data.error || "Failed to create collectible");
      }

      setCollectibles([data.collectible, ...collectibles]);
      setFormData(emptyFormData);
      setShowAddForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create collectible"
      );
      console.error("Error creating collectible:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update collectible
  const updateCollectible = async (item: Collectible) => {
    try {
      setError(null);

      // Check if there's a pending image file to upload (stored in a custom property)
      const pendingFile = (item as Collectible & { _pendingImageFile?: File })
        ._pendingImageFile;
      const shouldRemoveImage = (
        item as Collectible & { _removeImage?: boolean }
      )._removeImage;

      let imageData: string | undefined;
      let imageContentType: string | undefined;

      if (pendingFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pendingFile);
        });
        imageData = base64.split(",")[1];
        imageContentType = pendingFile.type;
      }

      const response = await fetch(`/api/collectibles/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          cost: item.cost,
          discountedCost: item.discountedCost,
          purchasable: item.purchasable,
          limited: item.limited,
          remaining: item.remaining,
          active: item.active,
          activationStart: item.activationStart,
          activationEnd: item.activationEnd,
          imageData,
          imageContentType,
          removeImage: shouldRemoveImage,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update collectible");
      }

      setCollectibles(
        collectibles.map((c) => (c._id === item._id ? data.collectible : c))
      );
      setEditingItem(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update collectible"
      );
      console.error("Error updating collectible:", err);
    }
  };

  // Delete collectible
  const deleteCollectible = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/collectibles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete collectible");
      }

      setCollectibles(collectibles.filter((c) => c._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete collectible"
      );
      console.error("Error deleting collectible:", err);
    }
  };

  // Fetch collectibles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCollectibles();
    }
  }, [isOpen]);

  return {
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
  };
};

"use client";

import { useState, useEffect } from "react";
import { Notice, NoticeFormData } from "@/lib/interface";

const emptyFormData: NoticeFormData = {
  title: "",
  description: "",
};

export const useNotices = (isOpen: boolean) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Notice | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<NoticeFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/notices");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch notices");
      }

      setNotices(data.notices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notices");
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new notice
  const createNotice = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/admin/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create notice");
      }

      setNotices([data.notice, ...notices]);
      setFormData(emptyFormData);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create notice");
      console.error("Error creating notice:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update notice
  const updateNotice = async (item: Notice) => {
    try {
      setError(null);

      const response = await fetch("/api/admin/notices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: item._id,
          title: item.title,
          description: item.description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update notice");
      }

      setNotices(notices.map((n) => (n._id === item._id ? data.notice : n)));
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update notice");
      console.error("Error updating notice:", err);
    }
  };

  // Delete notice
  const deleteNotice = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/notices?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete notice");
      }

      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notice");
      console.error("Error deleting notice:", err);
    }
  };

  // Fetch notices when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchNotices();
    }
  }, [isOpen]);

  return {
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
  };
};

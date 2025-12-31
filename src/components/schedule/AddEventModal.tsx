"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/modal";
import { ScheduleItem } from "../../lib/interface";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  onEventSaved: () => void;
  displayStartHour: number;
  displayEndHour: number;
  editEvent?: ScheduleItem | null;
}

// Helper to convert hour to HH:MM format
function hourToTimeString(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export default function AddEventModal({
  isOpen,
  onClose,
  dayId,
  onEventSaved,
  displayStartHour,
  displayEndHour,
  editEvent = null,
}: AddEventModalProps) {
  const minTime = hourToTimeString(displayStartHour);
  const maxTime = hourToTimeString(displayEndHour);
  const isEditMode = editEvent ? true : false;

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    title: "",
    location: "",
    description: "",
    detailedDescription: "",
    track: "A" as "A" | "B" | "C",
    color: "primary" as
      | "primary"
      | "secondary"
      | "accent"
      | "sunset"
      | "sea"
      | "white",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (editEvent) {
      setFormData({
        startTime: editEvent.startTime,
        endTime: editEvent.endTime,
        title: editEvent.title,
        location: editEvent.location || "",
        description: editEvent.description || "",
        detailedDescription: editEvent.detailedDescription || "",
        track: editEvent.track,
        color: editEvent.color || "primary",
      });
    } else {
      setFormData({
        startTime: "",
        endTime: "",
        title: "",
        location: "",
        description: "",
        detailedDescription: "",
        track: "A",
        color: "primary",
      });
    }
  }, [editEvent, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const method = isEditMode ? "PUT" : "POST";
      console.log("event:", editEvent);
      const body = isEditMode
        ? {
            dayId,
            eventId: editEvent?._id,
            event: formData,
          }
        : {
            dayId,
            event: formData,
          };

      const response = await fetch("/api/schedule", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isEditMode ? "update" : "add"} event`
        );
      }

      // Reset form and close modal
      setFormData({
        startTime: "",
        endTime: "",
        title: "",
        location: "",
        description: "",
        detailedDescription: "",
        track: "A",
        color: "primary",
      });
      onEventSaved();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      location: "",
      description: "",
      detailedDescription: "",
      track: "A",
      color: "primary",
    });
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Event" : "Add New Event"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Opening Ceremony"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              min={minTime}
              max={maxTime}
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Time *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              required
              min={minTime}
              max={maxTime}
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="track"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Track *
            </label>
            <select
              id="track"
              name="track"
              required
              value={formData.track}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="A">Track A</option>
              <option value="B">Track B</option>
              <option value="C">Track C</option>
              <option value="AB">Tracks A (full) & B (half)</option>
              <option value="BC">Tracks B (half) & C (full)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select which track this event belongs to.
            </p>
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Border Color *
            </label>
            <div className="relative">
              <select
                id="color"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="primary">Primary (Dark Blue)</option>
                <option value="secondary">Secondary (Blue Gray)</option>
                <option value="accent">Accent (Red)</option>
                <option value="sunset">Sunset (Burgundy)</option>
                <option value="sea">Sea (Navy)</option>
                <option value="white">White (Light mode)</option>
              </select>
              {/* Color preview indicator */}
              <div
                className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-gray-300"
                style={{
                  backgroundColor:
                    formData.color === "primary"
                      ? "rgb(0, 0, 114)"
                      : formData.color === "secondary"
                      ? "#41578c"
                      : formData.color === "accent"
                      ? "#a40b0d"
                      : formData.color === "sunset"
                      ? "#802b36"
                      : formData.color === "sea"
                      ? "#1e2371"
                      : formData.color === "white"
                      ? "#ffffff"
                      : "rgb(0, 0, 114)",
                }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Choose the left border color for this event.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Main Hall"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Event description..."
          />
        </div>

        <div>
          <label
            htmlFor="detailedDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Detailed Description (optional)
          </label>
          <textarea
            id="detailedDescription"
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="You can include longer HTML/markup here. It will be rendered on the event detail view."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Event"
              : "Add Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

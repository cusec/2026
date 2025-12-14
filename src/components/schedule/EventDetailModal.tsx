"use client";

import React from "react";
import Modal from "../ui/modal";
import { ScheduleItem } from "../../lib/interface";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleItem | null;
}

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
}: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.description || "Event Details"}
      className="mx-4 max-w-[80vw] md:max-w-2xl bg-dark-mode/90 text-light-mode rounded-2xl"
    >
      <div className="space-y-4">
        {event.detailedDescription ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: event.detailedDescription }}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            No additional details.
          </div>
        )}
      </div>
    </Modal>
  );
}

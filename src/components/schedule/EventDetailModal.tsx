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
    <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground font-mono">
          {event.startTime} - {event.endTime}
          {event.location ? ` | ${event.location}` : ""}
        </div>

        {event.description && (
          <div className="text-lg font-medium">{event.description}</div>
        )}

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

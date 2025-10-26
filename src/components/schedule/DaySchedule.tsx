"use client";

import { useState } from "react";
import { ScheduleItem } from "../../lib/interface";
import { Pencil, Download } from "lucide-react";
import EventModal from "./EventModal";
import { downloadEventICS, downloadDayICS } from "../../lib/icsGenerator";

interface ScheduleProps {
  events: ScheduleItem[];
  displayStartHour: number;
  displayEndHour: number;
  isAdmin?: boolean;
  dayId: string;
  dayTimestamp: number;
  dayName: string;
  onEventChanged?: () => void;
}

// Convert time string (HH:MM) to minutes from midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert minutes back to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Get border color class based on color name
function getBorderColorClass(color?: string): string {
  const colorMap: { [key: string]: string } = {
    primary: "border-l-primary",
    secondary: "border-l-secondary",
    accent: "border-l-accent",
    sunset: "border-l-sunset",
    sea: "border-l-sea",
  };
  return colorMap[color || "primary"] || "border-l-primary";
}

// Calculate layout based on tracks (A, B, C)
function calculateEventLayout(events: ScheduleItem[]) {
  const eventLayout = new Map<
    string,
    { column: number; totalColumns: number }
  >();

  // Determine which tracks are in use
  const tracksInUse = new Set<string>();
  events.forEach((event) => tracksInUse.add(event.track));

  // Create ordered list of active tracks
  const activeTracksList = ["A", "B", "C"].filter((track) =>
    tracksInUse.has(track)
  );

  const totalColumns = activeTracksList.length || 1; // At least 1 column

  // Map track to column index based on active tracks
  const trackToColumn: { [key: string]: number } = {};
  activeTracksList.forEach((track, index) => {
    trackToColumn[track] = index;
  });

  events.forEach((event) => {
    eventLayout.set(event._id!, {
      column: trackToColumn[event.track],
      totalColumns,
    });
  });

  return { eventLayout, activeTracksList };
}

export default function DaySchedule({
  events,
  displayStartHour,
  displayEndHour,
  isAdmin = false,
  dayId,
  dayTimestamp,
  dayName,
  onEventChanged,
}: ScheduleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleItem | null>(null);

  const handleEditEvent = (event: ScheduleItem) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventSaved = () => {
    if (onEventChanged) {
      onEventChanged();
    }
  };

  const layoutResult = calculateEventLayout(events);
  const eventLayout = layoutResult.eventLayout;

  // Convert hours to minutes from midnight
  const displayStart = displayStartHour * 60;
  const displayEnd = displayEndHour * 60;

  // Generate hour markers
  const hours = [];
  for (let time = displayStart; time <= displayEnd; time += 60) {
    hours.push(time);
  }

  const totalMinutes = displayEnd - displayStart;
  const pixelsPerMinute = 2.5; // Adjust this to change the scale

  return (
    <div className="relative w-[90vw] lg:w-[80vw] max-w-[1400px] mx-auto mt-12 bg-light-mode/90 backdrop-blur-xs px-4 lg:px-12 py-12 lg:py-16 rounded-4xl shadow-lg">
      {/* Download entire day button - top right corner */}
      <button
        onClick={() => downloadDayICS(events, dayTimestamp, dayName)}
        className="absolute top-4 right-4 p-3 bg-white/50 hover:bg-white rounded-full shadow-md transition-all opacity-70"
        title="Download full day schedule"
      >
        <Download size={20} className="text-primary" />
      </button>

      {isAdmin && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddEvent}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            + Add Event
          </button>
        </div>
      )}

      <div className="relative">
        {/* Time axis with absolute positioning */}
        <div className="absolute left-0 -top-4 w-16">
          {hours.map((hourMinutes, index) => (
            <div
              key={hourMinutes}
              className="absolute text-sm md:text-lg text-muted-foreground font-mono"
              style={{ top: `${index * 60 * pixelsPerMinute}px` }}
            >
              <div className="flex items-center h-8">
                {minutesToTime(hourMinutes)}
              </div>
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div
          className="ml-16 relative"
          style={{ height: `${totalMinutes * pixelsPerMinute}px` }}
        >
          {hours.map((hourMinutes, index) => (
            <div
              key={`line-${hourMinutes}`}
              className="absolute w-full border-t border-border text-dark-mode/10"
              style={{ top: `${index * 60 * pixelsPerMinute}px` }}
            />
          ))}

          {/* Events container */}
          {events[0] &&
            events.map((event) => {
              const layout = eventLayout.get(event._id!)!;
              const startMinutes =
                timeToMinutes(event.startTime) - displayStart;
              const duration =
                timeToMinutes(event.endTime) - timeToMinutes(event.startTime);

              const top = (startMinutes / 60) * 60 * pixelsPerMinute; // 180px per hour (if 3 pixels per minute)
              const height = Math.max(duration * pixelsPerMinute, 64); // Minimum height of 64px
              const width = `${100 / layout.totalColumns - 2}%`;
              const left = `${
                (layout.column * 100) / layout.totalColumns + 1
              }%`;

              return (
                <div
                  key={event._id}
                  className={`absolute items-center flex border-l-6 ${getBorderColorClass(
                    event.color
                  )} bg-light-mode/30 shadow-lg/20 hover:bg-light-mode/50 hover:shadow-xl/20 transition-shadow min-h-16 bg-card group`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    width,
                    left,
                  }}
                >
                  <div className="flex-1">
                    <div className="p-3 pb-0">
                      <h1 className="text-sm md:text-xl lg:text-2xl font-semibold leading-tight">
                        {event.title}
                      </h1>
                      <h2 className="text-xs md:text-lg text-muted-foreground font-mono">
                        {event.startTime} - {event.endTime}
                        {event.location ? ` | ${event.location}` : ""}
                      </h2>
                    </div>
                    <div className="hidden xs:block p-3 pt-0">
                      <p className="text-xs md:text-lg text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  {/* Download button - visible to everyone */}
                  <button
                    onClick={() => downloadEventICS(event, dayTimestamp)}
                    className="absolute top-2 right-2 p-2 bg-white/50 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add to calendar"
                  >
                    <Download size={16} className="text-primary" />
                  </button>
                  {/* Edit button - visible only to admins on hover */}
                  {isAdmin && (
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="absolute top-2 right-12 p-2 bg-white/50 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit event"
                    >
                      <Pencil size={16} className="text-primary" />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {isAdmin && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          dayId={dayId}
          onEventSaved={handleEventSaved}
          displayStartHour={displayStartHour}
          displayEndHour={displayEndHour}
          editEvent={editingEvent}
        />
      )}
    </div>
  );
}

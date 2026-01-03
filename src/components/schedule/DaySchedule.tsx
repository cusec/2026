"use client";

import { useState } from "react";
import { ScheduleItem } from "../../lib/interface";
import { Pencil, Download, Trash2 } from "lucide-react";
import AddEventModal from "./AddEventModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EventDetailModal from "./EventDetailModal";
import { downloadEventICS, downloadDayICS } from "../../lib/icsGenerator";
import Sun from "./graphics/sun";
import Moon from "./graphics/moon";

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
    white: "border-l-light-mode",
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ScheduleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailEvent, setDetailEvent] = useState<ScheduleItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleDeleteEvent = (event: ScheduleItem) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete || !eventToDelete._id) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/schedule", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayId,
          eventId: eventToDelete._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      if (onEventChanged) {
        onEventChanged();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(error instanceof Error ? error.message : "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleOpenDetails = (event: ScheduleItem) => {
    console.log("Opening details for event:", event);
    setDetailEvent(event);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    console.log("Closing details modal");
    setIsDetailOpen(false);
    setDetailEvent(null);
  };

  const layoutResult = calculateEventLayout(events);
  const eventLayout = layoutResult.eventLayout;
  const numberOfTracks = layoutResult.activeTracksList.length;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Convert hours to minutes from midnight
  const displayStart = displayStartHour * 60;
  const displayEnd = displayEndHour * 60;

  // Generate hour markers
  const hours = [];
  for (let time = displayStart; time <= displayEnd; time += 60) {
    hours.push(time);
  }

  const totalMinutes = displayEnd - displayStart;
  const pixelsPerMinute = 5; // Set to 5 for hour height

  // Determine container width based on number of tracks
  const getContainerWidthClass = () => {
    if (numberOfTracks === 1) {
      return "w-[100vw] sm:w-[70vw] max-w-[1100px]";
    } else if (numberOfTracks === 2) {
      return "w-[100vw] sm:w-[90vw] max-w-[1600px]";
    } else {
      return "w-[100vw] sm:w-[90vw] max-w-[1600px]";
    }
  };

  return (
    <>
      <div
        className={`relative group/full ${getContainerWidthClass()} mt-12 px-4 md:px-8 lg:px-12 py-12 lg:py-16`}
      >
        <div className="absolute w-full h-full top-0 left-0 sm:bg-dark-mode/40 sm:rounded-3xl sm:shadow-lg"></div>

        {/* Download entire day button - top right corner */}
        <button
          onClick={() => downloadDayICS(events, dayTimestamp, dayName)}
          className="absolute flex items-center gap-1 top-0 sm:top-2 lg:top-4 right-4 px-2 py-1 md:invisible group-hover/full:visible bg-light-mode/80 hover:bg-light-mode/90 rounded-xl shadow-md transition-all"
          title="Download full day schedule"
        >
          <Download
            size={isMobile ? 15 : 15}
            className="text-dark-mode inline"
          />
          .ics
        </button>

        {isAdmin && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleAddEvent}
              className="absolute top-4 px-3 py-1 md:px-6 md:py-3 bg-dark-mode/90 border border-light-mode/90 text-light-mode font-semibold rounded-lg transition-colors shadow-md"
            >
              + Add Event
            </button>
          </div>
        )}
        <Sun />
        <div className="relative">
          {/* Time axis with absolute positioning */}
          <div className="absolute left-0 -top-4 w-8 lg:w-16 text-light-mode">
            {hours.map((hourMinutes, index) => (
              <div
                key={hourMinutes}
                className="absolute text-xs md:text-lg text-muted-foreground font-mono"
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
            className="ml-10 lg:ml-16 relative "
            style={{ height: `${totalMinutes * pixelsPerMinute}px` }}
          >
            {hours.map((hourMinutes, index) => (
              <div
                key={`line-${hourMinutes}`}
                className="absolute w-full border-t border-border text-light-mode/15"
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

                // Check if this event is the only one in its time slot
                const isOnlyEventInSlot = !events.some((otherEvent) => {
                  if (otherEvent._id === event._id) return false; // Skip self

                  const eventStart = timeToMinutes(event.startTime);
                  const eventEnd = timeToMinutes(event.endTime);
                  const otherStart = timeToMinutes(otherEvent.startTime);
                  const otherEnd = timeToMinutes(otherEvent.endTime);

                  // Check for overlap
                  return eventStart < otherEnd && eventEnd > otherStart;
                });

                const top = startMinutes * pixelsPerMinute;
                const height = Math.max(duration * pixelsPerMinute, 120); // Minimum height of 120px for better visibility (updated for 5px/min)

                let width;
                let left;
                // Special handling for AB and BC tracks
                if (event.track === "AB") {
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 640
                  ) {
                    width = "45.5%";
                    left = "4%";
                  } else {
                    width = "46.25%";
                    left = "1%";
                  }
                } else if (event.track === "BC") {
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 640
                  ) {
                    width = "45.5%";
                    left = "51.5%";
                  } else {
                    width = "46.25%";
                    left = "49.25%";
                  }
                } else {
                  width = `${95 / layout.totalColumns - 2}%`;
                  // if viewport width is less than 640px and event is only in its time slot or only 1 column, make it full width
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 640 &&
                    layout.totalColumns == 1
                  ) {
                    width = "100%";
                  }
                  if (isOnlyEventInSlot) {
                    width = "94.5%";
                  }
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 640
                  ) {
                    left = `${(layout.column * 95) / layout.totalColumns + 4}%`;
                  } else {
                    left = `${(layout.column * 95) / layout.totalColumns + 1}%`;
                  }
                }

                return (
                  <div
                    key={event._id}
                    className={`absolute items-center w-full sm:mx-[2vw] lg:mx-10 flex rounded-lg ${
                      event.description || event.detailedDescription
                        ? " cursor-pointer "
                        : ""
                    } border-l-6 ${getBorderColorClass(
                      event.color
                    )} bg-dark-mode/60 shadow-lg/20 hover:bg-dark-mode/65 hover:shadow-lg/30 text-light-mode/90 transition-shadow min-h-16 bg-card group/event`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      width,
                      left,
                    }}
                    onClick={() => {
                      if (event.description || event.detailedDescription)
                        handleOpenDetails(event);
                    }}
                  >
                    <div className="flex flex-col pl-1 xxs:pl-3">
                      <div className="pb-1">
                        <h1 className="xxs:max-w-fit text-xs sm:text-sm md:text-lg lg:text-xl xxs:font-semibold leading-tight">
                          {event.title}
                        </h1>
                        <h2 className="text-[8px] xxs:text-xs sm:text-sm md:text-md lg:text-lg text-muted-foreground font-mono">
                          {event.startTime} - {event.endTime}
                          {event.location ? ` | ${event.location}` : ""}
                        </h2>
                      </div>
                      {/* <div>
                        <TruncatedText
                          text={event.description}
                          // estimate available height for description area
                          maxHeight={Math.max(height - 60, 24)}
                          className="text-xs md:text-lg text-muted-foreground leading-relaxed"
                        />
                      </div> */}
                    </div>
                    {/* Download button - visible to everyone */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadEventICS(event, dayTimestamp);
                      }}
                      className="absolute top-2 right-2 p-1 md:p-2 bg-light-mode/80 hover:bg-light-mode/90 rounded-lg shadow-md md:opacity-0 group-hover/event:opacity-100 transition-opacity"
                      title="Download ICS File"
                    >
                      <Download
                        size={isMobile ? 12 : 15}
                        className="text-dark-mode"
                      />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          className="absolute top-2 right-7.75 md:right-12 p-1 md:p-2 bg-light-mode/80 hover:bg-light-mode/90 rounded-lg shadow-md md:opacity-0 group-hover/event:opacity-100 transition-opacity"
                          title="Edit event"
                        >
                          <Pencil
                            size={isMobile ? 10 : 15}
                            className="text-dark-mode"
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event);
                          }}
                          className="absolute top-2 right-13 md:right-22 p-1 md:p-2 bg-light-mode/80 hover:bg-light-mode/90 rounded-lg shadow-md md:opacity-0 group-hover/event:opacity-100 transition-opacity"
                          title="Delete event"
                        >
                          <Trash2
                            size={isMobile ? 10 : 15}
                            className="text-dark-mode"
                          />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <Moon />
      </div>
      <EventDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetails}
        event={detailEvent}
      />
      {isAdmin && (
        <>
          <AddEventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            dayId={dayId}
            onEventSaved={handleEventSaved}
            displayStartHour={displayStartHour}
            displayEndHour={displayEndHour}
            editEvent={editingEvent}
          />
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            eventTitle={eventToDelete?.title || ""}
            isDeleting={isDeleting}
          />
        </>
      )}
    </>
  );
}

// TruncatedText: truncates `text` with ellipsis so it fits within `maxHeight` (px).
// function TruncatedText({
//   text,
//   maxHeight,
//   className,
//   onClick,
// }: {
//   text?: string | null;
//   maxHeight: number;
//   className?: string;
//   onClick?: () => void;
// }) {
//   const [displayText, setDisplayText] = useState<string>(text || "");
//   const [measuring, setMeasuring] = useState(true);
//   const pRef = useRef<HTMLParagraphElement | null>(null);

//   useEffect(() => {
//     setDisplayText(text || "");
//     setMeasuring(true);
//   }, [text]);

//   useEffect(() => {
//     const el = pRef.current;
//     if (!el) {
//       setMeasuring(false);
//       return;
//     }

//     const original = text || "";

//     let rafId = 0 as number;
//     let timeoutId: ReturnType<typeof setTimeout> | null = null;
//     let ro: ResizeObserver | null = null;

//     const measure = () => {
//       if (!el) return;
//       setMeasuring(true);
//       cancelAnimationFrame(rafId);
//       rafId = requestAnimationFrame(() => {
//         const fits = (candidate: string) => {
//           el.innerText = candidate;
//           return el.scrollHeight <= maxHeight - 40; // small padding for safety (updated for 5px/min)
//         };

//         if (fits(original)) {
//           setDisplayText(original);
//           setMeasuring(false);
//           return;
//         }

//         let low = 0;
//         let high = original.length;
//         let best = 0;

//         while (low <= high) {
//           const mid = Math.floor((low + high) / 2);
//           const candidate = original.slice(0, mid) + "...";
//           if (fits(candidate)) {
//             best = mid;
//             low = mid + 1;
//           } else {
//             high = mid - 1;
//           }
//         }

//         const finalText = original.slice(0, best) + "...";
//         setDisplayText(finalText);
//         setMeasuring(false);
//       });
//     };

//     // Initial measure
//     measure();

//     const scheduleMeasure = () => {
//       if (timeoutId) window.clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => measure(), 60);
//     };

//     if (typeof ResizeObserver !== "undefined") {
//       try {
//         ro = new ResizeObserver(scheduleMeasure);
//         ro.observe(el);
//       } catch (e) {
//         // fall through to window events
//         console.info("ResizeObserver failed, falling back to window events", e);
//       }
//     }

//     if (!ro) {
//       window.addEventListener("resize", scheduleMeasure);
//       window.addEventListener("orientationchange", scheduleMeasure);
//     }

//     return () => {
//       cancelAnimationFrame(rafId);
//       if (ro) ro.disconnect();
//       if (timeoutId) window.clearTimeout(timeoutId);
//       if (!ro) {
//         window.removeEventListener("resize", scheduleMeasure);
//         window.removeEventListener("orientationchange", scheduleMeasure);
//       }
//     };
//   }, [text, maxHeight]);

//   return (
//     <p
//       ref={pRef}
//       onClick={onClick}
//       className={className}
//       style={{ visibility: measuring ? "hidden" : "visible" }}
//     >
//       {displayText}
//     </p>
//   );
// }

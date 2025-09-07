"use client";

import { ScheduleItem } from "../../lib/interface";

interface ScheduleProps {
  events: ScheduleItem[];
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

// Check if two events overlap
function eventsOverlap(event1: ScheduleItem, event2: ScheduleItem): boolean {
  const start1 = timeToMinutes(event1.startTime);
  const end1 = timeToMinutes(event1.endTime);
  const start2 = timeToMinutes(event2.startTime);
  const end2 = timeToMinutes(event2.endTime);

  return start1 < end2 && start2 < end1;
}

// Calculate layout for overlapping events
function calculateEventLayout(events: ScheduleItem[]) {
  const sortedEvents = [...events].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const eventLayout = new Map<
    string,
    { column: number; totalColumns: number }
  >();
  const columns: ScheduleItem[][] = [];

  for (const event of sortedEvents) {
    // Find the first column where this event doesn't overlap with existing events
    let columnIndex = 0;
    while (columnIndex < columns.length) {
      const hasOverlap = columns[columnIndex].some((existingEvent) =>
        eventsOverlap(event, existingEvent)
      );
      if (!hasOverlap) break;
      columnIndex++;
    }

    // Create new column if needed
    if (columnIndex === columns.length) {
      columns.push([]);
    }

    columns[columnIndex].push(event);
    eventLayout.set(event.id, {
      column: columnIndex,
      totalColumns: columns.length,
    });
  }

  // Update totalColumns for all events
  eventLayout.forEach((layout) => {
    layout.totalColumns = columns.length;
  });

  return eventLayout;
}

export default function DaySchedule({ events }: ScheduleProps) {
  const eventLayout = calculateEventLayout(events);

  // Find the time range
  const startTimes = events.map((e) => timeToMinutes(e.startTime));
  const endTimes = events.map((e) => timeToMinutes(e.endTime));
  const earliestTime = Math.min(...startTimes);
  const latestTime = Math.max(...endTimes);

  // Round to nearest hour for display
  const displayStart = 8 * 60; // Start at 8:00 AM
  const displayEnd = 18 * 60; // End at 6:00 PM

  // Generate hour markers
  const hours = [];
  for (let time = displayStart; time <= displayEnd; time += 60) {
    hours.push(time);
  }

  const totalMinutes = displayEnd - displayStart;
  const pixelsPerMinute = 3; // Adjust this to change the scale

  return (
    <div className="relative w-[90vw] lg:w-[80vw] max-w-[1400px] mx-auto mt-12 bg-light-mode backdrop-blur-xs px-4 lg:px-12 py-12 lg:py-16 rounded-4xl shadow-lg">
      <div className="relative">
        {/* Time axis with absolute positioning */}
        <div className="absolute left-0 -top-4 w-16">
          {hours.map((hourMinutes, index) => (
            <div
              key={hourMinutes}
              className="absolute text-sm md:text-lg text-muted-foreground font-mono"
              style={{ top: `${index * 180}px` }}
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
              style={{ top: `${index * 180}px` }}
            />
          ))}

          {/* Events container */}
          {events.map((event) => {
            const layout = eventLayout.get(event.id)!;
            const startMinutes = timeToMinutes(event.startTime) - displayStart;
            const duration =
              timeToMinutes(event.endTime) - timeToMinutes(event.startTime);

            const top = (startMinutes / 60) * 180; // 180px per hour
            const height = Math.max(duration * pixelsPerMinute, 64); // Minimum height of 64px
            const width = `${100 / layout.totalColumns - 10}%`;
            const left = `${(layout.column * 100) / layout.totalColumns}%`;

            return (
              <div
                key={event.id}
                className={`absolute border-l-4 border-l-primary bg-light-mode shadow-md hover:shadow-md transition-shadow min-h-16 bg-card`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  width,
                  left,
                }}
              >
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

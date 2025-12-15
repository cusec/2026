import { ScheduleItem } from "./interface";

/**
 * Generates an ICS (iCalendar) file content for a schedule event
 * @param event - The schedule event to export
 * @param dayTimestamp - The numeric date timestamp in YYYYMMDD format (e.g., 20260101)
 * @returns ICS file content as string
 */
export function generateICS(event: ScheduleItem, dayTimestamp: number): string {
  // Parse the numeric timestamp (YYYYMMDD format)
  const timestampStr = dayTimestamp.toString();
  const year = timestampStr.substring(0, 4);
  const month = timestampStr.substring(4, 6);
  const day = timestampStr.substring(6, 8);
  const dateStr = `${year}${month}${day}`;

  // Parse time strings (HH:MM format)
  const [startHour, startMinute] = event.startTime.split(":");
  const [endHour, endMinute] = event.endTime.split(":");

  // Format times as HHMMSS
  const startTimeStr = `${startHour.padStart(2, "0")}${startMinute.padStart(
    2,
    "0"
  )}00`;
  const endTimeStr = `${endHour.padStart(2, "0")}${endMinute.padStart(
    2,
    "0"
  )}00`;

  // Create datetime strings (format: YYYYMMDDTHHMMSS)
  const dtStart = `${dateStr}T${startTimeStr}`;
  const dtEnd = `${dateStr}T${endTimeStr}`;

  // Generate a unique ID for the event
  const uid = `${event._id || Date.now()}@cusec.com`;

  // Current timestamp for DTSTAMP
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // Escape special characters in text fields for ICS format
  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  // Build the ICS content
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CUSEC 2026//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];

  // Add optional fields if they exist
  if (event.description) {
    icsLines.push(`DESCRIPTION:${escapeText(event.description)}`);
  }

  if (event.location) {
    icsLines.push(`LOCATION:${escapeText(event.location)}`);
  }

  // Close the event and calendar
  icsLines.push("STATUS:CONFIRMED");
  icsLines.push("SEQUENCE:0");
  icsLines.push("END:VEVENT");
  icsLines.push("END:VCALENDAR");

  // Join with CRLF (required by ICS spec)
  return icsLines.join("\r\n");
}

/**
 * Triggers a download of an ICS file for a schedule event
 * @param event - The schedule event to export
 * @param dayTimestamp - The numeric date timestamp in YYYYMMDD format (e.g., 20260101)
 */
export function downloadEventICS(
  event: ScheduleItem,
  dayTimestamp: number
): void {
  const icsContent = generateICS(event, dayTimestamp);

  // Create a blob with the ICS content
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

  // Create a download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Generate filename from event title (sanitized)
  const sanitizedTitle = event.title
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .substring(0, 50);
  link.download = `cusec_2026_${sanitizedTitle}.ics`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generates an ICS file with multiple events for an entire day
 * @param events - Array of schedule events to export
 * @param dayTimestamp - The numeric date timestamp in YYYYMMDD format (e.g., 20260101)
 * @param dayName - Human-readable day name (e.g., "Wednesday")
 * @returns ICS file content as string
 */
export function generateDayICS(
  events: ScheduleItem[],
  dayTimestamp: number,
  dayName: string
): string {
  // Parse the numeric timestamp (YYYYMMDD format)
  const timestampStr = dayTimestamp.toString();
  const year = timestampStr.substring(0, 4);
  const month = timestampStr.substring(4, 6);
  const day = timestampStr.substring(6, 8);
  const dateStr = `${year}${month}${day}`;

  // Current timestamp for DTSTAMP
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // Escape special characters in text fields for ICS format
  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  // Build the calendar header
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CUSEC 2026//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:CUSEC 2026 - ${dayName}`,
    `X-WR-TIMEZONE:America/Toronto`,
  ];

  // Add each event as a VEVENT
  events.forEach((event) => {
    // Parse time strings (HH:MM format)
    const [startHour, startMinute] = event.startTime.split(":");
    const [endHour, endMinute] = event.endTime.split(":");

    // Format times as HHMMSS
    const startTimeStr = `${startHour.padStart(2, "0")}${startMinute.padStart(
      2,
      "0"
    )}00`;
    const endTimeStr = `${endHour.padStart(2, "0")}${endMinute.padStart(
      2,
      "0"
    )}00`;

    // Create datetime strings
    const dtStart = `${dateStr}T${startTimeStr}`;
    const dtEnd = `${dateStr}T${endTimeStr}`;

    // Generate a unique ID for the event
    const uid = `${event._id || Date.now()}@cusec.com`;

    // Add event block
    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${dtstamp}`);
    icsLines.push(`DTSTART:${dtStart}`);
    icsLines.push(`DTEND:${dtEnd}`);
    icsLines.push(`SUMMARY:${escapeText(event.title)}`);

    // Add optional fields
    if (event.description) {
      icsLines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }

    if (event.location) {
      icsLines.push(`LOCATION:${escapeText(event.location)}`);
    }

    icsLines.push("STATUS:CONFIRMED");
    icsLines.push("SEQUENCE:0");
    icsLines.push("END:VEVENT");
  });

  // Close the calendar
  icsLines.push("END:VCALENDAR");

  // Join with CRLF (required by ICS spec)
  return icsLines.join("\r\n");
}

/**
 * Triggers a download of an ICS file containing all events for a day
 * @param events - Array of schedule events to export
 * @param dayTimestamp - The numeric date timestamp in YYYYMMDD format (e.g., 20260101)
 * @param dayName - Human-readable day name (e.g., "Wednesday")
 */
export function downloadDayICS(
  events: ScheduleItem[],
  dayTimestamp: number,
  dayName: string
): void {
  const icsContent = generateDayICS(events, dayTimestamp, dayName);

  // Create a blob with the ICS content
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

  // Create a download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Generate filename from day name (sanitized)
  const sanitizedDayName = dayName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  link.download = `cusec_2026_${sanitizedDayName}_schedule.ics`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

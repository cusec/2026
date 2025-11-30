import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { Day } from "@/lib/models";
import isAdmin from "@/lib/isAdmin";
import { logAdminAction } from "@/lib/adminAuditLogger";
import { auth0 } from "@/lib/auth0";

// Helper function to parse time string to minutes
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function GET() {
  await connectMongoDB();
  const days = await Day.find({});
  return NextResponse.json(days);
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get admin email
    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { dayId, event } = body;

    if (!dayId || !event) {
      return NextResponse.json(
        { error: "Missing required fields: dayId and event" },
        { status: 400 }
      );
    }

    // Validate event fields
    if (!event.startTime || !event.endTime || !event.title || !event.track) {
      return NextResponse.json(
        { error: "Event must have startTime, endTime, title, and track" },
        { status: 400 }
      );
    }

    // Validate track value
    if (!["A", "B", "C"].includes(event.track)) {
      return NextResponse.json(
        { error: "Track must be A, B, or C" },
        { status: 400 }
      );
    }

    // Validate color value if provided
    if (
      event.color &&
      !["primary", "secondary", "accent", "sunset", "sea"].includes(event.color)
    ) {
      return NextResponse.json(
        { error: "Color must be primary, secondary, accent, sunset, or sea" },
        { status: 400 }
      );
    }

    // Find the day and add the event
    const day = await Day.findById(dayId);
    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Check for overlap in the same track
    const hasOverlap = day.schedule.some(
      (existingEvent: {
        track: string;
        startTime: string;
        endTime: string;
      }) => {
        if (existingEvent.track !== event.track) return false;

        const existingStart = parseTime(existingEvent.startTime);
        const existingEnd = parseTime(existingEvent.endTime);
        const newStart = parseTime(event.startTime);
        const newEnd = parseTime(event.endTime);

        return existingStart < newEnd && newStart < existingEnd;
      }
    );

    if (hasOverlap) {
      return NextResponse.json(
        {
          error: `Track ${event.track} already has an event during this time slot. Please choose a different track or time.`,
        },
        { status: 409 }
      );
    }

    // Add the event to the schedule
    day.schedule.push(event);
    await day.save();

    // Log the admin action
    await logAdminAction({
      adminEmail,
      action: "CREATE_SCHEDULE_EVENT",
      resourceType: "scheduleItem",
      resourceId: day._id.toString(),
      details: {
        eventTitle: event.title,
        dayDate: day.date,
        startTime: event.startTime,
        endTime: event.endTime,
      },
      newData: event,
      request,
    });

    return NextResponse.json(
      { message: "Event added successfully", day },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get admin email
    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { dayId, eventId, event } = body;

    if (!dayId || !eventId || !event) {
      return NextResponse.json(
        { error: "Missing required fields: dayId, eventId, and event" },
        { status: 400 }
      );
    }

    // Validate event fields
    if (!event.startTime || !event.endTime || !event.title || !event.track) {
      return NextResponse.json(
        { error: "Event must have startTime, endTime, title, and track" },
        { status: 400 }
      );
    }

    // Validate track value
    if (!["A", "B", "C"].includes(event.track)) {
      return NextResponse.json(
        { error: "Track must be A, B, or C" },
        { status: 400 }
      );
    }

    // Validate color value if provided
    if (
      event.color &&
      !["primary", "secondary", "accent", "sunset", "sea"].includes(event.color)
    ) {
      return NextResponse.json(
        { error: "Color must be primary, secondary, accent, sunset, or sea" },
        { status: 400 }
      );
    }

    // Find the day
    const day = await Day.findById(dayId);
    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Find and update the event
    const eventIndex = day.schedule.findIndex(
      (e: { _id: { toString: () => string } }) => e._id.toString() === eventId
    );
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check for overlap in the same track (excluding the event being updated)
    const hasOverlap = day.schedule.some(
      (
        existingEvent: {
          track: string;
          startTime: string;
          endTime: string;
        },
        index: number
      ) => {
        if (index === eventIndex) return false; // Skip the event being updated
        if (existingEvent.track !== event.track) return false;

        const existingStart = parseTime(existingEvent.startTime);
        const existingEnd = parseTime(existingEvent.endTime);
        const newStart = parseTime(event.startTime);
        const newEnd = parseTime(event.endTime);

        return existingStart < newEnd && newStart < existingEnd;
      }
    );

    if (hasOverlap) {
      return NextResponse.json(
        {
          error: `Track ${event.track} already has an event during this time slot. Please choose a different track or time.`,
        },
        { status: 409 }
      );
    }

    const oldEvent = { ...day.schedule[eventIndex] };

    // Update the event
    day.schedule[eventIndex] = {
      ...day.schedule[eventIndex],
      startTime: event.startTime,
      endTime: event.endTime,
      title: event.title,
      location: event.location,
      description: event.description,
      track: event.track,
      color: event.color,
    };

    await day.save();

    // Log the admin action
    await logAdminAction({
      adminEmail,
      action: "UPDATE_SCHEDULE_EVENT",
      resourceType: "scheduleItem",
      resourceId: day._id.toString(),
      details: {
        eventTitle: event.title,
        dayDate: day.date,
        eventId,
      },
      previousData: oldEvent,
      newData: event,
      request,
    });

    return NextResponse.json(
      { message: "Event updated successfully", day },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get admin email
    const session = await auth0.getSession();
    const adminEmail = session?.user?.email || "unknown";

    await connectMongoDB();

    const body = await request.json();
    const { dayId, eventId } = body;

    if (!dayId || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields: dayId and eventId" },
        { status: 400 }
      );
    }

    // Find the day
    const day = await Day.findById(dayId);
    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Find the event index
    const eventIndex = day.schedule.findIndex(
      (e: { _id: { toString: () => string } }) => e._id.toString() === eventId
    );
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const deletedEvent = { ...day.schedule[eventIndex] };

    // Remove the event from the schedule
    day.schedule.splice(eventIndex, 1);
    await day.save();

    // Log the admin action
    await logAdminAction({
      adminEmail,
      action: "DELETE_SCHEDULE_EVENT",
      resourceType: "scheduleItem",
      resourceId: day._id.toString(),
      details: {
        eventTitle: deletedEvent.title,
        dayDate: day.date,
        eventId,
      },
      previousData: deletedEvent,
      request,
    });

    return NextResponse.json(
      { message: "Event deleted successfully", day },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

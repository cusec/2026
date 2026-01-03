"use client";

import React, { useState, useEffect } from "react";
import DaySchedule from "./DaySchedule";
import DayButton from "./DayButton";
import { Day as DayType } from "../../lib/interface";
import LeftPath from "./graphics/leftPath";
import RightPath from "./graphics/rightPath";
import ScrollToTopButton from "./ScrollToTop";

const Schedule = ({ adminUser }: { adminUser: boolean }) => {
  const [days, setDays] = useState<DayType[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single source of truth for display times (in hours, 24-hour format)
  const DISPLAY_START_HOUR = 9; // 9:00 AM
  const DISPLAY_END_HOUR = 22; // 10:00 PM

  // Hardcoded placeholder days for loading state
  const PLACEHOLDER_DAYS = [
    {
      day: "Thursday",
      date: "January 8th",
      schedule: [],
      _id: "",
      timestamp: 0,
    },
    { day: "Friday", date: "January 9th", schedule: [], _id: "", timestamp: 0 },
    {
      day: "Saturday",
      date: "January 10th",
      schedule: [],
      _id: "",
      timestamp: 0,
    },
  ];

  const fetchDays = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/schedule");
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();
      setDays(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

  const handleDayButtonClick = (index: number) => {
    setSelectedDay(index);
  };

  const handleEventChanged = () => {
    // Refresh the schedule data after adding/editing an event
    fetchDays();
  };

  const displayDays = loading ? PLACEHOLDER_DAYS : days;

  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-bold text-light-mode mb-8 pb-6 pt-6 text-center">
          SCHEDULE {adminUser ? "(Admin)" : ""}
        </h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <LeftPath />
            <RightPath />
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-42 sm:mb-6">
              {displayDays.map((day, index) => (
                <div
                  key={index}
                  className={loading ? "pointer-events-none opacity-60" : ""}
                >
                  <DayButton
                    Day={day.day}
                    Date={day.date}
                    selected={selectedDay === index}
                    onDayButtonClick={() =>
                      !loading && handleDayButtonClick(index)
                    }
                  />
                </div>
              ))}
            </div>
            {loading ? (
              <div className="relative w-full">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-light-mode"></div>
                  <p className="text-lg text-light-mode mt-4">
                    Loading schedule...
                  </p>
                </div>
                <div className="opacity-40">
                  <DaySchedule
                    events={[]}
                    displayStartHour={DISPLAY_START_HOUR}
                    displayEndHour={DISPLAY_END_HOUR}
                    isAdmin={false}
                    dayId=""
                    dayTimestamp={0}
                    dayName={PLACEHOLDER_DAYS[selectedDay].day}
                    onEventChanged={() => {}}
                  />
                </div>
              </div>
            ) : (
              days[selectedDay] && (
                <DaySchedule
                  events={days[selectedDay].schedule}
                  displayStartHour={DISPLAY_START_HOUR}
                  displayEndHour={DISPLAY_END_HOUR}
                  isAdmin={adminUser}
                  dayId={days[selectedDay]._id || ""}
                  dayTimestamp={days[selectedDay].timestamp}
                  dayName={days[selectedDay].day}
                  onEventChanged={handleEventChanged}
                />
              )
            )}
          </>
        )}
      </div>
      {/* Scroll to top arrow */}
      <ScrollToTopButton />
    </>
  );
};

export default Schedule;

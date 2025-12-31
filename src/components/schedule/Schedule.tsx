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
  const DISPLAY_START_HOUR = 8; // 8:00 AM
  const DISPLAY_END_HOUR = 23; // 11:00 PM

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

  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-bold text-light-mode mb-8 pb-6 pt-6 text-center">
          SCHEDULE {adminUser ? "(Admin)" : ""}
        </h2>
        {loading ? (
          <div className="text-lg text-light-mode">
            Scheduling CUSEC 2026...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <LeftPath />
            <RightPath />
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-42 sm:mb-6">
              {days.map((day, index) => (
                <DayButton
                  key={index}
                  Day={day.day}
                  Date={day.date}
                  selected={selectedDay === index}
                  onDayButtonClick={() => handleDayButtonClick(index)}
                />
              ))}
            </div>
            {days[selectedDay] && (
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

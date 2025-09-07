"use client";

import React, { useState } from "react";
import DaySchedule from "./DaySchedule";
import DayButton from "./DayButton";
import { ScheduleItem } from "../../lib/interface";

const days = [
  { Day: "Thursday", Date: "February 21st" },
  { Day: "Friday", Date: "February 22nd" },
  { Day: "Saturday", Date: "February 23rd" },
];

const sampleEvents: ScheduleItem[] = [
  {
    id: "1",
    startTime: "09:00",
    endTime: "10:30",
    title: "Team Meeting",
    location: "Conference Room A",
    description: "Weekly team sync and project updates",
  },
  {
    id: "2",
    startTime: "10:00",
    endTime: "11:00",
    title: "Client Call",
    location: "Zoom",
    description: "Discuss project requirements with client",
  },
  {
    id: "4",
    startTime: "14:00",
    endTime: "15:00",
    title: "Lunch Break",
    description: "Team lunch at the new restaurant",
  },
  {
    id: "5",
    startTime: "15:30",
    endTime: "16:30",
    title: "Code Review",
    description: "Review pull requests and discuss implementation",
  },
];

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  const handleDayButtonClick = (index: number) => {
    setSelectedDay(index);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-5xl md:text-7xl font-bold text-light-mode mb-2 pb-6 pt-6 text-center">
        SCHEDULE
      </h2>
      <div className="flex justify-center mb-4">
        {days.map((day, index) => (
          <DayButton
            key={index}
            Day={day.Day}
            Date={day.Date}
            selected={selectedDay === index}
            onDayButtonClick={() => handleDayButtonClick(index)}
          />
        ))}
      </div>
      <DaySchedule events={sampleEvents} />
    </div>
  );
};

export default Schedule;

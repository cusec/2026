import React from "react";
import Location from "./graphics/location";

interface DayButtonProps {
  Day: string;
  Date: string;
  selected: boolean;
  onDayButtonClick: () => void;
}

const DayButton = ({
  Day,
  Date,
  selected,
  onDayButtonClick,
}: DayButtonProps) => {
  return (
    <div>
      <button
        style={{
          opacity: selected ? 1 : 0.7,
        }}
        className="flex flex-col w-30 sm:w-40 md:w-36 items-center justify-center px-4 sm:px-8 py-5 bg-light-mode/90 rounded-lg mx-2 text-lg text-dark-mode"
        onClick={onDayButtonClick}
        title={Day}
      >
        <span className="font-bold">{Day}</span>
        <span className="text-sm">{Date}</span>
      </button>
      {selected && <Location />}
    </div>
  );
};

export default DayButton;

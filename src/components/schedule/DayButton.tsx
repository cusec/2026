import React from "react";

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
    <button
      style={{
        opacity: selected ? 1 : 0.8,
      }}
      className="flex flex-col items-center justify-center px-4 sm:px-8 py-5 bg-light-mode rounded-lg mx-2 text-lg text-dark-mode/80"
      onClick={onDayButtonClick}
      title={Day}
    >
      <span className="font-bold">{Day}</span>
      <span className="text-sm">{Date}</span>
    </button>
  );
};

export default DayButton;

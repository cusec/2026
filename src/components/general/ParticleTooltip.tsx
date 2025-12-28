"use client";

import { useEffect, useState } from "react";

interface ParticleTooltipProps {
  setIslandHovered: (isHovered: boolean) => void;
}

export default function ParticleTooltip({
  setIslandHovered,
}: ParticleTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Check if loading has completed and if it's the first visit (splashShown exists)
    const splashShown = sessionStorage.getItem("splashShown");
    const tooltipShown = sessionStorage.getItem("tooltipShown");

    // Only show tooltip if the splash screen has been shown and tooltip hasn't been shown yet
    if (splashShown && !tooltipShown) {
      // Wait a moment after loading screen disappears to show tooltip
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
        // Fade in
        setTimeout(() => {
          if (!sessionStorage.getItem("tooltipShown")) setOpacity(1);
        }, 5500);

        // Set timer to hide tooltip after 2 seconds
        const hideTimer = setTimeout(() => {
          // Fade out
          setOpacity(0);
          setTimeout(() => {
            setShowTooltip(false);
            // Mark tooltip as shown
            sessionStorage.setItem("tooltipShown", "true");
          }, 500); // Match the transition duration
        }, 9500);

        return () => clearTimeout(hideTimer);
      }, 500);

      return () => clearTimeout(tooltipTimer);
    }
  }, [setIslandHovered]);

  if (!showTooltip) return null;

  return (
    <div
      className="bg-linear-[45deg] from-[#959595]/80 from-0% via-light-mode/80 via-60% to-[#8d8d8d]/80 to-100% fixed z-30 bottom-[80px] left-1/2 transform -translate-x-1/2 px-5 py-2 backdrop-blur-sm text-dark-mode text-sm md:text-md lg:text-xl rounded-full shadow-lg shadow-black/30 transition-all duration-1000 ease-in-out"
      style={{ opacity }}
      onMouseEnter={() => setIslandHovered(true)}
      onMouseLeave={() => setIslandHovered(false)}
    >
      Toggle the ambience with one click!
    </div>
  );
}

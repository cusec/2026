"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const ParallaxCityscape: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const path = isMobile
    ? "M -1 40 C 203 48 436 34 734 41 C 997 48 1067 46 1200 40 L 1200 200 L 0 200 Z"
    : "M -1 40 C 205 61 438 20 734 41 C 999 62 1063 60 1200 40 L 1200 200 L 0 200 Z";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative z-30">
      {/* Wavy Ground/Base */}
      <div className="absolute top-[76vh]">
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="w-full h-[65vh]"
        >
          <defs>
            <linearGradient
              id="groundGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#000072" stopOpacity="1" />
              <stop offset="100%" stopColor="#6d072f" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d={path} fill="url(#groundGradient)" />
        </svg>
      </div>

      {/* Cityscape */}
      <div className="absolute top-[70vh] xl:top-[45vh] w-full">
        {/* Building 1 (Background) */}
        <div className="absolute left-0 top-[5vh] max-h-[70vh] w-[8vh] h-[20vh] xl:w-[20vh] xl:h-[50vh] -z-10 transition-transform duration-75 ease-out">
          <Image
            src="/images/building1.svg"
            alt="Building 1"
            className="object-contain"
            fill
          />
        </div>

        {/* Building 2 (Middle) */}
        <div className="absolute top-[10vh] left-[6vh] xl:left-[15vh] max-h-[60vh] w-[6vh] h-[15vh] xl:w-[18vh] xl:h-[38vh] -z-10 transition-transform duration-75 ease-out">
          <Image
            src="/images/building2.svg"
            alt="Building 2"
            className="object-contain"
            fill
          />
        </div>

        {/* Building 3 (Small) */}
        <div className="absolute hidden xl:block top-[38vh] w-[20vh] h-[11vh] -z-10 transition-transform duration-75 ease-out">
          <Image
            src="/images/building3.svg"
            alt="Building 3"
            className="object-contain"
            fill
          />
        </div>

        {/* Lighthouse (Foreground) */}
        <div className="absolute right-0 max-h-[70vh] w-[11vh] h-[25vh] xl:w-[24vh] xl:h-[55vh] -z-10 transition-transform duration-75 ease-out">
          <Image
            src="/images/lighthouse.svg"
            alt="Lighthouse"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default ParallaxCityscape;

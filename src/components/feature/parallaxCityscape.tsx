"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const ParallaxCityscape: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const path = isMobile
    ? "M -1 40 C 203 48 436 34 734 41 C 997 48 1067 46 1200 40 L 1200 200 L 0 200 Z"
    : "M -1 40 C 205 61 438 20 734 41 C 999 62 1063 60 1200 40 L 1200 200 L 0 200 Z";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };

    // Initial check
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate parallax offset - buildings move up as user scrolls down
  const building1Offset = scrollY * 1.6;
  const building2Offset = scrollY * 1.3;
  const building3Offset = scrollY * 2;
  const lighthouseOffset = scrollY * 1.7;
  const groundOffset = scrollY * 2.1; // Ground moves with buildings

  return (
    <div className="fixed bottom-0 left-0 w-full h-screen pointer-events-none z-30 overflow-hidden">
      {/* Background fill with same gradient - extends below the wavy ground */}
      <div
        className="absolute left-0 w-full h-[200vh] -z-20"
        style={{
          top: `calc(120vh - ${groundOffset}px)`,
          background: "linear-gradient(to right, #000072 0%, #6d072f 100%)",
        }}
      />

      {/* Wavy Ground/Base */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: "70vh",
          transform: `translateY(-${groundOffset}px)`,
        }}
      >
        <svg
          width="100%"
          height="300"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="w-full h-[640px] lg:h-[660px]"
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

      {/* Building 1 (Background) */}
      <div
        className="w-26 h-64 xl:w-52 xl:h-[500px] absolute bottom-20 left-0 -z-10 transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(-${building1Offset}px)`,
        }}
      >
        <Image
          src="/images/building1.svg"
          alt="Building 1"
          className="object-contain"
          fill
        />
      </div>

      {/* Building 2 (Middle) */}
      <div
        className="w-22 h-52 xl:w-46 xl:h-[380px] absolute bottom-20 left-25 xl:left-42 -z-10 transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(-${building2Offset}px)`,
        }}
      >
        <Image
          src="/images/building2.svg"
          alt="Building 2"
          className="object-contain"
          fill
        />
      </div>

      {/* Building 3 (Small) */}
      <div
        className="hidden xl:block w-52 h-[115px] absolute bottom-18 left-0 -z-10 transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(-${building3Offset}px)`,
        }}
      >
        <Image
          src="/images/building3.svg"
          alt="Building 2"
          className="object-contain"
          fill
        />
      </div>

      {/* Lighthouse (Foreground) */}
      <div
        className="w-32 h-72 xl:w-60 xl:h-[550px] absolute bottom-14 right-2 -z-10 transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(-${lighthouseOffset}px)`,
        }}
      >
        <Image
          src="/images/lighthouse.svg"
          alt="Lighthouse"
          className="object-contain"
          fill
        />
      </div>
    </div>
  );
};

export default ParallaxCityscape;

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTransform, useScroll, motion } from "framer-motion";

const ParallaxCityscape: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["center end", "end start"],
  });
  const b1 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-50%"]);
  const b2 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-70%"]);
  const b3 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-90%"]);
  const l = useTransform(scrollYProgress, [0.33, 1], ["0%", "50%"]);
  const w = useTransform(scrollYProgress, [0.33, 0.6], ["0%", "0%"]);
  const waveHeight = useTransform(
    scrollYProgress,
    [0.33, 0.6],
    ["40vh", "40vh"]
  );

  // Height transforms - scale down as they move up
  const b1Height = useTransform(scrollYProgress, [0.33, 1], [1, 1.2]);
  const b2Height = useTransform(scrollYProgress, [0.33, 1], [1, 1.3]);
  const b3Height = useTransform(scrollYProgress, [0.33, 1], [1, 1.6]);
  const lHeight = useTransform(scrollYProgress, [0.33, 1], [1, 1.7]);

  const path = isMobile
    ? "M -1 40 C 203 48 436 34 734 41 C 997 48 1067 46 1200 40 L 1200 200 L 0 200 Z"
    : "M -1 40 C 205 61 438 20 734 41 C 999 62 1063 60 1200 40 L 1200 200 L 0 200 Z";
  const wave_gradient_pull = isMobile ? "-150%" : "-40%";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="absolute w-full h-[100vh] pointer-events-none z-10 overflow-hidden"
      ref={container}
    >
      {/* Wavy Ground/Base */}
      <motion.div
        style={{
          x: w,
          height: waveHeight,
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
        className="absolute top-[80vh]"
      >
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="w-[100vw] h-full"
        >
          <defs>
            <linearGradient
              id="groundGradient"
              x1={wave_gradient_pull}
              y1="0%"
              x2="80%"
              y2="-5%"
            >
              <stop offset="0%" stopColor="#311a99" stopOpacity="1" />
              <stop offset="100%" stopColor="#6c264d" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d={path} fill="url(#groundGradient)" />
        </svg>
      </motion.div>

      {/* Cityscape */}
      <div className="hidden xxs:block absolute top-[65vh] xl:top-[42vh] w-full">
        {/* Building 1 (Background) */}
        <motion.div
          style={{ x: b1, scale: b1Height, transformOrigin: "bottom" }}
          className="absolute left-0 top-[1vh] max-h-[70vh] w-[10vh] h-[25vh] xl:w-[20vh] xl:h-[50vh] -z-10 transition-transform duration-75 ease-out"
        >
          <Image
            src="/images/building1.svg"
            alt="Building 1"
            className="object-contain"
            fill
          />
        </motion.div>

        {/* Building 2 (Middle) */}
        <motion.div
          style={{ x: b2, scale: b2Height, transformOrigin: "bottom" }}
          className="absolute top-[5vh] xl:top-[18vh] left-[8vh] xl:left-[15vh] max-h-[60vh] w-[10vh] h-[20vh] xl:w-[18vh] xl:h-[38vh] -z-10 transition-transform duration-75 ease-out"
        >
          <Image
            src="/images/building2.svg"
            alt="Building 2"
            className="object-contain"
            fill
          />
        </motion.div>

        {/* Building 3 (Small) */}
        <motion.div
          style={{ x: b3, scale: b3Height, transformOrigin: "bottom" }}
          className="absolute hidden xl:block top-[38vh] w-[20vh] h-[11vh] -z-10 transition-transform duration-75 ease-out"
        >
          <Image
            src="/images/building3.svg"
            alt="Building 3"
            className="object-contain"
            fill
          />
        </motion.div>

        {/* Lighthouse (Foreground) */}
        <motion.div
          style={{ x: l, scale: lHeight, transformOrigin: "bottom" }}
          className="absolute xl:top-0 right-8 max-h-[70vh] w-[15vh] h-[35vh] xl:w-[24vh] xl:h-[55vh] -z-10 transition-transform duration-75 ease-out"
        >
          <Image
            src="/images/lighthouse.svg"
            alt="Lighthouse"
            className="object-contain"
            fill
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxCityscape;

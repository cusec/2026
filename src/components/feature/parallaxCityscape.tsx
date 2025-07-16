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
  const b1 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-100%"]);
  const b2 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-50%"]);
  const b3 = useTransform(scrollYProgress, [0.33, 1], ["0%", "-30%"]);
  const l = useTransform(scrollYProgress, [0.33, 1], ["0%", "-110%"]);
  const w = useTransform(scrollYProgress, [0.33, 0.6], ["0%", "-70%"]);

  const path = isMobile
    ? "M -1 40 C 203 48 436 34 734 41 C 997 48 1067 46 1200 40 L 1200 200 L 0 200 Z"
    : "M -1 40 C 205 61 438 20 734 41 C 999 62 1063 60 1200 40 L 1200 200 L 0 200 Z";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    handleResize();
    scrollYProgress.onChange((latest) => {
      console.log("Scroll Progress:", latest);
    });

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute w-full h-[100vh] z-10" ref={container}>
      {/* Wavy Ground/Base */}
      <motion.div style={{ y: w }} className="absolute top-[76vh]">
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="w-full h-[80vh]"
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
      </motion.div>

      {/* Cityscape */}
      <div className="absolute top-[70vh] xl:top-[45vh] w-full">
        {/* Building 1 (Background) */}
        <motion.div
          style={{ y: b1 }}
          className="absolute left-0 top-[5vh] max-h-[70vh] w-[8vh] h-[20vh] xl:w-[20vh] xl:h-[50vh] -z-10 transition-transform duration-75 ease-out"
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
          style={{ y: b2 }}
          className="absolute top-[10vh] left-[6vh] xl:left-[15vh] max-h-[60vh] w-[6vh] h-[15vh] xl:w-[18vh] xl:h-[38vh] -z-10 transition-transform duration-75 ease-out"
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
          style={{ y: b3 }}
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
          style={{ y: l }}
          className="absolute top-[5vh] xl:top-0 right-0 max-h-[70vh] w-[11vh] h-[25vh] xl:w-[24vh] xl:h-[55vh] -z-10 transition-transform duration-75 ease-out"
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

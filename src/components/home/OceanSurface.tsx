"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useTransform, useScroll, motion } from "framer-motion";

const OceanSurface: React.FC = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["center end", "end start"],
  });
  const b = useTransform(scrollYProgress, [0.33, 1], ["0%", "80%"]);

  // Height transforms - scale down as they move up
  const bScale = useTransform(scrollYProgress, [0.33, 1], [0.8, 0.2]);

  return (
    <div
      className="absolute top-0 w-full h-[100vh] pointer-events-none z-10 "
      ref={container}
    >
      {/* Wave */}
      <div
        className="absolute left-0 -bottom-[8vw] sm:-bottom-[13vw] lg:-bottom-[18vw] w-[100vw] h-[30vw]"
        style={{
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      >
        <Image
          src="/splash/wave.svg"
          alt="Wave"
          className="object-contain"
          fill
        />
      </div>

      {/* Lighthouse & Boat */}
      <div className="absolute top-0 w-full h-full -z-10">
        {/* Lighthouse 1.3235 */}
        <motion.div className="absolute left-8 bottom-[19vw] sm:bottom-[14vw] lg:bottom-[9vw] w-[33vw] h-[25vw]">
          <Image
            src="/splash/lighthouse.svg"
            alt="Lighthouse"
            className="object-contain"
            fill
          />
        </motion.div>

        {/* Boat 0.595 */}
        <motion.div
          style={{ x: b, scale: bScale, transformOrigin: "bottom" }}
          animate={{ y: ["0vw", "-1vw", "0vw"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[11vw] bottom-[15vw] sm:bottom-[10vw] lg:bottom-[5vw] w-[20vw] h-[33.5vw]"
        >
          <Image
            src="/splash/boat.svg"
            alt="Boat"
            className="object-contain"
            fill
          />
        </motion.div>
      </div>
    </div>
  );
};

export default OceanSurface;

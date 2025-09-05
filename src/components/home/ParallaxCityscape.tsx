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
  const b = useTransform(scrollYProgress, [0.33, 1], ["0%", "80%"]);

  // Height transforms - scale down as they move up
  const bScale = useTransform(scrollYProgress, [0.33, 1], [1, 0.6]);

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
      className="absolute top-0 w-full h-[100vh] pointer-events-none z-10 x-overflow-hidden"
      ref={container}
    >
      {/* Wave */}
      <motion.div
        className="absolute left-0 -bottom-25 min-w-[1600px] min-h-[325px] w-[100vw] h-[20vw] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      >
        <Image
          src="/splash/wave.svg"
          alt="Wave"
          className="object-contain"
          fill
        />
      </motion.div>

      {/* Lighthouse & Boat */}
      <div className="hidden xxs:block absolute top-0 w-full -z-10">
        {/* Lighthouse */}
        <motion.div className="absolute left-8 top-[48vh] w-[500px] h-[375px]">
          <Image
            src="/splash/lighthouse.svg"
            alt="Lighthouse"
            className="object-contain"
            fill
          />
        </motion.div>

        {/* Boat */}
        <motion.div
          style={{ x: b, scale: bScale, transformOrigin: "bottom" }}
          className="absolute right-45 top-[35vh] w-[250px] h-[500px]"
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

export default ParallaxCityscape;

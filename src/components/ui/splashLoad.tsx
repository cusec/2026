"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// this determines the transition logic for all animations
const transitionConfig = (delay = 0) => ({
  type: "spring" as const,
  stiffness: 50,
  duration: 0.5,
  delay: delay,
});

// this determines the fade animations of content
const fadeConfig = (
  initialX = 0,
  initialY = 0,
  animateX = 0,
  animateY = 0
) => ({
  initial: { x: `${initialX}vw`, y: `${initialY}vw`, opacity: 0 },
  animate: {
    x: `${animateX}vw`,
    y: `${animateY}vw`,
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: { duration: 1.5 },
  },
});

export default function SplashLoad({ onComplete }: { onComplete: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //removes splashpage loading from DOM after animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.main
        className={`flex items-center justify-center text-light-mode/80 flex-col h-screen !overflow-hidden px-4`}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center h-auto sm:h-[150px] w-full mx-auto gap-8 sm:gap-[14px] max-w-4xl">
          {/* LEFT SIDE / TOP ON MOBILE */}
          <div className="w-full sm:w-[44.5%] flex flex-col sm:flex-row justify-center sm:justify-end items-center flex-grow gap-4 sm:gap-1 px-2 sm:px-5">
            <motion.div
              id="logo"
              {...fadeConfig(20, 0, 0, 0)}
              transition={transitionConfig(0)}
            >
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: isMobile ? "0%" : "50%" }}
                transition={transitionConfig(1.05)}
              >
                <Image
                  className="bobbing-animation w-12 h-12 sm:w-[75px] sm:h-[75px] max-w-[250px] max-h-[250px]"
                  src="/images/logo.svg"
                  alt="2026 logo main"
                  width={1080}
                  height={1080}
                  priority
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center mt-4 sm:mt-0"
              {...fadeConfig(0, 50, 0, 0)}
              transition={transitionConfig(0.1)}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: isMobile ? "30vh" : "50vw", opacity: 0 }}
                transition={transitionConfig(1)}
              >
                <h2 className="text-2xl sm:text-[40px] font-bold leading-[80%] bobbing-animation mb-1">
                  CUSEC
                </h2>
                <h2 className="text-2xl sm:text-[40px] font-bold leading-[80%] bobbing-animation">
                  2026
                </h2>
              </motion.div>
            </motion.div>
          </div>
          {/* MIDDLE DIVIDER - HIDDEN ON MOBILE */}
          <motion.div
            className="hidden sm:block w-[1%] max-w-[2px] h-3/5"
            {...fadeConfig(0, -10, 0, 0)}
            transition={transitionConfig(0.2)}
          >
            <motion.div
              className="h-full w-full bg-white"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: "-50vw", opacity: 0 }}
              transition={transitionConfig(1.1)}
            ></motion.div>
          </motion.div>
          {/* RIGHT / BOTTOM ON MOBILE */}
          <motion.div
            className="w-full sm:w-[44.5%] flex flex-grow px-2 sm:px-5 justify-center mt-6 sm:mt-0"
            {...fadeConfig(0, 50, 0, 0)}
            transition={transitionConfig(0.3)}
          >
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: isMobile ? "30vh" : "50vw", opacity: 0 }}
              transition={transitionConfig(1.2)}
            >
              <p className="textFont text-xs sm:text-base font-extrabold bobbing-animation max-w-xs sm:max-w-none leading-relaxed">
                Canadian University Software Engineering Conference
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* LOADING ANIMATION */}
        <motion.div
          className={`absolute flex flex-row items-baseline justify-center h-auto gap-1 sm:gap-2 mt-8 sm:mt-0`}
          {...fadeConfig(5, 10, 5, 0)}
          transition={transitionConfig(1.3)}
        >
          <p className="textFont text-xl sm:text-4xl font-extrabold animate-bounce duration-1">
            Loading
          </p>
          <div className="flex justify-center items-center gap-1 sm:gap-3 font-bold">
            <span className="block w-[0.3vh] h-[0.3vh] sm:w-[0.5vh] sm:h-[0.5vh] bg-[#494882] rounded-2xl bouncing-animation" />
            <span className="block w-[0.3vh] h-[0.3vh] sm:w-[0.5vh] sm:h-[0.5vh] bg-[#494882] rounded-2xl bouncing-animation delay-1" />
            <span className="block w-[0.3vh] h-[0.3vh] sm:w-[0.5vh] sm:h-[0.5vh] bg-[#494882] rounded-2xl bouncing-animation delay-2" />
          </div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}

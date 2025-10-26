"use client";

import { Speaker } from "@/lib/interface";
import Socials from "./Socials";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecondarySpeaker({
  key,
  speaker,
}: {
  key: number;
  speaker: Speaker;
}) {
  const [showBio, setShowBio] = useState(false);
  return (
    <div
      key={key}
      className="flex flex-col items-center justify-between w-full sm:min-w-[45%] sm:max-w-[45%] xl:min-w-[28%] xl:max-w-[28%] py-12 text-dark-mode rounded-xl border-1 border-light-mode/70 bg-light-mode/50 transition-all duration-300 ease-in-out hover:bg-light-mode/65 group"
    >
      <div className="w-full min-h-[270px] px-4 mb-4 flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {!showBio ? (
            /* Basic info display with image */
            <motion.div
              key="basic-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full"
            >
              <div className="mb-4 min-w-[16vw] max-w-[16vw] min-h-[16vw] max-h-[16vw] md:min-w-[8vw] md:max-w-[8vw] md:min-h-[8vw] md:max-h-[8vw] relative overflow-hidden rounded-xl">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="rounded-xl transition-transform duration-500 ease-out group-hover:scale-102"
                />
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-lg md:text-xl xl:text-2xl">
                  {speaker.name}
                </h2>
                <h2 className="text-md md:text-md xl:text-lg">
                  ({speaker.pronouns})
                </h2>
              </div>
              <p className="text-sm md:text-md xl:text-md mt-2">
                {speaker.title}
              </p>
              <div className="text-dark-mode mt-3">
                <Socials speaker={speaker} variant="dark" />
              </div>
            </motion.div>
          ) : (
            /* Bio display */
            <motion.div
              key="bio-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center text-center p-4"
            >
              <p className="text-sm md:text-md overflow-auto max-h-[250px]">
                {speaker.bio}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={() => setShowBio(!showBio)}
        className="border-2 border-dark-mode rounded-full py-2 px-4 hover:bg-dark-mode hover:text-light-mode"
        whileHover={{ scale: 1.0 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 800, damping: 17 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={showBio ? "show-less" : "learn-more"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            {showBio ? "Show Less" : "Learn More"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

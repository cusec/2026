"use client";

import { Speaker } from "@/lib/interface";
import Socials from "./Socials";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/modal";

export default function PrimarySpeaker({
  key,
  speaker,
}: {
  key: number;
  speaker: Speaker;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_LENGTH = 300; // Characters to show before truncating
  const shouldTruncate = speaker.bio.length > MAX_LENGTH;
  const displayBio =
    !isExpanded && shouldTruncate
      ? speaker.bio.slice(0, MAX_LENGTH) + "..."
      : speaker.bio;

  return (
    <div
      key={key}
      className="flex flex-col sm:flex-row w-full gap-2 md:gap-5 mb-[2vh] text-light-mode z-30 backdrop-blur-sm"
    >
      <div className="min-w-[80vw] max-w-[80vw] min-h-[80vw] max-h-[80vw] xs:min-w-[35vw] xs:max-w-[35vw] xs:min-h-[35vw] xs:max-h-[35vw] md:min-w-[18vw] md:max-w-[18vw] md:min-h-[18vw] md:max-h-[18vw] relative overflow-hidden rounded-xl group">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="w-full flex flex-col justify-between rounded-xl border border-light-mode/50 bg-light-mode/15 p-5 transition-all duration-300 ease-in-out hover:bg-light-mode/20 group">
        <div>
          <div className="flex flex-col md:flex-row items-baseline">
            <h2 className="text-3xl md:text-5xl mb-2">{speaker.name}</h2>
            <h2 className="text-xl md:text-2xl mb-2 md:ml-3">
              ({speaker.pronouns})
            </h2>
          </div>
          <p className="text-xl md:text-2xl mb-6">
            {speaker.title}
            {speaker.talkTitle && (
              <>
                {speaker.title && <> | </>}
                {speaker.talkDescription ? (
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="underline hover:text-dark-mode transition-colors duration-200 cursor-pointer"
                  >
                    {speaker.talkTitle}
                  </span>
                ) : (
                  <span>{speaker.talkTitle}</span>
                )}
              </>
            )}
          </p>
          <div className="text-lg md:text-xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {displayBio}
              </motion.p>
            </AnimatePresence>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 mt-2 text-light-mode/80 hover:text-light-mode transition-colors duration-200 underline"
              >
                {isExpanded ? (
                  <>
                    Show Less
                    <motion.svg
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </>
                ) : (
                  <>
                    Read More
                    <motion.svg
                      initial={{ rotate: 180 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="">
          <Socials speaker={speaker} />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={speaker.talkTitle}
        className="mx-4 max-w-[80vw] md:max-w-2xl bg-dark-mode/90 text-light-mode rounded-2xl"
      >
        <p className="text-light-mode/90 whitespace-pre-wrap leading-relaxed">
          {speaker.talkDescription || "No description available."}
        </p>
      </Modal>
    </div>
  );
}

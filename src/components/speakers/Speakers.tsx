"use client";

import { useState } from "react";
import { Speaker } from "@/lib/interface";
import speakers from "./speakerData.json";
import PrimarySpeaker from "./PrimarySpeaker";
import SecondarySpeaker from "./SecondarySpeaker";
import Modal from "@/components/ui/modal";

export default function Speakers() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const handleTalkClick = (title: string, description: string) => {
    setModalContent({ title, description });
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <div className="mx-[10vw] lg:mx-[12vw] mt-[15vh] text-light-mode">
      <h1 className="text-3xl md:text-5xl pb-4 mb-6 md:mb-12 w-fit border-b border-light-mode/70">
        The 2026 Speakers
      </h1>
      <div className="flex flex-col gap-10 mb-[5vh]">
        {speakers["primarySpeakers"].map((speaker: Speaker, index: number) => (
          <PrimarySpeaker
            key={index}
            speaker={speaker}
            onTalkClick={handleTalkClick}
          />
        ))}
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        {speakers["secondarySpeakers"].map(
          (speaker: Speaker, index: number) => (
            <SecondarySpeaker
              key={index}
              speaker={speaker}
              onTalkClick={handleTalkClick}
            />
          )
        )}
      </div>

      <Modal
        isOpen={modalContent !== null}
        onClose={handleCloseModal}
        title={modalContent?.title || "Talk Details"}
        className="mx-4 max-w-[80vw] md:max-w-2xl bg-dark-mode/90 text-light-mode rounded-2xl overflow-y-hidden"
      >
        <p className="text-light-mode/90 whitespace-pre-wrap leading-relaxed overflow-y-scroll max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh]">
          {modalContent?.description || "No description available."}
        </p>
      </Modal>
    </div>
  );
}

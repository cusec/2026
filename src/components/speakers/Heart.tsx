import { Speaker } from "@/lib/interface";
import speakers from "./speakerData.json";
import PrimarySpeaker from "./PrimarySpeaker";
import SecondarySpeaker from "./SecondarySpeaker";

export default function Heart() {
  return (
    <div className="mx-[10vw] lg:mx-[15vw] mt-[15vh] text-light-mode">
      <h1 className="text-3xl md:text-5xl pb-4 mb-6 md:mb-12 w-fit border-b border-light-mode/70">
        The Heart
      </h1>
      <div className="flex flex-col gap-10 mb-[5vh]">
        {speakers["primarySpeakers"].map((speaker: Speaker, index: number) => (
          <PrimarySpeaker key={index} speaker={speaker} />
        ))}
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        {speakers["secondarySpeakers"].map(
          (speaker: Speaker, index: number) => (
            <SecondarySpeaker key={index} speaker={speaker} />
          )
        )}
      </div>
    </div>
  );
}

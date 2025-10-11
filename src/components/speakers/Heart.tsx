import { Speaker } from "@/lib/interface";
import speakers from "./speakerData.json";
import MajorSpeaker from "./MajorSpeaker";

export default function Heart() {
  return (
    <div className="mx-[10vw] lg:mx-[20vw] mt-[15vh] text-light-mode">
      <h1 className="text-2xl md:text-5xl pb-4 mb-8 md:mb-14 w-fit">
        The Heart
      </h1>
      <div className="flex flex-col gap-10">
        {speakers["majorSpeakers"].map((speaker: Speaker, index: number) => (
          <MajorSpeaker key={index} speaker={speaker} />
        ))}
      </div>
    </div>
  );
}

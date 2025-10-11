import { Speaker } from "@/lib/interface";
import Image from "next/image";

export default function MajorSpeaker({
  key,
  speaker,
}: {
  key: number;
  speaker: Speaker;
}) {
  return (
    <div
      key={key}
      className="flex w-full h-[18vw] gap-5 mt-[5vh] text-light-mode"
    >
      <div className="w-[23vw] h-full relative">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="rounded-xl"
        />
      </div>
      <div className="w-full rounded-xl border-1 border-light-mode/50 bg-light-mode/15 p-5">
        <div className="flex items-baseline">
          <h2 className="text-3xl md:text-5xl mb-2">{speaker.name}</h2>
          <h2 className="text-xl md:text-2xl mb-2 ml-3">
            ({speaker.pronouns})
          </h2>
        </div>
        <p className="text-xl md:text-2xl mb-6">{speaker.title}</p>
        <p className="text-lg md:text-xl">{speaker.bio}</p>
      </div>
    </div>
  );
}

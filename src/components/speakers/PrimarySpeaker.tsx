import { Speaker } from "@/lib/interface";
import Socials from "./Socials";
import Image from "next/image";

export default function PrimarySpeaker({
  key,
  speaker,
}: {
  key: number;
  speaker: Speaker;
}) {
  return (
    <div
      key={key}
      className="flex flex-col sm:flex-row w-full gap-2 md:gap-5 mb-[2vh] text-light-mode"
    >
      <div className="min-w-[80vw] max-w-[80vw] min-h-[80vw] max-h-[80vw] xs:min-w-[35vw] xs:max-w-[35vw] xs:min-h-[35vw] xs:max-h-[35vw] md:min-w-[18vw] md:max-w-[18vw] md:min-h-[18vw] md:max-h-[18vw] relative overflow-hidden rounded-xl group">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="w-full flex flex-col justify-between rounded-xl border-1 border-light-mode/50 bg-light-mode/15 p-5 transition-all duration-300 ease-in-out hover:bg-light-mode/20 group">
        <div>
          <div className="flex flex-col md:flex-row items-baseline">
            <h2 className="text-3xl md:text-5xl mb-2">{speaker.name}</h2>
            <h2 className="text-xl md:text-2xl mb-2 md:ml-3">
              ({speaker.pronouns})
            </h2>
          </div>
          <p className="text-xl md:text-2xl mb-6">{speaker.title}</p>
          <p className="text-lg md:text-xl">{speaker.bio}</p>
        </div>
        <div className="">
          <Socials speaker={speaker} />
        </div>
      </div>
    </div>
  );
}

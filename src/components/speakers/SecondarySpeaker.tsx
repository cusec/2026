import { Speaker } from "@/lib/interface";
import Socials from "./Socials";
import Image from "next/image";

export default function SecondarySpeaker({
  key,
  speaker,
}: {
  key: number;
  speaker: Speaker;
}) {
  return (
    <div
      key={key}
      className="flex flex-col items-center justify-center w-full sm:min-w-[45%] sm:max-w-[45%] xl:min-w-[28%] xl:max-w-[28%] py-12 gap-3 text-dark-mode rounded-xl border-1 border-light-mode/70 bg-light-mode/50 transition-all duration-300 ease-in-out hover:bg-light-mode/65 group"
    >
      <div className="mb-4 min-w-[16vw] max-w-[16vw] min-h-[16vw] max-h-[16vw] md:min-w-[8vw] md:max-w-[8vw] md:min-h-[8vw] md:max-h-[8vw] relative overflow-hidden rounded-xl">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl xl:text-2xl">{speaker.name}</h2>
        <h2 className="text-md md:text-md xl:text-lg">({speaker.pronouns})</h2>
      </div>
      <p className="text-sm md:text-md xl:text-lg">{speaker.title}</p>
      <div className="text-dark-mode">
        <Socials speaker={speaker} variant="dark" />
      </div>

      <button className="border-2 border-dark-mode rounded-full py-2 px-4">
        Learn More
      </button>
    </div>
  );
}

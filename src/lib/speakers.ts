import { Speaker } from "@/lib/interface";
import speakerData from "@/components/speakers/speakerData.json";

export type SpeakerTier = "primary" | "secondary";

export function speakerSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function allSpeakers(): { speaker: Speaker; tier: SpeakerTier }[] {
  return [
    ...speakerData.primarySpeakers.map((speaker: Speaker) => ({
      speaker,
      tier: "primary" as const,
    })),
    ...speakerData.secondarySpeakers.map((speaker: Speaker) => ({
      speaker,
      tier: "secondary" as const,
    })),
  ];
}

export function findSpeaker(slug: string) {
  return allSpeakers().find(({ speaker }) => speakerSlug(speaker.name) === slug);
}

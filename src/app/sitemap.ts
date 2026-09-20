import type { MetadataRoute } from "next";
import { allSpeakers, speakerSlug } from "@/lib/speakers";

const BASE_URL = "https://2026.cusec.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-01-10");

  return [
    { url: BASE_URL, priority: 0.8 },
    { url: `${BASE_URL}/speakers`, priority: 0.5 },
    ...allSpeakers().map(({ speaker }) => ({
      url: `${BASE_URL}/speakers/${speakerSlug(speaker.name)}`,
      priority: 0.4,
    })),
    { url: `${BASE_URL}/schedule`, priority: 0.5 },
    { url: `${BASE_URL}/team`, priority: 0.5 },
    { url: `${BASE_URL}/code-of-conduct`, priority: 0.2 },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.2 },
  ].map((entry) => ({ ...entry, lastModified, changeFrequency: "yearly" }));
}

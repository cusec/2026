import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Particles, Navbar, SmoothFollower, Footer } from "@/components";
import Socials from "@/components/speakers/Socials";
import { allSpeakers, findSpeaker, speakerSlug } from "@/lib/speakers";

export function generateStaticParams() {
  return allSpeakers().map(({ speaker }) => ({
    slug: speakerSlug(speaker.name),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findSpeaker(slug);
  if (!found) return {};

  const { speaker } = found;
  const description = speaker.talkTitle
    ? `${speaker.name} spoke on "${speaker.talkTitle}" at CUSEC 2026, the 25th Canadian University Software Engineering Conference.`
    : `${speaker.name} spoke at CUSEC 2026, the 25th Canadian University Software Engineering Conference.`;

  return {
    title: `${speaker.name} | CUSEC 2026 Speakers`,
    description,
    openGraph: {
      title: `${speaker.name} at CUSEC 2026`,
      description,
      images: [{ url: speaker.image, alt: speaker.name }],
    },
  };
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findSpeaker(slug);
  if (!found) notFound();

  const { speaker } = found;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: speaker.name,
    image: `https://2026.cusec.net${speaker.image}`,
    ...(speaker.title ? { jobTitle: speaker.title } : {}),
    ...(speaker.socials?.website ? { url: speaker.socials.website } : {}),
    sameAs: Object.values(speaker.socials ?? {}).filter(Boolean),
    performerIn: {
      "@type": "Event",
      "@id": "https://2026.cusec.net/#event",
      name: "CUSEC 2026",
      url: "https://2026.cusec.net",
    },
  };

  return (
    <div className="relative bg-linear-[35deg] overflow-x-hidden from-dark-mode from-0% via-primary via-55% to-accent to-140% bg-cover bg-center h-full">
      <div className="bg-linear-[15deg] from-accent/20 from-0% via-primary/0 via-55% to-accent/0 to-100%">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Particles />
        <Navbar />
        <SmoothFollower />
        <main className="mx-[8vw] lg:mx-[12vw] min-h-screen pt-[20vh] pb-[10vh] text-light-mode">
          <Link
            href="/speakers"
            className="text-light-mode/70 hover:text-light-mode transition-colors duration-200"
          >
            &larr; All CUSEC 2026 speakers
          </Link>

          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="relative w-full md:w-[22vw] aspect-square shrink-0 overflow-hidden rounded-xl">
              <Image
                src={speaker.image}
                alt={`${speaker.name}, speaker at CUSEC 2026`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 22vw"
                className="object-cover rounded-xl"
              />
            </div>

            <div className="flex flex-col rounded-xl border border-light-mode/50 bg-light-mode/15 p-6">
              <div className="flex flex-col md:flex-row items-baseline">
                <h1 className="text-4xl md:text-5xl mb-2">{speaker.name}</h1>
                {speaker.pronouns && (
                  <h2 className="text-xl md:text-2xl mb-2 md:ml-3">
                    ({speaker.pronouns})
                  </h2>
                )}
              </div>
              {speaker.title && (
                <p className="text-xl md:text-2xl mb-6">{speaker.title}</p>
              )}
              <p className="text-lg md:text-xl whitespace-pre-wrap">
                {speaker.bio}
              </p>
              <Socials speaker={speaker} />
            </div>
          </div>

          {speaker.talkTitle && (
            <section className="mt-10 rounded-xl border border-light-mode/50 bg-light-mode/15 p-6">
              <h2 className="text-2xl md:text-3xl mb-4">
                {speaker.talkTitle}
              </h2>
              {speaker.talkDescription && (
                <p className="text-lg md:text-xl whitespace-pre-wrap">
                  {speaker.talkDescription}
                </p>
              )}
            </section>
          )}

          <p className="mt-10 text-lg text-light-mode/80">
            CUSEC 2026 was held January 8&ndash;10, 2026. The next edition is{" "}
            <a
              href="https://2027.cusec.net"
              className="underline underline-offset-4 decoration-secondary"
            >
              CUSEC 2027
            </a>
            .
          </p>
        </main>
        <Footer />
      </div>
    </div>
  );
}

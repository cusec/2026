"use client";

import { TeamMember } from "@/lib/interface";
import Image from "next/image";

export default function Member({
  key,
  member,
}: {
  key: number;
  member: TeamMember;
}) {
  // Calculate social media icon positions around the circle
  const socialEntries = member.socials
    ? Object.entries(member.socials).filter(([, url]) => url)
    : [];

  // Function to get position for social icons around the profile picture
  const getSocialPosition = (index: number) => {
    const angleStep = 50; // Spread evenly from left (270°) to bottom (270°)
    const angle = (315 - angleStep * index) * (Math.PI / 270); // Start from left (270°), go counter-clockwise
    const radius = 70; // Distance from center (half of image width + some padding)
    return {
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    };
  };

  return (
    <div
      key={key}
      className="mb-2 relative flex flex-col items-center justify-between w-full h-[450px] xs:w-[275px] xs:h-[400px] sm:w-[330px] sm:h-[470px] pt-6 pb-12 rounded-xl border-1 border-light-mode/70 bg-light-mode/40 overflow-hidden group"
    >
      {/* Gradient overlay - fades in on hover */}
      <div className="absolute inset-0 rounded-xl bg-linear-[215deg] from-sunset/30 to-secondary/30 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 z-0" />

      {/* Image - positioned absolutely, moves to top-right on hover */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-[180px] h-[180px] xs:w-[150px] xs:h-[150px] sm:w-[200px] sm:h-[200px] transition-all duration-500 ease-out group-hover:w-[120px] group-hover:h-[120px] group-hover:left-[calc(100%-135px)] group-hover:top-4 group-hover:-translate-x-0 z-10">
        <div className="relative w-full h-full overflow-hidden rounded-full">
          <Image
            src={member.primaryImage}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        {/* School logo - positioned at top-left, outside the circular container */}
        <div className="absolute top-2 left-2 w-10 h-10 xs:w-8 xs:h-8 z-20 transition-all duration-500 group-hover:scale-60 group-hover:top-0 group-hover:left-0">
          <div className="relative w-full h-full">
            <Image
              src={member.education.logo}
              alt={member.education.institution}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Social media icons - circle around the profile picture on hover (hidden on mobile) */}
        {socialEntries.map(([key, url], index) => {
          const position = getSocialPosition(index);
          // Only render icons for linkedin, website, and github
          if (!["linkedin", "website", "github"].includes(key)) return null;

          return (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 z-20 hover:scale-105"
              style={position}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/icons/team_socials/${key}.svg`}
                  alt={key}
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* Content container */}
      <div className="w-full h-full px-4 flex flex-col items-center justify-start pt-[220px] xs:pt-[190px] sm:pt-[240px]">
        {/* Basic info - hidden on hover */}
        <div className="flex flex-col items-center text-light-mode transition-opacity duration-300 ease-in-out group-hover:opacity-0">
          <h2 className="text-lg md:text-xl xl:text-3xl">{member.name}</h2>
          <h2 className="text-md md:text-md xl:text-lg text-light-mode/80">
            ({member.pronouns})
          </h2>
          <p className="text-sm md:text-md xl:text-2xl mt-2">
            {member.professionalTitle}
          </p>
        </div>

        {/* Hover content - visible only on hover */}
        <div className="absolute inset-0 px-6 pt-10 flex flex-col text-light-mode opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 pointer-events-none z-20">
          {/* Name and Pronouns */}
          <h2 className="text-md sm:text-2xl font-semibold mb-2">
            {member.name}
          </h2>
          <p className="text-sm text-light-mode/80 mb-2">({member.pronouns})</p>

          {/* Professional Title */}
          <p className="text-sm sm:text-xl mb-6">{member.professionalTitle}</p>

          <div className="w-full h-px bg-light-mode/70 mb-6"></div>

          {/* Education Info */}
          <div className="mb-4">
            <p className="text-md sm:text-2xl">{member.education.major}</p>
            <p className="text-md sm:text-xl font-semibold text-dark-mode">
              @{member.education.institution.toLowerCase().replace(/\s+/g, "")}
            </p>
          </div>

          {/* Info Section */}
          <div className="border-b border-light-mode/80 w-fit mb-4">
            <h3 className="text-md sm:text-2xl font-semibold">
              {member.infoTitle}:
            </h3>
          </div>
          <p className="text-sm sm:text-xl leading-relaxed">
            {member.infoDescription}
          </p>
        </div>

        {/* Mobile social links - displayed at bottom on sm and under */}
        <div className="absolute bottom-4 left-0 right-0 flex sm:hidden items-center gap-3 px-4 z-30 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {socialEntries
            .filter(([key]) => ["linkedin", "website", "github"].includes(key))
            .map(([key, url]) => (
              <a
                key={key}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`/icons/team_socials/${key}.svg`}
                    alt={key}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

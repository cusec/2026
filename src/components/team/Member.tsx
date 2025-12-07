"use client";

import { TeamMember } from "@/lib/interface";
import Image from "next/image";
import { useState } from "react";

// Supported social media platforms (those with icons in /public/icons/team_socials/)
const SUPPORTED_SOCIALS = ["website", "linkedin", "x", "github", "instagram"];

export default function Member({
  key,
  member,
  isHovered,
  hasAnyHover,
  onHoverChange,
}: {
  key: number;
  member: TeamMember;
  isHovered: boolean;
  hasAnyHover: boolean;
  onHoverChange: (isHovering: boolean) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  // Filter social entries to only include supported platforms with valid URLs
  const socialEntries = member.socials
    ? Object.entries(member.socials).filter(
        ([key, url]) => url && SUPPORTED_SOCIALS.includes(key)
      )
    : [];

  // Function to get position for social icons around the profile picture
  const getSocialPosition = (index: number) => {
    const angleStep = 55; // Spread evenly from left (270°) to bottom (270°)
    const angle = (280 - angleStep * index) * (Math.PI / 270); // Start from left (270°), go counter-clockwise
    const radius = 65; // Distance from center (half of image width + some padding)
    return {
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    };
  };

  return (
    <div
      key={key}
      onClick={() => setIsActive(!isActive)}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`mb-2 z-30 backdrop-blur-sm relative flex flex-col items-center justify-between w-full h-[470px] xs:w-[325px] xs:h-[470px] sm:w-[350px] sm:h-[470px] pt-6 pb-12 rounded-xl border border-light-mode/70 bg-light-mode/20 lg:hover:bg-light-mode/10 transition-all duration-200 ease-in-out overflow-hidden group lg:cursor-default cursor-pointer ${
        isActive ? "active" : ""
      } ${hasAnyHover && !isHovered ? "opacity-70" : ""}`}
    >
      {/* Gradient overlay - fades in on hover or active state */}
      <div className="absolute inset-0 rounded-xl bg-linear-[215deg] from-sunset/40 to-secondary/40 opacity-0 transition-opacity duration-500 ease-in-out lg:group-hover:opacity-55 group-[.active]:opacity-55 z-0" />

      {/* Image - positioned absolutely, moves to top-right on hover or active state */}
      <div className="absolute left-1/2 top-12 sm:top-8 -translate-x-1/2 w-[170px] h-[170px] xs:w-[185px] xs:h-[185px] sm:w-[200px] sm:h-[200px] transition-all duration-500 ease-out lg:group-hover:w-[120px] lg:group-hover:h-[120px] lg:group-hover:left-[calc(100%-135px)] lg:group-hover:top-4 lg:group-hover:translate-x-0 group-[.active]:w-[110px] group-[.active]:h-[110px] group-[.active]:left-[calc(100%-135px)] group-[.active]:top-4 group-[.active]:translate-x-0 z-10">
        <div className="relative w-full h-full overflow-hidden rounded-full transition-shadow duration-300 ease-in-out group-[.active]:ring-1 group-[.active]:ring-light-mode/20 group-[.active]:ring-offset-2">
          <Image
            src={member.primaryImage}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        {/* School logo - positioned at top-left, outside the circular container */}
        <div className="absolute top-2 left-2 w-10 h-10 z-20 transition-all duration-500 lg:group-hover:scale-60 lg:group-hover:top-0 lg:group-hover:left-0 group-[.active]:scale-60 group-[.active]:-top-1 group-[.active]:-left-1 sm:group-[.active]:top-0 sm:group-[.active]:left-0">
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

          return (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:block absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 lg:group-hover:opacity-100 z-20 hover:scale-105 group-[.active]:opacity-100"
              style={position}
            >
              <div className="relative w-full h-full rounded-full backdrop-blur-md bg-accent/10">
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
      <div className="w-full h-full px-4 flex flex-col items-center justify-start pt-[220px] xs:pt-[240px]">
        {/* Basic info - hidden on hover or active state */}
        <div className="flex flex-col items-center text-center text-light-mode transition-opacity duration-300 ease-in-out lg:group-hover:opacity-0 group-[.active]:opacity-0">
          <h2 className="text-lg xs:text-2xl xl:text-3xl">{member.name}</h2>
          <h2 className="text-md md:text-md xl:text-lg text-light-mode/80 mb-6">
            ({member.pronouns})
          </h2>
          <p className="text-sm xs:text-lg xl:text-lg">{member.teamRole}</p>
        </div>

        {/* Hover content - visible only on hover (lg+) or active state (all sizes) */}
        <div className="absolute inset-0 px-6 pt-10 flex flex-col text-light-mode opacity-0 transition-opacity duration-300 ease-in-out lg:group-hover:opacity-100 group-[.active]:opacity-100 pointer-events-none z-20">
          {/* Name and Pronouns */}
          <h2 className="text-md sm:text-2xl font-semibold mb-2 max-w-[170px]">
            {member.name}
          </h2>
          <p className="text-sm text-light-mode/80 mb-2">({member.pronouns})</p>

          {/* Professional Title */}
          <p className="text-sm sm:text-lg max-w-[180px]">
            {member.professionalTitle}
          </p>

          <div className="w-full min-h-px bg-light-mode/70 mt-4 mb-2"></div>

          {/* Education Info */}
          <div className="">
            <p className="text-md sm:text-xl font-semibold">
              {member.education.major}
            </p>
            <p className="text-md sm:text-md font-semibold bg-linear-[3deg] from-dark-mode/30 -from-20% via-light-mode/90 via-30% to-sunset/30 to-120% bg-clip-text text-transparent">
              @ {member.education.institution}
            </p>
          </div>

          <div className="w-full min-h-px bg-light-mode/70 mt-2 mb-4"></div>

          {/* Info Section */}
          <h3 className="text-md sm:text-xl mb-2 font-semibold">
            {member.infoTitle}
          </h3>
          <p className="text-sm sm:text-lg leading-relaxed">
            {member.infoDescription}
          </p>
        </div>

        {/* Mobile social links - displayed at bottom on sm and under */}
        <div className="absolute bottom-4 left-2 right-0 flex sm:hidden items-center justify-start gap-3 px-4 z-20 opacity-0 transition-all duration-300 lg:group-hover:opacity-100 group-[.active]:opacity-100">
          {socialEntries.map(([key, url]) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8"
            >
              <div className="relative w-full h-full rounded-full backdrop-blur-md bg-accent/10">
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

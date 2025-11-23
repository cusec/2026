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
  return (
    <div
      key={key}
      className="mb-2 relative flex flex-col items-center justify-between w-full h-[450px] xs:w-[200px] xs:h-[400px] sm:w-[300px] sm:h-[470px] pt-6 pb-12 rounded-xl border-1 border-light-mode/70 bg-light-mode/40 overflow-hidden group"
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
      </div>
    </div>
  );
}

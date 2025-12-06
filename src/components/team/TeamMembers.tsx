"use client";

import { TeamMember } from "@/lib/interface";
import members from "./teamMembersData.json";
import Member from "./Member";
import { useState } from "react";

export default function TeamMembers() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mx-[10vw] lg:mx-[12vw] mt-[15vh] text-light-mode">
      <h1 className="text-3xl md:text-5xl pb-4 mb-[5vh] border-b w-fit border-light-mode/70">
        The 2026 Team
      </h1>
      <div className="flex gap-4 flex-wrap justify-evenly">
        {members.map((member: TeamMember, index: number) => (
          <Member
            key={index}
            member={member}
            isHovered={hoveredIndex === index}
            hasAnyHover={hoveredIndex !== null}
            onHoverChange={(isHovering: boolean) =>
              setHoveredIndex(isHovering ? index : null)
            }
          />
        ))}
      </div>
    </div>
  );
}

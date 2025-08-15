"use client";

import React from "react";
import Image from "next/image";
import { Stat } from "@/lib/interface";

const statData: Stat[] = [
  {
    id: "attendees",
    name: "1000+ Attendees",
    content: <span>1000+ Attendees</span>,
    image: "/icons/stat.svg",
    position: { x: "-1vw", y: "5vh" },
    size: { width: "32vw", height: "16vh" },
  },
];

const Stats: React.FC = () => {
  return (
    <div className="hidden md:block relative">
      {statData.map((stat) => {
        return (
          <div
            key={stat.id}
            className="absolute hover:scale-105 transition-transform duration-300"
            style={{
              left: stat.position.x,
              top: stat.position.y,
              height: stat.size.height,
              width: stat.size.width,
            }}
            title={stat.name}
          >
            <Image
              src={stat.image}
              alt={stat.name}
              fill
              className="object-contain"
              sizes={stat.size.width}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg z-10">
              {stat.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;

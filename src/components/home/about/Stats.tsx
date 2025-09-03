import React from "react";
import Image from "next/image";
import { Stat } from "@/lib/interface";

const statData: Stat[] = [
  {
    id: "attendees",
    name: "Attendees",
    content: "10K+",
    description: "Attendees",
    image: "/icons/stat.svg",
    position: { x: "-30%", y: -25 },
    size: { width: "9vw", height: "18vh" },
  },
  {
    id: "sponsors",
    name: "Sponsors",
    content: "50+",
    description: "Sponsors",
    image: "/icons/stat.svg",
    position: { x: "-30%", y: 400 },
    size: { width: "9vw", height: "18vh" },
  },
  {
    id: "years",
    name: "Years",
    content: "25",
    description: "Years",
    image: "/icons/stat.svg",
    position: { x: "-50%", y: 175 },
    size: { width: "10vw", height: "22vh" },
    font_sizes: { content: "lg:text-5xl", description: "lg:text-xl" },
  },
  {
    id: "vip_members",
    name: "VIP Members",
    content: "100+",
    description: "VIP Members",
    image: "/icons/stat.svg",
    position: { x: "130%", y: -15 },
    size: { width: "9vw", height: "18vh" },
  },
  {
    id: "speakers",
    name: "Speakers",
    content: "220+",
    description: "Speakers",
    image: "/icons/stat.svg",
    position: { x: "130%", y: 375 },
    size: { width: "9vw", height: "18vh" },
  },
];

const Stats: React.FC = () => {
  return (
    <div className="hidden lg:block relative w-full h-full">
      {statData.map((stat) => {
        return (
          <div
            key={stat.id}
            className="absolute hover:scale-105 transition-transform duration-300 z-10"
            style={{
              left: stat.position.x,
              top: stat.position.y,
              transform: "translate(-50%, -50%)",
              height: stat.size.height,
              minHeight: "120px",
              minWidth: "120px",
              width: stat.size.width,
              maxHeight: "320px",
              maxWidth: "320px",
            }}
            title={stat.name}
          >
            <Image
              src={stat.image}
              alt={stat.name}
              fill
              className="object-contain opacity-50"
              sizes={stat.size.width}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 font-semibold">
              <div
                className={`text-xl pb-2 ${
                  stat.font_sizes?.content || "lg:text-3xl"
                }`}
              >
                {stat.content}
              </div>
              <div
                className={`text-sm ${
                  stat.font_sizes?.description || "lg:text-lg"
                }`}
              >
                {stat.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;

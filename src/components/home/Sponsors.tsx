"use client";

import React from "react";
import Image from "next/image";
import { Sponsor } from "@/lib/interface";

// Define sponsor data with position and size in vh/vw formats
const sponsorData: Sponsor[] = [
  {
    id: "rbc",
    name: "RBC",
    image: "/2025_sponsors/rbc.webp",
    position: { x: "2vw", y: "5vh" },
    size: { width: "32vw", height: "16vh" },
    rotation: -2,
    zIndex: 2,
  },
  {
    id: "ciena",
    name: "Ciena",
    image: "/2025_sponsors/ciena.webp",
    position: { x: "16vw", y: "34vh" },
    size: { width: "25vw", height: "14vh" },
    rotation: 1,
    zIndex: 1,
  },
  {
    id: "wolfram",
    name: "Wolfram",
    image: "/2025_sponsors/wolfram.webp",
    position: { x: "40vw", y: "3vh" },
    size: { width: "17vw", height: "13vh" },
    rotation: -1,
    zIndex: 3,
  },
  {
    id: "fellow",
    name: "Fellow",
    image: "/2025_sponsors/fellow.webp",
    position: { x: "60vw", y: "38vh" },
    size: { width: "23vw", height: "13vh" },
    rotation: 2,
    zIndex: 1,
  },
  {
    id: "cse",
    name: "CSE",
    image: "/2025_sponsors/cse.svg",
    position: { x: "10vw", y: "50vh" },
    size: { width: "25vw", height: "11vh" },
    rotation: -3,
    zIndex: 2,
  },
  {
    id: "gadget",
    name: "Gadget",
    image: "/2025_sponsors/gadget.svg",
    position: { x: "65vw", y: "8vh" },
    size: { width: "20vw", height: "12vh" },
    rotation: 1,
    zIndex: 1,
  },
  {
    id: "compulsion-games",
    name: "Compulsion Games",
    image: "/2025_sponsors/Compulsion_Games.webp",
    position: { x: "48vw", y: "55vh" },
    size: { width: "22vw", height: "13vh" },
    rotation: -2,
    zIndex: 2,
  },
  {
    id: "tailed",
    name: "Tailed",
    image: "/2025_sponsors/tailed.webp",
    position: { x: "42vw", y: "23vh" },
    size: { width: "20vw", height: "10vh" },
    rotation: 3,
    zIndex: 1,
  },
];

const Sponsors: React.FC = () => {
  const handleSponsorClick = (sponsor: Sponsor) => {
    if (sponsor.website) {
      window.open(sponsor.website, "_blank");
    }
  };

  return (
    <div
      id="SPONSORS"
      className="mt-[50vh] mb-12 px-4 md:px-8 w-full flex flex-col justify-center mx-auto"
    >
      <div className="w-full text-center flex justify-center">
        <h1 className="w-fit text-light-mode text-3xl xl:text-6xl font-bold pb-4 border-b-1">
          Our Sponsors
        </h1>
      </div>

      {/* Sponsors Container */}
      <div className="w-full h-[70vh] text-center flex justify-left">
        <div className="relative">
          {sponsorData.map((sponsor) => {
            return (
              <div
                key={sponsor.id}
                className={`absolute hover:scale-105 transition-transform duration-300 ${
                  sponsor.website ? "cursor-pointer" : ""
                }`}
                style={{
                  left: sponsor.position.x,
                  top: sponsor.position.y,
                  height: sponsor.size.height,
                  width: sponsor.size.width,
                }}
                onClick={() => handleSponsorClick(sponsor)}
                title={sponsor.name}
              >
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                  sizes={sponsor.size.width}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;

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
    position: { x: "5vw", y: "10vh" },
    size: { width: "15vw", height: "10vh" },
    rotation: -2,
    zIndex: 2,
  },
  {
    id: "ciena",
    name: "Ciena",
    image: "/2025_sponsors/ciena.webp",
    position: { x: "25vw", y: "5vh" },
    size: { width: "14vw", height: "9vh" },
    rotation: 1,
    zIndex: 1,
  },
  {
    id: "wolfram",
    name: "Wolfram",
    image: "/2025_sponsors/wolfram.webp",
    position: { x: "45vw", y: "15vh" },
    size: { width: "12vw", height: "8vh" },
    rotation: -1,
    zIndex: 3,
  },
  {
    id: "fellow",
    name: "Fellow",
    image: "/2025_sponsors/fellow.webp",
    position: { x: "65vw", y: "8vh" },
    size: { width: "13vw", height: "8vh" },
    rotation: 2,
    zIndex: 1,
  },
  {
    id: "cse",
    name: "CSE",
    image: "/2025_sponsors/cse.svg",
    position: { x: "10vw", y: "25vh" },
    size: { width: "10vw", height: "6vh" },
    rotation: -3,
    zIndex: 2,
  },
  {
    id: "gadget",
    name: "Gadget",
    image: "/2025_sponsors/gadget.svg",
    position: { x: "75vw", y: "22vh" },
    size: { width: "9vw", height: "6vh" },
    rotation: 1,
    zIndex: 1,
  },
  {
    id: "compulsion-games",
    name: "Compulsion Games",
    image: "/2025_sponsors/Compulsion_Games.webp",
    position: { x: "35vw", y: "30vh" },
    size: { width: "13vw", height: "8vh" },
    rotation: -2,
    zIndex: 2,
  },
  {
    id: "tailed",
    name: "Tailed",
    image: "/2025_sponsors/tailed.webp",
    position: { x: "55vw", y: "35vh" },
    size: { width: "10vw", height: "6vh" },
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
    <section id="sponsors" className="mt-[15vh] px-4 md:px-8">
      <div className="ml-[4vw] mb-12">
        <div className="w-fit heading-gradient text-light-mode/70">
          <h1 className="text-3xl xl:text-6xl font-bold mb-1 border-b-1">
            Our Sponsors
          </h1>
        </div>
      </div>

      {/* Sponsors Container */}
      <div className="relative max-w-6xl mx-auto h-[50vh] overflow-hidden">
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
                width: sponsor.size.width,
                height: sponsor.size.height,
              }}
              onClick={() => handleSponsorClick(sponsor)}
              title={sponsor.name}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  fill
                  className="object-contain p-2"
                  sizes={sponsor.size.width}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Sponsors;

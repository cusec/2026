"use server";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "./embla/EmblaCarousel";
import "../../../app/embla.css";

const slideImages: string[] = [
  "/images/gallery/1.webp",
  "/images/gallery/2.webp",
  "/images/gallery/3.webp",
  "/images/gallery/4.webp",
  "/images/gallery/5.webp",
  "/images/gallery/6.webp",
  "/images/gallery/7.webp",
  "/images/gallery/8.webp",
  "/images/gallery/9.webp",
  "/images/gallery/10.webp",
  "/images/gallery/11.webp",
  "/images/gallery/12.webp",
  "/images/gallery/13.webp",
  "/images/gallery/14.webp",
  "/images/gallery/15.webp",
  "/images/gallery/16.webp",
];

const About: React.FC = () => {
  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
  const SLIDE_COUNT = slideImages.length;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div
      id="Gallery"
      className="mt-[25vh] md:mt-[50vh] max-w-[1800px] w-full flex flex-col justify-center mx-auto"
    >
      <div className="w-full flex justify-center text-center mb-12">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Relive CUSEC
        </h2>
      </div>

      <div className="w-full flex justify-center text-center">
        <EmblaCarousel
          slides={SLIDES}
          slideImages={slideImages}
          options={OPTIONS}
        />
      </div>
    </div>
  );
};

export default About;

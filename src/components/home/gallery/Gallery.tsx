import EmblaCarousel from "./embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "../../../app/embla.css";

const slideImages: string[] = [
  "/images/gallery/6.jpg",
  "/images/gallery/2.jpg",
  "/images/gallery/3.webp",
  "/images/gallery/4.jpg",
  "/images/gallery/5.jpg",
  "/images/gallery/1.jpg",
];

const About: React.FC = () => {
  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div
      id="GALLERY"
      className="mt-[50vh] max-w-[1800px] w-full flex flex-col justify-center mx-auto"
    >
      <div className="w-full flex justify-center text-center">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Relive CUSEC
        </h2>
      </div>

      <div className="w-full flex justify-center text-center mt-4">
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

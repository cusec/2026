import { Sponsor } from "@/lib/interface";

type SponsorData = {
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
  collaborators: Sponsor[];
  inkind: Sponsor[];
};

const sponsors: SponsorData = {
  gold: [
    {
      image: "/images/2025_sponsors/rbc.png",
      link: "https://www.rbc.com/about-rbc.html",
    },
  ],
  silver: [
    {
      image: "/images/2025_sponsors/Compulsion_Games.png",
      link: "https://compulsiongames.com/",
    },
    { image: "/images/2025_sponsors/fellow.webp", link: "https://fellow.app/" },
  ],
  bronze: [
    { image: "/images/2025_sponsors/ciena.png", link: "https://www.ciena.com" },
    {
      image: "/images/2025_sponsors/cse.svg",
      link: "https://www.cse-cst.gc.ca/",
    },
    {
      image: "/images/2025_sponsors/gadget.svg",
      link: "https://www.gadget.dev/",
    },
  ],
  collaborators: [
    {
      image: "/images/2025_sponsors/tailed.png",
      link: "https://www.tailed.ca",
    },
  ],
  inkind: [
    {
      image: "/images/2025_sponsors/wolfram.png",
      link: "https://www.wolframalpha.com/",
    },
    {
      image: "/images/2025_sponsors/stickerbeaver.png",
      link: "https://www.stickerbeaver.com",
    },
  ],
};

export default sponsors;

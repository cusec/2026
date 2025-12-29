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
      image: "/images/sponsors/rbc.png",
      link: "https://www.rbc.com/about-rbc.html",
    },
  ],
  silver: [
    {
      image: "/images/sponsors/nokia.svg",
      link: "https://www.nokia.com/",
    },
    {
      image: "/images/sponsors/Compulsion_Games.png",
      link: "https://compulsiongames.com/",
    },
    //{ image: "/images/sponsors/fellow.webp", link: "https://fellow.app/" },
  ],
  bronze: [
    {
      image: "/images/sponsors/cse.svg",
      link: "https://www.cse-cst.gc.ca/",
    },
  ],
  collaborators: [],
  inkind: [
    {
      image: "/images/sponsors/tailed.png",
      link: "https://www.tailed.ca",
    },
    /*
    {
      image: "/images/sponsors/wolfram.png",
      link: "https://www.wolframalpha.com/",
    },
    {
      image: "/images/sponsors/stickerbeaver.png",
      link: "https://www.stickerbeaver.com",
    },
    */
  ],
};

export default sponsors;

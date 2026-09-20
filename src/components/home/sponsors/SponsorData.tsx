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
      name: "RBC",
      image: "/images/sponsors/rbc.png",
      link: "https://www.rbc.com/about-rbc.html",
    },
  ],
  silver: [
    {
      name: "Nokia",
      image: "/images/sponsors/nokia.svg",
      link: "https://www.nokia.com/",
    },
    {
      name: "Compulsion Games",
      image: "/images/sponsors/Compulsion_Games.png",
      link: "https://compulsiongames.com/",
    },
    //{ image: "/images/sponsors/fellow.webp", link: "https://fellow.app/" },
  ],
  bronze: [
    {
      name: "Communications Security Establishment Canada",
      image: "/images/sponsors/cse.svg",
      link: "https://www.cse-cst.gc.ca/",
    },
  ],
  collaborators: [],
  inkind: [
    {
      name: "Tailed",
      image: "/images/sponsors/tailed.png",
      link: "https://community.tailed.ca",
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

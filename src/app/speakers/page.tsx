import type { Metadata } from "next";
import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  Speakers,
  Heart,
} from "@/components";

export const metadata: Metadata = {
  title: "Speakers | CUSEC 2026",
  description:
    "The speakers who took the stage at CUSEC 2026, the 25th Canadian University Software Engineering Conference. The CUSEC 2027 lineup is at 2027.cusec.net.",
};

export default function SpeakersPage() {
  return (
    <div className="relative bg-linear-[35deg] overflow-x-hidden overflow-y-hidden from-dark-mode from-0% via-primary via-55% to-accent to-140% bg-cover bg-center h-full">
      <div className="bg-linear-[15deg] from-accent/20 from-0% via-primary/0 via-55% to-accent/0 to-100%">
        <Particles />
        <Navbar />
        <SmoothFollower />
        <div className="flex relative flex-col justify-center items-center min-h-screen min-w-screen pb-[10vh] pt-[18vh] md:pt-[25vh]">
          <Heart />
          <Speakers />
        </div>
        <Footer />
      </div>
    </div>
  );
}

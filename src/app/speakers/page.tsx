import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  SpeakersHero,
  Heart,
} from "@/components";

export default function SpeakersPage() {
  return (
    <div className="relative bg-linear-[35deg] from-dark-mode from-0% via-primary via-55% to-accent to-140% bg-cover bg-center h-full">
      <div className="bg-linear-[15deg] from-accent/20 from-0% via-primary/0 via-55% to-accent/0 to-100%">
        <Particles />
        <Navbar />
        <SmoothFollower />
        <div className="flex relative flex-col justify-center items-center min-h-screen pb-[10vh] pt-[25vh]">
          <SpeakersHero />
          <Heart />
        </div>
        <Footer />
      </div>
    </div>
  );
}

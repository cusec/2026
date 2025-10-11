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
    <div className="relative bg-linear-[35deg] from-secondary from-0% via-primary/100 via-55% to-accent to-140% bg-cover bg-center h-full w-screen">
      <Particles />
      <Navbar />
      <SmoothFollower />
      <div className="flex flex-col justify-center items-center min-h-[100vh] pb-[10vh] pt-[25vh]">
        <SpeakersHero />
        <Heart />
      </div>
      <Footer />
    </div>
  );
}

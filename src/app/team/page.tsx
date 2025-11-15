import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  TeamHero,
  TeamMembers,
} from "@/components";

export default function TeamPage() {
  return (
    <div className="relative bg-linear-[35deg] from-secondary from-0% via-primary/100 via-55% to-accent to-140% bg-cover bg-center h-full">
      <Particles />
      <Navbar />
      <SmoothFollower />
      <div className="flex relative flex-col justify-center items-center min-h-[100vh] pb-[10vh] pt-[25vh]">
        <TeamHero />
        <TeamMembers />
      </div>
      <Footer />
    </div>
  );
}

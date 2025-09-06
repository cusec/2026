import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  CodeOfConduct,
} from "@/components";

export default function CodeOfConductPage() {
  return (
    <div className="relative bg-linear-[35deg] from-secondary from-0% via-primary/100 via-55% to-accent to-140% bg-cover bg-center h-full w-screen">
      <Particles />
      <Navbar />
      <SmoothFollower />
      <div className="flex justify-center items-center min-h-[100vh] pt-[20vh] pb-[10vh]">
        <CodeOfConduct />
      </div>
      <Footer />
    </div>
  );
}

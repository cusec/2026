import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  CodeOfConduct,
} from "@/components";

export default function CodeOfConductPage() {
  return (
    <div className="relative bg-linear-[60deg] from-night from-5% via-light-primary via-40% to-sunset to-105% bg-cover bg-center h-full w-screen">
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

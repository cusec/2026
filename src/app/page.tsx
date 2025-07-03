import { Navbar, Hero, Particles } from "@/components";

export default function Home() {
  return (
    <div className="bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-120% -z-20 bg-cover bg-center h-screen w-screen">
      <Particles
        className="absolute inset-0 z-0 animate-fade-in"
        quantity={300}
      />
      <div className="relative z-10">
        <Navbar />
        <main className="w-full flex justify-center items-center pt-[15vh] lg:pt-[20vh]">
          <Hero />
        </main>
      </div>
    </div>
  );
}

import { Hero, ParallaxCityscape, Particles } from "@/components";

export default function Home() {
  return (
    <div className="bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-120% -z-20 bg-cover bg-center h-full w-screen">
      <Particles />
      <ParallaxCityscape />
      <div className="relative z-10">
        <main className="w-full flex justify-center items-center pt-[15vh] lg:pt-[20vh]">
          <Hero />
        </main>
        <section className="min-h-[100vh]"></section>
      </div>
    </div>
  );
}

"use server";

import {
  Hero,
  OceanSurface,
  Particles,
  SmoothFollower,
  Navbar,
  About,
  Sponsors,
  Pricing,
  Footer,
  FAQ,
  Gallery,
} from "@/components";

const Home = () => {
  return (
    <div className="bg-linear-[180deg] from-sea from-0% via-sea via-20% to-dark-mode to-100% bg-cover bg-center h-full">
      <div className="overflow-x-hidden w-full h-full bg-linear-[45deg] from-accent/25 from-0% via-accent/5 via-10% to-dark-mode/0 to-100%">
        <div className="relative">
          <Particles desktopParticleCount={400} sizeMultiplier={1.5} />
          <Navbar />
          <SmoothFollower />
          <OceanSurface />
          <main role="main">
            <div
              id="Hero"
              className="w-full h-[95vh] flex justify-center items-center bg-linear-[35deg] from-secondary from-0% via-primary/100 via-35% to-accent to-140%"
            >
              <div className="absolute xs:top-[13vh] sm:top-[25vh] z-10">
                <Hero />
              </div>
            </div>
            <About />
            <Gallery />
            <Sponsors />
            <Pricing />
            <FAQ />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;

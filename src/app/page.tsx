"use client";

import {
  Hero,
  ParallaxCityscape,
  Particles,
  LoadingScreen,
  SmoothFollower,
  Navbar,
  About,
  Sponsors,
  Pricing,
  Footer,
  FAQ,
  Gallery,
} from "@/components";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [hideContent, setHideContent] = useState(true);
  const [particlesKey, setParticlesKey] = useState(0);

  // checks if we need to show splashpage (only shows on intial load)
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    } else {
      setHideContent(false);
      // Force particles refresh when splash is skipped (helps with Firefox)
      setTimeout(() => {
        setParticlesKey((prev) => prev + 1);
      }, 100);
    }
  }, []);

  return (
    <div className="bg-linear-[60deg] from-night from-5% via-light-primary via-40% to-sunset to-105% bg-cover bg-center h-full w-screen">
      {showSplash ? (
        <LoadingScreen
          onComplete={() => {
            setShowSplash(false);
            setHideContent(false);
          }}
        />
      ) : (
        <>
          <div className={`${hideContent ? "min-h-[100vh]" : "hidden"}`}></div>
          <div className={`relative ${hideContent ? "hidden" : ""}`}>
            <Particles
              key={particlesKey}
              desktopParticleCount={400}
              sizeMultiplier={1.5}
            />
            <Navbar />
            <SmoothFollower />
            <ParallaxCityscape />
            <main className="w-full h-[95vh] flex justify-center items-center bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-140%">
              <div className="absolute top-[13vh] sm:top-[25vh]">
                <Hero />
              </div>
            </main>
            <About />
            <Gallery />
            <Sponsors />
            <Pricing />
            <FAQ />
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

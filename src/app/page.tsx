"use client";

import {
  Hero,
  ParallaxCityscape,
  Particles,
  SplashLoad,
  SmoothFollower,
  Navbar,
  Cusec,
  Sponsors,
  Pricing,
  Footer,
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
    <div className="bg-linear-[70deg] from-night from-0% via-primary via-40% to-sunset to-80% -z-20 bg-cover bg-center h-full w-screen">
      {showSplash ? (
        <SplashLoad
          onComplete={() => {
            setShowSplash(false);
            setHideContent(false);
          }}
        />
      ) : (
        <>
          <div className={`${hideContent ? "min-h-[100vh]" : "hidden"}`}></div>
          <div className={`relative z-10 ${hideContent ? "hidden" : ""}`}>
            <Navbar />
            <Particles key={particlesKey} />
            <SmoothFollower />
            <ParallaxCityscape />
            <main className="w-full h-[100vh] flex justify-center items-center bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-140%">
              <div className="absolute top-[13vh] sm:top-[25vh]">
                <Hero />
              </div>
            </main>
            <Cusec />
            <Sponsors />
            <Pricing />
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

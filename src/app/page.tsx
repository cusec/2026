"use client";

import { Hero, ParallaxCityscape, Particles, SplashLoad } from "@/components";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);

  // checks if we need to show splashpage (only shows on intial load)
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  return (
    <div className="bg-linear-[50deg] from-primary from-0% to-sunset to-100% -z-20 bg-cover bg-center h-full w-screen">
      {showSplash ? (
        <SplashLoad onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="relative z-10">
          <Particles />
          <ParallaxCityscape />
          <main className="w-full h-[100vh] flex justify-center items-center bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-140%">
            <div className="absolute top-[13vh] sm:top-[25vh]">
              <Hero />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

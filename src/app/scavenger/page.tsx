"use client";

import { Navbar, Particles, ScavengerLogin } from "@/components";
import { useState, useEffect } from "react";

export default function ScavengerPage() {
  const [particleCount, setParticleCount] = useState(500);

  useEffect(() => {
    const updateParticleCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setParticleCount(100);
      } else if (width < 1024) {
        setParticleCount(300);
      } else {
        setParticleCount(500);
      }
    };

    // Set initial count
    updateParticleCount();

    // Listen for window resize
    window.addEventListener("resize", updateParticleCount);

    // Cleanup
    return () => window.removeEventListener("resize", updateParticleCount);
  }, []);

  return (
    <div className="bg-gradient-to-tr from-primary from-0% via-primary/100 via-75% to-accent to-100% -z-20 bg-cover bg-center h-screen">
      <Particles
        className="absolute inset-0 z-0 animate-fade-in"
        quantity={particleCount}
      />
      <div className="relative z-10">
        <Navbar />
        <main>
          <ScavengerLogin />
        </main>
      </div>
    </div>
  );
}

import { Navbar, Hero, Particles } from "@/components";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-primary from-0% via-primary/100 via-75% to-accent to-100% -z-20 bg-cover bg-center h-screen">
      <Particles
        className="absolute inset-0 z-0 animate-fade-in"
        quantity={300}
      />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
    </div>
  );
}

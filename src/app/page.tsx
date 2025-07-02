import { Navbar, Hero } from "@/components";

export default function Home() {
  return (
    <div className="bg-[url('/images/splash.svg')] bg-cover bg-center h-screen">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}

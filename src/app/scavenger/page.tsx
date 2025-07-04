import { ScavengerLogin, Particles } from "@/components";

export default function ScavengerPage() {
  return (
    <div className="bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-120% -z-20 bg-cover bg-center h-screen w-screen">
      <Particles />
      <main className="w-full h-full flex justify-center relative z-10 items-center">
        <ScavengerLogin />
      </main>
    </div>
  );
}

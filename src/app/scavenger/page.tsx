import { ScavengerLogin } from "@/components";

export default function ScavengerPage() {
  return (
    <div className="bg-gradient-to-tr from-primary from-0% via-primary/100 via-75% to-accent to-100% -z-20 bg-cover bg-center h-screen">
      <main className="w-full h-full flex justify-center items-center">
        <ScavengerLogin />
      </main>
    </div>
  );
}

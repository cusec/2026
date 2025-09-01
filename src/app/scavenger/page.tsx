import {
  ScavengerLogin,
  Particles,
  Navbar,
  ScavengerOptions,
  Leaderboard,
} from "@/components";
import { auth0 } from "@/lib/auth0";

export default async function ScavengerPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="bg-linear-[35deg] from-primary from-0% via-primary/100 via-55% to-accent to-120% -z-20 bg-cover bg-center min-h-screen w-screen">
      <Navbar />
      <Particles />
      <main className="w-full min-h-[100vh] h-full flex justify-center relative z-10 py-auto pt-24">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="min-w-fit flex flex-col items-center justify-center gap-4 bg-light-mode rounded-4xl shadow-lg p-8 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4">
            <ScavengerLogin user={user} />
            {user && <ScavengerOptions user={user} />}
          </div>
          {user && <Leaderboard />}
        </div>
      </main>
    </div>
  );
}

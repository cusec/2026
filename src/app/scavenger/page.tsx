"use server";

import {
  Particles,
  Navbar,
  ScavengerOptions,
  Leaderboard,
  Footer,
} from "@/components";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function ScavengerPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="bg-linear-[35deg] from-secondary from-0% via-primary/100 via-55% to-accent to-140% -z-20 bg-cover bg-center min-h-screen w-screen">
      <Navbar />
      <main className="relative w-full min-h-[100vh] h-full flex justify-center items-center px-4 py-16">
        <Particles />
        {user ? (
          <div className="z-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="min-w-fit flex flex-col items-center justify-center gap-4 bg-light-mode rounded-4xl shadow-lg p-8 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4">
              <span>Welcome, {user.name}!</span>
              <span>[Roles: {user["cusec/roles"].join(", ")}]</span>
              <a
                href={`/auth/logout?returnTo=${process.env.APP_BASE_URL}/scavenger`}
              >
                <button className="px-6 py-2 rounded-lg bg-light-mode text-primary font-semibold shadow hover:bg-primary hover:text-white transition">
                  Log Out
                </button>
              </a>
              <ScavengerOptions user={user} />
            </div>
            <Leaderboard />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto text-center z-10">
            {/* Hero Section */}
            <div className="mb-16 mt-16">
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-light-mode mb-4 tracking-wider">
                  SCAVENGER
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold text-accent mb-6">
                  HUNT
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-light-mode/90 max-w-3xl mx-auto leading-relaxed">
                An epic adventure awaits! Scan codes, solve puzzles, compete
                with fellow attendees, and win exclusive prizes at CUSEC 2026.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-light-mode mb-4">
                  Scan & Earn
                </h3>
                <p className="text-light-mode/80">
                  Find hidden QR codes throughout the venue & events. Each scan
                  earns you points.
                </p>
              </div>

              <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                <div className="text-4xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-light-mode mb-4">
                  Solve Puzzles
                </h3>
                <p className="text-light-mode/80">
                  Earn more points by challenging yourself with riddles and
                  technical puzzles, designed to test your skills.
                </p>
              </div>

              <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-light-mode mb-4">
                  Win Prizes
                </h3>
                <p className="text-light-mode/80">
                  Climb the leaderboard and build your score to redeem exclusive
                  CUSEC merchandise and stickers.
                </p>
              </div>
            </div>

            {/* Coming Soon Banner */}
            <div className="bg-light-mode/10 backdrop-blur-sm rounded-4xl p-8 border-2 border-light-mode/50 mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-4">⏰</div>
                <h3 className="text-3xl font-bold text-light-mode">
                  Coming Soon
                </h3>
              </div>
              <p className="text-xl text-light-mode/90 mb-2">
                The Scavenger Hunt will be available closer to the event date.
              </p>
              <p className="text-lg text-light-mode/70">
                Get ready for an unforgettable adventure at CUSEC 2026!
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Link href="/auth/login?returnTo=/scavenger">
                <button className="bg-accent hover:bg-accent/80 text-light-mode font-bold text-xl px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Enter the Hunt (Staging)
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

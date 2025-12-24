"use server";

import {
  Particles,
  Navbar,
  // ScavengerOptions,
  // Leaderboard,
  Footer,
  SmoothFollower,
  Dashboard,
} from "@/components";
import { auth0 } from "@/lib/auth0";
import { getUserByEmail } from "@/lib/userService";
import { Trophy, QrCode, Puzzle, Users } from "lucide-react";

export default async function ScavengerPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  const scavengerEnabled = process.env.SCAVENGER_HUNT_ENABLED === "true";

  // Fetch MongoDB user if logged in
  let dbUser = null;
  if (user?.email) {
    const mongoUser = await getUserByEmail(user.email);
    if (mongoUser) {
      // Convert Mongoose document to plain object to avoid serialization issues
      const plainUser = mongoUser.toObject();

      dbUser = JSON.parse(
        JSON.stringify({
          ...plainUser,
          points: plainUser.points || 0,
        })
      );
    }
  }

  return (
    <div className="bg-linear-[35deg] from-secondary from-0% via-primary via-55% to-accent to-140% -z-20 bg-cover bg-center min-h-screen">
      <Navbar />
      <main className="relative w-full overflow-y-hidden overflow-x-hidden flex justify-center items-center pt-[15vh]">
        <Particles />
        <SmoothFollower />
        {user ? (
          <div className="relative z-10">
            <Dashboard
              user={user}
              dbUser={dbUser}
              baseURL={process.env.APP_BASE_URL || ""}
            />
            {/* <div className="min-w-fit flex flex-col items-center justify-center gap-4 bg-light-mode rounded-4xl shadow-lg p-8 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4">
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
              <Leaderboard />
            </div> */}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto text-center z-10">
            {/* Hero Section */}
            <div className="mt-[20vh] md:mt-[25vh]">
              <div className="mb-12">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-light-mode mb-4 tracking-wider">
                  SCAVENGER
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold text-accent mb-6">
                  HUNT
                </h2>
              </div>
              <p className="mb-12 text-lg sm:text-xl md:text-2xl text-light-mode/90 max-w-3xl mx-auto leading-relaxed">
                An epic adventure awaits! Scan codes, solve puzzles, compete
                with fellow attendees, and win exclusive prizes at CUSEC 2026.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center text-light-mode/90">
                {scavengerEnabled ? (
                  <a
                    className="select-none flex max-w-fit px-8 py-4 text-lg font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50! register-hover"
                    href="/auth/login?returnTo=/scavenger"
                  >
                    <Trophy className="mr-3 h-6 w-6" />
                    Start Hunting
                  </a>
                ) : (
                  <div className="select-none flex max-w-fit px-8 py-4 text-lg font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50! register-hover">
                    <Trophy className="mr-3 h-6 w-6" />
                    Coming Soon
                  </div>
                )}

                <div className="hidden">
                  <a
                    className="flex max-w-fit px-4 py-4 text-lg bg-transparent border-b-2 border-light-mode/50 email-hover"
                    href="#"
                  >
                    <Users className="mr-3 h-6 w-6" />
                    Rules & Guidelines
                  </a>
                </div>
              </div>
              {!scavengerEnabled && (
                <p className="mt-6 text-md text-muted-foreground text-light-mode">
                  ⏰ The hunt will be available closer to the conference date
                </p>
              )}
            </div>

            {/* Features Grid */}
            <div className="mt-[28vh] text-center mx-2">
              <div className="mb-16 text-center text-light-mode">
                <h2 className="mb-4 text-4xl font-black text-foreground">
                  How It Works
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-4">
                  Three simple steps to become the ultimate CUSEC 2026 scavenger
                  hunt champion.{" "}
                </p>
                <a
                  href="https://www.youtube.com/watch?v=Aq5WXmQQooo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Get Early Access (2026)
                </a>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                    <QrCode className="h-8 w-8 text-light-mode" />
                  </div>
                  <h3 className="text-2xl font-bold text-light-mode mb-4">
                    Scan & Earn
                  </h3>
                  <p className="text-light-mode/80">
                    Find hidden QR codes throughout the venue & events such as a
                    presentation or at sponsor booths. Each scan earns you
                    points.
                  </p>
                </div>

                <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                    <Puzzle className="h-8 w-8 text-green-300/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-light-mode mb-4">
                    Solve Puzzles
                  </h3>
                  <p className="text-light-mode/80">
                    Earn more points by challenging yourself with riddles and
                    technical puzzles, designed to test your skills.
                  </p>
                </div>

                <div className="bg-light-mode/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-light-mode/15 transition-all duration-300">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                    <Trophy className="h-8 w-8 text-yellow-300/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-light-mode mb-4">
                    Win Prizes
                  </h3>
                  <p className="text-light-mode/80">
                    Compete against the other attendees, climb the leaderboard
                    and build your score to redeem exclusive CUSEC merchandise
                    and stickers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

import { auth0 } from "@/lib/auth0";

export default async function ScavengerPage() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main>
        <div className="bg-[url('/images/splash.svg')] bg-cover bg-center h-screen flex items-center justify-center gap-4">
          <a href="/auth/login?screen_hint=signup&returnTo=/scavenger">
            <button className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/80 transition">
              Sign up
            </button>
          </a>
          <a href="/auth/login?returnTo=/scavenger">
            <button className="px-6 py-2 rounded-lg bg-light-mode text-primary font-semibold shadow hover:bg-primary hover:text-white transition">
              Log in
            </button>
          </a>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div className="bg-[url('/images/splash.svg')] bg-cover bg-center h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 bg-light-mode dark:bg-dark-mode rounded-4xl shadow-lg p-8 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <h1 className="text-primary dark:text-light-mode">
            Welcome, {session.user.name}!{" "}
            {session.user["cusec/roles"]?.includes("Admin") ? `(Admin)` : ""}
          </h1>
          <a
            href={`/auth/logout?returnTo=${process.env.NEXT_PUBLIC_URL}/scavenger`}
          >
            <button className="px-6 py-2 rounded-lg bg-light-mode text-primary font-semibold shadow hover:bg-primary hover:text-white transition">
              Log Out
            </button>
          </a>
          <p>{JSON.stringify(session.user, null, 2)}</p>
          <p>{typeof session.accessToken}</p>
          <p>{typeof session.user["cusec/roles"]}</p>
        </div>
      </div>
    </main>
  );
}

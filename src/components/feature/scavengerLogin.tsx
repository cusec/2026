"use server";

import { auth0 } from "@/lib/auth0";
import { findOrCreateUser } from "@/lib/userService";

const ScavengerLogin = async () => {
  const session = await auth0.getSession();
  const user = session?.user;

  const handleLogin = async () => {
    if (!user?.email) return;
    try {
      await findOrCreateUser({
        email: user.email,
        name: user.name || "",
      });
    } catch (error) {
      console.error("Error creating/finding user:", error);
    }
  };

  // User not logged in
  if (!user) {
    return (
      <>
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
      </>
    );
  }

  // User is logged in
  return (
    <>
      <h1 className="text-primary dark:text-light-mode">
        Welcome, {user.name}!{" "}
        {user["cusec/roles"]?.includes("Admin") ? `(Admin)` : ""}
      </h1>
      <a
        href={`/auth/logout?returnTo=${process.env.NEXT_PUBLIC_URL}/scavenger`}
      >
        <button className="px-6 py-2 rounded-lg bg-light-mode text-primary font-semibold shadow hover:bg-primary hover:text-white transition">
          Log Out
        </button>
      </a>
    </>
  );
};

export default ScavengerLogin;

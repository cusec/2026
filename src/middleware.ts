import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

// Build disabled routes based on environment variables
const buildDisabledRoutes = (): string[] => {
  const disabled = [];

  // Check if features are enabled (default to false/disabled if not set)
  const scheduleEnabled = process.env.SCHEDULE_ENABLED === "true";
  //const scavengerEnabled = process.env.SCAVENGER_HUNT_ENABLED === "true";

  if (!scheduleEnabled) disabled.push("/schedule");
  //if (!scavengerEnabled) disabled.push("/auth/login?returnTo=/scavenger");

  return disabled;
};

const disabledRoutes = buildDisabledRoutes();

export async function middleware(request: NextRequest) {
  // Check if route is disabled
  if (
    disabledRoutes.length > 0 &&
    disabledRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return new NextResponse(
      "Access Restricted by CUSEC Team. Contact Technology Team for access.",
      { status: 404 }
    );
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - scavenger (allow public access to handle auth in component)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

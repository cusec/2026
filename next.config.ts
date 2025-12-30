import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";

module.exports = async (phase: string) => {
  const nextConfig: NextConfig = {
    /* config options here */
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
          ],
        },
        {
          source: "/sw.js",
          headers: [
            {
              key: "Content-Type",
              value: "application/javascript; charset=utf-8",
            },
            {
              key: "Cache-Control",
              value: "no-cache, no-store, must-revalidate",
            },
            {
              key: "Content-Security-Policy",
              value: "default-src 'self'; script-src 'self'",
            },
          ],
        },
      ];
    },
  };

  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    const withSerwist = withSerwistInit({
      swSrc: "src/service-worker/app-worker.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    });

    return withSerwist(nextConfig);
  }
  return nextConfig;
};

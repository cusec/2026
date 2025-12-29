import type { NextConfig } from "next";

module.exports = async () => {
  const nextConfig: NextConfig = {
    /* config options here */
  };

  const withSerwist = (await import("@serwist/next")).default({
    swSrc: "src/service-worker/app-worker.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
  });

  return withSerwist(nextConfig);
};

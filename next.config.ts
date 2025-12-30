import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

module.exports = async () => {
  const nextConfig: NextConfig = {
    /* config options here */
  };

  const withSerwist = withSerwistInit({
    swSrc: "src/service-worker/app-worker.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
  });

  return withSerwist(nextConfig);
};

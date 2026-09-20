import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/scavenger", "/auth/"],
    },
    sitemap: "https://2026.cusec.net/sitemap.xml",
    host: "https://2026.cusec.net",
  };
}

import type { Metadata } from "next";
import "./globals.css";
import connectMongoDB from "@/lib/mongodb";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// Initialize MongoDB connection when the server starts
if (typeof window === "undefined") {
  connectMongoDB().catch((error) => {
    console.error("Failed to connect to MongoDB on startup:", error);
  });
}

export const metadata: Metadata = {
  title: "CUSEC 2026 - Canadian University Software Engineering Conference",
  description:
    "Join CUSEC 2026, Canada's longest running student-led software engineering conference. The 25th annual conference offering unique tech experiences to university students across Canada.",
  keywords: [
    "CUSEC",
    "Canadian University Software Engineering Conference",
    "software engineering",
    "university students",
    "tech conference",
    "Canada",
    "2026",
    "student conference",
    "programming",
    "technology",
    "computer science",
    "networking",
    "career development",
  ],
  authors: [{ name: "CUSEC Organization" }],
  creator: "CUSEC Organization",
  publisher: "CUSEC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cusec.net"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CUSEC 2026 - Canadian University Software Engineering Conference",
    description:
      "Join CUSEC 2026, Canada's longest running student-led software engineering conference. The 25th annual conference offering unique tech experiences to university students.",
    url: "/",
    siteName: "CUSEC 2026",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/logo.svg",
        alt: "CUSEC 2026 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CUSEC 2026 - Canadian University Software Engineering Conference",
    description:
      "Join Canada's longest running student-led software engineering conference. CUSEC 2026 - the 25th annual conference.",
    images: ["/images/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://cusec.net"}
        />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

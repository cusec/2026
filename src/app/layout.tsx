import type { Metadata } from "next";
import "./globals.css";
import connectMongoDB from "@/lib/mongodb";
import { Jost, Space_Grotesk, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-jost",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

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
  manifest: "/manifest.json",
  title: "CUSEC 2026 - Canadian University Software Engineering Conference",
  description:
    "CUSEC 2026, the 25th Canadian University Software Engineering Conference, took place January 8-10, 2026. The next edition is CUSEC 2027 at 2027.cusec.net.",
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
  metadataBase: new URL("https://2026.cusec.net"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "CUSEC 2026 - Canadian University Software Engineering Conference",
    description:
      "CUSEC 2026, the 25th Canadian University Software Engineering Conference, took place January 8-10, 2026. The next edition is CUSEC 2027 at 2027.cusec.net.",
    url: "./",
    siteName: "CUSEC 2026",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/logo.png",
        width: 448,
        height: 448,
        alt: "CUSEC 2026 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CUSEC 2026 - Canadian University Software Engineering Conference",
    description:
      "CUSEC 2026 - the 25th annual conference, held January 8-10, 2026. The next edition is CUSEC 2027.",
    images: ["/images/logo.png"],
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

const conferenceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://cusec.net/#organization",
      name: "CUSEC",
      alternateName: "Canadian University Software Engineering Conference",
      url: "https://cusec.net",
      logo: "https://2026.cusec.net/images/logo.png",
      sameAs: [
        "https://2027.cusec.net",
        "https://instagram.com/cusecofficial",
        "https://linkedin.com/company/cusec",
        "https://youtube.com/@cusec_cucgl",
        "https://github.com/cusec",
      ],
    },
    {
      "@type": "EventSeries",
      "@id": "https://cusec.net/#series",
      name: "Canadian University Software Engineering Conference",
      url: "https://cusec.net",
      organizer: { "@id": "https://cusec.net/#organization" },
    },
    {
      "@type": "Event",
      "@id": "https://2026.cusec.net/#event",
      name: "CUSEC 2026",
      url: "https://2026.cusec.net",
      startDate: "2026-01-08",
      endDate: "2026-01-10",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      superEvent: { "@id": "https://cusec.net/#series" },
      organizer: { "@id": "https://cusec.net/#organization" },
    },
    {
      "@type": "Event",
      "@id": "https://2027.cusec.net/#event",
      name: "CUSEC 2027",
      url: "https://2027.cusec.net",
      startDate: "2027-01",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Montréal, QC",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Montréal",
          addressRegion: "QC",
          addressCountry: "CA",
        },
      },
      superEvent: { "@id": "https://cusec.net/#series" },
      organizer: { "@id": "https://cusec.net/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      dir="ltr"
      className={`${jost.variable} ${spaceGrotesk.variable} ${bebasNeue.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(conferenceJsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

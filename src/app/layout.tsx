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
  title: "CUSEC 2026",
  description: "The official website for CUSEC 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

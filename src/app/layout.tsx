import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Particles } from "@/components";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

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
      <body className={`antialiased`}>
        <Particles
          className="absolute inset-0 z-0 animate-fade-in"
          quantity={300}
        />
        <Navbar />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

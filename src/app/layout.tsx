import type { Metadata } from "next";
import { Space_Grotesk, Jost } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk", // Define the CSS variable
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost", // Define the CSS variable
});

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
    <html lang="en" className={`${spaceGrotesk.variable} ${jost.variable}`}>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

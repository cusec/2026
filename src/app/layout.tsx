import type { Metadata } from "next";
import "./globals.css";

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

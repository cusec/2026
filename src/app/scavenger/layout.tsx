import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scavenger Hunt | CUSEC 2026",
  robots: { index: false, follow: true },
};

export default function ScavengerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | CUSEC 2026",
  description:
    "The three-day schedule of talks, workshops, and socials at CUSEC 2026, held January 8-10, 2026. CUSEC 2027 runs in January 2027 at 2027.cusec.net.",
};

export default function ScheduleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

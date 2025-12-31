"use server";
import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  Schedule,
} from "@/components";
import isAdmin from "@/lib/isAdmin";

export default async function PrivacyPolicyPage() {
  const adminUser = await isAdmin();
  const scheduleHeight = 6000;

  return (
    <div className="relative bg-linear-[35deg] overflow-x-hidden overflow-y-hidden from-secondary from-0% via-primary via-55% to-accent to-140% bg-cover bg-center h-full">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ height: scheduleHeight }}
      >
        <Particles className="absolute inset-0 animate-fade-in" />
      </div>
      <Navbar />
      <SmoothFollower />
      <div className="flex justify-center items-center h-full min-h-screen overflow-x-hidden pt-[15vh] pb-[10vh]">
        <Schedule adminUser={adminUser} />
      </div>
      <Footer />
    </div>
  );
}

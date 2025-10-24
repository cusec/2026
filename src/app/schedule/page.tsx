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
  return (
    <div className="relative bg-linear-[35deg] from-secondary from-0% via-primary/100 via-55% to-accent to-140% bg-cover bg-center h-full">
      <Particles />
      <Navbar />
      <SmoothFollower />
      <div className="relative z-10 flex justify-center items-center min-h-[100vh] pt-[15vh] pb-[10vh]">
        <Schedule adminUser={adminUser} />
      </div>
      <Footer />
    </div>
  );
}

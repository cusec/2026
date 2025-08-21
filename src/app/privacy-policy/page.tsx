import {
  Particles,
  Navbar,
  SmoothFollower,
  Footer,
  PrivacyPolicy,
} from "@/components";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative bg-linear-[80deg] from-night from-10% via-primary via-40% to-sunset to-85% bg-cover bg-center h-full w-screen">
      <Particles />
      <Navbar />
      <SmoothFollower />
      <div className="flex justify-center items-center min-h-[100vh] pt-[20vh] pb-[10vh]">
        <PrivacyPolicy />
      </div>
      <Footer />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: "/icons/instagram.svg",
      url: "https://instagram.com/cusecofficial",
    },
    {
      name: "LinkedIn",
      icon: "/icons/linkedin.svg",
      url: "https://linkedin.com/company/cusec",
    },
    {
      name: "YouTube",
      icon: "/icons/youtube.svg",
      url: "https://youtube.com/@cusec_cucgl",
    },
    {
      name: "GitHub",
      icon: "/icons/github.svg",
      url: "https://github.com/cusec",
    },
  ];

  return (
    <footer className="bg-dark-mode/60 w-full py-6 relative z-40">
      <div className="w-full md:max-w-[80vw] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-3 p-2 px-4 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-8 h-8 relative">
            <Image
              src="/images/logo.svg"
              alt="CUSEC Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-16 text-white">
          <Link
            href="/code-of-conduct"
            className="text-sm md:text-base hover:text-white/80 transition-colors duration-200 font-jost"
          >
            Code of Conduct
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm md:text-base hover:text-white/80 transition-colors duration-200 font-jost"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 relative transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 opacity-80 hover:opacity-100"
              aria-label={social.name}
            >
              <Image
                src={social.icon}
                alt={`${social.name} icon`}
                fill
                className="object-contain filter brightness-0 invert"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

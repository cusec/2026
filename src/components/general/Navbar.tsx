"use client";

import { Speaker } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = {
    Home: "/#Hero",
    About: "/#About",
    Gallery: "/#Gallery",
    Sponsors: "/#Sponsors",
    Pricing: "/#Pricing",
    Faq: "/#Faq",
    Speakers: "/speakers",
    Schedule: "/schedule",
    "Scavenger Hunt": "/scavenger",
  };

  return (
    <>
      <nav
        className={`w-full xl:h-min text-white fixed top-0 z-30 backdrop-blur-sm xl:backdrop-blur-md border-b-2 border-light-mode/30 xl:bg-white/2 xl:rounded-b-3xl transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between py-2 px-4 xl:px-8 mx-4">
          <Link
            href="/#Hero"
            className="flex items-center gap-3 p-2 px-4 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setIsMenuOpen(false)}
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
            <div className="hidden xl:block text-center leading-none">
              <h3 className="text-2xl">CUSEC</h3>
              <h3 className="text-lg tracking-[0.15em]">2026</h3>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            {Object.entries(navItems).map(([item, url]) => (
              <Link
                key={item}
                href={url}
                className="text-sm 2xl:text-md px-2 2xl:px-4 py-2 tracking-wide rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Mobile Burger Menu Button */}
          <button
            className="xl:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>
      {/* Mobile Navigation Menu */}
      {true && (
        <div
          className={`fixed w-full h-[100vh] z-20 bg-dark-mode/60 backdrop-blur-sm text-light-mode/90 pb-4 py-24 space-y-3 transition-all duration-1000`}
          style={{
            clipPath: isMenuOpen
              ? "inset(0% 0% 0% 0%)"
              : "inset(0% 0% 100% 0%)",
          }}
        >
          {Object.entries(navItems).map(([item, url]) => (
            <Link
              key={item}
              href={url}
              className="block w-full text-center tracking-wide text-lg px-4 py-3 transition-all duration-300 ease-out hover:bg-light-mode/20"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;

"use client";

import Image from "next/image";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = {
    HOME: "/",
    "ATTEND THE CONFERENCE": "#attend",
    SPONSORS: "#sponsors",
    SPEAKERS: "#speakers",
    SCHEDULE: "#schedule",
    "THE TEAM": "#team",
    "SCAVENGER HUNT": "/scavenger",
    ABOUT: "#about",
    FAQ: "#faq",
  };

  return (
    <nav
      className={`w-full h-[100vh] xl:h-min text-white lg:px-4 2xl:px-8 py-4 absolute z-30 xl:backdrop-blur-none xl:bg-transparent transition-all duration-300 ease-in-out ${
        isMenuOpen ? "backdrop-blur-sm bg-dark-mode/50" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 xl:px-8 pb-2 mx-4 border-b-2 border-white/40">
        <div className="flex items-center gap-3">
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
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-6">
          {Object.entries(navItems).map(([item, url]) => (
            <a
              key={item}
              href={url}
              className="text-sm 2xl: text-md font-medium px-2 2xl:px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              {item}
            </a>
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="xl:hidden mt-4 px-8 pb-4 space-y-4">
          {Object.entries(navItems).map(([item, url]) => (
            <a
              key={item}
              href={url}
              className="block w-full text-center text-md font-medium px-4 py-3 rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

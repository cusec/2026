"use client";

import Image from "next/image";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "ATTEND THE CONFERENCE",
    "SPONSORS",
    "SPEAKERS",
    "SCHEDULE",
    "THE TEAM",
    "ABOUT",
    "FAQ",
  ];

  return (
    <nav className="text-white px-8 py-4">
      <div className="flex items-center justify-between px-8 pb-2 mx-4 border-b-2 border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            <Image
              src="/images/logo.svg"
              alt="CUSEC Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="text-center leading-none">
            <h3 className="text-2xl">CUSEC</h3>
            <h3 className="text-lg tracking-[0.15em]">2026</h3>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              className="text-md font-medium px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile Burger Menu Button */}
        <button
          className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
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
        <div className="lg:hidden mt-4 px-8 pb-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item}
              className="block w-full text-center text-md font-medium px-4 py-3 rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

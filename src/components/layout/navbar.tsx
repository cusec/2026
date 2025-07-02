import Image from "next/image";
import React from "react";

const Navbar: React.FC = () => {
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
            <h3 className="text-lg tracking-[0.25em]">2026</h3>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              className="text-md font-medium px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

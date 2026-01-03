"use client";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

// ScrollToTopButton: fixed arrow at bottom right
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed z-45 bottom-6 right-6 md:bottom-16 md:right-16 p-2 md:p-4 rounded-full bg-dark-mode/20 hover:bg-light-mode/10 cursor-pointer shadow-lg transition-all border border-light-mode/10 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.12)" }}
    >
      <ChevronUp className="w-7 h-7 text-light-mode/70" />
    </button>
  );
};

export default ScrollToTopButton;

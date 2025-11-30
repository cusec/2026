"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [displayedText, setDisplayedText] = useState("");
  const [textVisible, setTextVisible] = useState(true);
  const [screenVisible, setScreenVisible] = useState(true);
  const fullText = "25th Anniversary";

  // The splash flag + content hiding ensures smooth transition without flicker
  const [showSplash, setShowSplash] = useState(false);
  const [TemporaryContent, setTemporaryContent] = useState(true);

  const handleSkip = () => {
    setTextVisible(false);
    setScreenVisible(false);

    // Mark tooltip as already shown to prevent it from appearing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tooltipShown", "true");
    }

    // Re-enable scrolling immediately
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.touchAction = "";
    }
  };

  useEffect(() => {
    // checks if we need to show splashpage (only shows on intial load)
    if (typeof window !== "undefined") {
      const splashShown = sessionStorage.getItem("splashShown");
      if (!splashShown) {
        setShowSplash(true);
        sessionStorage.setItem("splashShown", "true");

        // Prevent scrolling while loading animation is active
        if (typeof document !== "undefined") {
          // Apply overflow hidden to both body and html to ensure no scrolling
          document.body.style.overflow = "hidden";
          document.documentElement.style.overflow = "hidden";

          document.body.style.touchAction = "none";
        }
      } else {
        setTemporaryContent(false);
      }
    }

    // Typewriter effect
    let currentIndex = 0;
    const typewriterTimer = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typewriterTimer);
      }
    }, 100); // 100ms per character

    // Start text disappear animation after typewriter completes + additional time
    const textTimer = setTimeout(() => {
      setTextVisible(false);
    }, 3000);

    // Start screen disappear animation after text animation completes
    const screenTimer = setTimeout(() => {
      setScreenVisible(false);
    }, 4000);

    // Create a reference to the function that can be used in the cleanup
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    if (typeof document !== "undefined") {
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    // Re-enable scrolling after animation completes
    const enableScrollingTimer = setTimeout(() => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        document.body.style.touchAction = "";

        document.removeEventListener("touchmove", preventScroll);
      }
    }, 4200); // slightly after the screen animation completes

    return () => {
      clearInterval(typewriterTimer);
      clearTimeout(textTimer);
      clearTimeout(screenTimer);
      clearTimeout(enableScrollingTimer);
      // Reset overflow if component unmounts
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        document.body.style.touchAction = "";

        document.removeEventListener("touchmove", preventScroll);
      }
    };
  }, []);

  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 z-50 items-center justify-center transition-all duration-1000 ease-out bg-linear-[35deg] from-secondary from-0% via-primary via-35% to-accent to-140% ${
          showSplash ? "flex" : "hidden"
        }`}
        style={{
          clipPath: screenVisible
            ? "inset(0% 0% 0% 0%)"
            : "inset(0% 0% 100% 0%)",
        }}
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 text-light-mode tracking-wide rounded-xl transition-all duration-300 ease-out hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] z-60"
          aria-label="Skip animation"
        >
          Skip
        </button>

        <h1
          className="text-3xl sm:text-6xl lg:text-8xl font-bold text-light-mode tracking-wider transition-all duration-500 ease-linear"
          style={{
            clipPath: textVisible
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0% 100% 0%)",
          }}
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>
      </div>
    );
  } else {
    return (
      <div
        className={`${
          TemporaryContent
            ? "fixed inset-0 z-50 flex bg-linear-[35deg] from-secondary from-0% via-primary/100 via-35% to-accent to-140% min-h-[100vh]"
            : "hidden"
        }`}
      ></div>
    );
  }
}

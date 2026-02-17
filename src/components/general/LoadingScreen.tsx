"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingScreen() {
  const [displayedText, setDisplayedText] = useState("");
  const [textVisible, setTextVisible] = useState(true);
  const [screenVisible, setScreenVisible] = useState(true);
  const fullText = "25th Anniversary";

  // The splash flag + content hiding ensures smooth transition without flicker
  const [showSplash, setShowSplash] = useState(false);
  const [TemporaryContent, setTemporaryContent] = useState(true);

  const preventWheelRef = useRef<(e: WheelEvent) => void>(() => {});
  const preventTouchRef = useRef<(e: TouchEvent) => void>(() => {});
  const lockScroll = () => {
    if (typeof document !== "undefined") {
      document.addEventListener("wheel", preventWheelRef.current, {
        passive: false,
      });
      document.addEventListener("touchmove", preventTouchRef.current, {
        passive: false,
      });
    }
  };
  const unlockScroll = () => {
    if (typeof document !== "undefined") {
      document.removeEventListener("wheel", preventWheelRef.current);
      document.removeEventListener("touchmove", preventTouchRef.current);
    }
  };

  const handleSkip = () => {
    setTextVisible(false);
    setScreenVisible(false);

    setTimeout(() => {
      setShowSplash(false);
      setTemporaryContent(false);
      unlockScroll();
    }, 500); // short delay to allow screen to disappear smoothly

    // Mark tooltip as already shown to prevent it from appearing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tooltipShown", "true");
    }
  };

  useEffect(() => {
    // initialize listener refs once
    preventWheelRef.current = (e: WheelEvent) => e.preventDefault();
    preventTouchRef.current = (e: TouchEvent) => e.preventDefault();

    // checks if we need to show splashpage (only shows on intial load)
    if (typeof window !== "undefined") {
      if (false) { // if (!sessionStorage.getItem("splashShown"))
        setShowSplash(true);
        sessionStorage.setItem("splashShown", "true");
        lockScroll();
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

    // Re-enable scrolling after animation completes
    const enableScrollingTimer = setTimeout(() => {
      unlockScroll();
    }, 4400); // slightly after the screen animation completes

    return () => {
      clearInterval(typewriterTimer);
      clearTimeout(textTimer);
      clearTimeout(screenTimer);
      clearTimeout(enableScrollingTimer);
      unlockScroll();
    };
  }, []);

  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 z-70 items-center justify-center transition-all duration-600 ease-out bg-linear-[35deg] from-secondary from-0% via-primary via-35% to-accent to-140% ${
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
            ? "fixed inset-0 z-70 flex bg-linear-[35deg] from-secondary from-0% via-primary/100 via-35% to-accent to-140% min-h-[100vh]"
            : "hidden"
        }`}
      ></div>
    );
  }
}

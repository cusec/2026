"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function InstallLink() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    // Check if iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <span className="text-light-mode/80">
        You can also{" "}
        <button
          onClick={handleInstallClick}
          className="underline text-accent hover:text-accent/80 transition-colors cursor-pointer"
        >
          install
        </button>{" "}
        it locally on your phone.
      </span>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-[#1a1a2e] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-4">
              Install on iPhone/iPad
            </h3>
            <div className="space-y-3 text-white/90 text-sm">
              <p>
                <span className="text-accent font-semibold">1.</span> Tap the
                Share button in Safari
              </p>
              <p>
                <span className="text-accent font-semibold">2.</span> Scroll
                down and tap &quot;Add to Home Screen&quot;
              </p>
              <p>
                <span className="text-accent font-semibold">3.</span> Tap
                &quot;Add&quot; to install
              </p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-5 bg-accent text-white py-2 rounded-xl font-semibold hover:bg-accent/90 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

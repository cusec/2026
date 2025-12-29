"use client";

import { useEffect } from "react";
import { AppWindow } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: Array<string>;
  readonly userChoice?: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt?(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null;

    const installButton = document.getElementById("installButton");

    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installButton) {
        installButton.hidden = false;
      }
    };

    const installApp = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt?.();
        const { outcome } = await deferredPrompt.userChoice!;
        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      }
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    if (installButton) {
      installButton.addEventListener("click", installApp);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
      if (installButton) {
        installButton.removeEventListener("click", installApp);
      }
    };
  }, []);

  return (
    <button
      id="installButton"
      hidden
      className="flex items-center max-w-fit px-4 py-4 text-lg bg-transparent border-b-2 text-light-mode/90 border-light-mode/50 email-hover"
    >
      <AppWindow className="w-6 h-6 mr-3" aria-hidden="true" />
      Install 2026 App
    </button>
  );
};

export default InstallPrompt;

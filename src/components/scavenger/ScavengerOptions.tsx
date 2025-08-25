"use client";

import { useEffect, useState } from "react";
import HuntItemsModal from "./HuntItemsModal";

interface ScavengerOptionsProps {
  dbUser?: {
    _id: string;
    email: string;
    name?: string;
    points: number;
    history: string[];
  } | null;
}

const ScavengerOptions = ({ dbUser: initialDbUser }: ScavengerOptionsProps) => {
  const [dbUser, setDbUser] = useState(initialDbUser);
  const [loading, setLoading] = useState(!initialDbUser);
  const [error, setError] = useState<string | null>(null);
  const [isHuntItemsModalOpen, setIsHuntItemsModalOpen] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (dbUser) return; // Already have user data

      try {
        setLoading(true);
        console.log("Making POST request to /api/user to initialize user...");

        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to initialize user");
        }

        const data = await response.json();
        console.log("User data received:", data);

        if (data.success) {
          setDbUser({
            _id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            points: data.user.points,
            history: [],
          });
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Error initializing user:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [dbUser]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading user data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setDbUser(null);
            }}
            className="mt-2 px-4 py-2 text-xs rounded bg-red-100 text-red-800 hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {dbUser && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Points:{" "}
            <span className="font-semibold text-primary">{dbUser.points}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Items Found: {dbUser.history.length}
          </p>
        </div>
      )}
      <button
        onClick={() => setIsHuntItemsModalOpen(true)}
        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/80 transition"
      >
        Hunt Items
      </button>
      <button className="px-4 py-2 rounded-lg bg-accent text-white font-semibold shadow hover:bg-accent/80 transition">
        Find Items
      </button>

      <HuntItemsModal
        isOpen={isHuntItemsModalOpen}
        onClose={() => setIsHuntItemsModalOpen(false)}
      />
    </div>
  );
};

export default ScavengerOptions;

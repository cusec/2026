"use client";

import { useEffect, useState } from "react";
import HuntItemsModal from "./HuntItemsModal";
import ClaimHuntItemModal from "./ClaimHuntItemModal";
import UsersManagementModal from "./users/UsersManagementModal";
import ClaimAttemptsModal from "./claimAttempts/ClaimAttemptsModal";
import AuditLogsModal from "./admin/AuditLogsModal";
import { Auth0User, DbUser } from "@/lib/interface";

interface ScavengerOptionsProps {
  user?: Auth0User | null;
  dbUser?: DbUser | null;
}

const ScavengerOptions = ({
  user,
  dbUser: initialDbUser,
}: ScavengerOptionsProps) => {
  const [dbUser, setDbUser] = useState(initialDbUser);
  const [loading, setLoading] = useState(!initialDbUser);
  const [error, setError] = useState<string | null>(null);
  const [isHuntItemsModalOpen, setIsHuntItemsModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isClaimAttemptsModalOpen, setIsClaimAttemptsModalOpen] =
    useState(false);
  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (dbUser) return; // Already have user data

      try {
        setLoading(true);
        console.log("Making POST request to /api/users to initialize user...");

        const response = await fetch("/api/users", {
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
            history: data.user.history || [],
            claim_attempts: [],
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

  // Handle successful claim - update user points and history
  const handleClaimSuccess = (newPoints: number, totalItems: number) => {
    if (dbUser) {
      // Create a new history array with the updated count
      // Note: The actual item ID would be added by the API, but for UI purposes
      // we just need to update the count to reflect the new total
      const updatedHistory = [...dbUser.history];
      while (updatedHistory.length < totalItems) {
        updatedHistory.push("claimed"); // Placeholder - actual IDs managed by API
      }

      setDbUser({
        ...dbUser,
        points: newPoints,
        history: updatedHistory,
      });
    }
  };

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
      {user?.["cusec/roles"]?.includes("Admin") ? (
        <>
          <button
            onClick={() => setIsHuntItemsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/80 transition"
          >
            Hunt Items (Admin)
          </button>
          <button
            onClick={() => setIsUsersModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition"
          >
            Users (Admin)
          </button>
          <button
            onClick={() => setIsClaimAttemptsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow hover:bg-orange-700 transition"
          >
            Claim Attempts (Admin)
          </button>
          <button
            onClick={() => setIsAuditLogsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            Audit Logs (Admin)
          </button>
        </>
      ) : null}
      <button
        onClick={() => setIsClaimModalOpen(true)}
        className="px-4 py-2 rounded-lg bg-accent text-white font-semibold shadow hover:bg-accent/80 transition"
      >
        Claim Hunt Item
      </button>

      <HuntItemsModal
        isOpen={isHuntItemsModalOpen}
        onClose={() => setIsHuntItemsModalOpen(false)}
      />

      <ClaimHuntItemModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSuccess={handleClaimSuccess}
        userId={dbUser?._id}
      />

      <UsersManagementModal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
      />

      <ClaimAttemptsModal
        isOpen={isClaimAttemptsModalOpen}
        onClose={() => setIsClaimAttemptsModalOpen(false)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsModalOpen}
        onClose={() => setIsAuditLogsModalOpen(false)}
      />
    </div>
  );
};

export default ScavengerOptions;

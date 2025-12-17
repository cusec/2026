"use client";

import { useState } from "react";
import { QrCode, HelpCircle, LogOut } from "lucide-react";
import { DbUser } from "@/lib/interface";
import ItemClaim from "./user/ItemClaim";

interface UserHuntProps {
  dbUser: DbUser;
  onPointsUpdate?: (newPoints: number) => void;
}

const UserHunt = ({ dbUser, onPointsUpdate }: UserHuntProps) => {
  const [points, setPoints] = useState(dbUser.points);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
    onPointsUpdate?.(newPoints);
  };

  const handleGetHelp = () => {
    // Placeholder for future help functionality
    console.log("Get Help clicked");
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-8">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome {dbUser.name || "Hunter"}!
          </h2>
          <p className="text-lg">
            You have <span className="font-bold text-accent">{points}</span>{" "}
            points
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
          >
            <QrCode className="mr-3 h-6 w-6" />
            Scan Item
          </button>

          <a
            href={`/auth/logout?returnTo=${process.env.APP_BASE_URL}/scavenger`}
          >
            <button className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover">
              <LogOut className="mr-3 h-6 w-6" />
              Log Out
            </button>
          </a>
          <button
            onClick={handleGetHelp}
            className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
          >
            <HelpCircle className="mr-3 h-6 w-6" />
            Get Help
          </button>
        </div>
      </div>

      {/* Claim Modal */}
      <ItemClaim
        userId={dbUser._id}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onPointsUpdate={handlePointsUpdate}
      />
    </div>
  );
};

export default UserHunt;

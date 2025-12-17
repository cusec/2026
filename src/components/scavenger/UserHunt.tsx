"use client";

import { useState } from "react";
import { QrCode, Shield, LogOut, Gift } from "lucide-react";
import { Auth0User, DbUser } from "@/lib/interface";
import ItemClaim from "./user/ItemClaim";
import AdminPanel from "./admin/AdminPanel";
import RedeemPointsModal from "./volunteer/RedeemPointsModal";

interface UserHuntProps {
  user: Auth0User;
  dbUser: DbUser;
  onPointsUpdate?: (newPoints: number) => void;
}

const UserHunt = ({ user, dbUser, onPointsUpdate }: UserHuntProps) => {
  const [points, setPoints] = useState(dbUser.points);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isRedeemPointsModalOpen, setIsRedeemPointsModalOpen] = useState(false);

  const isAdmin = user?.["cusec/roles"]?.includes("Admin") ?? false;
  const isVolunteer = user?.["cusec/roles"]?.includes("Volunteer") ?? false;

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
    onPointsUpdate?.(newPoints);
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
        <div className="flex flex-col gap-4 justify-center items-center">
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
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Admin Panel Button - Only visible to admins */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
              >
                <Shield className="mr-3 h-6 w-6" />
                Admin Panel
              </button>
            )}

            {/* Redeem Points Button - Visible to admins and volunteers */}
            {(isAdmin || isVolunteer) && (
              <button
                onClick={() => setIsRedeemPointsModalOpen(true)}
                className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
              >
                <Gift className="mr-3 h-6 w-6" />
                Redeem Points
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ItemClaim
        userId={dbUser._id}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onPointsUpdate={handlePointsUpdate}
      />

      {/* Admin Panel Modal - Only rendered for admins */}
      {isAdmin && (
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

      {/* Redeem Points Modal - Only rendered for admins and volunteers */}
      {(isAdmin || isVolunteer) && (
        <RedeemPointsModal
          isOpen={isRedeemPointsModalOpen}
          onClose={() => setIsRedeemPointsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserHunt;

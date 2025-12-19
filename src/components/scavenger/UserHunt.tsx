"use client";

import { useState } from "react";
import {
  QrCode,
  Shield,
  LogOut,
  // Gift,
  AlertCircle,
  Package,
} from "lucide-react";
import { Auth0User, DbUser } from "@/lib/interface";
import ItemClaim from "./user/ItemClaim";
import AdminPanel from "./admin/AdminPanel";
import RedeemPointsModal from "./volunteer/RedeemPointsModal";
import InventoryModal from "./user/InventoryModal";
import Modal from "@/components/ui/modal";

interface UserHuntProps {
  user: Auth0User;
  dbUser: DbUser;
  linkedEmail?: string | null;
  onPointsUpdate?: (newPoints: number) => void;
}

const UserHunt = ({
  user,
  dbUser,
  linkedEmail,
  onPointsUpdate,
}: UserHuntProps) => {
  const [points, setPoints] = useState(dbUser.points || 0);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isRedeemPointsModalOpen, setIsRedeemPointsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [showLinkEmailWarning, setShowLinkEmailWarning] = useState(false);

  const isAdmin = user?.["cusec/roles"]?.includes("Admin") ?? false;
  const isVolunteer = user?.["cusec/roles"]?.includes("Volunteer") ?? false;

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
    onPointsUpdate?.(newPoints);
  };

  const handleScanClick = () => {
    if (!linkedEmail) {
      setShowLinkEmailWarning(true);
    } else {
      setIsClaimModalOpen(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-8">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome {dbUser.name || "Hunter"}!
            {linkedEmail && (
              <span className="text-lg font-normal text-light-mode/70">
                {" "}
                ({linkedEmail})
              </span>
            )}
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
              onClick={handleScanClick}
              className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
            >
              <QrCode className="mr-3 h-6 w-6" />
              Scan Item
            </button>

            <button
              onClick={() => setIsInventoryModalOpen(true)}
              className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
            >
              <Package className="mr-3 h-6 w-6" />
              Inventory
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
            {/* {(isAdmin || isVolunteer) && (
              <button
                onClick={() => setIsRedeemPointsModalOpen(true)}
                className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-4xl border-light-mode/50 bg-dark-mode/50 register-hover"
              >
                <Gift className="mr-3 h-6 w-6" />
                Redeem Points
              </button>
            )} */}
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

      {/* Inventory Modal */}
      <InventoryModal
        userId={dbUser._id}
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
      />

      {/* Link Email Warning Modal */}
      <Modal
        isOpen={showLinkEmailWarning}
        onClose={() => setShowLinkEmailWarning(false)}
        title="Email Required"
        className="max-w-md text-light-mode bg-dark-mode/90"
      >
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <p className="mb-6">
            You need to link an email first before you can scan items. Please
            link your ticket email to participate in the scavenger hunt.
          </p>
          <button
            onClick={() => setShowLinkEmailWarning(false)}
            className="px-6 py-2 bg-sunset rounded-lg border border-accent hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserHunt;

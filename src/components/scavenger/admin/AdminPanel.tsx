"use client";

import { useState } from "react";
import {
  X,
  Users,
  FileSearch,
  History,
  ClipboardList,
  ShoppingBag,
  Megaphone,
  Gem,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import HuntItemsModal from "./actions/huntItems/HuntItemsModal";
import ShopItemsModal from "./actions/shopItems/ShopItemsModal";
import UsersManagementModal from "./actions/users/UsersManagementModal";
import ClaimAttemptsModal from "./actions/claimAttempts/ClaimAttemptsModal";
import AuditLogsModal from "./actions/AuditLogsModal";
import NoticesModal from "./actions/notices/NoticesModal";
import CollectiblesModal from "./actions/collectibles/CollectiblesModal";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const AdminPanel = ({ isOpen, onClose, isAdmin }: AdminPanelProps) => {
  const [isHuntItemsModalOpen, setIsHuntItemsModalOpen] = useState(false);
  const [isShopItemsModalOpen, setIsShopItemsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isClaimAttemptsModalOpen, setIsClaimAttemptsModalOpen] =
    useState(false);
  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState(false);
  const [isNoticesModalOpen, setIsNoticesModalOpen] = useState(false);
  const [isCollectiblesModalOpen, setIsCollectiblesModalOpen] = useState(false);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="mx-4 max-w-[80vw] md:max-w-lg bg-dark-mode/90 text-light-mode rounded-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-light-mode/10 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Actions */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsUsersModalOpen(true)}
                className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
              >
                <Users className="mr-3 h-6 w-6" />
                Manage Users
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setIsHuntItemsModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <FileSearch className="mr-3 h-6 w-6" />
                    Manage Hunt Items
                  </button>

                  <button
                    onClick={() => setIsShopItemsModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <ShoppingBag className="mr-3 h-6 w-6" />
                    Manage Shop Prizes
                  </button>

                  <button
                    onClick={() => setIsCollectiblesModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <Gem className="mr-3 h-6 w-6" />
                    Manage Collectibles
                  </button>

                  <button
                    onClick={() => setIsNoticesModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <Megaphone className="mr-3 h-6 w-6" />
                    Manage Notices
                  </button>

                  <button
                    onClick={() => setIsClaimAttemptsModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <ClipboardList className="mr-3 h-6 w-6" />
                    View Claim Attempts
                  </button>

                  <button
                    onClick={() => setIsAuditLogsModalOpen(true)}
                    className="select-none flex items-center justify-center px-4 py-2 text-md font-semibold border-2 rounded-2xl border-light-mode/50 bg-dark-mode/50 register-hover"
                  >
                    <History className="mr-3 h-6 w-6" />
                    View Admin Logs
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Sub-modals */}
      <HuntItemsModal
        isOpen={isHuntItemsModalOpen}
        onClose={() => setIsHuntItemsModalOpen(false)}
      />

      <ShopItemsModal
        isOpen={isShopItemsModalOpen}
        onClose={() => setIsShopItemsModalOpen(false)}
      />

      <UsersManagementModal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        isAdmin={isAdmin}
      />

      <ClaimAttemptsModal
        isOpen={isClaimAttemptsModalOpen}
        onClose={() => setIsClaimAttemptsModalOpen(false)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsModalOpen}
        onClose={() => setIsAuditLogsModalOpen(false)}
      />

      <NoticesModal
        isOpen={isNoticesModalOpen}
        onClose={() => setIsNoticesModalOpen(false)}
      />

      <CollectiblesModal
        isOpen={isCollectiblesModalOpen}
        onClose={() => setIsCollectiblesModalOpen(false)}
      />
    </>
  );
};

export default AdminPanel;

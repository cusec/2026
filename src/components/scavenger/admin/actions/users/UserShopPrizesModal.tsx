import React, { useEffect, useState, useCallback } from "react";
import Modal from "@/components/ui/modal";
import { ShopItem } from "@/lib/interface";
import { Trash2, AlertTriangle } from "lucide-react";

interface UserShopPrizesModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const UserShopPrizesModal: React.FC<UserShopPrizesModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [shopPrizes, setShopPrizes] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShopPrizes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/shop-prizes`);
      const data = await res.json();
      if (data.success) {
        setShopPrizes(data.shopPrizes || []);
      } else {
        setError("Failed to fetch shop prizes");
      }
    } catch {
      setError("Failed to fetch shop prizes");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) fetchShopPrizes();
  }, [isOpen, userId, fetchShopPrizes]);

  // Remove one instance of a shop prize
  const handleRemove = async (instanceId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/shop-prizes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopPrizeId: instanceId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchShopPrizes();
      } else {
        setError(data.error || "Failed to remove shop prize");
      }
    } catch {
      setError("Failed to remove shop prize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      simple={true}
      className="max-w-lg text-dark-mode"
      title="User's Shop Prizes"
    >
      <div className="p-6">
        {/* Warning about points */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Important:</strong> Removing shop prizes here will{" "}
              <strong>NOT</strong> change the user&apos;s points. To update
              points, manually edit them in the user settings if you remove it
              here.
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {shopPrizes.length === 0 ? (
              <div className="text-center">No shop prizes found.</div>
            ) : (
              shopPrizes.map((prize) => (
                <div
                  key={prize._id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{prize.name}</p>
                    <p className="text-xs truncate">{prize.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(prize._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove shop prize"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserShopPrizesModal;

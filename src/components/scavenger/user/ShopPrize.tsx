"use client";

import { useState } from "react";
import { ShopItem } from "@/lib/interface";
import Modal from "@/components/ui/modal";
import { Search, User, X, Loader2 } from "lucide-react";

interface ShopPrizeProps {
  item: ShopItem;
  isVolunteerOrAdmin: boolean;
  onRedeemSuccess?: () => void;
}

interface SearchUser {
  _id: string;
  email: string;
  name: string;
  linked_email: string | null;
  discord_handle: string | null;
  points: number;
}

// Helper function to get image source from shop item
const getImageSrc = (item: ShopItem): string | null => {
  if (item.imageData && item.imageContentType) {
    return `data:${item.imageContentType};base64,${item.imageData}`;
  }
  return null;
};

const ShopPrize = ({
  item,
  isVolunteerOrAdmin,
  onRedeemSuccess,
}: ShopPrizeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const openItemModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openRedeemModal = () => {
    setIsRedeemModalOpen(true);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setRedeemError(null);
    setRedeemSuccess(null);
  };

  const closeRedeemModal = () => {
    setIsRedeemModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setRedeemError(null);
    setRedeemSuccess(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setRedeemError(null);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/shop/search-users?search=${encodeURIComponent(query)}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (user: SearchUser) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setRedeemError(null);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setRedeemError(null);
  };

  const handleRedeem = async () => {
    if (!selectedUser) return;

    // Check if user has enough points
    if (selectedUser.points < item.cost) {
      setRedeemError(
        `${selectedUser.name} doesn't have enough points. They have ${selectedUser.points} points but need ${item.cost}.`
      );
      return;
    }

    setIsRedeeming(true);
    setRedeemError(null);

    try {
      const response = await fetch("/api/shop/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopItemId: item._id,
          userId: selectedUser._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRedeemSuccess(data.message);
        setTimeout(() => {
          closeRedeemModal();
          onRedeemSuccess?.();
        }, 2000);
      } else {
        setRedeemError(data.error || "Failed to redeem item");
      }
    } catch (error) {
      console.error("Error redeeming item:", error);
      setRedeemError("Failed to redeem item. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const isSoldOut = item.limited && item.remaining === 0;

  return (
    <>
      <div className="flex flex-col gap-2 mx-auto justify-center items-center text-center p-2 bg-dark-mode/30 h-48 w-48 rounded-2xl border-2 border-light-mode/20 text-light-mode">
        {getImageSrc(item) && (
          <div className="w-18 h-18 rounded-full overflow-hidden bg-gray-200 shrink-0 ring-1 ring-light-mode/30 ring-offset-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageSrc(item)!}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p>{item.name}</p>

        <div className="flex items-center justify-center space-x-1 text-xs">
          <div className="flex items-center justify-center px-2 py-1 rounded-full bg-light-mode/20">
            {item.cost}
          </div>
          <button
            onClick={openItemModal}
            className="px-2 py-1 bg-dark-mode/10 border border-light-mode/30 rounded-full"
          >
            More Info
          </button>

          {item.limited && (
            <span className="bg-accent/80 px-2 py-1 rounded-full">
              {item.remaining} left
            </span>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={item.name}
        className="max-w-md text-dark-mode"
      >
        <div className="space-y-4">
          {/* Large Image */}
          {getImageSrc(item) && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageSrc(item)!}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700">{item.description}</p>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Cost:</span>
              <span className="text-primary font-bold">{item.cost} points</span>
            </div>
            {item.limited && (
              <div className="flex justify-between">
                <span className="font-medium">Availability:</span>
                <span
                  className={
                    item.remaining > 0 ? "text-orange-600" : "text-red-600"
                  }
                >
                  {item.remaining > 0
                    ? `${item.remaining} remaining`
                    : "Sold out"}
                </span>
              </div>
            )}
          </div>

          {/* Redeem Button (only for volunteers/admins) */}
          {isVolunteerOrAdmin && (
            <button
              onClick={() => {
                closeModal();
                openRedeemModal();
              }}
              disabled={isSoldOut}
              className="w-full py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSoldOut ? "Sold Out" : "Redeem for User"}
            </button>
          )}
        </div>
      </Modal>

      {/* Redeem Modal (for volunteers/admins) */}
      <Modal
        isOpen={isRedeemModalOpen}
        onClose={closeRedeemModal}
        title={`Redeem: ${item.name}`}
        className="max-w-md text-dark-mode"
      >
        <div className="space-y-4">
          {redeemSuccess ? (
            <div className="text-center py-4">
              <div className="text-green-600 font-semibold mb-2">
                ✓ {redeemSuccess}
              </div>
            </div>
          ) : (
            <>
              {/* Item Info */}
              <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg">
                {getImageSrc(item) && (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageSrc(item)!}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-primary font-bold">
                    {item.cost} points
                  </p>
                </div>
              </div>

              {/* User Selection */}
              {selectedUser ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected User
                  </label>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedUser.email}
                        </p>
                        {selectedUser.linked_email && (
                          <p className="text-xs text-gray-500">
                            Linked: {selectedUser.linked_email}
                          </p>
                        )}
                        {selectedUser.discord_handle && (
                          <p className="text-xs text-gray-500">
                            Discord: {selectedUser.discord_handle}
                          </p>
                        )}
                        <p className="text-sm font-medium text-primary">
                          {selectedUser.points} points available
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearSelectedUser}
                      className="p-1 hover:bg-blue-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Points Check */}
                  {selectedUser.points < item.cost && (
                    <p className="text-red-600 text-sm">
                      ⚠️ This user doesn&apos;t have enough points (needs{" "}
                      {item.cost}, has {selectedUser.points})
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Search for User
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search by name, email, linked email, or discord..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                    )}
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => selectUser(user)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-primary">
                            {user.points} points
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery.length >= 2 &&
                    !isSearching &&
                    searchResults.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No users found
                      </p>
                    )}
                </div>
              )}

              {/* Error Message */}
              {redeemError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {redeemError}
                </div>
              )}

              {/* Confirm Redeem Button */}
              <button
                onClick={handleRedeem}
                disabled={
                  !selectedUser ||
                  selectedUser.points < item.cost ||
                  isRedeeming
                }
                className="w-full py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redeeming...
                  </>
                ) : (
                  "Confirm Redemption"
                )}
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ShopPrize;

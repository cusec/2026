"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { ShopItem, Collectible, Auth0User, DbUser } from "@/lib/interface";
import ShopPrize from "./user/ShopPrize";
import ShopCollectible from "./user/ShopCollectible";

interface ShopProps {
  user?: Auth0User | null;
  dbUser?: DbUser | null;
}

interface ShopResponse {
  success: boolean;
  shopItems: ShopItem[];
}

interface CollectiblesResponse {
  success: boolean;
  collectibles: Collectible[];
}

const Shop = ({ user, dbUser }: ShopProps) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(dbUser?.points || 0);

  // Check if user is volunteer or admin
  const isAdmin = user?.["cusec/roles"]?.includes("Admin") ?? false;
  const isVolunteer = user?.["cusec/roles"]?.includes("Volunteer") ?? false;
  const isVolunteerOrAdmin = isAdmin || isVolunteer;

  useEffect(() => {
    fetchShopItems();
  }, []);

  // Update userPoints when dbUser changes
  useEffect(() => {
    setUserPoints(dbUser?.points || 0);
  }, [dbUser?.points]);

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const [shopResponse, collectiblesResponse] = await Promise.all([
        fetch("/api/shop"),
        fetch("/api/collectibles"),
      ]);

      if (!shopResponse.ok) {
        throw new Error("Failed to fetch shop items");
      }

      const shopData: ShopResponse = await shopResponse.json();
      const collectiblesData: CollectiblesResponse =
        await collectiblesResponse.json();

      if (shopData.success) {
        setShopItems(shopData.shopItems);
      } else {
        throw new Error("Failed to load shop data");
      }

      if (collectiblesData.success) {
        // Only show purchasable collectibles in the shop
        setCollectibles(
          collectiblesData.collectibles.filter((c) => c.purchasable)
        );
      }
    } catch (err) {
      console.error("Error fetching shop items:", err);
      setError("Failed to load shop");
    } finally {
      setLoading(false);
    }
  };

  const handleShopPrizeRedeemSuccess = () => {
    // Refresh shop items to update stock counts
    fetchShopItems();
  };

  const handleCollectibleRedeemSuccess = (newPoints: number) => {
    // Update user points after collectible purchase
    setUserPoints(newPoints);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-light-mode/90">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Shop</h2>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-700 rounded-lg h-16"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-light-mode/90">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Shop</h2>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-8">
        {/* Header */}

        <div className="flex items-center justify-center space-x-2">
          <ShoppingBag className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Shop</h2>
        </div>

        {/* Shop Items List */}
        {shopItems.length === 0 && collectibles.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
            <p>No items available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Shop Prizes Section */}
            {shopItems.length > 0 && (
              <div className="w-full flex flex-col items-center justify-center text-center sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {shopItems.map((item) => (
                  <ShopPrize
                    key={item._id}
                    item={item}
                    isVolunteerOrAdmin={isVolunteerOrAdmin}
                    onRedeemSuccess={handleShopPrizeRedeemSuccess}
                  />
                ))}
              </div>
            )}

            {/* Collectibles Section */}
            {collectibles.length > 0 && (
              <div className="w-full flex flex-col items-center justify-center text-center md:grid md:grid-cols-2 gap-4 pt-4">
                {collectibles.map((collectible) => (
                  <ShopCollectible
                    key={collectible._id}
                    collectible={collectible}
                    userPoints={userPoints}
                    onRedeemSuccess={handleCollectibleRedeemSuccess}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;

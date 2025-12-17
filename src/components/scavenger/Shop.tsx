"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { ShopItem } from "@/lib/interface";
import Modal from "@/components/ui/modal";
import Image from "next/image";

interface ShopResponse {
  success: boolean;
  shopItems: ShopItem[];
}

const Shop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/shop");

      if (!response.ok) {
        throw new Error("Failed to fetch shop items");
      }

      const data: ShopResponse = await response.json();

      if (data.success) {
        setShopItems(data.shopItems);
      } else {
        throw new Error("Failed to load shop data");
      }
    } catch (err) {
      console.error("Error fetching shop items:", err);
      setError("Failed to load shop");
    } finally {
      setLoading(false);
    }
  };

  const openItemModal = (item: ShopItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleRedeem = () => {
    // Placeholder for future redeem functionality
    console.log("Redeem clicked for:", selectedItem?.name);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-light-mode/90">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Shop</h2>
              <button
                disabled
                className="p-1 rounded-full hover:text-light-mode transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5 animate-spin" />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-700 rounded-lg h-16"
                />
              ))}
            </div>
            <div className="flex-1 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-700 rounded-lg h-16"
                />
              ))}
            </div>
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
              <button
                onClick={fetchShopItems}
                className="p-1 rounded-full hover:text-light-mode transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const firstColumn = shopItems.slice(0, 5);
  const secondColumn = shopItems.slice(5, 10);

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center space-x-2">
            <ShoppingBag className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Shop</h2>
            <button
              onClick={fetchShopItems}
              disabled={loading}
              className="p-1 rounded-full hover:text-light-mode transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          {shopItems.length > 0 && (
            <div className="mt-2 text-center text-sm">
              {shopItems.length} items available
            </div>
          )}
        </div>

        {/* Shop Items List */}
        {shopItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
            <p>No items available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {/* First column - items 1-5 */}
            <div className="flex-1 space-y-3">
              {firstColumn.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-light-mode/70 rounded-lg border transition-all duration-200 hover:shadow-md text-dark-mode"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={`/images/shop/${item.imageSlug}`}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm">
                        {item.cost} points
                        {item.limited && item.remaining > 0 && (
                          <span className="ml-2 text-orange-600">
                            ({item.remaining} left)
                          </span>
                        )}
                        {item.limited && item.remaining === 0 && (
                          <span className="ml-2 text-red-600">(Sold out)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => openItemModal(item)}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
                    >
                      More Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Second column - items 6-10 */}
            {secondColumn.length > 0 && (
              <div className="flex-1 space-y-3">
                {secondColumn.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-light-mode/70 rounded-lg border transition-all duration-200 hover:shadow-md text-dark-mode"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={`/images/shop/${item.imageSlug}`}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm">
                          {item.cost} points
                          {item.limited && item.remaining > 0 && (
                            <span className="ml-2 text-orange-600">
                              ({item.remaining} left)
                            </span>
                          )}
                          {item.limited && item.remaining === 0 && (
                            <span className="ml-2 text-red-600">
                              (Sold out)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => openItemModal(item)}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
                      >
                        More Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedItem?.name || "Item Details"}
        className="max-w-md"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Large Image */}
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={`/images/shop/${selectedItem.imageSlug}`}
                alt={selectedItem.name}
                width={400}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300">
              {selectedItem.description}
            </p>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Cost:</span>
                <span className="text-primary font-bold">
                  {selectedItem.cost} points
                </span>
              </div>
              {selectedItem.limited && (
                <div className="flex justify-between">
                  <span className="font-medium">Availability:</span>
                  <span
                    className={
                      selectedItem.remaining > 0
                        ? "text-orange-600"
                        : "text-red-600"
                    }
                  >
                    {selectedItem.remaining > 0
                      ? `${selectedItem.remaining} remaining`
                      : "Sold out"}
                  </span>
                </div>
              )}
              {selectedItem.moderated && (
                <div className="flex justify-between">
                  <span className="font-medium">Note:</span>
                  <span className="text-yellow-600">Requires approval</span>
                </div>
              )}
            </div>

            {/* Redeem Button */}
            <button
              onClick={handleRedeem}
              disabled={selectedItem.limited && selectedItem.remaining === 0}
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedItem.limited && selectedItem.remaining === 0
                ? "Sold Out"
                : "Redeem"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Shop;

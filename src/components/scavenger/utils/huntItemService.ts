import { HuntItem, HuntItemFormData } from "@/lib/interface";

export class HuntItemService {
  /**
   * Fetch all hunt items
   */
  static async fetchHuntItems(): Promise<HuntItem[]> {
    const response = await fetch("/api/hunt-items");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch hunt items");
    }

    return data.huntItems;
  }

  /**
   * Create a new hunt item
   */
  static async createHuntItem(formData: HuntItemFormData): Promise<HuntItem> {
    const response = await fetch("/api/hunt-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create hunt item");
    }

    return data.huntItem;
  }

  /**
   * Update an existing hunt item
   */
  static async updateHuntItem(item: HuntItem): Promise<HuntItem> {
    const response = await fetch(`/api/hunt-items/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: item.name,
        description: item.description,
        points: item.points,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update hunt item");
    }

    return data.huntItem;
  }

  /**
   * Delete a hunt item
   */
  static async deleteHuntItem(id: string): Promise<void> {
    const response = await fetch(`/api/hunt-items/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to delete hunt item");
    }
  }
}

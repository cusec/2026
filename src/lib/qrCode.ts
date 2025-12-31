/**
 * Generate QR code URL for display
 * @param identifier - The unique identifier for the QR code
 * @param size - The size of the QR code (default 250)
 * @param customBaseUrl - Optional custom base URL
 * @param fallback - If true, use fallback (qrserver.com) directly; otherwise, try QuickChart first
 * @returns {Promise<string>} - The QR code image URL
 */
export const getQRCodeURL = async (
  identifier: string,
  size: number = 250,
  customBaseUrl?: string,
  fallback: boolean = false
): Promise<string> => {
  const baseUrl =
    customBaseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://2026.cusec.net");
  const qrData = `${baseUrl}/scavenger?identifier=${encodeURIComponent(
    identifier
  )}`;

  // Fallback URL (api.qrserver.com)
  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    qrData
  )}`;

  if (fallback) {
    return fallbackUrl;
  }

  // QuickChart API URL
  // Use logo.png from public/images as center image
  const logoUrl = `https://2026.cusec.net/images/logo.png`;
  const quickChartUrl =
    `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}` +
    `&size=300&margin=0&centerImageUrl=${encodeURIComponent(logoUrl)}` +
    `&centerImageSize=0.4`;
  return quickChartUrl;
};

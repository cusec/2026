/**
 * Generate and download a QR code for a hunt item identifier
 */
export const generateAndDownloadQR = async (
  identifier: string,
  itemName: string
): Promise<void> => {
  try {
    // Create a simple QR code using a QR code service API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      identifier
    )}`;

    // Create a temporary link to download the QR code
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${itemName.replace(
      /[^a-zA-Z0-9]/g,
      "-"
    )}-${identifier}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw new Error("Failed to generate QR code");
  }
};

/**
 * Generate QR code URL for display
 */
export const getQRCodeURL = (
  identifier: string,
  size: number = 250
): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    identifier
  )}`;
};

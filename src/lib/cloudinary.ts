import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a base64 image to Cloudinary
 * @param base64Data - Base64 encoded image data (without data URL prefix)
 * @param contentType - MIME type of the image (e.g., "image/png")
 * @param folder - Cloudinary folder to store the image
 * @returns CloudinaryUploadResult with the image URL and metadata
 */
export async function uploadImage(
  base64Data: string,
  contentType: string,
  folder: string = "shop-items"
): Promise<CloudinaryUploadResult> {
  // Verify Cloudinary is configured
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Cloudinary environment variables are not configured:", {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    });
    throw new Error(
      "Cloudinary is not configured. Check environment variables."
    );
  }

  // Construct data URL from base64 data
  const dataUrl = `data:${contentType};base64,${base64Data}`;

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: folder,
      resource_type: "image",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Extract public_id from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public_id or null if not a valid Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default cloudinary;

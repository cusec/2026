// Script to generate PWA icons from a source image
// Run: node scripts/generate-pwa-icons.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_IMAGE = path.join(__dirname, "../public/images/logo.svg");
const OUTPUT_DIR = path.join(__dirname, "../public/icons/pwa");

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Generating PWA icons...");

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 102, b: 204, alpha: 1 }, // CUSEC primary color
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(
        `✗ Failed to generate ${size}x${size} icon:`,
        error.message
      );
    }
  }

  console.log("\nDone! Icons saved to:", OUTPUT_DIR);
  console.log(
    "\nNote: You may want to manually adjust the icons for better appearance."
  );
}

generateIcons().catch(console.error);

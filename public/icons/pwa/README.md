# PWA Icons Setup for CUSEC Scavenger Hunt

This folder should contain the following icon files for the PWA to work properly:

## Required Icons

You need to create PNG icons in the following sizes from your CUSEC logo:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` (also used as apple-touch-icon)
- `icon-384x384.png`
- `icon-512x512.png`

## Optional Screenshots (for better install experience)

- `screenshot-wide.png` (1280x720) - Desktop/tablet screenshot
- `screenshot-narrow.png` (720x1280) - Mobile screenshot

## How to Generate Icons

### Option 1: Online Tool (Easiest)

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your high-resolution logo (at least 512x512)
3. Download the generated icon pack
4. Extract and copy the icons to this folder

### Option 2: Using Sharp (Node.js)

Run this script from the project root:

```bash
npm install sharp --save-dev
node scripts/generate-pwa-icons.js
```

### Option 3: Using ImageMagick

```bash
# Install ImageMagick first, then run:
convert source-logo.png -resize 72x72 icon-72x72.png
convert source-logo.png -resize 96x96 icon-96x96.png
convert source-logo.png -resize 128x128 icon-128x128.png
convert source-logo.png -resize 144x144 icon-144x144.png
convert source-logo.png -resize 152x152 icon-152x152.png
convert source-logo.png -resize 192x192 icon-192x192.png
convert source-logo.png -resize 384x384 icon-384x384.png
convert source-logo.png -resize 512x512 icon-512x512.png
```

## Icon Design Tips

1. **Use a square canvas** - PWA icons should be perfectly square
2. **Add safe zone padding** - Keep important content within 80% of the icon (center area) for maskable icons
3. **Use a solid background** - Transparent backgrounds may look odd on some devices
4. **Test on both light/dark backgrounds** - Icons should be visible on any wallpaper

## Testing the PWA

1. Build the project: `npm run build`
2. Start the production server: `npm start`
3. Open Chrome DevTools → Application → Manifest to verify
4. Test the install prompt on mobile or desktop

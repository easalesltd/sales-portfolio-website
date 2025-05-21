const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = {
  favicon: [16, 32, 48],
  apple: [180, 167, 152, 144, 120, 114, 76, 72, 60, 57],
  android: [192, 512],
  ms: [144, 150, 310]
};

async function generateFavicons() {
  const sourceImage = path.join(__dirname, '../public/images/logo.svg.png');
  const outputDir = path.join(__dirname, '../public/favicons');

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Generate favicon.ico (16x16, 32x32, 48x48)
    const faviconBuffers = await Promise.all(
      sizes.favicon.map(size =>
        sharp(sourceImage)
          .resize(size, size)
          .toBuffer()
      )
    );
    await fs.writeFile(path.join(outputDir, 'favicon.ico'), Buffer.concat(faviconBuffers));

    // Generate PNG favicons for different sizes
    const allSizes = [...new Set([...sizes.favicon, ...sizes.apple, ...sizes.android, ...sizes.ms])];
    
    for (const size of allSizes) {
      await sharp(sourceImage)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
    }

    // Generate apple-touch-icon.png (180x180)
    await sharp(sourceImage)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));

    // Generate android-chrome-192x192.png and android-chrome-512x512.png
    await sharp(sourceImage)
      .resize(192, 192)
      .png()
      .toFile(path.join(outputDir, 'android-chrome-192x192.png'));
    
    await sharp(sourceImage)
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'android-chrome-512x512.png'));

    // Generate msapplication-TileImage.png (144x144)
    await sharp(sourceImage)
      .resize(144, 144)
      .png()
      .toFile(path.join(outputDir, 'msapplication-TileImage.png'));

    console.log('Favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 
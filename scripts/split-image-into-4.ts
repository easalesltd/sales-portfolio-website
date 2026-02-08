import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Splits a PNG image into 4 equal vertical sections for Instagram carousel posts
 * Usage: npx tsx scripts/split-image-into-4.ts <input-image-path>
 */
async function splitImageInto4(inputPath: string) {
  try {
    // Check if file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: File not found: ${inputPath}`);
      process.exit(1);
    }

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    if (!width || !height) {
      console.error('Error: Could not read image dimensions');
      process.exit(1);
    }

    console.log(`Original image dimensions: ${width}x${height}`);

    // Calculate section width (divide by 4)
    const sectionWidth = Math.floor(width / 4);
    const outputDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, path.extname(inputPath));

    console.log(`Section width: ${sectionWidth}px`);
    console.log(`Output directory: ${outputDir}`);

    // Extract and save each section
    for (let i = 0; i < 4; i++) {
      const left = i * sectionWidth;
      const outputPath = path.join(outputDir, `${baseName}-section-${i + 1}.png`);

      await sharp(inputPath)
        .extract({
          left,
          top: 0,
          width: sectionWidth,
          height: height,
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);

      console.log(`✓ Created: ${outputPath} (${sectionWidth}x${height})`);
    }

    console.log('\n✅ Successfully created 4 sections!');
    console.log(`Files saved in: ${outputDir}`);
  } catch (error) {
    console.error('Error processing image:', error);
    process.exit(1);
  }
}

// Get input file path from command line arguments
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: npx tsx scripts/split-image-into-4.ts <input-image-path>');
  console.error('Example: npx tsx scripts/split-image-into-4.ts public/images/spring-fair.png');
  process.exit(1);
}

splitImageInto4(inputPath);

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const aboutDir = path.join(__dirname, '../public/images/about');
const exts = ['.jpg', '.JPG'];
const maxWidth = 1600;
const quality = 80;

fs.readdirSync(aboutDir).forEach(file => {
  if (exts.includes(path.extname(file))) {
    const filePath = path.join(aboutDir, file);
    sharp(filePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer()
      .then(data => {
        fs.writeFileSync(filePath, data);
        console.log(`Optimized: ${file}`);
      })
      .catch(err => {
        console.error(`Error optimizing ${file}:`, err);
      });
  }
});

const file = 'DSC07186.JPG';
const filePath = path.join(aboutDir, file);

sharp(filePath)
  .rotate() // auto-orient based on EXIF
  .resize({ width: maxWidth, withoutEnlargement: true })
  .jpeg({ quality, mozjpeg: true })
  .toBuffer()
  .then(data => {
    fs.writeFileSync(filePath, data);
    console.log(`Auto-rotated and optimized: ${file}`);
  })
  .catch(err => {
    console.error(`Error optimizing ${file}:`, err);
  }); 
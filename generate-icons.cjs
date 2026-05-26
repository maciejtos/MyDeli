const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./public/favicon.svg');
  
  // Create apple-touch-icon.png (180x180) for iOS
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');
    
  console.log('Generated apple-touch-icon.png');

  // Create 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
    
  console.log('Generated pwa-192x192.png');

  // Create 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');

  console.log('Generated pwa-512x512.png');
}

generateIcons().catch(console.error);

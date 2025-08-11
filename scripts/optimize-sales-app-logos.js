#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const salesAppsDir = path.join(__dirname, '../public/images/sales-apps');

console.log('🎨 Sales App Logo Optimization Helper');
console.log('=====================================\n');

// Check if directory exists
if (!fs.existsSync(salesAppsDir)) {
  console.log('❌ Sales apps directory not found. Creating it...');
  fs.mkdirSync(salesAppsDir, { recursive: true });
  console.log('✅ Directory created successfully!\n');
}

console.log('📁 Directory: ' + salesAppsDir);
console.log('\n📋 Expected Logo Files:');
console.log('------------------------');

const expectedLogos = [
  'sales-pak.png', 
  'blue-alligator.png',
  'pixsell.png',
  'card-manager.png',
  'shopify.png',
  'inzant.png'
];

expectedLogos.forEach(logo => {
  const logoPath = path.join(salesAppsDir, logo);
  if (fs.existsSync(logoPath)) {
    const stats = fs.statSync(logoPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ ${logo} (${sizeKB} KB)`);
  } else {
    console.log(`❌ ${logo} - Missing`);
  }
});

console.log('\n🔧 Optimization Recommendations:');
console.log('--------------------------------');
console.log('• Logo dimensions: 96x96px or 128x128px (will be displayed at 48x48px)');
console.log('• File format: PNG with transparency preferred');
console.log('• File size: Keep under 50KB each');
console.log('• Color space: sRGB for web compatibility');

console.log('\n📥 How to Add Logos:');
console.log('---------------------');
console.log('1. Download logos from official company websites');
console.log('2. Place them in the sales-apps directory');
console.log('3. Rename them to match the expected filenames above');
console.log('4. Run this script again to verify');

console.log('\n🎯 Next Steps:');
console.log('---------------');
console.log('• Find and download the 7 sales app logos');
console.log('• Optimize them using tools like TinyPNG or ImageOptim');
console.log('• Place them in the sales-apps directory');
console.log('• The website will automatically use them with fallback icons');

console.log('\n💡 Pro Tips:');
console.log('-------------');
console.log('• Contact each company for official logo files');
console.log('• Ensure you have permission to use their logos');
console.log('• Test the website after adding logos');
console.log('• Logos will automatically fallback to generic icons if missing'); 
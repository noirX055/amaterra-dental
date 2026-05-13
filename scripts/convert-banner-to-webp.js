const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const inputPath = path.join(publicDir, 'banner-bg-v2.jpg');
const outputPath = path.join(publicDir, 'banner-bg-v2.webp');

const convertBanner = async () => {
  try {
    console.log('🖼️  Конвертация баннера в WebP...\n');

    const originalSize = fs.statSync(inputPath).size;

    const info = await sharp(inputPath)
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);

    const savings = ((originalSize - info.size) / originalSize * 100).toFixed(2);

    console.log(`✓ banner-bg-v2.jpg → banner-bg-v2.webp`);
    console.log(`  Размер: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(info.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Сохранено: ${savings}%`);
    console.log('\n✅ Конвертация завершена!');
  } catch (error) {
    console.error('✗ Ошибка при конвертации:', error.message);
  }
};

convertBanner();

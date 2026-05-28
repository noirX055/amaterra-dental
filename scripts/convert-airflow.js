const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const inputPath = path.join(publicDir, 'airflow.jpg');
const outputPath = path.join(publicDir, 'airflow.webp');

const convertImage = async () => {
  try {
    console.log('🖼️  Конвертация airflow.jpg в WebP...\n');

    const originalSize = fs.statSync(inputPath).size;

    const info = await sharp(inputPath)
      .rotate()
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);

    const savings = ((originalSize - info.size) / originalSize * 100).toFixed(2);

    console.log(`✓ airflow.jpg → airflow.webp`);
    console.log(`  Размер: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(info.size / 1024 / 1024).toFixed(2)}MB (сохранено ${savings}%)`);
    console.log('\n✅ Конвертация завершена!');
  } catch (error) {
    console.error('✗ Ошибка при конвертации:', error.message);
  }
};

convertImage();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Настройки оптимизации
const optimizeImage = async (inputPath) => {
  try {
    const tempPath = inputPath + '.tmp';

    const info = await sharp(inputPath)
      .rotate() // Автоматически исправляет ориентацию по EXIF
      .resize(800, 1067, { // 3:4 соотношение для врачей
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(tempPath);

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = info.size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    // Заменяем оригинал оптимизированной версией
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    console.log(`✓ ${path.basename(inputPath)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (сохранено ${savings}%)`);
  } catch (error) {
    console.error(`✗ Ошибка при оптимизации ${inputPath}:`, error.message);
  }
};

// Оптимизируем все изображения врачей
const optimizeDoctorImages = async () => {
  console.log('🖼️  Начинаем оптимизацию изображений врачей...\n');

  const doctorImages = fs.readdirSync(publicDir)
    .filter(file => file.startsWith('doctor-') && file.endsWith('.jpg'));

  for (const image of doctorImages) {
    const inputPath = path.join(publicDir, image);
    await optimizeImage(inputPath);
  }

  console.log('\n✅ Оптимизация завершена!');
};

optimizeDoctorImages();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Список файлов для конвертации
const filesToConvert = [
  'work1.JPG',
  'work2.JPG',
  'work3.JPG',
  'work4.JPG',
  'work5.JPG',
  'work6.JPG',
  'photodoctors.JPG',
  'doctorwork.JPG',
  'doctor work2.JPG',
  'amaterra vizit.JPG'
];

const convertImage = async (filename) => {
  try {
    const inputPath = path.join(publicDir, filename);

    // Проверяем существование файла
    if (!fs.existsSync(inputPath)) {
      console.log(`⊘ ${filename} - файл не найден, пропускаем`);
      return;
    }

    const outputFilename = filename.replace(/\.(JPG|jpg|JPEG|jpeg|PNG|png)$/, '.webp');
    const outputPath = path.join(publicDir, outputFilename);

    const originalSize = fs.statSync(inputPath).size;

    const info = await sharp(inputPath)
      .rotate() // Автоматически исправляет ориентацию по EXIF
      .resize(1920, null, { // Максимальная ширина 1920px, высота пропорционально
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);

    const savings = ((originalSize - info.size) / originalSize * 100).toFixed(2);

    console.log(`✓ ${filename} → ${outputFilename}`);
    console.log(`  Размер: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(info.size / 1024 / 1024).toFixed(2)}MB (сохранено ${savings}%)`);
  } catch (error) {
    console.error(`✗ Ошибка при конвертации ${filename}:`, error.message);
  }
};

const convertAll = async () => {
  console.log('🖼️  Начинаем конвертацию рабочих фотографий в WebP...\n');

  for (const file of filesToConvert) {
    await convertImage(file);
  }

  console.log('\n✅ Конвертация завершена!');
};

convertAll();

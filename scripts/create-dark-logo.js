const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const inputPath = path.join(publicDir, 'logo-large.webp');
const outputPath = path.join(publicDir, 'logo-large-dark.webp');

const createDarkLogo = async () => {
  try {
    console.log('🖼️  Создание тёмной версии логотипа...\n');

    const info = await sharp(inputPath)
      .negate() // Инвертирует цвета
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputPath);

    console.log(`✓ logo-large.webp → logo-large-dark.webp`);
    console.log(`  Размер: ${(info.size / 1024).toFixed(2)}KB`);
    console.log('\n✅ Готово!');
  } catch (error) {
    console.error('✗ Ошибка:', error.message);
  }
};

createDarkLogo();

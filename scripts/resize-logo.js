const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const inputPath = path.join(publicDir, 'logo.webp');
const outputPath = path.join(publicDir, 'logo-large.webp');

const resizeLogo = async () => {
  try {
    console.log('🖼️  Создание увеличенной версии логотипа...\n');

    const info = await sharp(inputPath)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputPath);

    console.log(`✓ logo.webp → logo-large.webp`);
    console.log(`  Размер: 800x800px, ${(info.size / 1024).toFixed(2)}KB`);
    console.log('\n✅ Готово!');
  } catch (error) {
    console.error('✗ Ошибка:', error.message);
  }
};

resizeLogo();

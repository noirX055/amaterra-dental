import sharp from "sharp";
import { resolve } from "path";

async function convertToWebp() {
  const inputPath = resolve(process.cwd(), "public/amaterrakabinet.jpg");
  const outputPath = resolve(process.cwd(), "public/amaterrakabinet.webp");

  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log("✓ Successfully converted amaterrakabinet.jpg to amaterrakabinet.webp");
  } catch (error) {
    console.error("Error converting image:", error);
    process.exit(1);
  }
}

convertToWebp();

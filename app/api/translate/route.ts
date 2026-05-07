import { NextRequest, NextResponse } from "next/server";

// MyMemory API имеет ограничение ~500 символов на запрос
const MAX_CHUNK_LENGTH = 500;

async function translateChunk(text: string, targetLang: string): Promise<string> {
  const sourceLang = "ru";
  const encodedText = encodeURIComponent(text);

  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }

  throw new Error("Invalid response from translation API");
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    // Если текст короткий - переводим сразу
    if (text.length <= MAX_CHUNK_LENGTH) {
      const translatedText = await translateChunk(text, targetLang);
      return NextResponse.json({ translatedText });
    }

    // Разбиваем длинный текст на предложения
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + " " + sentence).length <= MAX_CHUNK_LENGTH) {
        currentChunk += (currentChunk ? " " : "") + sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    // Переводим каждый кусок с небольшой задержкой (rate limiting)
    const translatedChunks: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        // Задержка 200ms между запросами
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      const translated = await translateChunk(chunks[i], targetLang);
      translatedChunks.push(translated);
    }

    const translatedText = translatedChunks.join(" ");
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

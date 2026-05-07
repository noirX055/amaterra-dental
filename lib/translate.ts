// Функция автоматического перевода текста через MyMemory API
// Использует серверный API route для избежания CORS проблем

export async function translateText(
  text: string,
  targetLang: "ro" | "en"
): Promise<string> {
  if (!text || text.trim() === "") {
    return text;
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.translatedText) {
      return data.translatedText;
    }

    throw new Error("Invalid response from translation API");
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Возвращаем оригинальный текст при ошибке
  }
}

export async function translateBlogPost(ruText: string) {
  const [roText, enText] = await Promise.all([
    translateText(ruText, "ro"),
    translateText(ruText, "en"),
  ]);

  return { roText, enText };
}

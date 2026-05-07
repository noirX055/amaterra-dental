"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";
import type { Lang } from "@/app/blocks/home/types";
import { LANG_STORAGE_KEY } from "@/app/blocks/home/i18n";
import { translateText } from "@/lib/translate";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("ru");
  const [translatedTitle, setTranslatedTitle] = useState<string>("");
  const [translatedExcerpt, setTranslatedExcerpt] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "ru" || stored === "ro" || stored === "en") setLang(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await blogService.getPostBySlug(slug);
        if (!data) {
          router.push("/");
          return;
        }
        setPost(data);
      } catch (error) {
        console.error("Failed to load blog post:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [slug, router]);

  useEffect(() => {
    if (!post) return;

    // If selected language matches source language, no translation needed
    if (lang === post.source_lang) {
      setTranslatedTitle(post.title);
      setTranslatedExcerpt(post.excerpt || "");
      setTranslatedContent(post.content);
      return;
    }

    // Translate to selected language
    async function translate() {
      setIsTranslating(true);
      try {
        const [title, excerpt, content] = await Promise.all([
          translateText(post.title, lang as "ro" | "en"),
          post.excerpt ? translateText(post.excerpt, lang as "ro" | "en") : Promise.resolve(""),
          translateText(post.content, lang as "ro" | "en"),
        ]);

        setTranslatedTitle(title);
        setTranslatedExcerpt(excerpt);
        setTranslatedContent(content);
      } catch (error) {
        console.error("Translation failed:", error);
        // Fallback to original
        setTranslatedTitle(post.title);
        setTranslatedExcerpt(post.excerpt || "");
        setTranslatedContent(post.content);
      } finally {
        setIsTranslating(false);
      }
    }

    translate();
  }, [post, lang]);

  const getTitle = () => translatedTitle;
  const getExcerpt = () => translatedExcerpt;
  const getContent = () => translatedContent;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (lang === "ru") {
      return date.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
    }
    if (lang === "ro") {
      return date.toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" });
    }
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getBackText = () => {
    if (lang === "ru") return "← Назад к статьям";
    if (lang === "ro") return "← Înapoi la articole";
    return "← Back to articles";
  };

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  if (isTranslating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 mx-auto" />
          <p className="text-sm text-zinc-600">
            {lang === "ru" && "Перевод статьи..."}
            {lang === "ro" && "Traducerea articolului..."}
            {lang === "en" && "Translating article..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            {getBackText()}
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1">
            <button
              onClick={() => handleLangChange("ru")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                lang === "ru"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              RU
            </button>
            <button
              onClick={() => handleLangChange("ro")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                lang === "ro"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              RO
            </button>
            <button
              onClick={() => handleLangChange("en")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.image_url && (
        <div className="relative h-[60vh] w-full overflow-hidden bg-zinc-100">
          <img
            src={post.image_url}
            alt={getTitle()}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {formatDate(post.published_at || post.created_at)}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {getTitle()}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Excerpt */}
        {getExcerpt() && (
          <div className="mb-12 border-l-4 border-zinc-900 bg-zinc-50 p-6 text-xl leading-relaxed text-zinc-700">
            {getExcerpt()}
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg prose-zinc max-w-none">
          {getContent().split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 text-lg leading-relaxed text-zinc-800">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Footer CTA */}
      <div className="border-t border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-12 shadow-xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {lang === "ru" && "Готовы записаться на прием?"}
              {lang === "ro" && "Gata să vă programați?"}
              {lang === "en" && "Ready to book an appointment?"}
            </h2>
            <p className="mb-8 text-lg text-zinc-600">
              {lang === "ru" && "Свяжитесь с нами сегодня и получите профессиональную стоматологическую помощь"}
              {lang === "ro" && "Contactați-ne astăzi și primiți îngrijire stomatologică profesională"}
              {lang === "en" && "Contact us today and get professional dental care"}
            </p>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-zinc-800 hover:shadow-2xl"
            >
              {lang === "ru" && "Записаться"}
              {lang === "ro" && "Programează-te"}
              {lang === "en" && "Book Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

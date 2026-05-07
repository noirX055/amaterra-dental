"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HomeI18n } from "./types";
import type { Lang } from "./types";
import type { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";
import { translateText } from "@/lib/translate";

interface Props {
  t: HomeI18n;
  lang: Lang;
}

export function LatestInsightsBlock({ t, lang }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedPosts, setTranslatedPosts] = useState<Map<string, { title: string; excerpt: string }>>(new Map());

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await blogService.getPublishedPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    async function translatePosts() {
      setIsTranslating(true);
      const newTranslations = new Map<string, { title: string; excerpt: string }>();

      for (const post of posts) {
        // Если язык совпадает с оригиналом - не переводим
        if (lang === post.source_lang) {
          newTranslations.set(post.id, {
            title: post.title,
            excerpt: post.excerpt || "",
          });
          continue;
        }

        // Переводим на выбранный язык
        try {
          const [translatedTitle, translatedExcerpt] = await Promise.all([
            translateText(post.title, lang as "ro" | "en"),
            post.excerpt ? translateText(post.excerpt, lang as "ro" | "en") : Promise.resolve(""),
          ]);

          newTranslations.set(post.id, {
            title: translatedTitle,
            excerpt: translatedExcerpt,
          });
        } catch (error) {
          console.error("Translation failed for post:", post.id, error);
          // Fallback к оригиналу
          newTranslations.set(post.id, {
            title: post.title,
            excerpt: post.excerpt || "",
          });
        }
      }

      setTranslatedPosts(newTranslations);
      setIsTranslating(false);
    }

    translatePosts();
  }, [posts, lang]);

  const getTitle = (post: BlogPost) => {
    const translated = translatedPosts.get(post.id);
    return translated?.title || post.title;
  };

  const getExcerpt = (post: BlogPost) => {
    const translated = translatedPosts.get(post.id);
    return translated?.excerpt || post.excerpt || "";
  };

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

  if (isLoading) {
    return (
      <section
        data-reveal-on-scroll
        className="relative mx-auto mt-20 flex w-full max-w-7xl flex-col px-4 pt-12 pb-12 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
      >
        <h2 className="text-4xl font-semibold tracking-tighter text-zinc-900 sm:text-5xl mb-10">
          {t.insightsTitle}
        </h2>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
        </div>
      </section>
    );
  }

  // Use posts from database if available, otherwise fallback to i18n
  const usePosts = posts.length > 0;
  const items = usePosts ? posts : (t.insightsItems || []);

  if (items.length === 0) {
    return null;
  }

  const visibleItems = items.slice(currentIndex, currentIndex + 3);
  const canGoNext = currentIndex + 3 < items.length;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section
      data-reveal-on-scroll
      className="relative mx-auto mt-20 flex w-full max-w-7xl flex-col px-4 pt-12 pb-12 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-semibold tracking-tighter text-zinc-900 sm:text-5xl">
          {t.insightsTitle}
        </h2>

        {items.length > 3 && (
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-all duration-300 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-all duration-300 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isTranslating && (
          <div className="col-span-full flex items-center justify-center py-10">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
              <span className="text-sm text-zinc-600">
                {lang === "ru" && "Перевод статей..."}
                {lang === "ro" && "Traducerea articolelor..."}
                {lang === "en" && "Translating articles..."}
              </span>
            </div>
          </div>
        )}
        {!isTranslating && usePosts
          ? visibleItems.map((post: any) => {
              const hasImage = !!post.image_url;
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col items-center justify-between overflow-hidden rounded-[32px] p-8 text-center min-h-[460px] transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: hasImage ? "transparent" : "#F7EDEB",
                    backgroundImage: hasImage ? `url(${post.image_url})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {hasImage && <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />}
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-between">
                    <div className={`rounded-full border px-5 py-1.5 text-sm font-medium transition-colors ${hasImage ? "border-white/40 text-white" : "border-black/15 text-zinc-700"}`}>
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                    <h3 className={`my-auto w-4/5 text-2xl sm:text-[28px] font-semibold tracking-tight leading-snug ${hasImage ? "text-white" : "text-zinc-900"}`}>
                      {getTitle(post)}
                    </h3>
                    <p className={`mt-auto text-[14px] leading-relaxed font-medium sm:text-[15px] line-clamp-3 ${hasImage ? "text-zinc-200" : "text-zinc-600"}`}>
                      {getExcerpt(post)}
                    </p>
                  </div>
                </Link>
              );
            })
          : visibleItems.map((item: any, index: number) => {
              const hasImage = !!item.image;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-between overflow-hidden rounded-[32px] p-8 text-center min-h-[460px] transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: hasImage ? "transparent" : "#F7EDEB",
                    backgroundImage: hasImage ? `url(${item.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {hasImage && <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />}
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-between">
                    <div className={`rounded-full border px-5 py-1.5 text-sm font-medium transition-colors ${hasImage ? "border-white/40 text-white" : "border-black/15 text-zinc-700"}`}>
                      {item.date}
                    </div>
                    <h3 className={`my-auto w-4/5 text-2xl sm:text-[28px] font-semibold tracking-tight leading-snug ${hasImage ? "text-white" : "text-zinc-900"}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-auto text-[14px] leading-relaxed font-medium sm:text-[15px] ${hasImage ? "text-zinc-200" : "text-zinc-600"}`}>
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {items.length > 3 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: Math.ceil(items.length / 3) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx * 3)}
              className={`h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 3) === idx ? "w-8 bg-zinc-900" : "w-2 bg-zinc-300 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

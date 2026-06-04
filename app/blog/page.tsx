"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { HeroHeader } from "@/app/blocks/home/HeroHeader";
import { FooterBlock } from "@/app/blocks/home/FooterBlock";
import { BookingModal } from "@/app/blocks/home/BookingModal";
import { I18N, LANG_STORAGE_KEY } from "@/app/blocks/home/i18n";
import type { Lang } from "@/app/blocks/home/types";
import type { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";
import { translateText } from "@/lib/translate";

export default function BlogPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedPosts, setTranslatedPosts] = useState<Map<string, { title: string; excerpt: string }>>(new Map());

  // Load language from storage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "ru" || stored === "ro" || stored === "en") setLang(stored as Lang);
    } catch {
      // ignore
    }
  }, []);

  // Sync language to storage
  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const t = useMemo(() => I18N[lang], [lang]);

  // Load posts
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

  // Translate posts if needed
  useEffect(() => {
    if (posts.length === 0) return;

    async function translatePosts() {
      setIsTranslating(true);
      const newTranslations = new Map<string, { title: string; excerpt: string }>();

      for (const post of posts) {
        if (lang === post.source_lang) {
          newTranslations.set(post.id, {
            title: post.title,
            excerpt: post.excerpt || "",
          });
          continue;
        }
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

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9] text-zinc-900">
      {/* Header section */}
      <div className="bg-zinc-950 rounded-b-[28px] shadow-sm pb-2">
        <HeroHeader
          t={t}
          lang={lang}
          isLangOpen={isLangOpen}
          langMenuRef={langMenuRef}
          setIsLangOpen={setIsLangOpen}
          setLang={setLang}
        />
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tighter text-zinc-900 sm:text-5xl">
            {t.insightsTitle || "Наши статьи"}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            {lang === "ru" && "Полезная информация о здоровье зубов и современных методах лечения."}
            {lang === "ro" && "Informații utile despre sănătatea dentară și metode moderne de tratament."}
            {lang === "en" && "Useful information about dental health and modern treatment methods."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-zinc-500 text-lg">
            {lang === "ru" ? "Статей пока нет." : (lang === "ro" ? "Nu există articole încă." : "No articles yet.")}
          </p>
        ) : (
          <>
            {isTranslating && (
              <div className="mb-8 flex items-center gap-3 bg-zinc-100 w-fit px-4 py-2 rounded-full">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                <span className="text-sm font-medium text-zinc-700">
                  {lang === "ru" && "Перевод статей..."}
                  {lang === "ro" && "Traducerea articolelor..."}
                  {lang === "en" && "Translating articles..."}
                </span>
              </div>
            )}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const hasImage = !!post.image_url;
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[24px] bg-white border border-zinc-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
                      {hasImage ? (
                        <div
                          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${post.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#F7EDEB] text-zinc-400">
                          <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-4 text-sm font-medium text-emerald-600">
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      <h3 className="mb-4 text-xl font-bold leading-tight tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors sm:text-2xl">
                        {getTitle(post)}
                      </h3>
                      <p className="mb-6 mt-auto text-[15px] leading-relaxed text-zinc-600 line-clamp-3">
                        {getExcerpt(post)}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {lang === "ru" && "Читать далее"}
                        {lang === "ro" && "Citește mai mult"}
                        {lang === "en" && "Read more"}
                        <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>

      <BookingModal
        t={t}
        lang={lang}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <FooterBlock t={t} />
    </div>
  );
}

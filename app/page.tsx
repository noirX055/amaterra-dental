"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AboutUsBlock } from "./blocks/home/AboutUsBlock";
import { HeroBackground } from "./blocks/home/HeroBackground";
import { HeroContent } from "./blocks/home/HeroContent";
import { HeroHeader } from "./blocks/home/HeroHeader";
import { SpecializationsBlock } from "./blocks/home/SpecializationsBlock";
import { OurServicesBlock } from "./blocks/home/OurServicesBlock";
import { OurDoctorsBlock } from "./blocks/home/OurDoctorsBlock";
import { ReviewsBlock } from "./blocks/home/ReviewsBlock";
import { FindUsBlock } from "./blocks/home/FindUsBlock";
import { LatestInsightsBlock } from "./blocks/home/LatestInsightsBlock";
import { FooterBlock } from "./blocks/home/FooterBlock";
import { BookingModal } from "./blocks/home/BookingModal";
import { ChatWidget } from "./blocks/home/ChatWidget";
import { I18N, LANG_STORAGE_KEY } from "./blocks/home/i18n";
import type { Lang } from "./blocks/home/types";

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "ru" || stored === "ro" || stored === "en") setLang(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    if (!isLangOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsLangOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLangOpen]);

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-on-scroll]")
    );
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  const t = useMemo(() => {
    console.log("Language changed to:", lang);
    return I18N[lang];
  }, [lang]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white font-sans text-zinc-900 dark:bg-white dark:text-zinc-900">
      <main className="flex flex-1 flex-col gap-3 p-0 sm:gap-4">
        <section
          id="home"
          data-reveal-on-scroll
          className="hero-appear relative flex h-svh w-full flex-col overflow-hidden rounded-b-[28px] bg-zinc-950"
        >
          <HeroBackground />
          <HeroHeader
            t={t}
            lang={lang}
            isLangOpen={isLangOpen}
            langMenuRef={langMenuRef}
            setIsLangOpen={setIsLangOpen}
            setLang={setLang}
          />
          <HeroContent t={t} onBookClick={() => setIsBookingModalOpen(true)} />
        </section>
        <AboutUsBlock t={t} />
        <SpecializationsBlock t={t} />
        <OurServicesBlock t={t} />
        <OurDoctorsBlock t={t} />
        <ReviewsBlock t={t} />
        <FindUsBlock t={t} lang={lang} />
        <LatestInsightsBlock t={t} lang={lang} />
      </main>
      <BookingModal
        t={t}
        lang={lang}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <ChatWidget lang={lang} />
      <FooterBlock t={t} />
    </div>
  );
}

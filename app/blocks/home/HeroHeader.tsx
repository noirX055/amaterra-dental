import Image from "next/image";
import { useState } from "react";
import { LANGS } from "./i18n";
import type { HomeI18n, Lang } from "./types";

type HeroHeaderProps = {
  t: HomeI18n;
  lang: Lang;
  isLangOpen: boolean;
  langMenuRef: React.RefObject<HTMLDivElement | null>;
  setIsLangOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
};

export function HeroHeader({
  t,
  lang,
  isLangOpen,
  langMenuRef,
  setIsLangOpen,
  setLang,
}: HeroHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("HeroHeader render, current lang:", lang, "isOpen:", isLangOpen);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    // Небольшая задержка для закрытия меню
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <header className="hero-appear-soft hero-delay-1 relative flex items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 md:px-8">
      <a href="#" className="inline-flex h-10 flex-shrink-0 items-center overflow-visible sm:h-14">
        <Image
          src="/logo-large.webp"
          alt={t.brand}
          width={210}
          height={56}
          priority
          className="h-10 w-auto origin-left scale-[2.2] object-contain sm:h-14 sm:scale-[3.2] md:scale-[3.5]"
        />
      </a>

      <nav className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2 py-1 text-sm font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-200 md:flex md:ml-auto md:mr-4">
        {t.nav.map((label, index) => {
          const sectionIds = ["#home", "#about", "#services", "#reviews", "#appointment"];
          const href = sectionIds[index] || "#";

          return (
            <a
              key={label}
              href={href}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-black/4 hover:text-zinc-900 dark:hover:bg-white/6 dark:hover:text-white"
            >
              {label}
            </a>
          );
        })}
      </nav>

      <div className="flex flex-shrink-0 items-center justify-end gap-2">
        {/* Burger button for mobile */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              console.log("Toggle menu, current:", isLangOpen);
              setIsLangOpen(!isLangOpen);
            }}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-2.5 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950 sm:h-10 sm:gap-2 sm:px-3 sm:text-sm"
          >
            {lang.toUpperCase()}
            <span className="text-xs leading-none opacity-70">▾</span>
          </button>

          {isLangOpen && (
            <div
              ref={langMenuRef}
              className="absolute right-0 z-[9999] mt-2 w-40 overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-2xl"
              style={{ pointerEvents: 'auto' }}
            >
              {LANGS.map((code) => {
                console.log("Rendering button for:", code);
                return (
                  <div
                    key={code}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Selected language (mousedown):", code);
                      setLang(code);
                      setIsLangOpen(false);
                    }}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      code === lang
                        ? "bg-black/6 text-zinc-950"
                        : "text-zinc-800 hover:bg-black/4"
                    }`}
                  >
                    <span className="uppercase">{code}</span>
                    {code === lang && <span className="opacity-80">✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <a
          href={`tel:${t.phoneTel}`}
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-2 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950 lg:gap-3 lg:px-4"
        >
          <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 transition-colors group-hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20 sm:h-8 sm:w-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>

          <span className="hidden flex-col items-start leading-none lg:flex">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              {t.callNow}
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {t.phoneNumberDisplay}
            </span>
          </span>
        </a>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay with blur */}
          <div
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-md md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <div className="fixed left-0 right-0 top-[80px] z-[9999] px-4 md:hidden">
            <nav className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl">
              {t.nav.map((label, index) => {
                const sectionIds = ["#home", "#about", "#services", "#reviews", "#appointment"];
                const href = sectionIds[index] || "#";

                return (
                  <button
                    key={label}
                    onClick={() => handleNavClick(href)}
                    className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-black/5"
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

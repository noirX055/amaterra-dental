import Image from "next/image";
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
  console.log("HeroHeader render, current lang:", lang, "isOpen:", isLangOpen);

  return (
    <header className="hero-appear-soft hero-delay-1 relative flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
      <a href="#" className="inline-flex h-14 flex-1 items-center overflow-visible pl-2 sm:pl-3">
        <Image
          src="/logo.webp"
          alt={t.brand}
          width={210}
          height={56}
          className="h-14 w-auto origin-left scale-[3.2] object-contain sm:scale-[3.5]"
        />
      </a>

      <nav className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2 py-1 text-sm font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-200 md:flex">
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

      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              console.log("Toggle menu, current:", isLangOpen);
              setIsLangOpen(!isLangOpen);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950"
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
          className="group inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 transition-colors group-hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>

          <span className="flex flex-col items-start leading-none">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              {t.callNow}
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {t.phoneNumberDisplay}
            </span>
          </span>
        </a>
      </div>
    </header>
  );
}

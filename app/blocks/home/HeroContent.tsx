import type { HomeI18n } from "./types";

type HeroContentProps = {
  t: HomeI18n;
  onBookClick: () => void;
};

export function HeroContent({ t, onBookClick }: HeroContentProps) {
  return (
    <div className="hero-appear-soft hero-delay-2 relative grid flex-1 content-end gap-10 px-6 pb-10 pt-6 sm:px-8 sm:pb-14 lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-10">
      <div className="lg:col-span-7">
        <p className="text-sm font-semibold tracking-wide text-zinc-100 drop-shadow">
          {t.tagline}
        </p>
        <h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          {t.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-100 drop-shadow sm:text-lg sm:leading-8">
          {t.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {t.book}
          </button>
          <a
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 text-sm font-semibold text-zinc-900 backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950"
          >
            {t.learn}
          </a>
        </div>
      </div>
    </div>
  );
}

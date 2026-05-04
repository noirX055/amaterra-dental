import Image from "next/image";
import type { HomeI18n } from "./types";

type AboutUsBlockProps = {
  t: HomeI18n;
};

export function AboutUsBlock({ t }: AboutUsBlockProps) {
  return (
    <section
      id="about"
      data-reveal-on-scroll
      className="rounded-[28px] bg-zinc-100 px-6 py-12 text-zinc-900 sm:px-10 sm:py-16"
    >
      <div className="grid gap-6 lg:min-h-[620px] lg:grid-cols-[0.95fr_1.3fr_0.95fr] lg:grid-rows-[1fr_auto]">
        <div className="relative mx-auto h-[280px] w-full max-w-[300px] overflow-hidden rounded-[24px] lg:row-span-2 lg:h-full lg:min-h-[560px]">
          <Image
            src="/about-main.webp"
            alt="Dental care close up"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 300px, 100vw"
          />
        </div>

        <div className="mx-auto max-w-xl self-center text-center lg:px-4">
          <p className="text-xs font-semibold tracking-wide text-amber-700">{t.aboutLabel}</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl">
            {t.aboutTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
            {t.aboutDescription}
          </p>
          <a
            href="#"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            {t.aboutCta}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative mx-auto h-[240px] w-full max-w-[300px] overflow-hidden rounded-[24px] lg:h-[320px]">
          <Image
            src="/about-side.webp"
            alt="Patient smiling in clinic"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 300px, 100vw"
          />
        </div>

        <div className="relative mx-auto h-[170px] w-full max-w-[500px] overflow-hidden rounded-[22px] lg:col-start-2 lg:h-[210px] lg:w-[86%]">
          <Image
            src="/about-bottom.webp"
            alt="Dental smile detail"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 500px, 100vw"
          />
        </div>

        <div className="mx-auto w-full max-w-[300px] self-end rounded-[22px] bg-white/70 p-5 backdrop-blur">
          <div>
            <p className="text-5xl font-semibold leading-none sm:text-6xl">{t.aboutSatisfaction}</p>
            <p className="mt-2 text-sm text-zinc-600">{t.aboutSatisfactionLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

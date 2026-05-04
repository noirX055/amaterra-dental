import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function LatestInsightsBlock({ t }: Props) {
  return (
    <section
      data-reveal-on-scroll
      className="relative mx-auto mt-20 flex w-full max-w-7xl flex-col px-4 pt-12 pb-12 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-24 mb-10">
        <h2 className="text-4xl font-semibold tracking-tighter text-zinc-900 sm:text-5xl">
          {t.insightsTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {t.insightsItems.map((item, index) => {
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
              {/* Overlay for image background */}
              {hasImage && <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />}

              {/* Content Wrapper */}
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-between">
                {/* Date Badge */}
                <div
                  className={`rounded-full border px-5 py-1.5 text-sm font-medium transition-colors ${
                    hasImage
                      ? "border-white/40 text-white"
                      : "border-black/15 text-zinc-700"
                  }`}
                >
                  {item.date}
                </div>

                {/* Title */}
                <h3
                  className={`my-auto w-4/5 text-2xl sm:text-[28px] font-semibold tracking-tight leading-snug ${
                    hasImage ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className={`mt-auto text-[14px] leading-relaxed font-medium sm:text-[15px] ${
                    hasImage ? "text-zinc-200" : "text-zinc-600"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

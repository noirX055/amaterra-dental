import type { HomeI18n } from "./types";

type SpecializationsBlockProps = {
  t: HomeI18n;
};

export function SpecializationsBlock({ t }: SpecializationsBlockProps) {
  return (
    <section
      data-reveal-on-scroll
      className="mx-3 rounded-[28px] bg-zinc-900 px-6 py-12 text-white sm:mx-4 sm:px-10 sm:py-16"
    >
      {/* Header row */}
      <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-start lg:justify-between">
        <h2 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {t.specTitle}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-400 lg:pt-2 lg:text-right">
          {t.specDescription}
        </p>
      </div>

      {/* Service cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.specServices.map((service) => (
          <div
            key={service.title}
            className="flex flex-col overflow-hidden rounded-[22px] bg-zinc-800/60 transition-colors hover:bg-zinc-800"
          >
            {/* Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-[22px] bg-zinc-700/50">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>

            {/* Card content */}
            <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
              <h3 className="text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

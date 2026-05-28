import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function ReviewsBlock({ t }: Props) {
  return (
    <section
      id="reviews"
      data-reveal-on-scroll
      className="relative mx-auto mt-16 flex w-full max-w-7xl flex-col px-4 pt-12 pb-12 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12 lg:gap-24">
        <h2 className="text-4xl font-semibold tracking-tighter text-zinc-900 sm:text-5xl md:w-1/2 whitespace-pre-line">
          {t.reviewsTitle}
        </h2>
        <p className="text-base sm:text-lg font-medium text-zinc-500 md:w-1/2 md:max-w-md pt-2">
          {t.reviewsDescription}
        </p>
      </div>

      <hr className="my-10 lg:my-14 border-zinc-200" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {t.reviewsItems.map((item, index) => {
          const bgColors = [
            "bg-[#F2F8FD]", // light blue
            "bg-[#FCF9F0]", // light yellow/beige
            "bg-[#F4F6FC]", // light grayish blue
          ];
          const bgColor = bgColors[index % bgColors.length];

          return (
            <div
              key={index}
              className={`flex flex-col gap-6 rounded-[28px] p-8 lg:p-10 transition-transform duration-300 hover:-translate-y-1 ${bgColor}`}
            >
              <div className="text-7xl font-serif leading-none text-black/10 -mb-6 mt-[-10px]">
                “
              </div>
              <p className="flex-1 text-[15px] sm:text-base leading-relaxed text-zinc-800 font-medium">
                {item.text}
              </p>

              <hr className="border-black/5" />

              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">

                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 text-sm">
                      {item.name}
                    </span>
                    <span className="text-[13px] font-medium text-zinc-500">
                      {item.role}
                    </span>
                  </div>
                </div>
                <button className="text-[13px] font-semibold text-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap">
                  {t.reviewsReadMore}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function OurDoctorsBlock({ t }: Props) {
  return (
    <section
      id="doctors"
      data-reveal-on-scroll
      className="relative mx-auto mt-24 flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <h2 className="text-5xl sm:text-6xl font-medium tracking-tight text-zinc-900">
          {t.ourDoctorsTitle}
        </h2>
        <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl">
          {t.ourDoctorsSubtitle}
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.ourDoctors.map((doctor, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col overflow-hidden rounded-[40px] bg-gradient-to-br from-[#F5F5F7] to-[#E8E8EA] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 transition-transform duration-500 group-hover:scale-110">
                  {/* Placeholder for doctor image */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-zinc-500">
                    👨‍⚕️
                  </div>
                </div>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Info Container */}
            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <h3 className="text-2xl font-medium tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-zinc-700">
                {doctor.name}
              </h3>

              <div className="flex flex-col gap-2">
                <p className="text-base font-medium text-zinc-600">
                  {doctor.specialty}
                </p>
                <div className="flex items-center gap-2">
                  <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-sm text-zinc-500">
                    {doctor.experience}
                  </p>
                </div>
              </div>

              {/* Decorative element */}
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-600 transition-all duration-500 group-hover:w-full" />
            </div>

            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-[40px] border-2 border-transparent transition-colors duration-500 group-hover:border-zinc-900/10" />
          </div>
        ))}
      </div>

      {/* Bottom decorative text */}
      <div className="mt-16 flex items-center justify-center">
        <p className="text-center text-lg text-zinc-500 max-w-2xl">
          {t.ourDoctorsBottomText}
        </p>
      </div>
    </section>
  );
}

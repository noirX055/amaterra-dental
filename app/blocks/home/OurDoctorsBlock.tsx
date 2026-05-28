"use client";

import Image from "next/image";
import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

function DoctorCard({ doctor, idx }: { doctor: HomeI18n["ourDoctors"][0]; idx: number }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F5F5F7] to-[#E8E8EA] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full"
      style={{
        animationDelay: `${idx * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-2 p-5 sm:p-6">
        <h3 className="text-xl font-medium tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-zinc-700">
          {doctor.name}
        </h3>

        <p className="text-sm font-medium text-zinc-600">
          {doctor.specialty}
        </p>

        {/* Decorative element */}
        <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-600 transition-all duration-500 group-hover:w-full" />
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-[32px] border-2 border-transparent transition-colors duration-500 group-hover:border-zinc-900/10" />
    </div>
  );
}

export function OurDoctorsBlock({ t }: Props) {
  return (
    <section
      id="doctors"
      data-reveal-on-scroll
      className="relative mx-auto mt-24 flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-500 translate-y-4 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
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

      {/* Doctors Section */}
      <div className="flex flex-col gap-8">
        {/* Top Doctor (Centered) */}
        {t.ourDoctors.length > 0 && (
          <div className="flex justify-center">
            <div className="w-full max-w-[240px] sm:max-w-[280px]">
              <DoctorCard doctor={t.ourDoctors[0]} idx={0} />
            </div>
          </div>
        )}

        {/* Remaining Doctors Grid */}
        {t.ourDoctors.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.ourDoctors.slice(1).map((doctor, idx) => (
              <DoctorCard key={idx + 1} doctor={doctor} idx={idx + 1} />
            ))}
          </div>
        )}
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

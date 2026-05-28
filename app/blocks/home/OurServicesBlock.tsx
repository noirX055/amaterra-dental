"use client";

import { useState, useMemo } from "react";
import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function OurServicesBlock({ t }: Props) {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return t.ourServicesCategories.map(category => ({
      ...category,
      services: category.services.filter(service =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.services.length > 0);
  }, [t.ourServicesCategories, searchQuery]);

  return (
    <section
      id="services"
      data-reveal-on-scroll
      className="relative mx-auto mt-24 flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-500 translate-y-4 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      <h2 className="mb-10 text-5xl sm:text-6xl font-medium tracking-tight text-zinc-900">
        {t.ourServicesTitle}
      </h2>

      <div className="flex flex-col gap-6">
        {/* Top row: 2 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {t.ourServicesMain.map((service, idx) => (
            <div
              key={idx}
              className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[40px] bg-[#F5F5F7] p-10 lg:p-14 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Text Content */}
              <div className="relative z-10 w-3/5 sm:w-1/2">
                <h3 className="mb-6 text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900">
                  {service.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {service.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3 text-sm sm:text-base font-medium text-zinc-600">
                      <span className="block h-1.5 w-1.5 rounded-full bg-zinc-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3D Image */}
              <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 w-3/5 sm:w-1/2 md:w-[60%] select-none pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-auto object-contain drop-shadow-2xl mix-blend-multiply"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: Minor Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.ourServicesMinor.map((service, idx) => (
            <div
              key={idx}
              className="flex min-h-[120px] sm:min-h-[140px] items-center justify-center rounded-[32px] bg-[#F5F5F7] p-6 text-center transition-all duration-300 hover:bg-[#E5E5E8] hover:scale-[1.02]"
            >
              <h4 className="text-[17px] sm:text-xl font-medium tracking-tight text-zinc-500 transition-colors duration-300 hover:text-zinc-900">
                {service}
              </h4>
            </div>
          ))}
        </div>

        {/* Full Services List with Search and Accordion */}
        <div className="mt-16 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900">
              {t.ourServicesFullListTitle}
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.ourServicesSearchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[24px] bg-[#F5F5F7] px-6 py-4 text-base outline-none transition-all duration-200 focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-zinc-900/10"
              />
              <svg
                className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-4">
            {filteredCategories.map((category, idx) => {
              const isOpen = openCategory === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-[32px] bg-[#F5F5F7] transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 sm:p-8 text-left transition-colors duration-200 hover:bg-[#E5E5E8]"
                  >
                    <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-900">
                      {category.title}
                    </h4>
                    <svg
                      className={`h-6 w-6 text-zinc-900 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {category.services.map((service, sIdx) => (
                            <li
                              key={sIdx}
                              className="flex items-start gap-3 text-sm sm:text-base text-zinc-600"
                            >
                              <span className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && searchQuery && (
            <div className="rounded-[32px] bg-[#F5F5F7] p-8 text-center">
              <p className="text-lg text-zinc-500">{t.ourServicesNoResults}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

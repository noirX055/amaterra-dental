"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

const workImages = [
  { src: "/work1.webp", alt: "Dental work example 1" },
  { src: "/work2.webp", alt: "Dental work example 2" },
  { src: "/work3.webp", alt: "Dental work example 3" },
  { src: "/work4.webp", alt: "Dental work example 4" },
  { src: "/work5.webp", alt: "Dental work example 5" },
];

export function WorkGalleryBlock({ t }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? workImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === workImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="gallery"
      data-reveal-on-scroll
      className="relative mx-auto mt-16 flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-700 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      {/* Header */}
      <div className="mb-12 flex flex-col gap-3 text-center">
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900">
          {t.workGalleryTitle || "Наши работы"}
        </h2>
        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto">
          {t.workGallerySubtitle || "Примеры наших стоматологических работ"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-100 to-zinc-200">
          <Image
            src={workImages[currentIndex].src}
            alt={workImages[currentIndex].alt}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          aria-label="Previous image"
        >
          <svg
            className="h-6 w-6 text-zinc-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          aria-label="Next image"
        >
          <svg
            className="h-6 w-6 text-zinc-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {workImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-zinc-900"
                  : "w-2 bg-zinc-300 hover:bg-zinc-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="mt-6 text-center text-lg text-zinc-500">
        {currentIndex + 1} / {workImages.length}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "/banner-bg-v2.webp",
    alt: "Dental clinic interior"
  },
  {
    image: "/amaterra vizit.webp",
    alt: "Amaterra clinic visit"
  },
  {
    image: "/amaterrakabinet.webp",
    alt: "Amaterra cabinet"
  }
];

export function HeroBackground() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Меняется каждые 10 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.image}
          alt={slide.alt}
          fill
          priority={index === 0}
          quality={85}
          sizes="100vw"
          className={`pointer-events-none absolute inset-0 object-cover brightness-95 saturate-90 transition-all duration-[2000ms] ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/35"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-blob hero-blob-1 absolute -left-24 -top-24 h-72 w-72 rounded-full bg-zinc-700 blur-3xl opacity-20 dark:bg-zinc-800 dark:opacity-15" />
        <div className="hero-blob hero-blob-2 absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-zinc-600 blur-3xl opacity-15 dark:bg-zinc-900 dark:opacity-10" />
      </div>
    </>
  );
}

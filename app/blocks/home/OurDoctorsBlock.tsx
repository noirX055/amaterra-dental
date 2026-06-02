"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function OurDoctorsBlock({ t }: Props) {
  const doctors = t.ourDoctors;
  const total = doctors.length;
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActive((prev) => (prev + dir + total) % total);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, total]
  );

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  /* autoplay */
  useEffect(() => {
    autoplayRef.current = setInterval(() => go(1), 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [go]);

  /* keyboard */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  /* touch swipe */
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prev() : next();
    }
  }

  /* get relative position of card from active index */
  function getOffset(idx: number) {
    let diff = idx - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  return (
    <section
      id="doctors"
      data-reveal-on-scroll
      className="relative mx-auto mt-24 mb-12 flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8 opacity-0 transition-opacity duration-500 translate-y-4 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
        {/* Left: Title */}
        <div className="flex flex-col gap-2 lg:pt-16 text-center lg:text-left shrink-0">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-900 leading-[1.1]">
            {(t.ourDoctorsTitle || "Meet Our Team").split(" ").map((word, i, arr) => {
              // Highlight the second word (or "Our") in orange
              if (i === 1 || (arr.length <= 2 && i === 0)) {
                return (
                  <span key={i}>
                    <span className="text-[#E8562A]">{word}</span>
                    {i < arr.length - 1 ? <br /> : null}
                  </span>
                );
              }
              return (
                <span key={i}>
                  {word}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              );
            })}
          </h2>
          {t.ourDoctorsSubtitle && (
            <p className="mt-4 text-lg text-zinc-500 max-w-xs mx-auto lg:mx-0">
              {t.ourDoctorsSubtitle}
            </p>
          )}
        </div>

        {/* Right: 3D Card Carousel */}
        <div
          className="relative flex flex-col items-center w-full max-w-2xl select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Cards container */}
          <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px]" style={{ perspective: "1200px" }}>
            {doctors.map((doctor, idx) => {
              const offset = getOffset(idx);
              const absOffset = Math.abs(offset);

              // Only render nearby cards (up to 3 ahead)
              if (absOffset > 3) return null;

              const isActive = offset === 0;
              const zIndex = 10 - absOffset;

              // Stack cards to the right, with decreasing size
              const translateX = offset * 70; // px shift to the right per card
              const translateZ = -absOffset * 80;
              const scale = 1 - absOffset * 0.08;
              const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.3);
              const rotateY = offset * -2;

              return (
                <div
                  key={doctor.name}
                  className="absolute left-1/2 top-1/2 flex flex-col items-center"
                  style={{
                    width: "280px",
                    transform: `translate(-50%, -55%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: isActive ? "auto" : "none",
                    filter: isActive ? "none" : `brightness(${1 - absOffset * 0.08})`,
                  }}
                >
                  {/* Card */}
                  <div
                    className={`relative overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-500 ${
                      isActive ? "shadow-zinc-900/30" : "shadow-zinc-900/10"
                    }`}
                    style={{ width: "280px", height: "350px" }}
                  >
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                      sizes="280px"
                      priority={isActive}
                    />
                    {/* Subtle gradient overlay for non-active */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </div>

                  {/* Name - only visible for active card */}
                  <div
                    className="mt-5 text-center transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">{doctor.specialty}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between w-full max-w-xs mt-4">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous doctor"
                className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-zinc-600 transition-all duration-300 hover:border-zinc-900 hover:text-zinc-900 hover:shadow-lg active:scale-95"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next doctor"
                className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-zinc-600 transition-all duration-300 hover:border-zinc-900 hover:text-zinc-900 hover:shadow-lg active:scale-95"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Counter */}
            <div className="flex items-baseline gap-0.5 tabular-nums">
              <span className="text-4xl font-bold text-zinc-900">{active + 1}</span>
              <span className="text-lg text-zinc-400 font-medium">/{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative text */}
      {t.ourDoctorsBottomText && (
        <div className="mt-16 flex items-center justify-center">
          <p className="text-center text-lg text-zinc-500 max-w-2xl">
            {t.ourDoctorsBottomText}
          </p>
        </div>
      )}
    </section>
  );
}

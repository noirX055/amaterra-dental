import Image from "next/image";

export function HeroBackground() {
  return (
    <>
      <Image
        src="/banner-bg-v2.jpg"
        alt=""
        fill
        preload
        quality={85}
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover opacity-85 brightness-100 saturate-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/32 via-black/24 to-black/28 dark:from-zinc-950/35 dark:via-zinc-950/28 dark:to-zinc-950/32"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-blob hero-blob-1 absolute -left-24 -top-24 h-72 w-72 rounded-full bg-zinc-700 blur-3xl opacity-20 dark:bg-zinc-800 dark:opacity-15" />
        <div className="hero-blob hero-blob-2 absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-zinc-600 blur-3xl opacity-15 dark:bg-zinc-900 dark:opacity-10" />
      </div>
    </>
  );
}

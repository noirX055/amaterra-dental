import Image from "next/image";
import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function FooterBlock({ t }: Props) {
  return (
    <footer className="w-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 pt-20 pb-10 sm:pt-24 sm:pb-12 border-t border-zinc-800 z-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-20">
          {/* Logo and Description */}
          <div className="flex max-w-lg flex-col gap-6">
            <div className="flex items-center group">
              <Image
                src="/logo-large.webp"
                alt="Amaterra Logo"
                width={210}
                height={56}
                className="h-14 w-auto origin-left scale-[3.2] object-contain sm:scale-[3.5] transition-transform duration-300 group-hover:scale-[3.3] sm:group-hover:scale-[3.6]"
              />
            </div>
            <p className="text-base leading-relaxed text-zinc-400 font-medium">
              {t.footerDescription}
            </p>
            {/* Decorative line */}
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-800" />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-24 pt-2">
            <div className="flex flex-col gap-3 group">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {t.footerPhoneLabel}
              </span>
              <a href={`tel:${t.phoneTel}`} className="text-[15px] font-medium text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                {t.phoneNumberDisplay}
              </a>
            </div>
            <div className="flex flex-col gap-3 group">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {t.footerEmailLabel}
              </span>
              <a href={`mailto:${t.footerEmail}`} className="text-[15px] font-medium text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                {t.footerEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Clinic Hours & Copyright */}
          <div className="flex flex-col gap-6 lg:w-[35%] lg:pr-12 lg:border-r lg:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              {t.footerHoursLabel}
            </span>
            <ul className="flex flex-col gap-3">
              {t.footerHours.map((hour, idx) => {
                const parts = hour.split(/:(.*)/);
                return (
                  <li key={idx} className="text-[15px] text-zinc-400 font-medium flex gap-2 hover:text-zinc-300 transition-colors">
                    {parts.length > 1 ? (
                      <>
                        <span className="text-zinc-300 sm:min-w-[90px]">{parts[0]}:</span>
                        <span>{parts[1]}</span>
                      </>
                    ) : (
                      hour
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:flex-1 lg:pl-10">
            {/* Column 1 */}
            <ul className="flex flex-col gap-4 sm:gap-5">
              <li>
                <a href="#about" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t.footerLinksCol1[0]}
                </a>
              </li>
              <li>
                <a href="#services" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t.footerLinksCol1[1]}
                </a>
              </li>
            </ul>

            {/* Column 2 */}
            <ul className="flex flex-col gap-4 sm:gap-5">
              <li>
                <a href="#doctors" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t.footerLinksCol2[0]}
                </a>
              </li>
              <li>
                <a href="#appointment" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  {t.footerLinksCol2[1]}
                </a>
              </li>
            </ul>

            {/* Socials Column */}
            <ul className="flex flex-col gap-4 sm:gap-5 mt-4 sm:mt-0 col-span-2 lg:col-span-1">
              {t.footerSocial.map((social, idx) => (
                <li key={idx}>
                  <a href={t.footerSocialLinks[idx]} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 text-center">
          <div className="text-[12px] font-medium text-zinc-500">
            {t.footerCopyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

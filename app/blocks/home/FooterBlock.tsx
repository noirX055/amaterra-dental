import type { HomeI18n } from "./types";

interface Props {
  t: HomeI18n;
}

export function FooterBlock({ t }: Props) {
  return (
    <footer className="w-full bg-white pt-20 pb-10 sm:pt-24 sm:pb-12 border-t border-zinc-100 z-10 relative">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-20">
          {/* Logo and Description */}
          <div className="flex max-w-lg flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo.webp" alt="Amaterra Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-semibold tracking-tight text-zinc-900">
                {t.brand}
              </span>
            </div>
            <p className="text-base leading-relaxed text-zinc-600 font-medium">
              {t.footerDescription}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-24 pt-2">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                {t.footerPhoneLabel}
              </span>
              <a href={`tel:${t.phoneTel}`} className="text-[15px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
                {t.phoneNumberDisplay}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                {t.footerEmailLabel}
              </span>
              <a href={`mailto:${t.footerEmail}`} className="text-[15px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
                {t.footerEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <hr className="my-12 border-zinc-200" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Clinic Hours & Copyright */}
          <div className="flex flex-col gap-6 lg:w-[35%] lg:pr-12 lg:border-r lg:border-zinc-200">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
              {t.footerHoursLabel}
            </span>
            <ul className="flex flex-col gap-3">
              {t.footerHours.map((hour, idx) => {
                // Split around the colon if it exists, to match the styling in the image (Day bold, time normal)
                const parts = hour.split(/:(.*)/); // Split on first colon
                return (
                  <li key={idx} className="text-[15px] text-zinc-500 font-medium flex gap-2">
                    {parts.length > 1 ? (
                      <>
                        <span className="text-zinc-800 sm:min-w-[90px]">{parts[0]}:</span>
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
              {t.footerLinksCol1.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-950 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Column 2 */}
            <ul className="flex flex-col gap-4 sm:gap-5">
              {t.footerLinksCol2.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-950 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Socials Column */}
            <ul className="flex flex-col gap-4 sm:gap-5 mt-4 sm:mt-0 col-span-2 lg:col-span-1">
              {t.footerSocial.map((social, idx) => (
                <li key={idx}>
                  <a href="#" className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-950 transition-colors">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 text-center">
          <div className="text-[12px] font-medium text-zinc-400">
            {t.footerCopyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

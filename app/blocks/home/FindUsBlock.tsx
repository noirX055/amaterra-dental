import { useState } from "react";
import type { HomeI18n } from "./types";
import type { Lang } from "./types";

type FindUsBlockProps = {
  t: HomeI18n;
  lang: Lang;
};

const contactStatusByLang = {
  ru: {
    messagePlaceholder: "Опишите ваш вопрос",
    success: "Сообщение отправлено. Мы свяжемся с вами.",
    error: "Не удалось отправить форму. Попробуйте еще раз.",
  },
  ro: {
    messagePlaceholder: "Descrieti solicitarea dvs.",
    success: "Mesaj trimis. Va contactam in curand.",
    error: "Nu am reusit sa trimitem formularul. Incercati din nou.",
  },
  en: {
    messagePlaceholder: "Describe your request",
    success: "Message sent. We will contact you soon.",
    error: "Failed to submit form. Please try again.",
  },
} as const;

export function FindUsBlock({ t, lang }: FindUsBlockProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
    };

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact message");
      }

      form.reset();
      setSubmitMessage(contactStatusByLang[lang].success);
    } catch {
      setSubmitMessage(contactStatusByLang[lang].error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="appointment"
      data-reveal-on-scroll
      className="mx-3 overflow-hidden rounded-[28px] bg-zinc-100 sm:mx-4"
    >
      <div className="grid lg:grid-cols-2">
        {/* Left — Booking form */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:px-16">
          <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            {t.findUsTitle}
            <span className="inline-block text-emerald-500">.</span>
          </h2>

          <form
            className="mt-10 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              name="name"
              type="text"
              placeholder={t.findUsName}
              required
              className="h-13 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-sm"
            />
            <input
              name="email"
              type="email"
              placeholder={t.findUsEmail}
              required
              className="h-13 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-sm"
            />

            <div className="flex gap-3 sm:max-w-sm">
              <input
                name="preferredDate"
                type="date"
                aria-label={t.findUsDate}
                className="h-13 flex-1 rounded-full border border-zinc-200 bg-white px-5 text-sm text-zinc-500 outline-none transition-colors focus:border-zinc-400"
              />
              <input
                name="preferredTime"
                type="time"
                aria-label={t.findUsTime}
                className="h-13 flex-1 rounded-full border border-zinc-200 bg-white px-5 text-sm text-zinc-500 outline-none transition-colors focus:border-zinc-400"
              />
            </div>
            <textarea
              name="message"
              placeholder={contactStatusByLang[lang].messagePlaceholder}
              rows={3}
              className="w-full rounded-3xl border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-sm"
            />
            {submitMessage ? (
              <p className="text-sm text-zinc-600" role="status">
                {submitMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {isSubmitting ? "..." : t.findUsCta}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        {/* Right — Map */}
        <div className="relative min-h-[360px] lg:min-h-[520px]">
          <iframe
            title="Location map"
            src="https://maps.google.com/maps?q=Strada+Vasile+Lupu+34%2F2%2C+Chi%C8%99in%C4%83u%2C+Moldova&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Address card overlay */}
          <div className="absolute bottom-6 left-1/2 z-10 w-[260px] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {t.findUsLocationLabel}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-snug text-zinc-900">
              {t.findUsAddress}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

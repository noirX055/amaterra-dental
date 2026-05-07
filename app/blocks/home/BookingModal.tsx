import { useEffect } from "react";
import { useState } from "react";
import type { HomeI18n } from "./types";
import type { Lang } from "./types";

type BookingModalProps = {
  t: HomeI18n;
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
};

const statusTextByLang = {
  ru: {
    success: "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
    error: "Не удалось отправить заявку. Попробуйте еще раз.",
  },
  ro: {
    success: "Cererea a fost trimisa. Va contactam in curand.",
    error: "Nu am reusit sa trimitem cererea. Incercati din nou.",
  },
  en: {
    success: "Request submitted. We will contact you soon.",
    error: "Failed to submit request. Please try again.",
  },
} as const;

export function BookingModal({ t, lang, isOpen, onClose }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!showSuccessPopup) return;
    const timeoutId = window.setTimeout(() => {
      setShowSuccessPopup(false);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [showSuccessPopup, onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      doctor: String(formData.get("doctor") ?? ""),
      lang,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to submit appointment");
      }

      form.reset();
      setSubmitMessage(null);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Appointment submit failed:", error);
      setSubmitMessage(statusTextByLang[lang].error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="animate-modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="animate-modal-slide relative flex w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white text-zinc-900 shadow-2xl"
      >
        {showSuccessPopup ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 px-6 text-center">
            <div className="max-w-sm">
              <p className="text-2xl font-semibold text-zinc-900">Спасибо!</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Заявка отправлена, скоро с вами свяжутся.
              </p>
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 sm:px-8">
          <h2 className="text-xl font-semibold">{t.modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label={t.modalClose}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <p className="mb-6 text-sm leading-relaxed text-zinc-500">
            {t.modalSubtitle}
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                name="lastName"
                type="text"
                placeholder={t.modalLastName}
                className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                required
              />
              <input
                name="firstName"
                type="text"
                placeholder={t.modalFirstName}
                className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                required
              />
            </div>

            <input
              name="phone"
              type="tel"
              placeholder={t.modalPhone}
              className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
              required
            />

            <input
              name="email"
              type="email"
              placeholder={t.modalEmail}
              className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
            />

            <div className="relative">
              <input
                name="preferredDate"
                type="date"
                className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                required
              />
              {/* Optional visually hidden label or fake placeholder logic could go here */}
            </div>
            <input
              name="preferredTime"
              type="time"
              className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
            />
            <select
              name="doctor"
              required
              className="h-13 w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
            >
              <option value="">Выберите врача</option>
              <option value="d1">Анна Мороз - Терапевт-стоматолог</option>
              <option value="d2">Игорь Петреску - Ортодонт</option>
              <option value="d3">Марина Раду - Хирург-имплантолог</option>
              <option value="d4">Виктор Савин - Пародонтолог</option>
            </select>
            <textarea
              name="notes"
              placeholder="Комментарий к записи"
              rows={3}
              className="w-full rounded-[18px] border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
            />
            {submitMessage ? (
              <p className="text-sm text-zinc-600" role="status">
                {submitMessage}
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-full px-6 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {t.modalClose}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? "..." : t.modalSubmit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

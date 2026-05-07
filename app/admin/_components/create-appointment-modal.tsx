"use client";

import { useState } from "react";
import { showToast } from "./toast";

type CreateAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      doctor: String(formData.get("doctor") ?? ""),
      lang: "ru",
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorData?.error ?? "Не удалось создать запись");
      }

      showToast("Запись успешно создана", "success");
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось создать запись";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Создать запись
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Имя <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Фамилия <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Телефон <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Дата визита <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  name="preferredDate"
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Время визита
                </span>
                <input
                  type="time"
                  name="preferredTime"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Лечащий врач <span className="text-red-500">*</span>
              </span>
              <select
                name="doctor"
                required
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите врача</option>
                <option value="d1">Анна Мороз - Терапевт-стоматолог</option>
                <option value="d2">Игорь Петреску - Ортодонт</option>
                <option value="d3">Марина Раду - Хирург-имплантолог</option>
                <option value="d4">Виктор Савин - Пародонтолог</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Примечания
              </span>
              <textarea
                name="notes"
                rows={4}
                placeholder="Опишите проблему или причину визита"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Создание..." : "Создать запись"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

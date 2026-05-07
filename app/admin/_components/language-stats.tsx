"use client";

import { useMemo } from "react";
import { Appointment } from "../adminTypes";

export function LanguageStats({ appointments }: { appointments: Appointment[] }) {
  const stats = useMemo(() => {
    const total = appointments.length || 1;
    const byLang = {
      ru: appointments.filter((a) => a.lang === "ru").length,
      ro: appointments.filter((a) => a.lang === "ro").length,
      en: appointments.filter((a) => a.lang === "en").length,
    };

    return [
      {
        lang: "ru",
        label: "Русский",
        count: byLang.ru,
        percentage: Math.round((byLang.ru / total) * 100),
        color: "bg-blue-500",
        lightColor: "bg-blue-100",
      },
      {
        lang: "ro",
        label: "Română",
        count: byLang.ro,
        percentage: Math.round((byLang.ro / total) * 100),
        color: "bg-amber-500",
        lightColor: "bg-amber-100",
      },
      {
        lang: "en",
        label: "English",
        count: byLang.en,
        percentage: Math.round((byLang.en / total) * 100),
        color: "bg-emerald-500",
        lightColor: "bg-emerald-100",
      },
    ].filter((item) => item.count > 0);
  }, [appointments]);

  if (stats.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Языки пациентов</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Распределение по языкам</p>
      </div>

      <div className="space-y-4">
        {stats.map((item) => (
          <div key={item.lang}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        {stats.map((item) => (
          <div
            key={item.lang}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg ${item.lightColor} px-3 py-2`}
          >
            <span className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-900">{item.lang}</span>
            <span className="text-sm font-bold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

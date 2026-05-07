"use client";

import { useMemo } from "react";
import { Appointment } from "../adminTypes";

export function OverviewStats({ appointments }: { appointments: Appointment[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    const thisWeekStartStr = thisWeekStart.toISOString().split("T")[0];

    const todayAppointments = appointments.filter((a) => a.preferred_date === today);
    const thisWeekAppointments = appointments.filter((a) => a.preferred_date >= thisWeekStartStr);
    const last24h = appointments.filter((a) => {
      const createdAt = new Date(a.created_at);
      const diff = now.getTime() - createdAt.getTime();
      return diff <= 24 * 60 * 60 * 1000;
    });

    return {
      total: appointments.length,
      today: todayAppointments.length,
      thisWeek: thisWeekAppointments.length,
      last24h: last24h.length,
    };
  }, [appointments]);

  const cards = [
    {
      label: "Всего записей",
      value: stats.total,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      label: "За последние 24ч",
      value: stats.last24h,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Сегодня",
      value: stats.today,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "На этой неделе",
      value: stats.thisWeek,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bgColor}`}>
            <div className={card.color}>{card.icon}</div>
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

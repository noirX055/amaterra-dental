"use client";

import { useMemo } from "react";
import { Appointment } from "../adminTypes";

type StatCardProps = {
  title: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

function StatCard({ title, count, percentage, trend, icon, color, bgColor }: StatCardProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-gray-400";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className={`font-semibold ${trendColor}`}>
              {trendIcon} {percentage}%
            </span>
            <span className="text-gray-500 dark:text-gray-400">от общего</span>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor} transition-transform group-hover:scale-110`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 ${bgColor} transition-all group-hover:h-1.5`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

export function DashboardStatsV2({ appointments }: { appointments: Appointment[] }) {
  const stats = useMemo(() => {
    const total = appointments.length || 1;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    return [
      {
        title: "Ожидает ответа",
        count: pending,
        percentage: Math.round((pending / total) * 100),
        trend: pending > confirmed ? "up" : "neutral" as const,
        icon: (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      {
        title: "Подтверждено",
        count: confirmed,
        percentage: Math.round((confirmed / total) * 100),
        trend: "up" as const,
        icon: (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      {
        title: "Завершено",
        count: completed,
        percentage: Math.round((completed / total) * 100),
        trend: "up" as const,
        icon: (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Отменено",
        count: cancelled,
        percentage: Math.round((cancelled / total) * 100),
        trend: cancelled > 0 ? "down" : "neutral" as const,
        icon: (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      },
    ];
  }, [appointments]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

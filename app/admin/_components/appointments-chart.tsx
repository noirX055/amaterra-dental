"use client";

import { useMemo } from "react";
import { Appointment } from "../adminTypes";

export function AppointmentsChart({ appointments }: { appointments: Appointment[] }) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const dataByDay = last7Days.map((day) => {
      const dayAppointments = appointments.filter((a) => a.created_at.startsWith(day));
      return {
        date: day,
        label: new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric" }).format(new Date(day)),
        pending: dayAppointments.filter((a) => a.status === "pending").length,
        confirmed: dayAppointments.filter((a) => a.status === "confirmed").length,
        completed: dayAppointments.filter((a) => a.status === "completed").length,
        cancelled: dayAppointments.filter((a) => a.status === "cancelled").length,
        total: dayAppointments.length,
      };
    });

    const maxValue = Math.max(...dataByDay.map((d) => d.total), 1);

    return { dataByDay, maxValue };
  }, [appointments]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Активность за неделю</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Записи за последние 7 дней</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">Ожидает</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">Подтверждено</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Завершено</span>
          </div>
        </div>
      </div>

      <div className="flex h-64 items-end justify-between gap-2">
        {chartData.dataByDay.map((day, index) => {
          const heightPercent = (day.total / chartData.maxValue) * 100;
          const pendingHeight = day.pending > 0 ? (day.pending / day.total) * heightPercent : 0;
          const confirmedHeight = day.confirmed > 0 ? (day.confirmed / day.total) * heightPercent : 0;
          const completedHeight = day.completed > 0 ? (day.completed / day.total) * heightPercent : 0;

          return (
            <div key={day.date} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-col items-center justify-end" style={{ height: "200px" }}>
                {day.total > 0 ? (
                  <div className="relative flex w-full max-w-[40px] flex-col overflow-hidden rounded-t-lg transition-all group-hover:max-w-[48px]">
                    {day.completed > 0 && (
                      <div
                        className="w-full bg-blue-500 transition-all"
                        style={{ height: `${completedHeight}%` }}
                        title={`Завершено: ${day.completed}`}
                      />
                    )}
                    {day.confirmed > 0 && (
                      <div
                        className="w-full bg-emerald-500 transition-all"
                        style={{ height: `${confirmedHeight}%` }}
                        title={`Подтверждено: ${day.confirmed}`}
                      />
                    )}
                    {day.pending > 0 && (
                      <div
                        className="w-full bg-amber-500 transition-all"
                        style={{ height: `${pendingHeight}%` }}
                        title={`Ожидает: ${day.pending}`}
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-2 w-full max-w-[40px] rounded-full bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="absolute -top-8 hidden rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                  {day.total}
                </div>
              </div>
              <div className="text-center text-xs text-gray-500">{day.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

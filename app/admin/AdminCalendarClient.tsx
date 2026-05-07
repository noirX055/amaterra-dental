"use client";

import { useMemo, useState } from "react";
import type { Appointment } from "./adminTypes";
import { statusLabels, statusStyles } from "./adminTypes";
import { useAppointmentsRealtime } from "./_components/use-appointments-realtime";

type AdminCalendarClientProps = {
  initialAppointments: Appointment[];
};

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toDateOnly(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function formatDateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(
    value.getDate()
  ).padStart(2, "0")}`;
}

function formatMonthLabel(value: Date) {
  return value.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string | null) {
  if (!value) return "Время не указано";
  return value.slice(0, 5);
}

function buildMonthGrid(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekDay = (start.getDay() + 6) % 7;
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - startWeekDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export default function AdminCalendarClient({
  initialAppointments,
}: AdminCalendarClientProps) {
  const { appointments } = useAppointmentsRealtime(initialAppointments);
  const today = toDateOnly(new Date());

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>((acc, appointment) => {
      const key = appointment.preferred_date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appointment);
      return acc;
    }, {});
  }, [appointments]);

  const monthCells = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

  const selectedDateKey = formatDateKey(selectedDate);
  const selectedDateAppointments = useMemo(() => {
    const list = appointmentsByDate[selectedDateKey] ?? [];
    return [...list].sort((a, b) => formatTime(a.preferred_time).localeCompare(formatTime(b.preferred_time)));
  }, [appointmentsByDate, selectedDateKey]);

  const monthTotal = useMemo(() => {
    return monthCells.reduce((count, day) => {
      const key = formatDateKey(day);
      return count + (appointmentsByDate[key]?.length ?? 0);
    }, 0);
  }, [monthCells, appointmentsByDate]);

  function prevMonth() {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function nextMonth() {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function goToToday() {
    const now = new Date();
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(toDateOnly(now));
  }

  return (
    <>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Календарь
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Визуальный календарь всех записей. Выберите дату для просмотра деталей приёмов
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">Записей в месяце:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{monthTotal}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Calendar */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Calendar Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
              {formatMonthLabel(visibleMonth)}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Сегодня
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                aria-label="Предыдущий месяц"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                aria-label="Следующий месяц"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthCells.map((day) => {
              const key = formatDateKey(day);
              const dayAppointments = appointmentsByDate[key] ?? [];
              const isToday = formatDateKey(day) === formatDateKey(today);
              const isSelected = formatDateKey(day) === formatDateKey(selectedDate);
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
              const hasAppointments = dayAppointments.length > 0;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`group relative aspect-square rounded-lg border p-2 text-sm transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-600 dark:bg-emerald-900/20"
                      : isToday
                      ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  } ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <div className="flex h-full flex-col">
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-400"
                          : isToday
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {hasAppointments && (
                      <div className="mt-auto flex flex-col gap-0.5">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`h-1 w-full rounded-full ${
                              apt.status === "pending"
                                ? "bg-amber-400"
                                : apt.status === "confirmed"
                                ? "bg-emerald-400"
                                : apt.status === "completed"
                                ? "bg-blue-400"
                                : "bg-rose-400"
                            }`}
                          />
                        ))}
                        {dayAppointments.length > 2 && (
                          <span className="mt-0.5 text-xs text-gray-500">+{dayAppointments.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedDate.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {selectedDateAppointments.length} {selectedDateAppointments.length === 1 ? "запись" : "записей"}
            </p>
          </div>

          <div className="max-h-[600px] overflow-y-auto p-6">
            {selectedDateAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Нет записей на эту дату
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-semibold text-white">
                        {appointment.first_name.charAt(0)}
                        {appointment.last_name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {appointment.first_name} {appointment.last_name}
                            </h4>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {appointment.phone}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}>
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(appointment.preferred_time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

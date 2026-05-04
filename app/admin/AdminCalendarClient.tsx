"use client";

import { useMemo, useState } from "react";
import type { Appointment } from "./adminTypes";
import { statusLabels, statusStyles } from "./adminTypes";
import { useAdminAppointmentsLive } from "./useAdminAppointmentsLive";

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
  const { appointments } = useAdminAppointmentsLive(initialAppointments);
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
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  }

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-8">
        <header className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">Календарь записей</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Расписание пациентов
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Выберите дату в календаре, чтобы увидеть все назначения и их статус.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            Записей в месяце: <span className="font-semibold text-white">{monthTotal}</span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Предыдущий месяц"
              >
                <span aria-hidden="true">←</span>
              </button>
              <h2 className="text-lg font-semibold capitalize text-white">
                {formatMonthLabel(visibleMonth)}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Следующий месяц"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((dayName) => (
                <div
                  key={dayName}
                  className="rounded-xl border border-slate-700 bg-slate-800/70 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-300"
                >
                  {dayName}
                </div>
              ))}

              {monthCells.map((day) => {
                const key = formatDateKey(day);
                const dayAppointments = appointmentsByDate[key] ?? [];
                const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                const isToday = key === formatDateKey(today);
                const isSelected = key === selectedDateKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(toDateOnly(day))}
                    className={`min-h-[108px] rounded-2xl border p-2 text-left transition ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-500/40"
                        : "border-slate-700 bg-slate-900/50 hover:border-emerald-500/60 hover:bg-slate-800/70"
                    } ${!isCurrentMonth ? "opacity-35" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          isToday ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayAppointments.length > 0 ? (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          {dayAppointments.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <p
                          key={appointment.id}
                          className="truncate rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-200"
                        >
                          {formatTime(appointment.preferred_time)} - {appointment.first_name}
                        </p>
                      ))}
                      {dayAppointments.length > 2 ? (
                        <p className="text-[11px] font-medium text-slate-400">
                          +{dayAppointments.length - 2} еще
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-lg font-semibold text-white">
              {selectedDate.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Записей: {selectedDateAppointments.length}
            </p>

            {selectedDateAppointments.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
                На выбранную дату записей нет.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {selectedDateAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">
                          {appointment.first_name} {appointment.last_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {appointment.phone}
                          {appointment.email ? ` - ${appointment.email}` : ""}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                      >
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                      <span className="rounded-lg bg-slate-800 px-2 py-1 font-medium text-slate-100">
                        {formatTime(appointment.preferred_time)}
                      </span>
                      <span>Язык: {appointment.lang.toUpperCase()}</span>
                    </div>
                    {appointment.notes ? (
                      <p className="mt-3 text-sm text-slate-300">{appointment.notes}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

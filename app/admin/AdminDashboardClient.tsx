"use client";

import { useMemo } from "react";

import type { Appointment } from "./adminTypes";
import {
  formatDate,
  formatDateTime,
  statusLabels,
  statusStyles,
} from "./adminTypes";
import { useAdminAppointmentsLive } from "./useAdminAppointmentsLive";

type AdminDashboardClientProps = {
  initialAppointments: Appointment[];
};

export default function AdminDashboardClient({
  initialAppointments,
}: AdminDashboardClientProps) {
  const { appointments } = useAdminAppointmentsLive(initialAppointments);

  const summaryItems = useMemo(() => {
    return [
      {
        label: "Подтверждено",
        value: appointments.filter((appointment) => appointment.status === "confirmed").length,
        border: "border-emerald-100",
        iconBg: "bg-emerald-500",
        valueColor: "text-emerald-600",
      },
      {
        label: "Ожидают ответа",
        value: appointments.filter((appointment) => appointment.status === "pending").length,
        border: "border-amber-100",
        iconBg: "bg-amber-400",
        valueColor: "text-amber-500",
      },
      {
        label: "Завершено",
        value: appointments.filter((appointment) => appointment.status === "completed").length,
        border: "border-sky-100",
        iconBg: "bg-sky-500",
        valueColor: "text-sky-600",
      },
      {
        label: "Отменено",
        value: appointments.filter((appointment) => appointment.status === "cancelled").length,
        border: "border-rose-100",
        iconBg: "bg-rose-500",
        valueColor: "text-rose-600",
      },
    ];
  }, [appointments]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="hero-appear rounded-[36px] border border-[#e3eaf1] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <header className="border-b border-[#edf2f7] px-6 py-6 sm:px-8">
          <div>
            <p className="text-sm font-medium text-emerald-600">Дашборд</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              Панель управления
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Здесь отображаются последние записи пациентов и текущая сводка по
              статусам. Уведомления о новых заявках появляются автоматически.
            </p>
          </div>
        </header>

        <div className="space-y-8 p-6 sm:p-8">
          <section className="hero-appear hero-delay-1 rounded-[30px] border border-[#e8eef4] bg-white px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Сводка по записям</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  Актуальный статус всех заявок
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Подтвержденные, ожидающие ответа, завершенные и отмененные заявки собраны в одном блоке.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e8eef4] bg-[#f8fbfd] px-4 py-3 text-sm text-slate-500">
                Всего записей: <span className="font-semibold text-slate-900">{appointments.length}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryItems.map((item, index) => (
                <section
                  key={item.label}
                  className={`hero-appear rounded-[26px] border ${item.border} bg-white p-5 shadow-[0_16px_35px_rgba(15,23,42,0.05)]`}
                  style={{ animationDelay: `${160 + index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className={`mt-4 text-4xl font-semibold tracking-tight ${item.valueColor}`}>
                        {item.value}
                      </p>
                    </div>
                    <span className={`mt-1 h-3 w-3 rounded-full ${item.iconBg}`} />
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="hero-appear hero-delay-3 rounded-[30px] border border-[#e8eef4] bg-[#fbfdff] p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#eef3f7] pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Последние записи</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Новые заявки пациентов
                </h2>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-slate-400">Новых записей пока нет.</div>
            ) : (
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {appointments.slice(0, 8).map((appointment, index) => (
                  <article
                    key={appointment.id}
                    className="hero-appear rounded-[28px] border border-[#e7edf3] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
                    style={{ animationDelay: `${260 + index * 70}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {appointment.first_name.charAt(0)}
                        {appointment.last_name.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-900">
                              {appointment.first_name} {appointment.last_name}
                            </h3>
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {appointment.email || appointment.phone}
                            </p>
                          </div>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                          >
                            {statusLabels[appointment.status]}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Дата визита</p>
                            <p className="mt-1 font-medium text-slate-700">{formatDate(appointment.preferred_date)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Время</p>
                            <p className="mt-1 font-medium text-slate-700">
                              {appointment.preferred_time || "Не указано"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Создано</p>
                            <p className="mt-1 font-medium text-slate-700">{formatDateTime(appointment.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Язык</p>
                            <p className="mt-1 font-medium uppercase text-slate-700">{appointment.lang}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}


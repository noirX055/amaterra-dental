"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment } from "./adminTypes";
import { formatDate, formatDateTime, statusLabels, statusStyles } from "./adminTypes";
import { useAppointmentsRealtime } from "./_components/use-appointments-realtime";

type AdminAppointmentsClientProps = {
  initialAppointments: Appointment[];
};

export default function AdminAppointmentsClient({
  initialAppointments,
}: AdminAppointmentsClientProps) {
  const router = useRouter();
  const { appointments } = useAppointmentsRealtime(initialAppointments);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusDrafts, setStatusDrafts] = useState<Record<string, Appointment["status"]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setStatusDrafts((prev) => {
      const next = { ...prev };
      for (const appointment of appointments) {
        if (!next[appointment.id]) {
          next[appointment.id] = appointment.status;
        }
      }
      return next;
    });

    setCommentDrafts((prev) => {
      const next = { ...prev };
      for (const appointment of appointments) {
        if (next[appointment.id] === undefined) {
          next[appointment.id] = appointment.admin_comment ?? "";
        }
      }
      return next;
    });
  }, [appointments]);

  async function saveAppointment(appointment: Appointment) {
    const appointmentId = appointment.id;
    const status = statusDrafts[appointmentId] ?? appointment.status;
    const adminComment = (commentDrafts[appointmentId] ?? "").trim();

    setSavingIds((prev) => ({ ...prev, [appointmentId]: true }));
    setSaveErrors((prev) => ({ ...prev, [appointmentId]: null }));

    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointmentId,
          status,
          adminComment,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Не удалось сохранить изменения");
      }

      if (status === "completed") {
        router.push("/admin/patients");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Не удалось сохранить изменения";
      setSaveErrors((prev) => ({ ...prev, [appointmentId]: message }));
    } finally {
      setSavingIds((prev) => ({ ...prev, [appointmentId]: false }));
    }
  }

  const filteredAppointments = useMemo(() => {
    const search = query.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const fullName = `${appointment.first_name} ${appointment.last_name}`.toLowerCase();
      const phone = appointment.phone.toLowerCase();
      const matchesSearch =
        search.length === 0 || fullName.includes(search) || phone.includes(search);
      const matchesDate =
        selectedDate.length === 0 || appointment.preferred_date === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [appointments, query, selectedDate]);

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-8">
        <header className="border-b border-slate-800/80 pb-6">
          <p className="text-sm font-medium text-emerald-400">Управление записями</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Записи пациентов
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Просмотр, фильтрация и управление всеми записями на приём. Изменяйте статусы и добавляйте комментарии
          </p>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-700 bg-slate-900/40 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
            <label className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск: имя, фамилия или телефон"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              />
            </label>

            <label className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M7 3v3M17 3v3M4 10h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedDate("");
              }}
              className="h-11 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Сбросить фильтры
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            Найдено записей:{" "}
            <span className="font-semibold text-white">{filteredAppointments.length}</span>
          </p>
        </section>

        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            По выбранным фильтрам записей не найдено.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filteredAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-[24px] border border-slate-700 bg-slate-900/50 p-5 shadow-[0_12px_28px_rgba(2,6,23,0.4)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {appointment.first_name} {appointment.last_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-300">
                      {appointment.email ?? "Email не указан"} - {appointment.phone}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                  >
                    {statusLabels[appointment.status]}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Дата визита</p>
                    <p className="mt-1 font-medium text-slate-100">{formatDate(appointment.preferred_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Время</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {appointment.preferred_time ?? "Не указано"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Создано</p>
                    <p className="mt-1 font-medium text-slate-100">{formatDateTime(appointment.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Язык</p>
                    <p className="mt-1 font-medium uppercase text-slate-100">{appointment.lang}</p>
                  </div>
                </div>

                {appointment.notes ? (
                  <p className="mt-4 rounded-2xl bg-slate-950/60 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
                    {appointment.notes}
                  </p>
                ) : null}

                <div className="mt-4 grid gap-3 rounded-2xl border border-slate-700/90 bg-slate-950/40 p-4">
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Статус записи</span>
                    <select
                      value={statusDrafts[appointment.id] ?? appointment.status}
                      onChange={(event) =>
                        setStatusDrafts((prev) => ({
                          ...prev,
                          [appointment.id]: event.target.value as Appointment["status"],
                        }))
                      }
                      className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
                    >
                      <option value="pending">{statusLabels.pending}</option>
                      <option value="confirmed">{statusLabels.confirmed}</option>
                      <option value="cancelled">{statusLabels.cancelled}</option>
                      <option value="completed">{statusLabels.completed}</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
                      Комментарий администратора
                    </span>
                    <textarea
                      value={commentDrafts[appointment.id] ?? ""}
                      onChange={(event) =>
                        setCommentDrafts((prev) => ({
                          ...prev,
                          [appointment.id]: event.target.value,
                        }))
                      }
                      placeholder="Добавьте комментарий по записи"
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => saveAppointment(appointment)}
                      disabled={savingIds[appointment.id] === true}
                      className="h-10 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingIds[appointment.id] ? "Сохранение..." : "Сохранить"}
                    </button>
                    {saveErrors[appointment.id] ? (
                      <p className="text-sm text-rose-300">{saveErrors[appointment.id]}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


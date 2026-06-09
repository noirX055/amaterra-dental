"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment } from "./adminTypes";
import { formatDate, formatDateTime, statusLabels, statusStyles } from "./adminTypes";
import { useAppointmentsRealtime } from "./_components/use-appointments-realtime";
import { useAdminLang } from "./_components/admin-lang-context";

type AdminAppointmentsClientProps = {
  initialAppointments: Appointment[];
};

const DOCTORS: Record<string, string> = {
  d1: "Ruslan Ceban",
  d2: "Sorin Rabac",
  d4: "Dumitru Gurenco",
  d5: "Natalia Lozova",
};

function getDoctorName(doctorId: string | null | undefined, fallback: string): string {
  if (!doctorId) return fallback;
  return DOCTORS[doctorId] ?? doctorId;
}

export default function AdminAppointmentsClient({
  initialAppointments,
}: AdminAppointmentsClientProps) {
  const router = useRouter();
  const { appointments } = useAppointmentsRealtime(initialAppointments);
  const { t } = useAdminLang();
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusDrafts, setStatusDrafts] = useState<Record<string, Appointment["status"]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [dateDrafts, setDateDrafts] = useState<Record<string, string>>({});
  const [timeDrafts, setTimeDrafts] = useState<Record<string, string>>({});
  const [doctorDrafts, setDoctorDrafts] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string | null>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

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

    setDateDrafts((prev) => {
      const next = { ...prev };
      for (const appointment of appointments) {
        if (next[appointment.id] === undefined) {
          next[appointment.id] = appointment.preferred_date ?? "";
        }
      }
      return next;
    });

    setTimeDrafts((prev) => {
      const next = { ...prev };
      for (const appointment of appointments) {
        if (next[appointment.id] === undefined) {
          next[appointment.id] = appointment.preferred_time ?? "";
        }
      }
      return next;
    });

    setDoctorDrafts((prev) => {
      const next = { ...prev };
      for (const appointment of appointments) {
        if (next[appointment.id] === undefined) {
          next[appointment.id] = appointment.doctor_id ?? "";
        }
      }
      return next;
    });
  }, [appointments]);

  async function saveAppointment(appointment: Appointment) {
    const appointmentId = appointment.id;
    const status = statusDrafts[appointmentId] ?? appointment.status;
    const adminComment = (commentDrafts[appointmentId] ?? "").trim();
    const preferredDate = dateDrafts[appointmentId] ?? appointment.preferred_date;
    const preferredTime = timeDrafts[appointmentId] ?? appointment.preferred_time ?? "";
    const doctorId = doctorDrafts[appointmentId] ?? appointment.doctor_id ?? "";

    setSavingIds((prev) => ({ ...prev, [appointmentId]: true }));
    setSaveErrors((prev) => ({ ...prev, [appointmentId]: null }));

    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appointmentId,
          status,
          adminComment,
          preferredDate,
          preferredTime: preferredTime || null,
          doctorId: doctorId || null,
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
      const matchesStatus = showHistory
        ? true
        : appointment.status === "pending" || appointment.status === "confirmed";

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [appointments, query, selectedDate, showHistory]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedDate, showHistory]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-8">
        <header className="border-b border-slate-800/80 pb-6">
          <p className="text-sm font-medium text-emerald-400">{t("appointments.management")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white flex items-center justify-between">
            {showHistory ? t("appointments.historyTitle") ?? "История записей" : t("appointments.title")}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm font-medium text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-1.5 transition-colors"
            >
              {showHistory ? t("appointments.backToActive") ?? "К активным записям" : t("appointments.viewHistory") ?? "История записей"}
            </button>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {showHistory ? t("appointments.historyDescription") ?? "Просмотр всех записей, включая завершенные и отмененные" : t("appointments.description")}
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
                placeholder={t("appointments.search")}
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
            {t("appointments.found")}{" "}
            <span className="font-semibold text-white">{filteredAppointments.length}</span>
          </p>
        </section>

        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            {t("appointments.noResults")}
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {paginatedAppointments.map((appointment) => (
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
                      {appointment.email ?? t("appointments.emailNotSpecified")} - {appointment.phone}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                  >
                    {t(`status.${appointment.status}`)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("appointments.visitDate")}</p>
                    <p className="mt-1 font-medium text-slate-100">{formatDate(appointment.preferred_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("appointments.time")}</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {appointment.preferred_time ?? t("appointments.notSpecified")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("appointments.created")}</p>
                    <p className="mt-1 font-medium text-slate-100">{formatDateTime(appointment.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("patients.doctor")}</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {getDoctorName(appointment.doctor_id, t("appointments.notSpecified"))}
                    </p>
                  </div>
                </div>

                {appointment.notes ? (
                  <p className="mt-4 rounded-2xl bg-slate-950/60 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
                    {appointment.notes}
                  </p>
                ) : null}

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setExpandedIds(prev => ({ ...prev, [appointment.id]: !prev[appointment.id] }))}
                    className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-2 transition-colors"
                  >
                    <span>{expandedIds[appointment.id] ? (t("common.hide") || "Скрыть") : (t("common.details") || "Подробнее")}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${expandedIds[appointment.id] ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    expandedIds[appointment.id] ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-3 rounded-2xl border border-slate-700/90 bg-slate-950/40 p-4">
                        {/* Date & Time */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t("appointments.visitDate")}</span>
                            <input
                              type="date"
                              value={dateDrafts[appointment.id] ?? appointment.preferred_date}
                              onChange={(e) => setDateDrafts((prev) => ({ ...prev, [appointment.id]: e.target.value }))}
                              className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
                            />
                          </label>
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t("appointments.time")}</span>
                            <input
                              type="time"
                              value={timeDrafts[appointment.id] ?? appointment.preferred_time ?? ""}
                              onChange={(e) => setTimeDrafts((prev) => ({ ...prev, [appointment.id]: e.target.value }))}
                              className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
                            />
                          </label>
                        </div>

                        {/* Status & Doctor */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t("appointments.status")}</span>
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
                              <option value="pending">{t("status.pending")}</option>
                              <option value="confirmed">{t("status.confirmed")}</option>
                              <option value="cancelled">{t("status.cancelled")}</option>
                              <option value="completed">{t("status.completed")}</option>
                            </select>
                          </label>

                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t("patients.doctor")}</span>
                            <select
                              value={doctorDrafts[appointment.id] ?? appointment.doctor_id ?? ""}
                              onChange={(event) =>
                                setDoctorDrafts((prev) => ({
                                  ...prev,
                                  [appointment.id]: event.target.value,
                                }))
                              }
                              className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
                            >
                              <option value="">Без врача</option>
                              {Object.entries(DOCTORS).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                              ))}
                            </select>
                          </label>
                        </div>

                        {/* Comment */}
                        <label className="grid gap-2">
                          <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
                            {t("appointments.adminComment")}
                          </span>
                          <textarea
                          value={commentDrafts[appointment.id] ?? ""}
                          onChange={(event) =>
                            setCommentDrafts((prev) => ({
                              ...prev,
                              [appointment.id]: event.target.value,
                            }))
                          }
                          placeholder={t("appointments.addComment")}
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
                          {savingIds[appointment.id] ? t("appointments.saving") : t("appointments.save")}
                        </button>
                        {saveErrors[appointment.id] ? (
                          <p className="text-sm text-rose-300">{saveErrors[appointment.id]}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("common.prev") || "Назад"}
                </button>
                <span className="text-sm text-slate-400">
                  {t("common.page") || "Страница"} {currentPage} {t("common.of") || "из"} {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("common.next") || "Вперед"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import { useMemo, useState } from "react";
import type { Appointment } from "./adminTypes";
import { formatDate, formatDateTime, statusLabels, statusStyles } from "./adminTypes";
import { useAdminAppointmentsLive } from "./useAdminAppointmentsLive";

type AdminPatientsClientProps = {
  initialAppointments: Appointment[];
};

const doctorNames = ["Анна Мороз", "Игорь Петреску", "Марина Раду", "Виктор Савин"];

function getDoctorNameByAppointmentId(appointmentId: string) {
  const hash = appointmentId.charCodeAt(0) + appointmentId.charCodeAt(1);
  return doctorNames[hash % doctorNames.length];
}

export default function AdminPatientsClient({
  initialAppointments,
}: AdminPatientsClientProps) {
  const { appointments } = useAdminAppointmentsLive(initialAppointments);
  const [expandedPatients, setExpandedPatients] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const patients = useMemo(() => {
    const groups = new Map<
      string,
      {
        id: string;
        first_name: string;
        last_name: string;
        phone: string;
        email: string | null;
        lang: Appointment["lang"];
        appointments: Appointment[];
      }
    >();

    for (const appointment of appointments) {
      const key = `${appointment.phone}|${appointment.first_name.toLowerCase()}|${appointment.last_name.toLowerCase()}`;
      const existing = groups.get(key);

      if (!existing) {
        groups.set(key, {
          id: appointment.id,
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          phone: appointment.phone,
          email: appointment.email,
          lang: appointment.lang,
          appointments: [appointment],
        });
        continue;
      }

      existing.appointments.push(appointment);
    }

    return Array.from(groups.values())
      .map((patient) => ({
        ...patient,
        appointments: [...patient.appointments].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      }))
      .filter((patient) => patient.appointments.some((item) => item.status === "completed"));
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return patients;

    return patients.filter((patient) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      const phone = patient.phone.toLowerCase();
      const email = (patient.email ?? "").toLowerCase();
      return fullName.includes(search) || phone.includes(search) || email.includes(search);
    });
  }, [patients, query]);

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-8">
        <header className="border-b border-slate-800/80 pb-6">
          <p className="text-sm font-medium text-emerald-400">Пациенты</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Клиенты со статусом записи «Завершен»
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Здесь хранится карточка клиента, история его обращений и лечащий врач.
            Отображаются только завершенные записи.
          </p>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-700 bg-slate-900/40 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
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
                placeholder="Поиск: имя, фамилия, телефон или email"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              />
            </label>

            <button
              type="button"
              onClick={() => setQuery("")}
              className="h-11 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Сбросить
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            Найдено пациентов: <span className="font-semibold text-white">{filteredPatients.length}</span>
          </p>
        </section>

        {filteredPatients.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">Пока нет завершенных записей пациентов.</div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/40">
            <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 border-b border-slate-700 px-4 py-3 text-xs uppercase tracking-[0.12em] text-slate-500 md:grid">
              <p>Пациент</p>
              <p>Контакт</p>
              <p>Последний визит</p>
              <p>История</p>
              <p className="text-right">Действия</p>
            </div>
            {filteredPatients.map((patient) => {
              const isExpanded = expandedPatients[patient.id] === true;

              return (
              <div
                key={patient.id}
                className={`border-b border-slate-800 transition-colors duration-200 last:border-b-0 ${
                  isExpanded ? "bg-slate-900/30" : ""
                }`}
              >
                <div className="grid gap-3 px-4 py-4 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] md:items-center md:gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-xs uppercase text-slate-400">Язык: {patient.lang}</p>
                  </div>
                  <p className="text-sm text-slate-300">
                    {patient.email ?? "Email не указан"} - {patient.phone}
                  </p>
                  <p className="text-sm text-slate-200">{formatDate(patient.appointments[0].preferred_date)}</p>
                  <p className="text-sm text-slate-200">{patient.appointments.length}</p>
                  <div className="flex justify-start md:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPatients((prev) => ({
                          ...prev,
                          [patient.id]: !isExpanded,
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-900"
                    >
                      {isExpanded ? "Скрыть" : "Подробнее"}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M6 9l6 6l6-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isExpanded
                      ? "grid-rows-[1fr] border-t border-slate-700 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`bg-slate-950/40 px-4 py-4 transition-all duration-300 ${
                        isExpanded ? "translate-y-0" : "-translate-y-1"
                      }`}
                    >
                    <p className="mb-3 text-xs uppercase tracking-[0.12em] text-slate-500">
                      История обращений / доп. информация
                    </p>
                    <p className="mb-3 text-sm text-slate-300">
                      Лечащий врач:{" "}
                      <span className="font-semibold text-white">{getDoctorNameByAppointmentId(patient.id)}</span>
                    </p>
                    <div className="grid gap-3">
                      {patient.appointments.map((historyItem) => (
                        <div key={historyItem.id} className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-100">
                              {formatDate(historyItem.preferred_date)}{" "}
                              {historyItem.preferred_time ? `- ${historyItem.preferred_time}` : ""}
                            </p>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[historyItem.status]}`}
                            >
                              {statusLabels[historyItem.status]}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            Создано: {formatDateTime(historyItem.created_at)}
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            {historyItem.notes ?? "Проблема не была указана в записи."}
                          </p>
                          {historyItem.admin_comment ? (
                            <p className="mt-2 text-sm text-slate-400">
                              Комментарий администратора: {historyItem.admin_comment}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


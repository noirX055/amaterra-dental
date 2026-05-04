"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { Appointment } from "./adminTypes";
import { formatDate } from "./adminTypes";
import { useAdminAppointmentsLive } from "./useAdminAppointmentsLive";

type AdminDoctorsClientProps = {
  initialAppointments: Appointment[];
};

const doctors = [
  { id: "d1", name: "Анна Мороз", specialty: "Терапевт-стоматолог" },
  { id: "d2", name: "Игорь Петреску", specialty: "Ортодонт" },
  { id: "d3", name: "Марина Раду", specialty: "Хирург-имплантолог" },
  { id: "d4", name: "Виктор Савин", specialty: "Пародонтолог" },
];

function getDoctorCases(completedAppointments: Appointment[]) {
  return doctors.map((doctor, index) => ({
    ...doctor,
    cases: completedAppointments.filter((appointment) => {
      const hash = appointment.id.charCodeAt(0) + appointment.id.charCodeAt(1);
      return hash % doctors.length === index;
    }),
  }));
}

export default function AdminDoctorsClient({
  initialAppointments,
}: AdminDoctorsClientProps) {
  const { appointments } = useAdminAppointmentsLive(initialAppointments);
  const searchParams = useSearchParams();
  const doctorParam = searchParams.get("doctor");

  const completedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "completed"),
    [appointments]
  );

  const casesByDoctor = useMemo(
    () => getDoctorCases(completedAppointments),
    [completedAppointments]
  );

  const activeDoctor = casesByDoctor.find((d) => d.id === doctorParam) ?? casesByDoctor[0];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="rounded-[36px] border border-[#e3eaf1] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <header className="border-b border-[#edf2f7] pb-6">
          <p className="text-sm font-medium text-emerald-600">Врачи</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Команда из 4 лечащих врачей
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            Нажмите на карточку врача, чтобы посмотреть историю пациентов с завершенными
            случаями лечения.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {casesByDoctor.map((doctor) => (
            <Link
              key={doctor.id}
              href={`/admin/doctors?doctor=${doctor.id}`}
              className={`rounded-[24px] border p-5 transition ${
                activeDoctor.id === doctor.id
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[#e7edf3] bg-[#fbfdff] hover:border-emerald-100 hover:bg-emerald-50/40"
              }`}
            >
              <h2 className="text-lg font-semibold text-slate-900">{doctor.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
              <p className="mt-4 text-sm text-slate-400">
                Завершенных случаев:{" "}
                <span className="font-semibold text-slate-700">{doctor.cases.length}</span>
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-[26px] border border-[#e7edf3] bg-[#fbfdff] p-5">
          <h3 className="text-xl font-semibold text-slate-900">
            История пациентов: {activeDoctor.name}
          </h3>

          {activeDoctor.cases.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">У этого врача пока нет завершенных случаев.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {activeDoctor.cases.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-2xl border border-[#e5ebf2] bg-white px-4 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-800">
                      {appointment.first_name} {appointment.last_name}
                    </p>
                    <p className="text-sm text-slate-500">Визит: {formatDate(appointment.preferred_date)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Проблема: {appointment.notes ?? "Информация не указана"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


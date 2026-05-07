"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { Appointment } from "./adminTypes";
import { formatDate } from "./adminTypes";
import { useAppointmentsRealtime } from "./_components/use-appointments-realtime";

type AdminDoctorsClientProps = {
  initialAppointments: Appointment[];
};

const doctors = [
  { id: "d1", name: "Анна Мороз", specialty: "Терапевт-стоматолог", avatar: "АМ", color: "from-blue-500 to-blue-600" },
  { id: "d2", name: "Игорь Петреску", specialty: "Ортодонт", avatar: "ИП", color: "from-emerald-500 to-emerald-600" },
  { id: "d3", name: "Марина Раду", specialty: "Хирург-имплантолог", avatar: "МР", color: "from-purple-500 to-purple-600" },
  { id: "d4", name: "Виктор Савин", specialty: "Пародонтолог", avatar: "ВС", color: "from-amber-500 to-amber-600" },
];

function getDoctorCases(completedAppointments: Appointment[]) {
  return doctors.map((doctor) => ({
    ...doctor,
    cases: completedAppointments.filter((appointment) => appointment.doctor_id === doctor.id),
  }));
}

export default function AdminDoctorsClient({
  initialAppointments,
}: AdminDoctorsClientProps) {
  const { appointments } = useAppointmentsRealtime(initialAppointments);
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
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Наши врачи
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Просмотр профилей врачей и истории завершённых случаев лечения пациентов
        </p>
      </div>

      <div className="space-y-6">
        {/* Карточки врачей */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {casesByDoctor.map((doctor) => {
            const isActive = activeDoctor.id === doctor.id;
            return (
              <Link
                key={doctor.id}
                href={`/admin/doctors?doctor=${doctor.id}`}
                className={`group rounded-xl border p-6 transition-all ${
                  isActive
                    ? "border-emerald-200 bg-emerald-50 shadow-md dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-800"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${doctor.color} text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-110`}>
                    {doctor.avatar}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {doctor.specialty}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Завершено:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {doctor.cases.length}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* История пациентов */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              История пациентов: {activeDoctor.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Завершенные случаи лечения
            </p>
          </div>

          <div className="p-6">
            {activeDoctor.cases.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  У этого врача пока нет завершенных случаев
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeDoctor.cases.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${activeDoctor.color} text-sm font-semibold text-white`}>
                        {appointment.first_name.charAt(0)}
                        {appointment.last_name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {appointment.first_name} {appointment.last_name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {appointment.phone}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(appointment.preferred_date)}
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-3 rounded-lg bg-white p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <p className="font-medium text-gray-900 dark:text-white">Проблема:</p>
                            <p className="mt-1">{appointment.notes}</p>
                          </div>
                        )}
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

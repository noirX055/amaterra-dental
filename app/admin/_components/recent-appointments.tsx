"use client";

import { Appointment, formatDateTime, statusLabels, statusStyles } from "../adminTypes";

export function RecentAppointments({ appointments }: { appointments: Appointment[] }) {
  const recentAppointments = appointments.slice(0, 6);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Последние записи</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Новые заявки пациентов</p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {recentAppointments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Записей не найдено</p>
          </div>
        ) : (
          recentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="group px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-sm">
                  {appointment.first_name.charAt(0)}
                  {appointment.last_name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate font-semibold text-gray-900 dark:text-white">
                        {appointment.first_name} {appointment.last_name}
                      </h4>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {appointment.phone}
                      </p>
                    </div>
                    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}>
                      {statusLabels[appointment.status]}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(new Date(appointment.preferred_date))}</span>
                    </div>
                    {appointment.preferred_time && (
                      <div className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{appointment.preferred_time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="uppercase">{appointment.lang}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {recentAppointments.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-700">
          <a
            href="/admin/appointments"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            Посмотреть все записи →
          </a>
        </div>
      )}
    </div>
  );
}

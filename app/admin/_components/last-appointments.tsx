import { Appointment, formatDateTime, statusLabels, statusStyles } from "../data";

export function LastAppointments({ appointments }: { appointments: Appointment[] }) {
  // Get last 5 appointments
  const lastAppointments = appointments.slice(0, 5);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-dark">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Последние записи
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-dark">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Пациент
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Телефон
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Дата и время
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {lastAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-dark">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {appointment.first_name} {appointment.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {appointment.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDateTime(appointment.created_at)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lastAppointments.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Записей не найдено
          </p>
        </div>
      )}
    </div>
  );
}

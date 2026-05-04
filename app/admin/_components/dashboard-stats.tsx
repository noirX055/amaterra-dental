import { Appointment } from "../data";

type StatCard = {
  title: string;
  count: number;
  icon: string;
  color: string;
};

export function DashboardStats({ appointments }: { appointments: Appointment[] }) {
  const stats: StatCard[] = [
    {
      title: "Завершено",
      count: appointments.filter((a) => a.status === "completed").length,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Отменено",
      count: appointments.filter((a) => a.status === "cancelled").length,
      icon: "✕",
      color: "bg-rose-50 text-rose-700",
    },
    {
      title: "Подтверждено",
      count: appointments.filter((a) => a.status === "confirmed").length,
      icon: "✔",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Ожидает ответа",
      count: appointments.filter((a) => a.status === "pending").length,
      icon: "!",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stat.count}
              </p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
              <span className="text-xl font-bold">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

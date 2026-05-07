"use client";

import { OverviewStats } from "./overview-stats";
import { DashboardStatsV2 } from "./dashboard-stats-v2";
import { AppointmentsChart } from "./appointments-chart";
import { RecentAppointments } from "./recent-appointments";
import { QuickActions } from "./quick-actions";
import { LanguageStats } from "./language-stats";
import { useAppointmentsRealtime } from "./use-appointments-realtime";
import type { Appointment } from "../adminTypes";

type DashboardClientProps = {
  initialAppointments: Appointment[];
};

export function DashboardClient({ initialAppointments }: DashboardClientProps) {
  const { appointments } = useAppointmentsRealtime(initialAppointments);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Обзор
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Статистика записей, активность пациентов и ключевые метрики клиники
        </p>
      </div>

      <div className="space-y-6">
        <OverviewStats appointments={appointments} />

        <DashboardStatsV2 appointments={appointments} />

        <AppointmentsChart appointments={appointments} />

        <QuickActions appointments={appointments} />

        <RecentAppointments appointments={appointments} />
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Appointment } from "../adminTypes";
import { CreateAppointmentModal } from "./create-appointment-modal";

export function QuickActions({ appointments }: { appointments: Appointment[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((a) => a.preferred_date === today);
    const pendingCount = appointments.filter((a) => a.status === "pending").length;
    const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;

    return {
      todayCount: todayAppointments.length,
      pendingCount,
      confirmedCount,
    };
  }, [appointments]);

  const actions = [
    {
      title: "Новая запись",
      description: "Создать запись вручную",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => setIsModalOpen(true),
    },
    {
      title: "Календарь",
      description: "Просмотр расписания",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-emerald-500 hover:bg-emerald-600",
      href: "/admin/calendar",
      badge: stats.todayCount > 0 ? `${stats.todayCount} сегодня` : undefined,
    },
    {
      title: "Ожидают ответа",
      description: "Обработать заявки",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-500 hover:bg-amber-600",
      href: "/admin/appointments?status=pending",
      badge: stats.pendingCount > 0 ? `${stats.pendingCount}` : undefined,
    },
    {
      title: "Подтверждённые",
      description: "Смена статуса",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-emerald-500 hover:bg-emerald-600",
      href: "/admin/appointments?status=confirmed",
      badge: stats.confirmedCount > 0 ? `${stats.confirmedCount}` : undefined,
    },
    {
      title: "Пациенты",
      description: "База пациентов",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/admin/patients",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Быстрые действия</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Часто используемые функции</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {actions.map((action) => {
          const isButton = 'onClick' in action;
          const Component = isButton ? 'button' : 'a';
          const props = isButton
            ? { type: 'button' as const, onClick: action.onClick }
            : { href: action.href };

          return (
            <Component
              key={action.title}
              {...props}
              className="group relative flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600"
            >
              {action.badge && (
                <div className="absolute -right-2 -top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                  {action.badge}
                </div>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.title}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </Component>
          );
        })}
      </div>

      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Modal will show success toast and close itself
        }}
      />
    </div>
  );
}

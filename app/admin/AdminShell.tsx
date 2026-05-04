"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type AdminShellProps = {
  userEmail: string | undefined;
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Дашборд",
    href: "/admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 5.75A1.75 1.75 0 015.75 4h4.5A1.75 1.75 0 0112 5.75v4.5A1.75 1.75 0 0110.25 12h-4.5A1.75 1.75 0 014 10.25v-4.5zM12 5.75A1.75 1.75 0 0113.75 4h4.5A1.75 1.75 0 0120 5.75v4.5A1.75 1.75 0 0118.25 12h-4.5A1.75 1.75 0 0112 10.25v-4.5zM4 13.75A1.75 1.75 0 015.75 12h4.5A1.75 1.75 0 0112 13.75v4.5A1.75 1.75 0 0110.25 20h-4.5A1.75 1.75 0 014 18.25v-4.5zM15.75 12h.5A3.75 3.75 0 0120 15.75v.5A3.75 3.75 0 0116.25 20h-.5A3.75 3.75 0 0112 16.25v-.5A3.75 3.75 0 0115.75 12z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: "Календарь",
    href: "/admin/calendar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2zm3 8h2v2H9v-2zm4 0h2v2h-2v-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Записи",
    href: "/admin/appointments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M7 3v3M17 3v3M4 10h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Врачи",
    href: "/admin/doctors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M8 4h8M12 4v6m-5.5 3h11M8 4l-2 6m10-6l2 6M10 17.5a2 2 0 114 0v2.5h-4v-2.5zM7 20h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Пациенты",
    href: "/admin/patients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M16 20a4 4 0 00-8 0M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7 8a3.5 3.5 0 00-3-3.46M17.5 12a3 3 0 100-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AdminShell({ userEmail, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#e7edf3] bg-[#fbfcfd] px-5 py-6 transition-all duration-300 ease-in-out xl:static xl:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full xl:w-[96px] xl:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-end px-2">

          <button
            type="button"
            onClick={() => setSidebarOpen((current) => !current)}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-[#e7edf3] text-slate-500 transition hover:bg-slate-50 xl:inline-flex"
            aria-label={sidebarOpen ? "Скрыть меню" : "Показать меню"}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d={
                  sidebarOpen
                    ? "M15 6l-6 6l6 6"
                    : "M9 6l6 6l-6 6"
                }
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

            return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-emerald-50 font-semibold text-emerald-700"
                  : "text-slate-500 hover:bg-white hover:text-slate-800"
              } ${sidebarOpen ? "gap-3" : "justify-center xl:px-0"}`}
              title={item.label}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? "max-w-[170px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2 pb-4">
          <div className={`flex ${sidebarOpen ? "items-center gap-3" : "justify-center"}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
              {userEmail?.slice(0, 1).toUpperCase()}
            </div>
            <div
              className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${
                sidebarOpen ? "w-[170px] opacity-100" : "w-0 opacity-0"
              }`}
            >
              <p className="truncate text-sm font-semibold text-slate-800">{userEmail}</p>
              <p className="text-xs text-slate-400">Администратор</p>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              sidebarOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <form action="/api/auth/logout" method="POST" className="mt-3">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#dbe3ea] bg-[#f7f9fb] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </aside>

      {!sidebarOpen ? null : (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 xl:hidden"
          aria-label="Закрыть меню"
        />
      )}

      <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex xl:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e3eaf1] bg-white text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            aria-label="Открыть меню"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

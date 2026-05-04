"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { Appointment } from "@/app/admin/adminTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BellIcon } from "./icons";

type NotificationItem = {
  id: string;
  title: string;
  subTitle: string;
  createdAt: string;
};

const STORAGE_KEY = "admin-notifications-seen-appointments";
const DUE_STORAGE_KEY = "admin-notifications-seen-due";
const NEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const DUE_WINDOW_MS = 10 * 60 * 1000;

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes <= 0) return "только что";
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseAppointmentDateTime(appointment: Appointment) {
  if (!appointment.preferred_time) return null;
  const time = appointment.preferred_time.slice(0, 5);
  const dateTime = new Date(`${appointment.preferred_date}T${time}`);
  if (Number.isNaN(dateTime.getTime())) return null;
  return dateTime;
}

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const seenDueRef = useRef<Set<string>>(new Set());
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (seen) {
        seenIdsRef.current = new Set(JSON.parse(seen) as string[]);
      }
      const seenDue = window.localStorage.getItem(DUE_STORAGE_KEY);
      if (seenDue) {
        seenDueRef.current = new Set(JSON.parse(seenDue) as string[]);
      }
    } catch {
      seenIdsRef.current = new Set();
      seenDueRef.current = new Set();
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const response = await fetch("/api/admin/appointments", {
          cache: "no-store",
        });
        if (!response.ok || !mounted) return;

        const data = (await response.json()) as { appointments: Appointment[] };
        const appointments = data.appointments ?? [];
        const now = Date.now();
        const updates: NotificationItem[] = [];

        for (const item of appointments) {
          const createdAtMs = new Date(item.created_at).getTime();
          const isRecentNew =
            now - createdAtMs <= NEW_WINDOW_MS && !seenIdsRef.current.has(item.id);

          if (isRecentNew) {
            seenIdsRef.current.add(item.id);
            updates.push({
              id: `new:${item.id}`,
              title: "Новая запись",
              subTitle: `${item.first_name} ${item.last_name} отправил(а) заявку`,
              createdAt: item.created_at,
            });
          }

          if (item.status === "cancelled" || item.status === "completed") {
            continue;
          }

          const scheduledAt = parseAppointmentDateTime(item);
          if (!scheduledAt) continue;

          const dueKey = `${item.id}:${scheduledAt.toISOString()}`;
          const delta = Math.abs(now - scheduledAt.getTime());
          const isDueNow = delta <= DUE_WINDOW_MS && !seenDueRef.current.has(dueKey);

          if (isDueNow) {
            seenDueRef.current.add(dueKey);
            updates.push({
              id: `due:${dueKey}`,
              title: "Запись на текущее время",
              subTitle: `${item.first_name} ${item.last_name} на ${scheduledAt.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}`,
              createdAt: new Date().toISOString(),
            });
          }
        }

        if (updates.length > 0) {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(Array.from(seenIdsRef.current))
          );
          window.localStorage.setItem(
            DUE_STORAGE_KEY,
            JSON.stringify(Array.from(seenDueRef.current))
          );
          setNotificationList((prev) => [...updates, ...prev].slice(0, 20));
        }
      } catch {
        // ignore transient polling errors
      }
    };

    poll();
    const intervalId = window.setInterval(poll, 30000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const unreadCount = notificationList.length;
  const isDotVisible = unreadCount > 0;

  const badgeText = useMemo(() => {
    if (unreadCount === 0) return "Пусто";
    if (unreadCount === 1) return "1 новое";
    return `${unreadCount} новых`;
  }, [unreadCount]);

  function clearNotifications() {
    setNotificationList([]);
  }

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Уведомления
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
              {badgeText}
            </span>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={clearNotifications}
                className="text-xs font-medium text-slate-500 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
              >
                Очистить
              </button>
            ) : null}
          </div>
        </div>

        <ul className="mb-3 max-h-92 space-y-1.5 overflow-y-auto">
          {notificationList.length === 0 ? (
            <li className="rounded-lg px-2 py-3 text-sm text-slate-500 dark:text-slate-300">
              Пока нет новых уведомлений.
            </li>
          ) : (
            notificationList.map((item) => (
            <li key={item.id} role="menuitem">
              <Link
                href="/admin/appointments"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <BellIcon width={16} height={16} />
                </span>

                <div>
                  <strong className="block text-sm font-medium text-dark dark:text-white">
                    {item.title}
                  </strong>

                  <span className="block truncate text-sm font-medium text-dark-5 dark:text-dark-6">
                    {item.subTitle}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          )))
          }
        </ul>

        <Link
          href="/admin/appointments"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          Открыть все записи
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}

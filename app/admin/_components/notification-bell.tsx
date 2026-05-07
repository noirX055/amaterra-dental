"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "./toast";

type Notification = {
  id: string;
  appointment_id: string;
  patient_name: string;
  message: string;
  created_at: string;
  read: boolean;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    // Создаём аудио элемент при монтировании
    audioRef.current = new Audio("/notification-sound.mp3");
    audioRef.current.volume = 0.5;
    console.log("🔊 Audio element created");

    // Проверяем, был ли звук уже активирован
    const wasEnabled = localStorage.getItem("audioEnabled") === "true";
    if (wasEnabled) {
      setAudioEnabled(true);
      console.log("🔊 Audio was previously enabled");
    }

    loadNotifications();
    subscribeToNewAppointments();
  }, []);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  async function loadNotifications() {
    const supabase = createClient();
    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, first_name, last_name, created_at, status")
      .order("created_at", { ascending: false })
      .limit(20);

    if (appointments && appointments.length > 0) {
      // Загружаем прочитанные ID из localStorage
      const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");

      const notifs: Notification[] = appointments.map((apt) => ({
        id: apt.id,
        appointment_id: apt.id,
        patient_name: `${apt.first_name} ${apt.last_name}`,
        message: `Новая запись от ${apt.first_name} ${apt.last_name}`,
        created_at: apt.created_at,
        read: readIds.includes(apt.id), // Проверяем, было ли прочитано
      }));

      setNotifications(notifs);
    }
  }

  function subscribeToNewAppointments() {
    const supabase = createClient();

    console.log("Setting up Realtime subscription...");

    const channel = supabase
      .channel("appointments-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("🔔 New appointment received:", payload);
          const newAppointment = payload.new as any;
          const notification: Notification = {
            id: newAppointment.id,
            appointment_id: newAppointment.id,
            patient_name: `${newAppointment.first_name} ${newAppointment.last_name}`,
            message: `Новая запись от ${newAppointment.first_name} ${newAppointment.last_name}`,
            created_at: newAppointment.created_at,
            read: false,
          };

          setNotifications((prev) => [notification, ...prev]);
          playNotificationSound();
          showBrowserNotification(notification);
          showToast(`Новая запись от ${notification.patient_name}`, "info");
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to appointments changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Realtime subscription error");
        }
      });

    return () => {
      console.log("Cleaning up Realtime subscription");
      supabase.removeChannel(channel);
    };
  }

  function playNotificationSound() {
    console.log("🔊 Trying to play sound, audioEnabled:", audioEnabled);
    if (audioRef.current && audioEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => console.log("✅ Sound played successfully"))
        .catch((error) => {
          console.error("❌ Audio playback error:", error);
        });
    } else {
      console.log("⚠️ Audio not enabled or ref is null");
    }
  }

  // Включить звук при первом клике на колокольчик
  function enableAudioOnClick() {
    console.log("🖱️ Bell clicked, audioEnabled:", audioEnabled);
    if (!audioEnabled && audioRef.current) {
      console.log("🔊 Attempting to enable audio...");
      audioRef.current.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("audioEnabled", "true");
        console.log("✅ Audio enabled successfully");
      }).catch((error) => {
        console.log("❌ Audio not enabled:", error);
      });
    }
    setIsOpen(!isOpen);
  }

  function showBrowserNotification(notification: Notification) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Новая запись", {
        body: notification.message,
        icon: "/amaterra.svg",
        badge: "/amaterra.svg",
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Новая запись", {
            body: notification.message,
            icon: "/amaterra.svg",
          });
        }
      });
    }
  }

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // Сохраняем в localStorage
    const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem("readNotifications", JSON.stringify(readIds));
    }
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Сохраняем все ID в localStorage
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem("readNotifications", JSON.stringify(allIds));
  }

  return (
    <div className="relative">
      <button
        onClick={enableAudioOnClick}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Уведомления
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Прочитать все
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Нет уведомлений
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                      !notification.read ? "bg-emerald-50 dark:bg-emerald-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-semibold text-white">
                        {notification.patient_name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.created_at).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <a
                href="/admin/appointments"
                className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Посмотреть все записи
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

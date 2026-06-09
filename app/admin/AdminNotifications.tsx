"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LatestAppointment = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

type AdminNotificationsProps = {
  initialLatestAppointment: LatestAppointment | null;
};

function playNotificationSound(audioContextRef: React.MutableRefObject<AudioContext | null>) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextCtor = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextCtor) {
    return;
  }

  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContextCtor();
  }

  const context = audioContextRef.current;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.18);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.36);
}

export default function AdminNotifications({
  initialLatestAppointment,
}: AdminNotificationsProps) {
  const [latestAppointmentId, setLatestAppointmentId] = useState(
    initialLatestAppointment?.id ?? null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">(
    typeof window === "undefined" || !("Notification" in window)
      ? "unsupported"
      : Notification.permission
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const initialTitle = useMemo(() => {
    if (!initialLatestAppointment) {
      return null;
    }

    return `Новая запись: ${initialLatestAppointment.firstName} ${initialLatestAppointment.lastName}`;
  }, [initialLatestAppointment]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!latestAppointmentId) {
      return;
    }

    window.localStorage.setItem("admin-last-appointment-id", latestAppointmentId);
  }, [latestAppointmentId]);

  async function enableNotifications() {
    if (permissionState === "unsupported") {
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionState(permission);

    if (permission !== "granted") {
      return;
    }

    setNotificationsEnabled(true);

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }

    playNotificationSound(audioContextRef);
    setToastMessage("Уведомления о новых записях включены.");

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }

  useEffect(() => {
    const storedId = window.localStorage.getItem("admin-last-appointment-id");

    if (storedId) {
      setLatestAppointmentId(storedId);
    } else if (initialLatestAppointment?.id) {
      window.localStorage.setItem("admin-last-appointment-id", initialLatestAppointment.id);
    }
  }, [initialLatestAppointment]);

  useEffect(() => {
    const poll = async () => {
      try {
        const response = await fetch("/api/admin/appointments/latest", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { appointment: LatestAppointment | null };
        const latest = data.appointment;

        if (!latest) {
          return;
        }

        if (!latestAppointmentId) {
          setLatestAppointmentId(latest.id);
          return;
        }

        if (latest.id === latestAppointmentId) {
          return;
        }

        // Check if this appointment was created from the admin panel
        const adminCreatedRaw = sessionStorage.getItem("admin-created-ids");
        const adminCreatedIds: string[] = adminCreatedRaw ? JSON.parse(adminCreatedRaw) : [];
        const isAdminCreated = adminCreatedIds.includes(latest.id);

        // Always update the tracked ID
        setLatestAppointmentId(latest.id);

        // Skip notification for admin-created records
        if (isAdminCreated) {
          return;
        }

        const message = `Новая запись: ${latest.firstName} ${latest.lastName}`;
        setToastMessage(message);

        if (toastTimerRef.current) {
          window.clearTimeout(toastTimerRef.current);
        }

        toastTimerRef.current = window.setTimeout(() => {
          setToastMessage(null);
        }, 5000);

        if (notificationsEnabled && permissionState === "granted") {
          if (audioContextRef.current?.state === "suspended") {
            await audioContextRef.current.resume();
          }
          new Notification("Новая запись", {
            body: `${latest.firstName} ${latest.lastName} оставил(а) новую заявку.`,
          });
          playNotificationSound(audioContextRef);
        }
      } catch {
        // Ignore transient polling errors.
      }
    };

    const intervalId = window.setInterval(poll, 3000);
    return () => window.clearInterval(intervalId);
  }, [latestAppointmentId, notificationsEnabled, permissionState]);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col items-end gap-3">
        {toastMessage ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-[0_8px_32px_rgba(15,23,42,0.18)] ring-1 ring-black/5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="leading-5">{toastMessage}</p>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-5 left-5 z-40">
        <button
          type="button"
          onClick={enableNotifications}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          {notificationsEnabled
            ? "Уведомления включены"
            : initialTitle
              ? "Включить уведомления и звук"
              : "Включить уведомления"}
        </button>
      </div>
    </>
  );
}

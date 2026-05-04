"use client";

import { useEffect, useRef, useState } from "react";

import type { Appointment } from "./adminTypes";

async function fetchAppointments(signal?: AbortSignal) {
  const res = await fetch("/api/admin/appointments", {
    method: "GET",
    cache: "no-store",
    signal,
  });
  if (!res.ok) {
    throw new Error("Failed to load appointments");
  }
  const data = (await res.json()) as { appointments: Appointment[] };
  return data.appointments;
}

export function useAdminAppointmentsLive(initialAppointments: Appointment[]) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [error, setError] = useState<string | null>(null);

  const intervalIdRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;

    async function tick() {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const latest = await fetchAppointments(controller.signal);
        if (!mounted) return;
        setAppointments(latest);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        // Avoid spamming the UI for transient errors.
        setError("Не удалось обновить записи.");
      }
    }

    tick();

    intervalIdRef.current = window.setInterval(tick, 1000);

    return () => {
      mounted = false;
      if (intervalIdRef.current) window.clearInterval(intervalIdRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return { appointments, error };
}


"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment } from "../adminTypes";

export function useAppointmentsPolling(initialAppointments: Appointment[]) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  useEffect(() => {
    const supabase = createClient();

    // Функция для загрузки данных
    async function fetchAppointments() {
      const { data } = await supabase
        .from("appointments")
        .select("id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, admin_comment, lang, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        setAppointments(data as Appointment[]);
      }
    }

    // Обновляем данные каждые 10 секунд
    const interval = setInterval(fetchAppointments, 10000);

    return () => clearInterval(interval);
  }, []);

  return { appointments };
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment } from "../adminTypes";

export function useAppointmentsRealtime(initialAppointments: Appointment[]) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  useEffect(() => {
    const supabase = createClient();

    // Подписка на INSERT
    const insertChannel = supabase
      .channel("appointments-insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("New appointment:", payload);
          const newAppointment = payload.new as Appointment;
          setAppointments((prev) => [newAppointment, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log("INSERT subscription status:", status);
      });

    // Подписка на UPDATE
    const updateChannel = supabase
      .channel("appointments-update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("Updated appointment:", payload);
          const updatedAppointment = payload.new as Appointment;
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === updatedAppointment.id ? updatedAppointment : apt
            )
          );
        }
      )
      .subscribe((status) => {
        console.log("UPDATE subscription status:", status);
      });

    // Подписка на DELETE
    const deleteChannel = supabase
      .channel("appointments-delete")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("Deleted appointment:", payload);
          const deletedId = payload.old.id;
          setAppointments((prev) => prev.filter((apt) => apt.id !== deletedId));
        }
      )
      .subscribe((status) => {
        console.log("DELETE subscription status:", status);
      });

    return () => {
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    };
  }, []);

  return { appointments };
}

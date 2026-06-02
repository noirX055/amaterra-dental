"server-only";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { Appointment } from "./adminTypes";

function isMissingAdminCommentColumn(errorMessage: string) {
  return errorMessage.toLowerCase().includes("appointments.admin_comment");
}

export async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminSupabase = createAdminClient();
  const { data: appointmentsData, error } = await adminSupabase
    .from("appointments")
    .select(
      "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, admin_comment, lang, doctor_id, patient_id, created_at, patient:patients(*)"
    )
    .order("created_at", { ascending: false });

  if (error && !isMissingAdminCommentColumn(error.message)) {
    throw new Error(error.message);
  }

  if (error && isMissingAdminCommentColumn(error.message)) {
    const { data: fallbackData, error: fallbackError } = await adminSupabase
      .from("appointments")
      .select(
        "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, lang, doctor_id, patient_id, created_at, patient:patients(*)"
      )
      .order("created_at", { ascending: false });

    if (fallbackError) {
      throw new Error(fallbackError.message);
    }

    const normalized = (fallbackData ?? []).map((item: any) => ({
      ...item,
      patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
      admin_comment: null,
    }));

    return {
      userEmail: user.email,
      appointments: normalized as Appointment[],
    };
  }

  const formattedAppointments = (appointmentsData ?? []).map((item: any) => ({
    ...item,
    patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
  }));

  return {
    userEmail: user.email,
    appointments: formattedAppointments as Appointment[],
  };
}


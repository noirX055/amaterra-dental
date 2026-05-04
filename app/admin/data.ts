import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type Appointment = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  preferred_time: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  admin_comment: string | null;
  lang: "ru" | "ro" | "en";
  created_at: string;
};

export const statusStyles: Record<Appointment["status"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  completed: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
};

export const statusLabels: Record<Appointment["status"], string> = {
  pending: "Ожидает ответа",
  confirmed: "Подтверждено",
  cancelled: "Отменено",
  completed: "Завершено",
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
      "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, admin_comment, lang, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    userEmail: user.email,
    appointments: (appointmentsData ?? []) as Appointment[],
  };
}

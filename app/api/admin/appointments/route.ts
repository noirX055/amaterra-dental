import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isMissingAdminCommentColumn(errorMessage: string) {
  return errorMessage.toLowerCase().includes("appointments.admin_comment");
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from("appointments")
    .select(
      "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, admin_comment, lang, doctor_id, patient_id, created_at, patient:patients(*)"
    )
    .order("created_at", { ascending: false });

  if (error && !isMissingAdminCommentColumn(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (error && isMissingAdminCommentColumn(error.message)) {
    const { data: fallbackData, error: fallbackError } = await adminSupabase
      .from("appointments")
      .select(
        "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, lang, doctor_id, patient_id, created_at, patient:patients(*)"
      )
      .order("created_at", { ascending: false });

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 });
    }

    const normalized = (fallbackData ?? []).map((item: any) => ({
      ...item,
      patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
      admin_comment: null,
    }));

    return NextResponse.json({ appointments: normalized });
  }

  const formattedAppointments = (data ?? []).map((item: any) => ({
    ...item,
    patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
  }));

  return NextResponse.json({ appointments: formattedAppointments });
}

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

type UpdateAppointmentPayload = {
  id?: string;
  status?: (typeof ALLOWED_STATUSES)[number];
  adminComment?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  doctorId?: string | null;
};

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: UpdateAppointmentPayload;
  try {
    body = (await request.json()) as UpdateAppointmentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const id = (body.id ?? "").trim();
  const status = body.status;
  const adminComment = body.adminComment?.trim() ?? null;
  const preferredDate = (body.preferredDate ?? "").trim() || null;
  const preferredTime = (body.preferredTime ?? "").trim() || null;
  const doctorId = (body.doctorId ?? "").trim() || null;

  if (!id) {
    return NextResponse.json({ error: "Appointment id is required" }, { status: 400 });
  }

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const adminSupabase = createAdminClient();
  const updatePayload: Record<string, unknown> = {
    status,
    admin_comment: adminComment,
  };
  if (preferredDate) updatePayload.preferred_date = preferredDate;
  if (preferredTime !== undefined) updatePayload.preferred_time = preferredTime;
  if (doctorId !== undefined) updatePayload.doctor_id = doctorId;

  const { error } = await adminSupabase
    .from("appointments")
    .update(updatePayload)
    .eq("id", id);

  if (error && isMissingAdminCommentColumn(error.message)) {
    const { error: fallbackError } = await adminSupabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      warning: "Admin comment column is missing. Apply migration to enable comments.",
    });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


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
      "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, admin_comment, lang, created_at"
    )
    .order("created_at", { ascending: false });

  if (error && !isMissingAdminCommentColumn(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (error && isMissingAdminCommentColumn(error.message)) {
    const { data: fallbackData, error: fallbackError } = await adminSupabase
      .from("appointments")
      .select(
        "id, first_name, last_name, phone, email, preferred_date, preferred_time, status, notes, lang, created_at"
      )
      .order("created_at", { ascending: false });

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 });
    }

    const normalized = (fallbackData ?? []).map((item) => ({
      ...item,
      admin_comment: null,
    }));

    return NextResponse.json({ appointments: normalized });
  }

  return NextResponse.json({ appointments: data ?? [] });
}

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

type UpdateAppointmentPayload = {
  id?: string;
  status?: (typeof ALLOWED_STATUSES)[number];
  adminComment?: string | null;
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

  if (!id) {
    return NextResponse.json({ error: "Appointment id is required" }, { status: 400 });
  }

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("appointments")
    .update({
      status,
      admin_comment: adminComment,
    })
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


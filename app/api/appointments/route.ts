import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type AppointmentPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  lang?: "ru" | "ro" | "en";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentPayload;

    const firstName = (body.firstName ?? "").trim();
    const lastName = (body.lastName ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const preferredDate = (body.preferredDate ?? "").trim();
    const email = (body.email ?? "").trim() || null;
    const preferredTime = (body.preferredTime ?? "").trim() || null;
    const notes = (body.notes ?? "").trim() || null;
    const lang = body.lang === "ro" || body.lang === "en" ? body.lang : "ru";

    if (!firstName || !lastName || !phone || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.from("appointments").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes,
      lang,
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

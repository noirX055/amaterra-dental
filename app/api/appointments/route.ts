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
  doctor?: string;
  patientId?: string;
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
    const doctor = (body.doctor ?? "").trim() || null;

    if (!firstName || !lastName || !phone || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 1. Determine patient_id
    let patientId = body.patientId || null;

    if (!patientId) {
      // Try to find existing patient by phone
      const { data: existingPatient } = await adminSupabase
        .from("patients")
        .select("id")
        .eq("phone", phone)
        .single();

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        // Create new patient if not found
        const { data: newPatient, error: patientError } = await adminSupabase
          .from("patients")
          .insert({
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
          })
          .select("id")
          .single();

        if (!patientError && newPatient) {
          patientId = newPatient.id;
        }
      }
    }

    // 3. Create appointment with patient_id
    const { error } = await adminSupabase.from("appointments").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes,
      lang,
      doctor_id: doctor,
      patient_id: patientId,
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

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ContactMessagePayload = {
  name?: string;
  email?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactMessagePayload;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim() || null;
    const preferredDate = (body.preferredDate ?? "").trim() || null;
    const preferredTime = (body.preferredTime ?? "").trim() || null;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.from("contact_messages").insert({
      name,
      email,
      message,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      is_read: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

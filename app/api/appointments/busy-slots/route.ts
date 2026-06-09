import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const doctorId = searchParams.get("doctorId");

    if (!date || !doctorId) {
      return NextResponse.json({ busySlots: [] });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .select("preferred_time")
      .eq("preferred_date", date)
      .eq("doctor_id", doctorId)
      // Only consider pending/confirmed appointments as busy
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Failed to fetch busy slots:", error);
      return NextResponse.json({ busySlots: [] });
    }

    // Extract HH:MM prefix
    const busySlots = data
      .map((row) => row.preferred_time?.slice(0, 5))
      .filter(Boolean) as string[];

    return NextResponse.json({ busySlots });
  } catch (error) {
    console.error("Busy slots error:", error);
    return NextResponse.json({ busySlots: [] });
  }
}

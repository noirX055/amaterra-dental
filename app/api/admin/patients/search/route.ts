import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ patients: [] });
    }

    const adminSupabase = createAdminClient();

    // Use Postgres text search or simple ilike
    const { data, error } = await adminSupabase
      .from("patients")
      .select("*")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ patients: data || [] });
  } catch (error) {
    console.error("Failed to search patients:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

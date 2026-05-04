import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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
    .select("id, first_name, last_name, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ appointment: null });
  }

  return NextResponse.json({
    appointment: {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: data.created_at,
    },
  });
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/chat/cleanup
 * Deletes all chat conversations (and their messages via CASCADE) older than 24 hours.
 * Called automatically by Vercel Cron every hour.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: Request) {
  // Protect the route – Vercel sends the secret automatically
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient();

    // Calculate the cutoff timestamp (24 hours ago)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Delete conversations older than 24 hours.
    // Messages are deleted automatically via ON DELETE CASCADE in the DB.
    const { data, error } = await supabase
      .from("chat_conversations")
      .delete()
      .lt("created_at", cutoff)
      .select("id");

    if (error) throw error;

    const deleted = data?.length ?? 0;
    console.log(`[chat-cleanup] Deleted ${deleted} conversation(s) older than 24h`);

    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error("[chat-cleanup] Error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}

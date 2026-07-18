import { NextResponse } from "next/server";
import { requireModerator } from "@/lib/moderation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await requireModerator())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("events")
    .select(
      "id, titre, description, type, discipline, ville, date, lieu, created_at, profiles!events_soumis_par_fkey(nom)"
    )
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}

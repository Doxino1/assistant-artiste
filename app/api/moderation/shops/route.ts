import { NextResponse } from "next/server";
import { requireModerator } from "@/lib/moderation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await requireModerator())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("shops")
    .select(
      "id, nom, ville, adresse, description, lien, discipline, created_at, profiles!shops_soumis_par_fkey(nom)"
    )
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shops: data });
}

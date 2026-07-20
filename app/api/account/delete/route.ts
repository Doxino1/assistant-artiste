import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Suppression définitive du compte, à la demande de l'utilisateur
// lui-même (RGPD). Supprimer la ligne auth.users cascade vers profiles
// (on delete cascade) puis vers tout le reste (posts, comments,
// portfolio_items, library_items, saved_events, matching_tags, follows,
// group_messages, blocks) — déjà en place depuis le schéma initial.
// events.soumis_par passe à null (on delete set null) : les événements
// déjà publiés restent visibles à la communauté.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

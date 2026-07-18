import { createClient } from "@/lib/supabase/server";

// Vérifie que l'utilisateur de la requête courante (via son cookie de
// session) est modérateur. Ne renvoie jamais la clé service_role au client
// — seulement un booléen, utilisé par les Route Handlers de modération pour
// décider s'ils peuvent agir avec le client admin.
export async function requireModerator(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_moderator")
    .eq("id", user.id)
    .single();

  return data?.is_moderator === true;
}

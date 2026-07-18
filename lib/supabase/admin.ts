import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client service_role : ne jamais importer depuis un composant client ni
// exposer SUPABASE_SERVICE_ROLE_KEY au navigateur. Réservé aux Route
// Handlers, après vérification explicite que l'appelant est modérateur.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

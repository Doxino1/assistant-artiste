"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resetSavedEventsCache } from "@/lib/use-saved-events";
import { useT } from "@/lib/i18n/context";

export function SignOutButton() {
  const router = useRouter();
  const t = useT();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetSavedEventsCache();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-foreground/60 hover:text-foreground"
    >
      {t.nav.deconnexion}
    </button>
  );
}

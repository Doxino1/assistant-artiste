"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resetSavedEventsCache } from "@/lib/use-saved-events";

export function SignOutButton() {
  const router = useRouter();

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
      Déconnexion
    </button>
  );
}

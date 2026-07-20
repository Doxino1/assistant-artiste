"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

interface GoingFollow {
  userId: string;
  nom: string;
}

// La RLS de saved_events (policy "saved_events_select_followed_going",
// migration 0016) ne renvoie déjà que les lignes "je_viens" des comptes
// suivis (et non bloqués) — on n'a qu'à filtrer sa propre ligne au cas où.
export function useGoingFollows(eventId: string, userId: string | null) {
  const [names, setNames] = useState<GoingFollow[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!userId) {
        if (active) setNames([]);
        return;
      }
      const { data } = await createClient()
        .from("saved_events")
        .select("user_id, profiles(nom)")
        .eq("event_id", eventId)
        .eq("statut", "je_viens");
      if (!active || !data) return;
      setNames(
        data
          .filter((row) => row.user_id !== userId)
          .map((row) => ({
            userId: row.user_id,
            nom: (row.profiles as unknown as { nom: string } | null)?.nom ?? "",
          }))
      );
    }

    load();
    return () => {
      active = false;
    };
  }, [eventId, userId]);

  return names;
}

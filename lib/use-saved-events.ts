"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createClient } from "./supabase/client";
import { SavedStatus } from "./types";

type SavedMap = Record<string, SavedStatus>;

const EMPTY: SavedMap = {};

let cache: SavedMap = EMPTY;
let userId: string | null = null;
let hydrated = false;
let hydrating: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): SavedMap {
  return cache;
}

function getServerSnapshot(): SavedMap {
  return EMPTY;
}

function hydrate(): Promise<void> {
  if (hydrating) return hydrating;

  hydrating = (async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userId = user?.id ?? null;

    if (!userId) {
      hydrated = true;
      notify();
      return;
    }

    const { data } = await supabase
      .from("saved_events")
      .select("event_id, statut")
      .eq("user_id", userId);

    const next: SavedMap = {};
    for (const row of data ?? []) {
      next[row.event_id] = row.statut as SavedStatus;
    }
    cache = next;
    hydrated = true;
    notify();
  })();

  return hydrating;
}

// Réinitialise l'état partagé à la déconnexion, pour qu'un autre utilisateur
// sur le même navigateur ne voie pas les événements sauvegardés du précédent.
export function resetSavedEventsCache() {
  cache = EMPTY;
  userId = null;
  hydrated = false;
  hydrating = null;
  notify();
}

export function useSavedEvents() {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);

  function setStatus(eventId: string, status: SavedStatus | null) {
    if (!userId) return;

    const next = { ...cache };
    if (status === null) {
      delete next[eventId];
    } else {
      next[eventId] = status;
    }
    cache = next;
    notify();

    const supabase = createClient();
    const query =
      status === null
        ? supabase.from("saved_events").delete().eq("user_id", userId).eq("event_id", eventId)
        : supabase.from("saved_events").upsert({ user_id: userId, event_id: eventId, statut: status });

    query.then(({ error }) => {
      if (error) console.error("saved_events sync failed:", error.message);
    });
  }

  return { saved, setStatus, canSave: userId !== null, hydrated };
}

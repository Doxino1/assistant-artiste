"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SavedStatus } from "./types";

const STORAGE_KEY = "assistant-artistes:saved-events";

type SavedMap = Record<string, SavedStatus>;

const listeners = new Set<() => void>();

function getSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? "{}";
}

function getServerSnapshot(): string {
  return "{}";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function parseSnapshot(raw: string): SavedMap {
  try {
    return JSON.parse(raw) as SavedMap;
  } catch {
    return {};
  }
}

// Stockage local temporaire en attendant la connexion à la table `saved_events` de Supabase.
export function useSavedEvents() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = useMemo(() => parseSnapshot(snapshot), [snapshot]);

  const setStatus = useCallback((eventId: string, status: SavedStatus | null) => {
    const next = parseSnapshot(getSnapshot());
    if (status === null) {
      delete next[eventId];
    } else {
      next[eventId] = status;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  }, []);

  return { saved, setStatus };
}

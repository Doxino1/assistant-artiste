"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dictionary, Locale, LOCALES, dictionaries } from "./dictionary";

const STORAGE_KEY = "assistant-artistes:locale";

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "fr";
  const lang = navigator.language.slice(0, 2).toLowerCase();
  return (LOCALES as string[]).includes(lang) ? (lang as Locale) : "fr";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function storedLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && (LOCALES as string[]).includes(stored) ? (stored as Locale) : null;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => storedLocale() ?? "fr");

  useEffect(() => {
    if (storedLocale()) return;

    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active || !user) {
        setLocaleState(detectBrowserLocale());
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("langue_preferee")
        .eq("id", user.id)
        .single();
      if (!active) return;
      const preferred = data?.langue_preferee;
      setLocaleState(
        preferred && (LOCALES as string[]).includes(preferred) ? (preferred as Locale) : detectBrowserLocale()
      );
    });
    return () => {
      active = false;
    };
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("profiles").update({ langue_preferee: next }).eq("id", user.id).then();
    });
  }

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useT() {
  return useLocale().t;
}

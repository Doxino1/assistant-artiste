"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatInVille } from "@/lib/timezone";
import { useLocale } from "@/lib/i18n/context";
import { Ville } from "@/lib/types";

interface PendingEvent {
  id: string;
  titre: string;
  description: string | null;
  type: string;
  discipline: string | null;
  ville: Ville;
  date: string;
  lieu: string | null;
  profiles: { nom: string } | null;
}

export default function ModerationPage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [events, setEvents] = useState<PendingEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const res = await fetch("/api/moderation/events");
      if (res.status === 403) {
        router.push("/");
        return;
      }
      const body = await res.json();
      if (!active) return;
      if (!res.ok) {
        setError(body.error ?? "Error");
        return;
      }
      setEvents(body.events);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  async function handlePublish(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/moderation/events/${id}`, { method: "PATCH" });
    setBusyId(null);
    if (res.ok) setEvents((prev) => (prev ?? []).filter((e) => e.id !== id));
  }

  async function handleReject(id: string) {
    if (!window.confirm(t.moderation.rejectConfirm)) return;
    setBusyId(id);
    const res = await fetch(`/api/moderation/events/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setEvents((prev) => (prev ?? []).filter((e) => e.id !== id));
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">{t.moderation.title}</h1>

      {error && <p className="mt-6 text-sm text-red-600">{t.moderation.loadError(error)}</p>}
      {events === null && !error && <p className="mt-6 text-sm text-foreground-muted">{t.common.loading}</p>}
      {events !== null && events.length === 0 && (
        <p className="mt-6 text-sm text-foreground-muted">{t.moderation.empty}</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {(events ?? []).map((event) => (
          <div key={event.id} className="rounded-lg border border-foreground/10 p-4">
            <div className="flex items-center justify-between gap-2 text-xs text-foreground-muted">
              <span className="rounded-full bg-foreground/5 px-2 py-0.5">
                {t.eventTypeLabels[event.type as keyof typeof t.eventTypeLabels] ?? event.type}
              </span>
              <span>
                {formatInVille(
                  event.date,
                  event.ville,
                  { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
                  locale
                )}
              </span>
            </div>
            <h3 className="mt-2 font-medium">{event.titre}</h3>
            <p className="mt-1 text-sm text-foreground-muted">
              {t.villeLabels[event.ville]} ·{" "}
              {event.discipline ? (t.disciplineLabels[event.discipline] ?? event.discipline) : ""} ·{" "}
              {event.lieu}
            </p>
            {event.description && <p className="mt-2 text-sm">{event.description}</p>}
            <p className="mt-2 text-xs text-foreground/40">
              {t.moderation.submittedBy(event.profiles?.nom ?? "—")}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={busyId === event.id}
                onClick={() => handlePublish(event.id)}
                className="rounded-lg bg-foreground px-3 py-1 text-sm text-background transition disabled:opacity-50"
              >
                {t.moderation.publish}
              </button>
              <button
                type="button"
                disabled={busyId === event.id}
                onClick={() => handleReject(event.id)}
                className="rounded-lg border border-red-600/40 px-3 py-1 text-sm text-red-600 transition hover:border-red-600 disabled:opacity-50"
              >
                {t.moderation.reject}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

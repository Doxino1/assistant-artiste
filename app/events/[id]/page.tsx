"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveButtons } from "@/components/SaveButtons";
import { useEvents } from "@/lib/use-events";
import { ArtEvent, EVENT_TYPE_LABELS } from "@/lib/types";
import { formatInVille } from "@/lib/timezone";
import { useSavedEvents } from "@/lib/use-saved-events";

function formatDate(event: ArtEvent) {
  return formatInVille(event.date, event.ville, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { events, loading, error } = useEvents();
  const { saved, setStatus } = useSavedEvents();

  const event = events.find((e) => e.id === id);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <p className="text-sm text-foreground/60">Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <p className="text-sm text-red-600">Impossible de charger l&apos;événement ({error}).</p>
      </div>
    );
  }

  if (!event) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
        ← Retour au flux
      </Link>

      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-foreground/60">
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">
          {EVENT_TYPE_LABELS[event.type]}
        </span>
        <span>{event.ville} · {event.quartier}</span>
      </div>

      <h1 className="mt-3 text-2xl font-semibold">{event.titre}</h1>
      <p className="mt-1 text-sm text-foreground/60">{formatDate(event)}</p>
      <p className="mt-1 text-sm text-foreground/60">{event.lieu}</p>

      <p className="mt-6 text-base leading-relaxed">{event.description}</p>

      <div className="mt-8">
        <SaveButtons status={saved[event.id]} onChange={(status) => setStatus(event.id, status)} />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { SaveButtons } from "./SaveButtons";
import { ArtEvent, EVENT_TYPE_LABELS } from "@/lib/types";
import { formatInVille } from "@/lib/timezone";
import { useSavedEvents } from "@/lib/use-saved-events";

function formatDate(event: ArtEvent) {
  return formatInVille(event.date, event.ville, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function EventCard({ event }: { event: ArtEvent }) {
  const { saved, setStatus, canSave } = useSavedEvents();

  return (
    <div className="rounded-lg border border-foreground/10 p-4 transition hover:border-foreground/30">
      <Link href={`/events/${event.id}`} className="block">
        <div className="flex items-center justify-between gap-2 text-xs text-foreground/60">
          <span className="rounded-full bg-foreground/5 px-2 py-0.5">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <span>{formatDate(event)}</span>
        </div>
        <h3 className="mt-2 font-medium">{event.titre}</h3>
        <p className="mt-1 text-sm text-foreground/60">
          {event.ville} · {event.discipline}
        </p>
      </Link>
      <div className="mt-3">
        {canSave ? (
          <SaveButtons status={saved[event.id]} onChange={(status) => setStatus(event.id, status)} />
        ) : (
          <Link href="/login" className="text-xs text-foreground/40 hover:text-foreground/60">
            Connecte-toi pour sauvegarder
          </Link>
        )}
      </div>
    </div>
  );
}

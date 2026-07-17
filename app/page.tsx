"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/lib/use-events";
import { DISCIPLINES, EVENT_TYPE_LABELS, EventType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];

export default function FeedPage() {
  const { events: allEvents, loading, error } = useEvents();
  const [ville, setVille] = useState<Ville>("Paris");
  const [type, setType] = useState<EventType | "">("");
  const [discipline, setDiscipline] = useState("");
  const [quartier, setQuartier] = useState("");
  const [query, setQuery] = useState("");

  const quartiers = useMemo(
    () =>
      Array.from(new Set(allEvents.filter((e) => e.ville === ville).map((e) => e.quartier))).sort(),
    [allEvents, ville]
  );

  const events = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents
      .filter((e) => e.ville === ville)
      .filter((e) => !type || e.type === type)
      .filter((e) => !discipline || e.discipline === discipline)
      .filter((e) => !quartier || e.quartier === quartier)
      .filter(
        (e) =>
          !q ||
          e.titre.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, ville, type, discipline, quartier, query]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex gap-2">
        {VILLES.map((v) => (
          <button
            key={v}
            onClick={() => {
              setVille(v);
              setQuartier("");
            }}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              ville === v
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 hover:border-foreground/40"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Rechercher un événement…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType | "")}
          className="rounded-md border border-foreground/20 bg-transparent px-2 py-1 text-sm"
        >
          <option value="">Tous types</option>
          {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-2 py-1 text-sm"
        >
          <option value="">Toutes disciplines</option>
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={quartier}
          onChange={(e) => setQuartier(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-2 py-1 text-sm"
        >
          <option value="">Tous quartiers</option>
          {quartiers.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {loading && <p className="text-sm text-foreground/60">Chargement des événements…</p>}
        {error && (
          <p className="text-sm text-red-600">
            Impossible de charger les événements ({error}).
          </p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className="text-sm text-foreground/60">Aucun événement ne correspond à ces filtres.</p>
        )}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

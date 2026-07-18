"use client";

import { useState } from "react";
import { VILLE_TIMEZONES } from "@/lib/timezone";
import { useT } from "@/lib/i18n/context";
import { AnnouncementSubtype, DISCIPLINES, EventType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];

export interface EventFormValues {
  titre: string;
  description: string;
  type: EventType;
  sousType: AnnouncementSubtype;
  discipline: string;
  ville: Ville;
  date: string;
  heure: string;
  lieu: string;
}

interface EventFormProps {
  initial: EventFormValues;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<string | null>;
  successMessage?: string;
  resetOnSuccess?: boolean;
  extra?: React.ReactNode;
}

export function EventForm({
  initial,
  submitLabel,
  onSubmit,
  successMessage,
  resetOnSuccess,
  extra,
}: EventFormProps) {
  const t = useT();
  const [values, setValues] = useState<EventFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const err = await onSubmit(values);

    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (successMessage) setMessage(successMessage);
    if (resetOnSuccess) setValues(initial);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <input
        type="text"
        required
        placeholder={t.submission.titre}
        value={values.titre}
        onChange={(e) => set("titre", e.target.value)}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
      />

      <textarea
        placeholder={t.submission.description}
        value={values.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
      />

      <select
        value={values.type}
        onChange={(e) => set("type", e.target.value as EventType)}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
      >
        {Object.entries(t.eventTypeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {values.type === "annonce" && (
        <>
          <select
            value={values.sousType}
            onChange={(e) => set("sousType", e.target.value as AnnouncementSubtype)}
            className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {Object.entries(t.announcementSubtypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <p className="rounded-md bg-foreground/5 px-3 py-2 text-xs text-foreground/60">
            {t.submission.annonceDisclaimer}
          </p>
        </>
      )}

      <select
        value={values.discipline}
        onChange={(e) => set("discipline", e.target.value)}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
      >
        {DISCIPLINES.map((d) => (
          <option key={d} value={d}>
            {t.disciplineLabels[d]}
          </option>
        ))}
      </select>

      <select
        value={values.ville}
        onChange={(e) => set("ville", e.target.value as Ville)}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
      >
        {VILLES.map((v) => (
          <option key={v} value={v}>
            {t.villeLabels[v]}
          </option>
        ))}
      </select>

      <input
        type="text"
        required
        placeholder={t.submission.lieu}
        value={values.lieu}
        onChange={(e) => set("lieu", e.target.value)}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
      />

      <div className="flex gap-2">
        <input
          type="date"
          required
          value={values.date}
          onChange={(e) => set("date", e.target.value)}
          className="w-1/2 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
        <input
          type="time"
          required
          value={values.heure}
          onChange={(e) => set("heure", e.target.value)}
          className="w-1/2 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
      </div>
      <p className="text-xs text-foreground/50">
        {t.submission.heureLocale(t.villeLabels[values.ville], VILLE_TIMEZONES[values.ville])}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-50"
      >
        {loading ? "…" : submitLabel}
      </button>

      {extra}
    </form>
  );
}

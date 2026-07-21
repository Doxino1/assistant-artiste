"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "./EventCard";
import { VILLE_TIMEZONES } from "@/lib/timezone";
import { useLocale } from "@/lib/i18n/context";
import { ArtEvent, Ville } from "@/lib/types";

const BCP47_TAGS: Record<string, string> = { fr: "fr-FR", en: "en-US", el: "el-GR" };

function dayKey(iso: string, ville: Ville): string {
  // Clé YYYY-MM-DD dans le fuseau de la ville, pas celui du navigateur.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VILLE_TIMEZONES[ville],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function EventCalendar({ events, ville }: { events: ArtEvent[]; ville: Ville }) {
  const { locale, t } = useLocale();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ArtEvent[]>();
    for (const e of events) {
      const key = dayKey(e.date, ville);
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [events, ville]);

  const weeks = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const result: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [month]);

  const monthLabel = month.toLocaleDateString(BCP47_TAGS[locale] ?? "fr-FR", {
    month: "long",
    year: "numeric",
  });

  const weekdayLabels = useMemo(() => {
    const base = new Date(2026, 0, 5); // un lundi
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(BCP47_TAGS[locale] ?? "fr-FR", { weekday: "short" });
    });
  }, [locale]);

  const selectedEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="rounded-lg border border-foreground/20 p-1.5 hover:border-foreground/40"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <span className="font-display text-sm font-medium capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="rounded-lg border border-foreground/20 p-1.5 hover:border-foreground/40"
          aria-label="Mois suivant"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-foreground/40">
        {weekdayLabels.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((date, i) => {
          if (!date) return <div key={i} />;
          const year = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          const key = `${year}-${m}-${d}`;
          const count = eventsByDay.get(key)?.length ?? 0;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDay(key === selectedDay ? null : key)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                key === selectedDay
                  ? "bg-foreground text-background"
                  : count > 0
                    ? "bg-foreground/5 hover:bg-foreground/10"
                    : "hover:bg-foreground/5"
              }`}
            >
              <span>{date.getDate()}</span>
              {count > 0 && (
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    key === selectedDay ? "bg-background" : "bg-accent"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-6 flex flex-col gap-3">
          {selectedEvents.length === 0 && (
            <p className="text-sm text-foreground-muted">{t.evenements.noResults}</p>
          )}
          {selectedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

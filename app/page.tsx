"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Store } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { useEvents } from "@/lib/use-events";
import { useSavedEvents } from "@/lib/use-saved-events";
import { createClient } from "@/lib/supabase/client";
import { formatInVille } from "@/lib/timezone";
import { useT } from "@/lib/i18n/context";
import { DISCIPLINES, EventType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];

const EventMap = dynamic(() => import("@/components/EventMap").then((m) => m.EventMap), {
  ssr: false,
});

type Tab = "tous" | "calendrier" | "carte" | "mes";
type SubmissionStatut = "en_attente" | "publie";

interface MySubmission {
  id: string;
  titre: string;
  ville: Ville;
  date: string;
  statut: SubmissionStatut;
}

function pillClass(active: boolean) {
  return `rounded-lg border px-4 py-1.5 text-sm transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/20 hover:border-foreground/40"
  }`;
}

export default function EvenementsPage() {
  const t = useT();
  const { events: allEvents, loading, error } = useEvents();
  const { saved } = useSavedEvents();

  const [tab, setTab] = useState<Tab>("tous");
  const [ville, setVille] = useState<Ville>("Paris");
  const [type, setType] = useState<EventType | "">("");
  const [discipline, setDiscipline] = useState("");
  const [query, setQuery] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [submissions, setSubmissions] = useState<MySubmission[] | null>(null);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!active) return;
        setUserId(user?.id ?? null);
        setCheckingUser(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (tab !== "mes" || !userId) return;
    let active = true;
    createClient()
      .from("events")
      .select("id, titre, ville, date, statut")
      .eq("soumis_par", userId)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setSubmissions((data ?? []) as MySubmission[]);
      });
    return () => {
      active = false;
    };
  }, [tab, userId]);

  const events = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents
      .filter((e) => new Date(e.date).getTime() >= now)
      .filter((e) => e.ville === ville)
      .filter((e) => !type || e.type === type)
      .filter((e) => !discipline || e.discipline === discipline)
      .filter(
        (e) =>
          !q ||
          e.titre.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, ville, type, discipline, query, now]);

  const savedEvents = allEvents
    .filter((e) => saved[e.id] === "sauvegarde")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const goingEvents = allEvents
    .filter((e) => saved[e.id] === "je_viens")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button onClick={() => setTab("tous")} className={pillClass(tab === "tous")}>
            {t.evenements.tabTous}
          </button>
          <button onClick={() => setTab("calendrier")} className={pillClass(tab === "calendrier")}>
            {t.calendar.tab}
          </button>
          <button onClick={() => setTab("carte")} className={pillClass(tab === "carte")}>
            {t.evenements.tabCarte}
          </button>
          <button onClick={() => setTab("mes")} className={pillClass(tab === "mes")}>
            {t.evenements.tabMes}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/boutiques"
            aria-label={t.shops.title}
            title={t.shops.title}
            className="rounded-lg border border-foreground/20 p-1.5 hover:border-foreground/40"
          >
            <Store size={16} strokeWidth={1.75} />
          </Link>
          {userId && (
            <Link
              href="/evenements/nouveau"
              className="rounded-lg bg-accent px-4 py-1.5 text-sm text-accent-foreground transition hover:opacity-90"
            >
              {t.evenements.proposer}
            </Link>
          )}
        </div>
      </div>

      {tab === "tous" && (
        <>
          <div className="mb-6 flex gap-2">
            {VILLES.map((v) => (
              <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
                {t.villeLabels[v]}
              </button>
            ))}
          </div>

          <input
            type="search"
            placeholder={t.evenements.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4 w-full rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />

          <div className="mb-2 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setType("")}
              className={`shrink-0 whitespace-nowrap ${pillClass(type === "")}`}
            >
              {t.evenements.tousTypes}
            </button>
            {Object.entries(t.eventTypeLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setType(value as EventType)}
                className={`shrink-0 whitespace-nowrap ${pillClass(type === value)}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setDiscipline("")}
              className={`shrink-0 whitespace-nowrap ${pillClass(discipline === "")}`}
            >
              {t.evenements.toutesDisciplines}
            </button>
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                onClick={() => setDiscipline(d)}
                className={`shrink-0 whitespace-nowrap ${pillClass(discipline === d)}`}
              >
                {t.disciplineLabels[d]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {loading && <p className="text-sm text-foreground-muted">{t.common.loading}</p>}
            {error && <p className="text-sm text-red-600">{t.evenements.loadError(error)}</p>}
            {!loading && !error && events.length === 0 && (
              <p className="text-sm text-foreground-muted">{t.evenements.noResults}</p>
            )}
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {tab === "calendrier" && (
        <>
          <div className="mb-6 flex gap-2">
            {VILLES.map((v) => (
              <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
                {t.villeLabels[v]}
              </button>
            ))}
          </div>
          <EventCalendar events={events} ville={ville} />
        </>
      )}

      {tab === "carte" && (
        <>
          <div className="mb-6 flex gap-2">
            {VILLES.map((v) => (
              <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
                {t.villeLabels[v]}
              </button>
            ))}
          </div>
          <EventMap key={ville} events={events} ville={ville} />
        </>
      )}

      {tab === "mes" && (
        <>
          {checkingUser && <p className="text-sm text-foreground-muted">{t.common.loading}</p>}

          {!checkingUser && !userId && (
            <p className="text-sm text-foreground-muted">
              <Link href="/login" className="underline hover:text-foreground">
                {t.evenements.loginLink}
              </Link>{" "}
              {t.evenements.loginToSee}
            </p>
          )}

          {!checkingUser && userId && (
            <>
              <section>
                <h2 className="text-sm font-medium text-foreground-muted">{t.evenements.jeViens}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {goingEvents.length === 0 && (
                    <p className="text-sm text-foreground-muted">{t.evenements.noneYet}</p>
                  )}
                  {goingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-sm font-medium text-foreground-muted">{t.evenements.sauvegardes}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {savedEvents.length === 0 && (
                    <p className="text-sm text-foreground-muted">{t.evenements.noneYet}</p>
                  )}
                  {savedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-sm font-medium text-foreground-muted">{t.evenements.mesSoumissions}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {submissions === null && (
                    <p className="text-sm text-foreground-muted">{t.common.loading}</p>
                  )}
                  {submissions !== null && submissions.length === 0 && (
                    <p className="text-sm text-foreground-muted">{t.evenements.noSubmissions}</p>
                  )}
                  {(submissions ?? []).map((s) => (
                    <div key={s.id} className="rounded-lg border border-foreground/10 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium">{s.titre}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            s.statut === "publie"
                              ? "bg-green-600/10 text-green-700"
                              : "bg-foreground/5 text-foreground-muted"
                          }`}
                        >
                          {s.statut === "publie"
                            ? t.evenements.statutPublie
                            : t.evenements.statutEnAttente}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {t.villeLabels[s.ville]} ·{" "}
                        {formatInVille(s.date, s.ville, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <Link
                          href={`/evenements/${s.id}/modifier`}
                          className="text-foreground-muted underline hover:text-foreground"
                        >
                          {t.evenements.editLink}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

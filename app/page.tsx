"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/lib/use-events";
import { useSavedEvents } from "@/lib/use-saved-events";
import { createClient } from "@/lib/supabase/client";
import { formatInVille } from "@/lib/timezone";
import { DISCIPLINES, EVENT_TYPE_LABELS, EventType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];

type Tab = "tous" | "mes";
type SubmissionStatut = "en_attente" | "publie";

interface MySubmission {
  id: string;
  titre: string;
  ville: Ville;
  date: string;
  statut: SubmissionStatut;
}

const STATUT_LABELS: Record<SubmissionStatut, string> = {
  en_attente: "En attente de validation",
  publie: "Publié",
};

function pillClass(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/20 hover:border-foreground/40"
  }`;
}

export default function EvenementsPage() {
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
  }, [allEvents, ville, type, discipline, query]);

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
            Tous
          </button>
          <button onClick={() => setTab("mes")} className={pillClass(tab === "mes")}>
            Mes événements
          </button>
        </div>
        {userId && (
          <Link
            href="/evenements/nouveau"
            className="rounded-full bg-foreground px-4 py-1.5 text-sm text-background transition hover:opacity-90"
          >
            + Proposer
          </Link>
        )}
      </div>

      {tab === "tous" && (
        <>
          <div className="mb-6 flex gap-2">
            {VILLES.map((v) => (
              <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
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
        </>
      )}

      {tab === "mes" && (
        <>
          {checkingUser && <p className="text-sm text-foreground/60">Chargement…</p>}

          {!checkingUser && !userId && (
            <p className="text-sm text-foreground/60">
              <Link href="/login" className="underline hover:text-foreground">
                Connecte-toi
              </Link>{" "}
              pour voir tes événements.
            </p>
          )}

          {!checkingUser && userId && (
            <>
              <section>
                <h2 className="text-sm font-medium text-foreground/60">Je viens</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {goingEvents.length === 0 && (
                    <p className="text-sm text-foreground/60">Aucun événement pour l&apos;instant.</p>
                  )}
                  {goingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-sm font-medium text-foreground/60">Sauvegardés</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {savedEvents.length === 0 && (
                    <p className="text-sm text-foreground/60">Aucun événement pour l&apos;instant.</p>
                  )}
                  {savedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-sm font-medium text-foreground/60">Mes soumissions</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {submissions === null && (
                    <p className="text-sm text-foreground/60">Chargement…</p>
                  )}
                  {submissions !== null && submissions.length === 0 && (
                    <p className="text-sm text-foreground/60">
                      Aucun événement proposé pour l&apos;instant.
                    </p>
                  )}
                  {(submissions ?? []).map((s) => (
                    <div key={s.id} className="rounded-lg border border-foreground/10 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium">{s.titre}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            s.statut === "publie"
                              ? "bg-green-600/10 text-green-700"
                              : "bg-foreground/5 text-foreground/60"
                          }`}
                        >
                          {STATUT_LABELS[s.statut]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/60">
                        {s.ville} ·{" "}
                        {formatInVille(s.date, s.ville, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
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

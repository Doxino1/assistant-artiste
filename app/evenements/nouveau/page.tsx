"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VILLE_TIMEZONES, zonedTimeToUtcIso } from "@/lib/timezone";
import {
  ANNOUNCEMENT_SUBTYPE_LABELS,
  AnnouncementSubtype,
  DISCIPLINES,
  EVENT_TYPE_LABELS,
  EventType,
  Ville,
} from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];

export default function NouvelEvenementPage() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType>("vernissage");
  const [sousType, setSousType] = useState<AnnouncementSubtype>("oeuvre");
  const [discipline, setDiscipline] = useState<string>(DISCIPLINES[0]);
  const [ville, setVille] = useState<Ville>("Paris");
  const [quartier, setQuartier] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("19:00");
  const [lieu, setLieu] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!active) return;
        if (!user) {
          router.push("/login");
          return;
        }
        setCheckingAuth(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // L'heure saisie est l'heure locale de la ville de l'événement (pas celle
    // du navigateur qui soumet), convertie en instant UTC pour le stockage.
    const dateIso = zonedTimeToUtcIso(date, heure, VILLE_TIMEZONES[ville]);

    const { error: insertError } = await supabase.from("events").insert({
      titre,
      description,
      type,
      sous_type: type === "annonce" ? sousType : null,
      discipline,
      ville,
      quartier,
      date: dateIso,
      lieu,
      soumis_par: user.id,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setMessage("Événement soumis, en attente de validation avant publication.");
    setTitre("");
    setDescription("");
    setQuartier("");
    setLieu("");
    setDate("");
  }

  if (checkingAuth) {
    return (
      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <p className="text-sm text-foreground/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-xl font-semibold">Proposer un événement</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Ta soumission sera relue avant publication dans le flux.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
        >
          {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {type === "annonce" && (
          <select
            value={sousType}
            onChange={(e) => setSousType(e.target.value as AnnouncementSubtype)}
            className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {Object.entries(ANNOUNCEMENT_SUBTYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}

        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
        >
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={ville}
          onChange={(e) => setVille(e.target.value as Ville)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
        >
          {VILLES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <input
          type="text"
          required
          placeholder="Quartier"
          value={quartier}
          onChange={(e) => setQuartier(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        <input
          type="text"
          required
          placeholder="Lieu"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        <div className="flex gap-2">
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-1/2 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
          <input
            type="time"
            required
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            className="w-1/2 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        </div>
        <p className="text-xs text-foreground/50">
          Heure locale à {ville} ({VILLE_TIMEZONES[ville]}).
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-50"
        >
          {loading ? "…" : "Soumettre"}
        </button>
      </form>
    </div>
  );
}

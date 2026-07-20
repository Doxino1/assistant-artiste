"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { ProfileType, Ville } from "@/lib/types";

interface ArtisteRow {
  id: string;
  nom: string;
  ville: Ville;
  type_profil: ProfileType;
  disciplines: string[];
  verified: boolean;
}

const VILLES: Ville[] = ["Paris", "Athènes"];

function pillClass(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/20 hover:border-foreground/40"
  }`;
}

export default function ArtistesPage() {
  const t = useT();
  const [ville, setVille] = useState<Ville>("Paris");
  const [artistes, setArtistes] = useState<ArtisteRow[] | null>(null);

  useEffect(() => {
    let active = true;
    createClient()
      .from("profiles")
      .select("id, nom, ville, type_profil, disciplines, verified")
      .eq("ville", ville)
      .order("nom")
      .then(({ data }) => {
        if (!active) return;
        setArtistes((data ?? []) as ArtisteRow[]);
      });
    return () => {
      active = false;
    };
  }, [ville]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">{t.artiste.directory}</h1>
      <div className="mb-6 flex gap-2">
        {VILLES.map((v) => (
          <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
            {t.villeLabels[v]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {artistes === null && <p className="text-sm text-foreground/60">{t.common.loading}</p>}
        {artistes !== null && artistes.length === 0 && (
          <p className="text-sm text-foreground/60">{t.evenements.noResults}</p>
        )}
        {(artistes ?? []).map((a) => (
          <Link
            key={a.id}
            href={`/artistes/${a.id}`}
            className="rounded-lg border border-foreground/10 p-4 transition hover:border-foreground/30"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1 font-medium">
                {a.nom}
                {a.verified && (a.type_profil === "galerie" || a.type_profil === "institution") && (
                  <span title={t.artiste.verified} className="text-blue-600">
                    ✓
                  </span>
                )}
              </h3>
              <span className="text-xs text-foreground/60">{t.profileTypeLabels[a.type_profil]}</span>
            </div>
            <p className="mt-1 text-sm text-foreground/60">
              {a.disciplines.map((d) => t.disciplineLabels[d] ?? d).join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

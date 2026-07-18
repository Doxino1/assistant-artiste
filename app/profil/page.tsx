"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DISCIPLINES, PROFILE_TYPE_LABELS, ProfileType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];
const PROFILE_TYPES = Object.keys(PROFILE_TYPE_LABELS) as ProfileType[];

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [ville, setVille] = useState<Ville>("Paris");
  const [typeProfil, setTypeProfil] = useState<ProfileType>("amateur");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("nom, ville, disciplines, type_profil, bio")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setNom(data.nom ?? "");
        setVille((data.ville as Ville) || "Paris");
        setTypeProfil(data.type_profil as ProfileType);
        setDisciplines(data.disciplines ?? []);
        setBio(data.bio ?? "");
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  function toggleDiscipline(d: string) {
    setDisciplines((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
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

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ nom, ville, type_profil: typeProfil, disciplines, bio })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage("Profil mis à jour.");
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <p className="text-sm text-foreground/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-xl font-semibold">Mon profil</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <label className="text-sm text-foreground/60">
          Nom
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        </label>

        <label className="text-sm text-foreground/60">
          Ville
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value as Ville)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-foreground/60">
          Type de profil
          <select
            value={typeProfil}
            onChange={(e) => setTypeProfil(e.target.value as ProfileType)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {PROFILE_TYPES.map((t) => (
              <option key={t} value={t}>
                {PROFILE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>

        <div className="text-sm text-foreground/60">
          Disciplines
          <div className="mt-1 flex flex-wrap gap-2">
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiscipline(d)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  disciplines.includes(d)
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 hover:border-foreground/40"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm text-foreground/60">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-50"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}

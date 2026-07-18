"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DISCIPLINES,
  MATCHING_TAG_LABELS,
  MatchingTag,
  PROFILE_TYPE_LABELS,
  ProfileType,
  Ville,
} from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];
const PROFILE_TYPES = Object.keys(PROFILE_TYPE_LABELS) as ProfileType[];
const MATCHING_TAGS = Object.keys(MATCHING_TAG_LABELS) as MatchingTag[];

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
  const [emailContact, setEmailContact] = useState("");
  const [matchingTags, setMatchingTags] = useState<MatchingTag[]>([]);

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

      const [{ data, error: fetchError }, { data: tags, error: tagsError }] = await Promise.all([
        supabase
          .from("profiles")
          .select("nom, ville, disciplines, type_profil, bio, email_contact")
          .eq("id", user.id)
          .single(),
        supabase.from("matching_tags").select("tag").eq("user_id", user.id),
      ]);

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setNom(data.nom ?? "");
        setVille((data.ville as Ville) || "Paris");
        setTypeProfil(data.type_profil as ProfileType);
        setDisciplines(data.disciplines ?? []);
        setBio(data.bio ?? "");
        setEmailContact(data.email_contact ?? "");
      }
      if (!tagsError && tags) {
        setMatchingTags(tags.map((t) => t.tag as MatchingTag));
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

  function toggleMatchingTag(tag: MatchingTag) {
    setMatchingTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
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
      .update({
        nom,
        ville,
        type_profil: typeProfil,
        disciplines,
        bio,
        email_contact: emailContact || null,
      })
      .eq("id", user.id);

    if (updateError) {
      setSaving(false);
      setError(updateError.message);
      return;
    }

    const { error: deleteTagsError } = await supabase
      .from("matching_tags")
      .delete()
      .eq("user_id", user.id);

    if (!deleteTagsError && matchingTags.length > 0) {
      await supabase
        .from("matching_tags")
        .insert(matchingTags.map((tag) => ({ user_id: user.id, tag })));
    }

    setSaving(false);
    if (deleteTagsError) {
      setError(deleteTagsError.message);
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

        <div className="text-sm text-foreground/60">
          Je cherche
          <div className="mt-1 flex flex-wrap gap-2">
            {MATCHING_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleMatchingTag(tag)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  matchingTags.includes(tag)
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 hover:border-foreground/40"
                }`}
              >
                {MATCHING_TAG_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm text-foreground/60">
          Email de contact <span className="text-foreground/40">(optionnel, visible des autres artistes)</span>
          <input
            type="email"
            value={emailContact}
            onChange={(e) => setEmailContact(e.target.value)}
            placeholder="Laisse vide pour ne pas être contactable"
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

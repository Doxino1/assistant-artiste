"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MATCHING_TAG_LABELS, MatchingTag, PROFILE_TYPE_LABELS, ProfileType } from "@/lib/types";

interface Suggestion {
  id: string;
  nom: string;
  typeProfil: ProfileType;
  disciplines: string[];
  bio: string;
  emailContact: string | null;
  sharedDisciplines: string[];
  sharedTags: MatchingTag[];
}

export default function MatchingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myTags, setMyTags] = useState<MatchingTag[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

      const [{ data: me, error: meError }, { data: myTagRows }] = await Promise.all([
        supabase.from("profiles").select("ville, disciplines").eq("id", user.id).single(),
        supabase.from("matching_tags").select("tag").eq("user_id", user.id),
      ]);

      if (!active) return;

      if (meError || !me) {
        setError(meError?.message ?? "Profil introuvable.");
        setLoading(false);
        return;
      }

      const mine = (myTagRows ?? []).map((t) => t.tag as MatchingTag);
      setMyTags(mine);

      const [{ data: candidates, error: candidatesError }, { data: allTags }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, nom, type_profil, disciplines, bio, email_contact")
          .eq("ville", me.ville)
          .neq("id", user.id),
        supabase.from("matching_tags").select("user_id, tag"),
      ]);

      if (!active) return;

      if (candidatesError) {
        setError(candidatesError.message);
        setLoading(false);
        return;
      }

      const tagsByUser = new Map<string, MatchingTag[]>();
      for (const row of allTags ?? []) {
        const list = tagsByUser.get(row.user_id) ?? [];
        list.push(row.tag as MatchingTag);
        tagsByUser.set(row.user_id, list);
      }

      const results: Suggestion[] = [];
      for (const c of candidates ?? []) {
        const candidateDisciplines: string[] = c.disciplines ?? [];
        const candidateTags = tagsByUser.get(c.id) ?? [];
        const sharedDisciplines = candidateDisciplines.filter((d) => me.disciplines.includes(d));
        const sharedTags = candidateTags.filter((t) => mine.includes(t));

        if (sharedDisciplines.length > 0 && sharedTags.length > 0) {
          results.push({
            id: c.id,
            nom: c.nom,
            typeProfil: c.type_profil as ProfileType,
            disciplines: candidateDisciplines,
            bio: c.bio ?? "",
            emailContact: c.email_contact,
            sharedDisciplines,
            sharedTags,
          });
        }
      }

      setSuggestions(results);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <p className="text-sm text-foreground/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">Suggestions de matching</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Même ville, discipline en commun, et un tag &laquo; je cherche &raquo; partagé.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!error && myTags.length === 0 && (
        <p className="mt-6 text-sm text-foreground/60">
          Ajoute au moins un tag « je cherche » sur ton profil pour voir des suggestions.
        </p>
      )}

      {!error && myTags.length > 0 && suggestions.length === 0 && (
        <p className="mt-6 text-sm text-foreground/60">
          Aucune suggestion pour l&apos;instant — reviens plus tard.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {suggestions.map((s) => (
          <div key={s.id} className="rounded-lg border border-foreground/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{s.nom}</h3>
              <span className="text-xs text-foreground/60">{PROFILE_TYPE_LABELS[s.typeProfil]}</span>
            </div>
            <p className="mt-1 text-sm text-foreground/60">{s.disciplines.join(", ")}</p>
            {s.bio && <p className="mt-2 text-sm">{s.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              {s.sharedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/60"
                >
                  {MATCHING_TAG_LABELS[tag]}
                </span>
              ))}
            </div>
            <div className="mt-3">
              {s.emailContact ? (
                <a
                  href={`mailto:${s.emailContact}`}
                  className="rounded-full border border-foreground/20 px-3 py-1 text-sm hover:border-foreground/40"
                >
                  Contacter
                </a>
              ) : (
                <span className="text-xs text-foreground/40">Pas de contact renseigné</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

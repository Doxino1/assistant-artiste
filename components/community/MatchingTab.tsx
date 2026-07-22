"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { MatchingTag, ProfileType } from "@/lib/types";

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

export function MatchingTab() {
  const t = useT();
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
        setError(meError?.message ?? t.common.profileNotFound);
        setLoading(false);
        return;
      }

      const mine = (myTagRows ?? []).map((row) => row.tag as MatchingTag);
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
        const sharedTags = candidateTags.filter((tag) => mine.includes(tag));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (loading) {
    return <p className="text-sm text-foreground-muted">{t.common.loading}</p>;
  }

  return (
    <div>
      <p className="mb-6 text-sm text-foreground-muted">{t.matching.subtitle}</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && myTags.length === 0 && (
        <p className="text-sm text-foreground-muted">{t.matching.needTag}</p>
      )}

      {!error && myTags.length > 0 && suggestions.length === 0 && (
        <p className="text-sm text-foreground-muted">{t.matching.noResults}</p>
      )}

      <div className="flex flex-col gap-3">
        {suggestions.map((s) => (
          <div key={s.id} className="rounded-lg border border-foreground/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/artistes/${s.id}`} className="font-medium hover:underline">
                {s.nom}
              </Link>
              <span className="text-xs text-foreground-muted">{t.profileTypeLabels[s.typeProfil]}</span>
            </div>
            <p className="mt-1 text-sm text-foreground-muted">
              {s.disciplines.map((d) => t.disciplineLabels[d] ?? d).join(", ")}
            </p>
            {s.bio && <p className="mt-2 text-sm">{s.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              {s.sharedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground-muted"
                >
                  {t.matchingTagLabels[tag]}
                </span>
              ))}
            </div>
            <div className="mt-3">
              {s.emailContact ? (
                <a
                  href={`mailto:${s.emailContact}`}
                  className="rounded-lg border border-accent/40 px-3 py-1 text-sm text-accent hover:border-accent"
                >
                  {t.matching.contact}
                </a>
              ) : (
                <span className="text-xs text-foreground/40">{t.matching.noContact}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

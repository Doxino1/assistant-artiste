"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/context";
import { BlockReportActions } from "@/components/BlockReportActions";
import { Ville } from "@/lib/types";

interface Message {
  id: string;
  texte: string;
  date: string;
  user_id: string;
  profiles: { nom: string } | null;
}

const VILLES: Ville[] = ["Paris", "Athènes"];
const BCP47_TAGS: Record<string, string> = { fr: "fr-FR", en: "en-US", el: "el-GR" };

function pillClass(active: boolean) {
  return `rounded-lg border px-4 py-1.5 text-sm transition ${
    active
      ? "border-accent bg-accent text-accent-foreground"
      : "border-foreground/20 hover:border-foreground/40"
  }`;
}

export function CommunityChatTab() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [ville, setVille] = useState<Ville | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(BCP47_TAGS[locale] ?? "fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const loadMessages = useCallback(async (group: string) => {
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("group_messages")
      .select("id, texte, date, user_id, profiles(nom)")
      .eq("group_id", group)
      .order("date", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setMessages((data ?? []) as unknown as Message[]);
  }, []);

  const loadBlocked = useCallback(async (uid: string) => {
    const supabase = createClient();
    const { data } = await supabase.from("blocks").select("blocker_id, blocked_id");
    const ids = new Set<string>();
    for (const row of data ?? []) {
      if (row.blocker_id === uid) ids.add(row.blocked_id);
      if (row.blocked_id === uid) ids.add(row.blocker_id);
    }
    setBlockedIds(ids);
  }, []);

  // Récupère l'utilisateur une seule fois et initialise la ville affichée sur
  // sa ville de profil — ensuite l'utilisateur peut basculer librement sur
  // l'autre ville sans que ça touche à son profil.
  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!active) return;
      setUserId(user.id);
      await loadBlocked(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ville")
        .eq("id", user.id)
        .single();

      if (!active) return;
      if (profileError || !profile) {
        setError(profileError?.message ?? t.common.profileNotFound);
        setLoading(false);
        return;
      }

      setVille(profile.ville as Ville);
    }

    init();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, loadBlocked]);

  // Recharge le groupe + les messages à chaque changement de ville affichée —
  // c'est cette dépendance qui manquait, la ville du profil n'était lue
  // qu'une fois au montage donc changer de ville ne rechargeait jamais rien.
  useEffect(() => {
    if (!ville) return;
    let active = true;
    const supabase = createClient();

    async function loadGroup() {
      setLoading(true);
      setError(null);

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id")
        .eq("ville", ville)
        .single();

      if (!active) return;
      if (groupError || !group) {
        setError(groupError?.message ?? t.communaute.groupNotFound);
        setLoading(false);
        return;
      }

      setGroupId(group.id);
      await loadMessages(group.id);
      if (active) setLoading(false);
    }

    loadGroup();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ville, loadMessages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!groupId || !texte.trim()) return;

    setSending(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase
      .from("group_messages")
      .insert({ group_id: groupId, user_id: user.id, texte: texte.trim() });

    setSending(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTexte("");
    await loadMessages(groupId);
  }

  const visibleMessages = messages.filter((m) => !blockedIds.has(m.user_id));

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {VILLES.map((v) => (
          <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
            {t.villeLabels[v]}
          </button>
        ))}
      </div>

      <h2 className="font-display text-lg font-medium">
        {t.communaute.title(ville ? (t.villeLabels[ville] ?? ville) : "")}
      </h2>

      {loading && <p className="mt-4 text-sm text-foreground-muted">{t.common.loading}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && (
        <>
          <div className="mt-6 flex flex-col gap-3">
            {visibleMessages.length === 0 && !error && (
              <p className="text-sm text-foreground-muted">{t.communaute.noMessages}</p>
            )}
            {visibleMessages.map((m) => (
              <div key={m.id} className="rounded-lg border border-foreground/10 p-3">
                <div className="flex items-baseline justify-between gap-2 text-xs text-foreground-muted">
                  <Link href={`/artistes/${m.user_id}`} className="font-medium text-foreground hover:underline">
                    {m.profiles?.nom || t.communaute.anonyme}
                  </Link>
                  <span>{formatDate(m.date)}</span>
                </div>
                <p className="mt-1 text-sm">{m.texte}</p>
                {userId && m.user_id !== userId && (
                  <BlockReportActions
                    targetUserId={m.user_id}
                    targetName={m.profiles?.nom || t.communaute.anonyme}
                    onBlocked={() => setBlockedIds((prev) => new Set(prev).add(m.user_id))}
                    className="mt-1.5"
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <input
              type="text"
              required
              placeholder={t.communaute.placeholder}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              className="flex-1 rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {sending ? "…" : t.communaute.send}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  texte: string;
  date: string;
  user_id: string;
  profiles: { nom: string } | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommunautePage() {
  const router = useRouter();
  const [ville, setVille] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ville")
        .eq("id", user.id)
        .single();

      if (!active) return;
      if (profileError || !profile) {
        setError(profileError?.message ?? "Profil introuvable.");
        setLoading(false);
        return;
      }

      setVille(profile.ville);

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id")
        .eq("ville", profile.ville)
        .single();

      if (!active) return;
      if (groupError || !group) {
        setError(groupError?.message ?? "Groupe introuvable pour cette ville.");
        setLoading(false);
        return;
      }

      setGroupId(group.id);
      await loadMessages(group.id);
      if (active) setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router, loadMessages]);

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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <p className="text-sm text-foreground/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">Communauté {ville}</h1>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-col gap-3">
        {messages.length === 0 && !error && (
          <p className="text-sm text-foreground/60">Aucun message pour l&apos;instant — lance la discussion.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-foreground/10 p-3">
            <div className="flex items-baseline justify-between gap-2 text-xs text-foreground/60">
              <span className="font-medium text-foreground">{m.profiles?.nom || "Anonyme"}</span>
              <span>{formatDate(m.date)}</span>
            </div>
            <p className="mt-1 text-sm">{m.texte}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          required
          placeholder="Écrire un message…"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          className="flex-1 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-50"
        >
          {sending ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}

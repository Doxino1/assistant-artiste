"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { Toggle } from "@/components/Toggle";
import { DISCIPLINES, MATCHING_TAGS, MatchingTag, PROFILE_TYPES, ProfileType, Ville } from "@/lib/types";

const VILLES: Ville[] = ["Paris", "Athènes"];
type Tab = "posts" | "portfolio";

interface Post {
  id: string;
  image: string | null;
  legende: string | null;
}

interface PortfolioItem {
  id: string;
  titre: string;
  technique: string | null;
  annee: number | null;
  image_url: string | null;
}

function initials(nom: string) {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function tabClass(active: boolean) {
  return `flex-1 flex items-center justify-center gap-1.5 border-b-2 py-2 text-sm font-medium transition ${
    active ? "border-foreground text-foreground" : "border-transparent text-foreground/50 hover:text-foreground/70"
  }`;
}

export default function ProfilPage() {
  const t = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [ville, setVille] = useState<Ville>("Paris");
  const [typeProfil, setTypeProfil] = useState<ProfileType>("amateur");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [matchingTags, setMatchingTags] = useState<MatchingTag[]>([]);
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [postsPublic, setPostsPublic] = useState(true);

  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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

      setUserId(user.id);

      const [
        { data, error: fetchError },
        { data: tags, error: tagsError },
        { data: userPosts },
        { data: items },
        { count: followers },
        { count: following },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("nom, ville, disciplines, type_profil, bio, email_contact, portfolio_public, posts_public")
          .eq("id", user.id)
          .single(),
        supabase.from("matching_tags").select("tag").eq("user_id", user.id),
        supabase.from("posts").select("id, image, legende").eq("user_id", user.id).order("date", { ascending: false }),
        supabase
          .from("portfolio_items")
          .select("id, titre, technique, annee, image_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("followed_id", user.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
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
        setPortfolioPublic(data.portfolio_public);
        setPostsPublic(data.posts_public);
      }
      if (!tagsError && tags) {
        setMatchingTags(tags.map((row) => row.tag as MatchingTag));
      }
      setPosts(userPosts ?? []);
      setPortfolio(items ?? []);
      setFollowerCount(followers ?? 0);
      setFollowingCount(following ?? 0);
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

  async function setVisibility(field: "portfolio_public" | "posts_public", value: boolean) {
    if (!userId) return;
    if (field === "portfolio_public") setPortfolioPublic(value);
    else setPostsPublic(value);

    const supabase = createClient();
    await supabase.from("profiles").update({ [field]: value }).eq("id", userId);
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
    setMessage(t.profil.saved);
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <p className="text-sm text-foreground/60">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 text-lg font-medium">
          {initials(nom)}
        </div>
        <p className="mt-2 text-base font-medium">{nom}</p>
        <span className="mt-1.5 rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-foreground/70">
          {t.profileTypeLabels[typeProfil]}
        </span>
        <p className="mt-2 text-sm text-foreground/60">
          {disciplines.map((d) => t.disciplineLabels[d] ?? d).join(" · ")}
        </p>

        <div className="mt-3.5 flex gap-6">
          <div className="text-center">
            <p className="text-sm font-semibold">{posts.length}</p>
            <p className="text-xs text-foreground/50">{t.profil.postsLabel}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{followerCount}</p>
            <p className="text-xs text-foreground/50">{t.profil.followersLabel}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{followingCount}</p>
            <p className="text-xs text-foreground/50">{t.profil.followingLabel}</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="mt-6 flex border-b border-foreground/10">
        <button onClick={() => setTab("posts")} className={tabClass(tab === "posts")}>
          {t.profil.postsLabel}
        </button>
        <button onClick={() => setTab("portfolio")} className={tabClass(tab === "portfolio")}>
          {t.artiste.portfolio}
        </button>
      </div>

      {tab === "posts" && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-foreground/50">{t.profil.postsSubtitle}</p>
            <Toggle checked={postsPublic} onChange={(v) => setVisibility("posts_public", v)} />
          </div>

          <div className="grid grid-cols-3 gap-1">
            <Link
              href="/profil/posts"
              className="flex aspect-square items-center justify-center rounded border-[1.5px] border-dashed border-foreground/25 text-foreground/40 hover:border-foreground/40"
            >
              <span className="text-xl leading-none">+</span>
            </Link>
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="aspect-square">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.legende ?? ""} className="h-full w-full rounded object-cover" />
                ) : (
                  <div className="h-full w-full rounded bg-foreground/5" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === "portfolio" && (
        <div className="mt-3">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-xs text-foreground/50">{t.profil.portfolioSubtitle}</p>
            <Toggle checked={portfolioPublic} onChange={(v) => setVisibility("portfolio_public", v)} />
          </div>

          <div className="flex flex-col gap-2">
            {portfolio.map((item) => (
              <div key={item.id} className="flex gap-2.5 rounded-lg bg-foreground/5 p-2.5">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.titre} className="h-[52px] w-[52px] shrink-0 rounded object-cover" />
                ) : (
                  <div className="h-[52px] w-[52px] shrink-0 rounded bg-foreground/10" />
                )}
                <div>
                  <p className="text-sm font-medium">{item.titre}</p>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {[item.technique, item.annee].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/profil/portfolio"
              className="rounded-full border border-foreground/20 py-2 text-center text-sm hover:border-foreground/40"
            >
              + {t.portfolio.addPiece}
            </Link>
          </div>
        </div>
      )}

      {/* Bibliothèque privée */}
      <Link
        href="/profil/bibliotheque"
        className="mt-6 block rounded-lg bg-foreground/5 p-3 transition hover:bg-foreground/10"
      >
        <p className="text-sm text-foreground/70">🔒 {t.library.title}</p>
        <p className="mt-1 text-xs text-foreground/50">{t.library.subtitle}</p>
      </Link>

      {/* Bio */}
      {bio && (
        <div className="mt-3 rounded-lg bg-foreground/5 p-3">
          <p className="text-sm text-foreground/60">{t.profil.bio}</p>
          <p className="mt-1 text-sm leading-relaxed">{bio}</p>
        </div>
      )}

      {/* Paramètres */}
      <h2 className="mt-10 text-sm font-medium text-foreground/60">{t.profil.settingsTitle}</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="text-sm text-foreground/60">
          {t.profil.nom}
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        </label>

        <label className="text-sm text-foreground/60">
          {t.profil.ville}
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value as Ville)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {t.villeLabels[v]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-foreground/60">
          {t.profil.typeProfil}
          <select
            value={typeProfil}
            onChange={(e) => setTypeProfil(e.target.value as ProfileType)}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            {PROFILE_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {t.profileTypeLabels[pt]}
              </option>
            ))}
          </select>
        </label>

        <div className="text-sm text-foreground/60">
          {t.profil.disciplines}
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
                {t.disciplineLabels[d]}
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm text-foreground/60">
          {t.profil.bio}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        </label>

        <div className="text-sm text-foreground/60">
          {t.profil.jeCherche}
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
                {t.matchingTagLabels[tag]}
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm text-foreground/60">
          {t.profil.emailContact} <span className="text-foreground/40">{t.profil.emailContactHint}</span>
          <input
            type="email"
            value={emailContact}
            onChange={(e) => setEmailContact(e.target.value)}
            placeholder={t.profil.emailContactPlaceholder}
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
          {saving ? "…" : t.profil.save}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm">
        <Link href="/profil/bloques" className="text-foreground/70 underline hover:text-foreground">
          {t.safety.blockedUsersTitle}
        </Link>
      </div>
    </div>
  );
}

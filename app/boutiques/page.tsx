"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";
import { useT } from "@/lib/i18n/context";
import { Ville } from "@/lib/types";

const ShopMap = dynamic(() => import("@/components/ShopMap").then((m) => m.ShopMap), {
  ssr: false,
});

interface Shop {
  id: string;
  nom: string;
  ville: string;
  adresse: string | null;
  description: string | null;
  lien: string | null;
  lat: number | null;
  lng: number | null;
}

const VILLES: Ville[] = ["Paris", "Athènes"];
type Tab = "liste" | "carte";

function pillClass(active: boolean) {
  return `rounded-lg border px-4 py-1.5 text-sm transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/20 hover:border-foreground/40"
  }`;
}

export default function BoutiquesPage() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("liste");
  const [ville, setVille] = useState<Ville>("Paris");
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [isModerator, setIsModerator] = useState(false);

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [description, setDescription] = useState("");
  const [lien, setLien] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("shops")
      .select("id, nom, ville, adresse, description, lien, lat, lng")
      .order("nom");
    setShops(data ?? []);
  }

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function fetchShops() {
      const { data } = await supabase
        .from("shops")
        .select("id, nom, ville, adresse, description, lien, lat, lng")
        .order("nom");
      if (active) setShops(data ?? []);
    }

    fetchShops();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active || !user) return;
      const { data } = await supabase.from("profiles").select("is_moderator").eq("id", user.id).single();
      if (active) setIsModerator(data?.is_moderator === true);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Géocodage best-effort (Nominatim/OSM, gratuit, sans clé) — un échec ne
    // bloque pas l'ajout, la boutique reste listée sans pin carte.
    const coords = adresse ? await geocode(`${adresse}, ${ville}`) : null;

    const supabase = createClient();
    const { error: insertError } = await supabase.from("shops").insert({
      nom,
      ville,
      adresse: adresse || null,
      description: description || null,
      lien: lien || null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNom("");
    setAdresse("");
    setDescription("");
    setLien("");
    load();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("shops").delete().eq("id", id);
    load();
  }

  const filtered = (shops ?? []).filter((s) => s.ville === ville);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">{t.shops.title}</h1>

      <div className="mb-6 mt-6 flex gap-2">
        <button onClick={() => setTab("liste")} className={pillClass(tab === "liste")}>
          {t.shops.tabList}
        </button>
        <button onClick={() => setTab("carte")} className={pillClass(tab === "carte")}>
          {t.shops.tabMap}
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {VILLES.map((v) => (
          <button key={v} onClick={() => setVille(v)} className={pillClass(ville === v)}>
            {t.villeLabels[v]}
          </button>
        ))}
      </div>

      {tab === "liste" && (
        <>
          {isModerator && (
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 rounded-lg border border-foreground/10 p-4">
              <h2 className="text-sm font-medium text-foreground-muted">{t.shops.addShop}</h2>
              <input
                type="text"
                required
                placeholder={t.shops.nom}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
              />
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value as Ville)}
                className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm"
              >
                {VILLES.map((v) => (
                  <option key={v} value={v}>
                    {t.villeLabels[v]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder={t.shops.adresse}
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
              />
              <textarea
                placeholder={t.shops.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
              />
              <input
                type="url"
                placeholder={t.shops.lien}
                value={lien}
                onChange={(e) => setLien(e.target.value)}
                className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "…" : t.shops.add}
              </button>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {shops !== null && filtered.length === 0 && (
              <p className="text-sm text-foreground-muted">{t.shops.empty}</p>
            )}
            {filtered.map((shop) => (
              <div key={shop.id} className="rounded-lg border border-foreground/10 p-4">
                <h3 className="font-medium">{shop.nom}</h3>
                {shop.adresse && <p className="mt-1 text-sm text-foreground-muted">{shop.adresse}</p>}
                {shop.description && <p className="mt-1 text-sm">{shop.description}</p>}
                {shop.lien && (
                  <a
                    href={shop.lien}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm underline hover:text-foreground"
                  >
                    {shop.lien}
                  </a>
                )}
                {isModerator && (
                  <button
                    type="button"
                    onClick={() => handleDelete(shop.id)}
                    className="mt-2 block text-xs text-red-600 hover:underline"
                  >
                    {t.shops.delete}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "carte" && <ShopMap key={ville} shops={filtered} ville={ville} />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Ville } from "@/lib/types";

type Mode = "connexion" | "inscription";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState<Ville>("Paris");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "connexion") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, ville },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setMessage("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse avant de te connecter.");
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8">
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("connexion")}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            mode === "connexion"
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 hover:border-foreground/40"
          }`}
        >
          Se connecter
        </button>
        <button
          type="button"
          onClick={() => setMode("inscription")}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            mode === "inscription"
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 hover:border-foreground/40"
          }`}
        >
          S&apos;inscrire
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        {mode === "inscription" && (
          <>
            <input
              type="text"
              required
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
            />
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value as Ville)}
              className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
            >
              <option value="Paris">Paris</option>
              <option value="Athènes">Athènes</option>
            </select>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-50"
        >
          {loading ? "…" : mode === "connexion" ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

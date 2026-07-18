"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Ville } from "@/lib/types";

type Mode = "connexion" | "inscription" | "mot_de_passe_oublie";

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

    if (mode === "mot_de_passe_oublie") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMessage("Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.");
      return;
    }

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

      {mode === "mot_de_passe_oublie" && (
        <p className="mb-3 text-sm text-foreground/60">
          Indique ton email, on t&apos;envoie un lien pour choisir un nouveau mot de passe.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />

        {mode !== "mot_de_passe_oublie" && (
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
          />
        )}

        {mode === "connexion" && (
          <button
            type="button"
            onClick={() => {
              setMode("mot_de_passe_oublie");
              setError(null);
              setMessage(null);
            }}
            className="self-start text-sm text-foreground/60 hover:text-foreground"
          >
            Mot de passe oublié ?
          </button>
        )}

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
          {loading
            ? "…"
            : mode === "connexion"
              ? "Se connecter"
              : mode === "inscription"
                ? "S'inscrire"
                : "Envoyer le lien"}
        </button>
      </form>
    </div>
  );
}

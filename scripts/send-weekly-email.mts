// Envoi manuel de l'email hebdomadaire personnalisé (par ville + discipline).
// Usage : npm run send-weekly-email -- --dry-run
//
// Nécessite dans .env.local :
//   SUPABASE_SERVICE_ROLE_KEY  (Supabase > Project Settings > API — jamais NEXT_PUBLIC_*)
//   RESEND_API_KEY             (Resend > API Keys)
// Sans RESEND_API_KEY, ou avec --dry-run, le script se contente d'afficher
// qui recevrait quoi, sans rien envoyer.

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { formatInVille } from "../lib/timezone.ts";
import { EVENT_TYPE_LABELS } from "../lib/types.ts";
import type { ArtEvent, Ville } from "../lib/types.ts";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const dryRun = process.argv.includes("--dry-run") || !RESEND_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Il manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY dans .env.local."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface ProfileRow {
  id: string;
  nom: string;
  ville: string;
  disciplines: string[];
}

interface EventRow {
  id: string;
  titre: string;
  description: string | null;
  type: ArtEvent["type"];
  discipline: string | null;
  ville: string;
  quartier: string | null;
  date: string;
  lieu: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function eventHtml(event: EventRow): string {
  const date = formatInVille(event.date, event.ville as Ville, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const link = SITE_URL ? `${SITE_URL}/events/${event.id}` : null;
  const titreSafe = escapeHtml(event.titre);
  const titre = link ? `<a href="${escapeHtml(link)}">${titreSafe}</a>` : titreSafe;
  const lieuLigne = [event.quartier, event.lieu]
    .filter((v): v is string => Boolean(v))
    .map(escapeHtml)
    .join(" · ");

  return `
    <li style="margin-bottom: 16px;">
      <div style="font-size: 12px; color: #666;">${EVENT_TYPE_LABELS[event.type]} · ${date}</div>
      <div style="font-weight: 600;">${titre}</div>
      <div style="font-size: 13px; color: #666;">${lieuLigne}</div>
    </li>`;
}

function digestHtml(nom: string, ville: string, events: EventRow[]): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <p>Bonjour ${escapeHtml(nom || "")},</p>
      <p>Voici les événements à ${escapeHtml(ville)} pour les 7 prochains jours :</p>
      <ul style="list-style: none; padding: 0;">
        ${events.map(eventHtml).join("")}
      </ul>
    </div>`;
}

async function main() {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [{ data: profiles, error: profilesError }, { data: events, error: eventsError }] =
    await Promise.all([
      supabase.from("profiles").select("id, nom, ville, disciplines"),
      supabase
        .from("events")
        .select("id, titre, description, type, discipline, ville, quartier, date, lieu")
        .eq("statut", "publie")
        .gte("date", now.toISOString())
        .lt("date", in7Days.toISOString())
        .order("date", { ascending: true }),
    ]);

  if (profilesError) throw profilesError;
  if (eventsError) throw eventsError;

  const emailById = new Map<string, string>();
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const user of data.users) {
      if (user.email) emailById.set(user.id, user.email);
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  let sent = 0;
  let skipped = 0;

  for (const profile of (profiles ?? []) as ProfileRow[]) {
    const email = emailById.get(profile.id);
    if (!email) {
      skipped += 1;
      continue;
    }

    const relevant = (events ?? []).filter(
      (e): e is EventRow =>
        e.ville === profile.ville &&
        (profile.disciplines.length === 0 ||
          (e.discipline !== null && profile.disciplines.includes(e.discipline)))
    );

    if (relevant.length === 0) {
      skipped += 1;
      continue;
    }

    const subject = `${relevant.length} événement${relevant.length > 1 ? "s" : ""} à ${profile.ville} cette semaine`;
    const html = digestHtml(profile.nom, profile.ville, relevant);

    if (dryRun) {
      console.log(`[dry-run] ${email} — ${subject}`);
      sent += 1;
      continue;
    }

    const { error: sendError } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (sendError) {
      console.error(`Échec envoi à ${email}:`, sendError);
    } else {
      console.log(`Envoyé à ${email} — ${subject}`);
      sent += 1;
    }
  }

  console.log(
    `\n${dryRun ? "[dry-run] " : ""}${sent} email(s) ${dryRun ? "à envoyer" : "envoyés"}, ${skipped} utilisateur(s) sans événement pertinent ou sans email.`
  );
  if (!RESEND_API_KEY && !process.argv.includes("--dry-run")) {
    console.log("(RESEND_API_KEY absente de .env.local — mode dry-run automatique.)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

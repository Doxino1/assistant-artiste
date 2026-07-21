import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { formatInVille } from "./timezone.ts";
import { LOCALES, dictionaries } from "./i18n/dictionary.ts";
import type { Locale } from "./i18n/dictionary.ts";
import type { ArtEvent, Ville } from "./types.ts";

interface ProfileRow {
  id: string;
  nom: string;
  ville: string;
  disciplines: string[];
  langue_preferee: string | null;
}

interface EventRow {
  id: string;
  titre: string;
  description: string | null;
  type: ArtEvent["type"];
  discipline: string | null;
  ville: string;
  date: string;
  lieu: string | null;
}

function resolveLocale(langue: string | null): Locale {
  return langue && (LOCALES as string[]).includes(langue) ? (langue as Locale) : "fr";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function eventHtml(event: EventRow, locale: Locale, siteUrl: string | undefined): string {
  const t = dictionaries[locale];
  const date = formatInVille(
    event.date,
    event.ville as Ville,
    { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" },
    locale
  );
  const link = siteUrl ? `${siteUrl}/events/${event.id}` : null;
  const titreSafe = escapeHtml(event.titre);
  const titre = link ? `<a href="${escapeHtml(link)}">${titreSafe}</a>` : titreSafe;
  const lieu = event.lieu ? escapeHtml(event.lieu) : "";

  return `
    <li style="margin-bottom: 16px;">
      <div style="font-size: 12px; color: #666;">${t.eventTypeLabels[event.type]} · ${date}</div>
      <div style="font-weight: 600;">${titre}</div>
      <div style="font-size: 13px; color: #666;">${lieu}</div>
    </li>`;
}

function digestHtml(nom: string, ville: string, events: EventRow[], locale: Locale, siteUrl: string | undefined): string {
  const t = dictionaries[locale];
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <p>${escapeHtml(t.weeklyEmail.greeting(nom || ""))}</p>
      <p>${escapeHtml(t.weeklyEmail.intro(ville))}</p>
      <ul style="list-style: none; padding: 0;">
        ${events.map((e) => eventHtml(e, locale, siteUrl)).join("")}
      </ul>
    </div>`;
}

export interface SendWeeklyEmailsOptions {
  dryRun: boolean;
  onLog?: (line: string) => void;
}

export interface SendWeeklyEmailsResult {
  sent: number;
  skipped: number;
  dryRun: boolean;
}

export async function sendWeeklyEmails({ dryRun, onLog }: SendWeeklyEmailsOptions): Promise<SendWeeklyEmailsResult> {
  const log = onLog ?? (() => {});

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Il manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY.");
  }

  const effectiveDryRun = dryRun || !RESEND_API_KEY;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [{ data: profiles, error: profilesError }, { data: events, error: eventsError }] =
    await Promise.all([
      supabase.from("profiles").select("id, nom, ville, disciplines, langue_preferee"),
      supabase
        .from("events")
        .select("id, titre, description, type, discipline, ville, date, lieu")
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

    const locale = resolveLocale(profile.langue_preferee);
    const t = dictionaries[locale];
    const villeLabel = t.villeLabels[profile.ville as Ville] ?? profile.ville;
    const subject = t.weeklyEmail.subject(relevant.length, villeLabel);
    const html = digestHtml(profile.nom, villeLabel, relevant, locale, SITE_URL);

    if (effectiveDryRun) {
      log(`[dry-run] ${email} (${locale}) — ${subject}`);
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
      log(`Échec envoi à ${email}: ${sendError.message}`);
    } else {
      log(`Envoyé à ${email} — ${subject}`);
      sent += 1;
    }
  }

  log(
    `${effectiveDryRun ? "[dry-run] " : ""}${sent} email(s) ${effectiveDryRun ? "à envoyer" : "envoyés"}, ${skipped} utilisateur(s) sans événement pertinent ou sans email.`
  );

  return { sent, skipped, dryRun: effectiveDryRun };
}

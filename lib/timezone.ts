import type { Ville } from "./types.ts";

export const VILLE_TIMEZONES: Record<Ville, string> = {
  Paris: "Europe/Paris",
  Athènes: "Europe/Athens",
};

// Convertit une date/heure saisie comme heure locale d'une ville (indépendamment
// du fuseau du navigateur) en instant UTC, via le décalage réel de cette ville
// pour ce jour donné (gère les changements d'heure été/hiver).
export function zonedTimeToUtcIso(dateStr: string, timeStr: string, timeZone: string): string {
  const asIfUtc = new Date(`${dateStr}T${timeStr}:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(asIfUtc);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";

  const asZonedUtc = Date.UTC(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")) % 24,
    Number(get("minute")),
    Number(get("second"))
  );

  const offsetMs = asZonedUtc - asIfUtc.getTime();
  return new Date(asIfUtc.getTime() - offsetMs).toISOString();
}

export function formatInVille(iso: string, ville: Ville, options: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString("fr-FR", { ...options, timeZone: VILLE_TIMEZONES[ville] });
}

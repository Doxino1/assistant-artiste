export type EventType = "vernissage" | "expo" | "workshop" | "open_call" | "annonce";
export type AnnouncementSubtype = "oeuvre" | "materiel" | "atelier";
export type SavedStatus = "sauvegarde" | "je_viens";
export type ProfileType = "artiste_pro" | "amateur" | "galerie" | "institution" | "curateur";
export type MatchingTag = "atelier_partage" | "collaborations" | "mentorat";

export type Ville = "Paris" | "Athènes";

export interface ArtEvent {
  id: string;
  titre: string;
  description: string;
  type: EventType;
  sousType?: AnnouncementSubtype;
  discipline: string;
  ville: Ville;
  date: string; // ISO 8601
  lieu: string;
}

// Valeurs canoniques stockées en base — l'affichage localisé vit dans
// lib/i18n/dictionary.ts (eventTypeLabels, disciplineLabels, etc.).
export const EVENT_TYPES: EventType[] = ["vernissage", "expo", "workshop", "open_call", "annonce"];
export const DISCIPLINES = ["Peinture", "Sculpture", "Performance", "Multidisciplinaire"] as const;
export const ANNOUNCEMENT_SUBTYPES: AnnouncementSubtype[] = ["oeuvre", "materiel", "atelier"];
export const PROFILE_TYPES: ProfileType[] = [
  "artiste_pro",
  "amateur",
  "galerie",
  "institution",
  "curateur",
];
export const MATCHING_TAGS: MatchingTag[] = ["atelier_partage", "collaborations", "mentorat"];

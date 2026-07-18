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
  quartier: string;
  date: string; // ISO 8601
  lieu: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  vernissage: "Vernissage",
  expo: "Exposition",
  workshop: "Workshop",
  open_call: "Open call",
  annonce: "Annonce",
};

export const DISCIPLINES = ["Peinture", "Sculpture", "Performance", "Multidisciplinaire"] as const;

export const ANNOUNCEMENT_SUBTYPE_LABELS: Record<AnnouncementSubtype, string> = {
  oeuvre: "Œuvre",
  materiel: "Matériel",
  atelier: "Atelier",
};

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  artiste_pro: "Artiste professionnel·le",
  amateur: "Artiste amateur",
  galerie: "Galerie",
  institution: "Institution",
  curateur: "Curateur·rice",
};

export const MATCHING_TAG_LABELS: Record<MatchingTag, string> = {
  atelier_partage: "Atelier partagé",
  collaborations: "Collaborations",
  mentorat: "Mentorat",
};

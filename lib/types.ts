export type EventType = "vernissage" | "expo" | "workshop" | "open_call" | "annonce";
export type AnnouncementSubtype = "oeuvre" | "materiel" | "atelier";
export type SavedStatus = "sauvegarde" | "je_viens";

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

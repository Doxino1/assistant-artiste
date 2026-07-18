import { ArtEvent } from "./types";

interface EventRow {
  id: string;
  titre: string;
  description: string | null;
  type: ArtEvent["type"];
  sous_type: ArtEvent["sousType"] | null;
  discipline: string | null;
  ville: string;
  date: string;
  lieu: string | null;
}

export function mapEventRow(row: EventRow): ArtEvent {
  return {
    id: row.id,
    titre: row.titre,
    description: row.description ?? "",
    type: row.type,
    sousType: row.sous_type ?? undefined,
    discipline: row.discipline ?? "",
    ville: row.ville as ArtEvent["ville"],
    date: row.date,
    lieu: row.lieu ?? "",
  };
}

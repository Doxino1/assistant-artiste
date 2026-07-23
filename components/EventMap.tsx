"use client";

import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArtEvent, Ville } from "@/lib/types";
import { formatInVille } from "@/lib/timezone";
import { useLocale } from "@/lib/i18n/context";

// Icônes par défaut de Leaflet servies depuis un CDN plutôt qu'importées
// localement : évite les incertitudes de résolution d'assets du bundler
// (Turbopack) pour des fichiers issus de node_modules.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CITY_CENTER: Record<Ville, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Athènes: [37.9838, 23.7275],
};

export function EventMap({ events, ville }: { events: ArtEvent[]; ville: Ville }) {
  const { locale, t } = useLocale();
  const withCoords = events.filter(
    (e): e is ArtEvent & { lat: number; lng: number } => e.lat != null && e.lng != null
  );
  const withoutCoords = events.length - withCoords.length;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-foreground/10" style={{ height: 420 }}>
        <MapContainer center={CITY_CENTER[ville]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((event) => (
            <Marker key={event.id} position={[event.lat, event.lng]} icon={markerIcon}>
              <Popup>
                <Link href={`/events/${event.id}`}>{event.titre}</Link>
                <br />
                {formatInVille(
                  event.date,
                  event.ville,
                  { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
                  locale
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {withoutCoords > 0 && (
        <p className="mt-2 text-xs text-foreground/50">{t.map.noCoordinates(withoutCoords, "events")}</p>
      )}
    </div>
  );
}

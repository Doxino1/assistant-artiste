"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Ville } from "@/lib/types";
import { useT } from "@/lib/i18n/context";

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

interface Shop {
  id: string;
  nom: string;
  adresse: string | null;
  lien: string | null;
  lat: number | null;
  lng: number | null;
}

export function ShopMap({ shops, ville }: { shops: Shop[]; ville: Ville }) {
  const t = useT();
  const withCoords = shops.filter(
    (s): s is Shop & { lat: number; lng: number } => s.lat != null && s.lng != null
  );
  const withoutCoords = shops.length - withCoords.length;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-foreground/10" style={{ height: 420 }}>
        <MapContainer center={CITY_CENTER[ville]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((shop) => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={markerIcon}>
              <Popup>
                <strong>{shop.nom}</strong>
                {shop.adresse && (
                  <>
                    <br />
                    {shop.adresse}
                  </>
                )}
                {shop.lien && (
                  <>
                    <br />
                    <a href={shop.lien} target="_blank" rel="noreferrer">
                      {shop.lien}
                    </a>
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {withoutCoords > 0 && (
        <p className="mt-2 text-xs text-foreground/50">{t.map.noCoordinates(withoutCoords)}</p>
      )}
    </div>
  );
}

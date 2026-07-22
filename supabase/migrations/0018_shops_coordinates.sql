-- Vue carte pour les boutiques de matériel artistique, sur le même principe
-- que les événements (migration 0016) : coordonnées optionnelles, géocodées
-- côté client via Nominatim (OSM, gratuit, sans clé) à la création. Seuls
-- les modérateurs peuvent insérer/modifier une boutique (policies de 0009),
-- donc pas besoin de restriction de colonne supplémentaire ici.
alter table public.shops add column lat double precision;
alter table public.shops add column lng double precision;

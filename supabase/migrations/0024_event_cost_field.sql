-- Indicateur de coût (gratuit/payant + détail libre), pertinent seulement
-- pour les types "opportunité" : workshop, open_call, residency. Les autres
-- types (vernissage/expo/annonce) ne doivent jamais avoir ce champ rempli —
-- contrainte au niveau base, pas seulement dans le formulaire.
alter table public.events add column cout_type text;
alter table public.events add column cout_detail text;

alter table public.events add constraint cout_only_for_paid_types check (
  type in ('workshop', 'open_call', 'residency') or (cout_type is null and cout_detail is null)
);

alter table public.events add constraint cout_type_valeurs check (
  cout_type is null or cout_type in ('gratuit', 'payant')
);

revoke insert, update on public.events from authenticated;

grant insert (
  titre, description, type, sous_type, discipline, ville, date, lieu,
  soumis_par, lat, lng, recurrence_group_id, cout_type, cout_detail
) on public.events to authenticated;

grant update (
  titre, description, type, sous_type, discipline, ville, date, lieu, lat, lng,
  cout_type, cout_detail
) on public.events to authenticated;

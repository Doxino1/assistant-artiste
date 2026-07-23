-- Ouvre la soumission de boutiques à tous les utilisateurs (au lieu de
-- modérateur uniquement), avec le même schéma de modération que les
-- événements : statut + soumis_par, un trigger qui publie automatiquement
-- les ajouts d'un modérateur et met les autres en attente (pas de statut de
-- confiance ici, contrairement aux événements — volume faible, revue
-- systématique voulue).
alter table public.shops add column statut event_status not null default 'en_attente';
alter table public.shops add column soumis_par uuid references public.profiles (id) on delete set null;
alter table public.shops add column discipline text;

-- Les boutiques déjà en base ont été ajoutées par un modérateur — elles
-- restent publiées.
update public.shops set statut = 'publie';

create or replace function public.shops_moderation_gate()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if exists (select 1 from public.profiles where id = auth.uid() and is_moderator) then
    new.statut := 'publie';
  else
    new.statut := 'en_attente';
  end if;
  return new;
end;
$$;

create trigger shops_moderation_gate before insert on public.shops
  for each row execute procedure public.shops_moderation_gate();

-- Lecture : publique pour les boutiques publiées, plus sa propre soumission
-- en attente et tout pour un modérateur (file de modération).
drop policy "shops_select_all" on public.shops;
create policy "shops_select_public_or_own_or_moderator" on public.shops
  for select using (
    statut = 'publie'
    or soumis_par = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and is_moderator)
  );

-- Écriture : n'importe quel utilisateur connecté peut proposer une boutique
-- en son nom propre — le trigger ci-dessus décide seul du statut réel, le
-- grant de colonnes ci-dessous empêche par ailleurs le client de fixer
-- statut directement dans sa requête d'insertion.
drop policy "shops_moderator_insert" on public.shops;
create policy "shops_authenticated_insert" on public.shops
  for insert with check (soumis_par = auth.uid());

revoke insert, update on public.shops from authenticated;

grant insert (
  nom, ville, adresse, description, lien, lat, lng, discipline, soumis_par
) on public.shops to authenticated;

grant update (
  nom, ville, adresse, description, lien, lat, lng, discipline
) on public.shops to authenticated;

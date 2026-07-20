-- Priorité 4 (optionnelle) : carte, calendrier externe, preuve sociale,
-- badge vérifié, événements récurrents.

-- ---------------------------------------------------------------------------
-- Preuve sociale : "X abonnements y vont" sur la page d'un événement.
-- saved_events est strictement privé au propriétaire (0001) ; on ajoute une
-- policy supplémentaire limitée aux lignes "je_viens" des comptes qu'on suit
-- et qui ne sont pas dans une relation de blocage (même logique que
-- profiles_select_not_blocked en 0012).
-- ---------------------------------------------------------------------------

create policy "saved_events_select_followed_going" on public.saved_events
  for select using (
    statut = 'je_viens'
    and exists (
      select 1 from public.follows f
      where f.follower_id = auth.uid() and f.followed_id = saved_events.user_id
    )
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = saved_events.user_id)
         or (b.blocker_id = saved_events.user_id and b.blocked_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Badge de vérification (Galerie/Institution). Colonne de confiance, comme
-- is_moderator (0011) : seul service_role peut l'écrire, à la main.
-- ---------------------------------------------------------------------------

alter table public.profiles add column verified boolean not null default false;

-- ---------------------------------------------------------------------------
-- Vue carte : coordonnées optionnelles. Géocodées côté client via Nominatim
-- (OpenStreetMap, gratuit, sans clé) au moment de la soumission — nullable
-- car le géocodage peut échouer ou l'adresse être introuvable ; l'événement
-- reste publiable sans pin dans ce cas. Les événements déjà en base restent
-- sans coordonnées (pas de backfill rétroactif).
--
-- Récurrence : une ligne par occurrence (pas de moteur de règles), avec un
-- identifiant de groupe optionnel pour retrouver toute la série plus tard.
-- ---------------------------------------------------------------------------

alter table public.events add column lat double precision;
alter table public.events add column lng double precision;
alter table public.events add column recurrence_group_id uuid;

revoke insert, update on public.events from authenticated;

grant insert (
  titre, description, type, sous_type, discipline, ville, date, lieu,
  soumis_par, lat, lng, recurrence_group_id
) on public.events to authenticated;

grant update (
  titre, description, type, sous_type, discipline, ville, date, lieu, lat, lng
) on public.events to authenticated;

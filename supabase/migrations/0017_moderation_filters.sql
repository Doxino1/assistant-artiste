-- Modération progressive (cahier des charges) : filtres automatiques de base
-- et statut "de confiance". Tout se joue dans un trigger BEFORE INSERT côté
-- events plutôt que côté client, pour rester efficace même si quelqu'un
-- appelle l'API REST directement (le client ne peut de toute façon pas
-- définir `statut` lui-même depuis la restriction de colonnes de 0002).
--
-- SECURITY DEFINER : nécessaire pour que le contrôle de doublon voie aussi
-- les soumissions en attente d'autres utilisateurs (la policy RLS
-- "events_select_published_or_own" ne les montre pas à l'auteur d'une
-- nouvelle soumission).

create or replace function public.events_moderation_gate()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Liste de départ, volontairement courte — à étendre via une nouvelle
  -- migration si du spam concret apparaît (mieux vaut peu de faux positifs
  -- qu'une liste agressive qui bloque de vraies soumissions).
  banned_words text[] := array[
    'viagra', 'casino en ligne', 'crypto pump', 'forex signal',
    'make money fast', 'click here now'
  ];
  word text;
  haystack text := lower(coalesce(new.titre, '') || ' ' || coalesce(new.description, ''));
  submission_units integer;
  published_count integer;
  is_trusted boolean;
  duplicate_exists boolean;
begin
  -- 1. Mots-clés interdits (spam/abus évident) — refus pur et simple.
  foreach word in array banned_words loop
    if haystack like '%' || word || '%' then
      raise exception 'Ce texte contient un terme non autorisé, corrige et réessaie.';
    end if;
  end loop;

  -- 2. Doublon : même titre + ville + date déjà soumis (par qui que ce soit).
  select exists (
    select 1 from public.events e
    where lower(trim(e.titre)) = lower(trim(new.titre))
      and e.ville = new.ville
      and e.date = new.date
  ) into duplicate_exists;

  if duplicate_exists then
    raise exception 'Un événement avec ce titre, cette ville et cette date existe déjà.';
  end if;

  -- 3. Limite de soumissions par jour. Une série récurrente (même
  -- recurrence_group_id) compte comme une seule soumission, pas une par
  -- occurrence — sinon proposer 12 dates d'un coup grillerait le quota.
  select count(distinct coalesce(e.recurrence_group_id::text, e.id::text))
    into submission_units
    from public.events e
    where e.soumis_par = new.soumis_par
      and e.created_at >= date_trunc('day', now());

  if submission_units >= 5 then
    raise exception 'Tu as atteint la limite de 5 soumissions par jour, réessaie demain.';
  end if;

  -- 4. Statut "de confiance" : après 3 soumissions déjà validées (ou pour
  -- un modérateur), publication automatique sans passer par la file.
  select (p.is_moderator) into is_trusted
    from public.profiles p
    where p.id = new.soumis_par;

  if not coalesce(is_trusted, false) then
    select count(*) into published_count
      from public.events e
      where e.soumis_par = new.soumis_par and e.statut = 'publie';
    is_trusted := published_count >= 3;
  end if;

  new.statut := case when is_trusted then 'publie' else 'en_attente' end;

  return new;
end;
$$;

create trigger events_moderation_gate
  before insert on public.events
  for each row execute procedure public.events_moderation_gate();

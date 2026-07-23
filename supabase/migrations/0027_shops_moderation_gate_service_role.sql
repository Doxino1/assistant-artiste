-- Le trigger shops_moderation_gate (0026) ne traitait que le cas "utilisateur
-- authentifié modérateur ou non" — une insertion faite via la clé
-- service_role (scripts d'admin, seed initial) a auth.uid() = null, qui ne
-- correspond à aucun profil, donc le trigger la mettait en attente au lieu
-- de la publier directement. Le service_role contourne déjà toute la RLS :
-- une insertion sans utilisateur authentifié est au moins aussi fiable
-- qu'un modérateur, donc on la publie aussi directement.
create or replace function public.shops_moderation_gate()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null or exists (
    select 1 from public.profiles where id = auth.uid() and is_moderator
  ) then
    new.statut := 'publie';
  else
    new.statut := 'en_attente';
  end if;
  return new;
end;
$$;

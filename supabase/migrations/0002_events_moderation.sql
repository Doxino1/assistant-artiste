-- Corrige un trou de modération : la policy RLS "events_update_own" et la
-- policy d'insertion n'empêchaient pas un utilisateur authentifié de définir
-- lui-même `statut = 'publie'` (à la création ou en modifiant son propre
-- événement), ou de réassigner `soumis_par`, ce qui permettait de contourner
-- la validation manuelle prévue par le cahier des charges.
--
-- Le RLS contrôle quelles lignes sont visibles/modifiables, pas quelles
-- colonnes ; on restreint donc aussi les privilèges au niveau colonne pour
-- que `statut` et `source` ne puissent être définis que par le rôle
-- `service_role` (utilisé pour la modération), jamais par le client.

revoke insert, update on public.events from authenticated;

grant insert (
  titre, description, type, sous_type, discipline, ville, quartier, date, lieu, soumis_par
) on public.events to authenticated;

grant update (
  titre, description, type, sous_type, discipline, ville, quartier, date, lieu
) on public.events to authenticated;

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events
  for update using (auth.uid() = soumis_par)
  with check (auth.uid() = soumis_par);

-- Aucune policy de suppression n'existait pour `events` : impossible pour un
-- utilisateur de retirer un événement qu'il a soumis. On l'ajoute, alignée
-- sur la policy de mise à jour existante (le soumetteur peut agir sur sa
-- propre soumission, quel que soit son statut).

create policy "events_delete_own" on public.events
  for delete using (auth.uid() = soumis_par);

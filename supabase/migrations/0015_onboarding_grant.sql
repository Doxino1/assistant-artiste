-- onboarding_complete (ajoutée en 0014) n'était pas dans la liste de colonnes
-- autorisées en écriture par 0011, donc le PATCH que fait /onboarding pour
-- marquer le parcours terminé échouait avec 403 (vérifié en test réel).
-- Contrairement à is_moderator, ce n'est pas une colonne de confiance : le
-- propriétaire du profil doit pouvoir la passer à true lui-même.
grant update (onboarding_complete) on public.profiles to authenticated;

-- Nécessaire pour pouvoir écrire honnêtement dans la politique de
-- confidentialité que l'email hebdomadaire est désactivable — jusqu'ici
-- aucun moyen de s'en désinscrire n'existait. Défaut à true pour ne pas
-- couper l'envoi aux utilisateurs existants sans action de leur part.
alter table public.profiles add column recoit_email_hebdo boolean not null default true;

-- Union de toutes les colonnes déjà accordées par 0011/0019/0020 — voir
-- feedback_grant_rebuild_regression dans la mémoire du projet.
revoke update on public.profiles from authenticated;

grant update (
  nom, ville, disciplines, type_profil, bio, email_contact,
  portfolio_public, posts_public, langue_preferee,
  instagram_handle, tiktok_handle, twitter_handle,
  onboarding_complete, recoit_email_hebdo
) on public.profiles to authenticated;

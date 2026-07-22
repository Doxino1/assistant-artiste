-- 0019 a fait un "revoke update on public.profiles from authenticated" puis
-- re-grant en ne reprenant que la liste de 0011 + les 3 nouveaux champs
-- sociaux — ça a supprimé le grant onboarding_complete accordé séparément
-- par 0015, cassant la fin du parcours d'inscription (update silencieusement
-- refusé). On regrant la liste complète.
revoke update on public.profiles from authenticated;

grant update (
  nom, ville, disciplines, type_profil, bio, email_contact,
  portfolio_public, posts_public, langue_preferee,
  instagram_handle, tiktok_handle, twitter_handle,
  onboarding_complete
) on public.profiles to authenticated;

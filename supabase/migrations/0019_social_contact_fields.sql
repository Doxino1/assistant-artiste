-- Champs de contact social optionnels (Instagram, TikTok, Twitter/X),
-- affichés sur le profil public au même titre que l'email de contact
-- existant, uniquement si renseignés.
alter table public.profiles add column instagram_handle text;
alter table public.profiles add column tiktok_handle text;
alter table public.profiles add column twitter_handle text;

-- Le grant UPDATE de 0011 liste explicitement les colonnes modifiables par
-- le propriétaire — il faut y ajouter les 3 nouvelles, sinon le formulaire
-- de réglages échouera silencieusement (403) en essayant de les sauvegarder.
revoke update on public.profiles from authenticated;

grant update (
  nom, ville, disciplines, type_profil, bio, email_contact,
  portfolio_public, posts_public, langue_preferee,
  instagram_handle, tiktok_handle, twitter_handle
) on public.profiles to authenticated;

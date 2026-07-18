-- Email de contact optionnel, distinct de l'email de connexion (qui reste
-- privé, dans auth.users). Opt-in : ne sert que pour le "contact direct"
-- niveau 2 du matching, visible publiquement comme le reste du profil via
-- la policy "profiles_select_all" déjà en place.

alter table public.profiles add column email_contact text;

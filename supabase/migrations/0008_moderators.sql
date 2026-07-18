-- Support pour une interface de modération minimale. Publier/rejeter reste
-- interdit via le client normal (cf. migration 0002) : ces actions passent
-- par une route serveur qui vérifie is_moderator puis utilise la clé
-- service_role, sans jamais assouplir les policies RLS existantes.

alter table public.profiles add column is_moderator boolean not null default false;

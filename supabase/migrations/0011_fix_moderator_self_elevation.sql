-- Faille critique trouvée en relecture et confirmée par un test réel : la
-- policy RLS "profiles_update_own" ne restreint que la ligne (son propre
-- profil), pas les colonnes — exactement le même trou que celui corrigé
-- pour events.statut en 0002, mais jamais appliqué à profiles.is_moderator
-- quand la colonne a été ajoutée en 0008. N'importe quel utilisateur
-- authentifié pouvait s'auto-attribuer les droits modérateur via un simple
-- PATCH REST direct (vérifié : PATCH profiles?id=eq.<soi> {is_moderator:true}
-- réussit avec un compte fraîchement créé, sans aucun privilège).
--
-- On retire le grant UPDATE large et on ne redonne que les colonnes que le
-- formulaire de profil modifie réellement. is_moderator ne devient
-- modifiable que par service_role (donc à la main, via le SQL editor, comme
-- pour la première nomination de modérateur).

revoke update on public.profiles from authenticated;

grant update (
  nom, ville, disciplines, type_profil, bio, email_contact,
  portfolio_public, posts_public, langue_preferee
) on public.profiles to authenticated;

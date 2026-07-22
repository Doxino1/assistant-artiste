-- L'inscription ne demandait jamais la langue : un nouveau profil recevait
-- toujours 'fr' par défaut, même si la personne naviguait en anglais ou en
-- grec avant de créer son compte. Le formulaire d'inscription transmet
-- maintenant la langue actuellement affichée (détectée du navigateur, ou
-- déjà choisie manuellement) via raw_user_meta_data ->> 'langue' — on la
-- reprend ici si elle fait partie des langues supportées, sinon 'fr'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nom, ville, langue_preferee)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    coalesce(new.raw_user_meta_data ->> 'ville', ''),
    case
      when new.raw_user_meta_data ->> 'langue' in ('fr', 'en', 'el') then new.raw_user_meta_data ->> 'langue'
      else 'fr'
    end
  );
  return new;
end;
$$;

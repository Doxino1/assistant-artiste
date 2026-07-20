-- Marqueur de progression du parcours d'inscription en plusieurs étapes.
-- Les comptes existants sont considérés comme déjà "onboardés" (backfill à
-- true) ; seuls les nouveaux inscrits après cette migration démarrent à
-- false et sont redirigés vers /onboarding par le proxy tant qu'ils n'ont
-- pas terminé le parcours.
alter table public.profiles add column onboarding_complete boolean not null default true;
alter table public.profiles alter column onboarding_complete set default false;

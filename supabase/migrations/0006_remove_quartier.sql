-- Retrait du champ "quartier" : redondant avec la ville pour l'usage
-- actuel, et pas praticable à collecter proprement à grande échelle sur de
-- nouvelles villes.

alter table public.events drop column quartier;

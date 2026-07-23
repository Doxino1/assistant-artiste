-- Les résidences étaient jusqu'ici classées comme "open_call" alors qu'elles
-- sont conceptuellement distinctes (lieu + hébergement/atelier sur une durée,
-- vs. simple appel à candidatures) — impossible de les filtrer séparément.
-- ALTER TYPE ... ADD VALUE doit être seul dans sa transaction/migration : la
-- nouvelle valeur ne peut pas être utilisée avant que ce fichier soit commité
-- (d'où les migrations suivantes séparées pour l'utiliser).
alter type event_type add value 'residency';

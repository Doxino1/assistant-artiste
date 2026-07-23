-- L'événement de démo "Open call — Résidence d'été" est en réalité une
-- résidence, pas un open call — recatégorisation avec le nouveau type.
update public.events set type = 'residency' where id = '00000000-0000-0000-0000-000000000002';

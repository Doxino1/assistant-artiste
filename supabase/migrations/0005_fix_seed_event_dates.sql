-- Les événements de démo (seed.sql) ont été insérés avant la correction du
-- fuseau horaire (lib/timezone.ts) : leur `date` était stockée comme si
-- l'heure locale saisie (ex. "19:00" à Paris) était déjà de l'UTC, au lieu
-- d'être convertie. Résultat : un vernissage "19h Paris" s'affichait 21h
-- l'été. On recalcule les vraies valeurs UTC pour chaque ville/heure locale
-- prévue à l'origine.

update public.events set date = '2026-07-24T17:00:00.000Z' where id = '00000000-0000-0000-0000-000000000001';
update public.events set date = '2026-07-31T22:00:00.000Z' where id = '00000000-0000-0000-0000-000000000002';
update public.events set date = '2026-07-27T08:00:00.000Z' where id = '00000000-0000-0000-0000-000000000003';
update public.events set date = '2026-07-19T22:00:00.000Z' where id = '00000000-0000-0000-0000-000000000004';
update public.events set date = '2026-08-05T18:30:00.000Z' where id = '00000000-0000-0000-0000-000000000005';
update public.events set date = '2026-07-23T16:30:00.000Z' where id = '00000000-0000-0000-0000-000000000006';
update public.events set date = '2026-07-18T21:00:00.000Z' where id = '00000000-0000-0000-0000-000000000007';
update public.events set date = '2026-08-10T15:00:00.000Z' where id = '00000000-0000-0000-0000-000000000008';
update public.events set date = '2026-08-02T06:00:00.000Z' where id = '00000000-0000-0000-0000-000000000009';
update public.events set date = '2026-08-14T21:00:00.000Z' where id = '00000000-0000-0000-0000-000000000010';
update public.events set date = '2026-07-20T22:00:00.000Z' where id = '00000000-0000-0000-0000-000000000011';
update public.events set date = '2026-07-31T17:00:00.000Z' where id = '00000000-0000-0000-0000-000000000012';

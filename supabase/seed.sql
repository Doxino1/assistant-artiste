-- Données de démonstration pour valider le flux connecté à Supabase.
-- À exécuter dans le SQL Editor (les policies RLS bloquent l'insertion via la clé anon,
-- ce script s'exécute avec les droits du propriétaire des tables et les contourne).
--
-- Les `date` ci-dessous sont déjà en UTC (converties depuis l'heure locale
-- prévue à Paris/Athènes via lib/timezone.ts) — ne pas remettre une heure
-- "locale" brute ici, voir 0005_fix_seed_event_dates.sql pour le contexte.

insert into public.events
  (id, titre, description, type, sous_type, discipline, ville, date, lieu, statut, soumis_par, source)
values
  ('00000000-0000-0000-0000-000000000001', 'Vernissage — Lignes de fuite',
   'Exposition collective autour du dessin contemporain, avec cinq artistes émergents du 20e arrondissement.',
   'vernissage', null, 'Peinture', 'Paris', '2026-07-24T17:00:00Z', 'Galerie du Marais Est',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000002', 'Open call — Résidence d''été',
   'Appel à candidatures pour une résidence de 6 semaines dans un atelier partagé, toutes disciplines.',
   'open_call', null, 'Multidisciplinaire', 'Paris', '2026-07-31T22:00:00Z', 'Candidature en ligne',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000003', 'Workshop — Taille directe sur pierre',
   'Initiation à la sculpture sur pierre calcaire, matériel fourni, places limitées à 8 participants.',
   'workshop', null, 'Sculpture', 'Paris', '2026-07-27T08:00:00Z', 'Atelier des Grands Voisins',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000004', 'Annonce — Chevalet à donner',
   'Chevalet en bois massif, bon état, à venir chercher sur place.',
   'annonce', 'materiel', 'Peinture', 'Paris', '2026-07-19T22:00:00Z', 'Belleville',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000005', 'Performance — Corps et mémoire',
   'Performance immersive d''une heure explorant la mémoire corporelle, suivie d''un échange avec l''artiste.',
   'expo', null, 'Performance', 'Paris', '2026-08-05T18:30:00Z', 'La Compagnie',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000006', 'Vernissage — Σκιές (Ombres)',
   'Exposition solo explorant la lumière et l''ombre à travers la peinture à l''huile.',
   'vernissage', null, 'Peinture', 'Athènes', '2026-07-23T16:30:00Z', 'Galerie Kolonaki Sud',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000007', 'Atelier partagé — Places disponibles',
   'Deux places libres dans un atelier de sculpture partagé, accès 24/7, quartier calme.',
   'annonce', 'atelier', 'Sculpture', 'Athènes', '2026-07-18T21:00:00Z', 'Metaxourgeio',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000008', 'Expo collective — Nouvelle scène athénienne',
   'Douze artistes de la scène émergente athénienne, toutes disciplines confondues.',
   'expo', null, 'Multidisciplinaire', 'Athènes', '2026-08-10T15:00:00Z', 'Espace Exarcheia',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000009', 'Workshop — Écriture scénique et performance',
   'Deux jours d''atelier autour de l''écriture pour la performance, ouvert aux débutants.',
   'workshop', null, 'Performance', 'Athènes', '2026-08-02T06:00:00Z', 'Studio Koukaki',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000010', 'Open call — Biennale des matériaux recyclés',
   'Appel à projets pour une exposition sur l''art fait de matériaux recyclés, dépôt de dossier avant le 15 août.',
   'open_call', null, 'Sculpture', 'Athènes', '2026-08-14T21:00:00Z', 'Candidature en ligne',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000011', 'Annonce — Recherche modèle vivant',
   'Recherche modèle pour séances de dessin hebdomadaires, indemnisation prévue.',
   'annonce', 'oeuvre', 'Peinture', 'Paris', '2026-07-20T22:00:00Z', 'Atelier Belleville',
   'publie', null, 'manuel'),

  ('00000000-0000-0000-0000-000000000012', 'Vernissage — Matière première',
   'Exposition de sculptures en céramique brute, sans cuisson, sur le thème du temps.',
   'vernissage', null, 'Sculpture', 'Paris', '2026-07-31T17:00:00Z', 'Fabrique Montreuil',
   'publie', null, 'manuel')
on conflict (id) do nothing;

-- Le bucket "images" (0009) n'avait ni limite de taille ni restriction de
-- type — n'importe quel utilisateur authentifié pouvait y déposer des
-- fichiers arbitrairement gros ou non-images (coût de stockage, abus). Le
-- filtre côté client (accept="image/*") est juste une aide à la saisie, pas
-- une protection ; celle-ci doit vivre côté serveur.

update storage.buckets
set file_size_limit = 5242880, -- 5 Mo
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'images';

-- profiles_select_not_blocked (0012) masque un profil bloqué dans les deux
-- sens, y compris pour le bloqueur lui-même — donc impossible de rejoindre
-- profiles pour afficher le nom sur l'écran "utilisateurs bloqués". On
-- stocke un instantané du nom au moment du blocage (peut devenir périmé si
-- la personne change de nom ensuite, acceptable pour cet usage).

alter table public.blocks add column blocked_nom text not null default '';

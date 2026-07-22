-- 0004 avait volontairement restreint chaque utilisateur au groupe de SA
-- propre ville de profil ("communauté locale par ville"), empêchant toute
-- lecture/écriture croisée entre villes. Le produit veut maintenant un vrai
-- sélecteur de ville dans l'onglet Communauté (CommunityChatTab.tsx)
-- permettant de consulter ET de poster dans le groupe de N'IMPORTE quelle
-- ville, pas seulement celle de son profil — sinon changer de ville dans le
-- sélecteur affiche un groupe qu'on n'a pas le droit de lire/écrire.
-- L'isolation des données entre villes reste garantie par group_id (chaque
-- message reste rattaché à un seul groupe) ; ce qu'on relâche ici, c'est
-- uniquement le droit d'ACCÈS, plus le contenu lui-même.
drop policy if exists "group_messages_select_own_city" on public.group_messages;
drop policy if exists "group_messages_insert_own_city" on public.group_messages;

create policy "group_messages_select_authenticated" on public.group_messages
  for select using (auth.role() = 'authenticated');

create policy "group_messages_insert_own_message" on public.group_messages
  for insert with check (auth.uid() = user_id);

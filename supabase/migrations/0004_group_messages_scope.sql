-- La policy d'origine laissait n'importe quel utilisateur authentifié lire
-- les messages de N'IMPORTE QUEL groupe (auth.role() = 'authenticated' ne
-- filtre pas par groupe) — un utilisateur de Paris pouvait donc lire le
-- groupe d'Athènes. On restreint la lecture au groupe correspondant à la
-- ville du profil de l'utilisateur, cohérent avec l'intention "communauté
-- locale par ville" du cahier des charges.

-- Même trou côté écriture : la policy d'insertion vérifiait seulement
-- `auth.uid() = user_id`, pas que group_id corresponde à la ville de
-- l'utilisateur — n'importe qui pouvait poster dans le groupe d'une autre
-- ville.

drop policy if exists "group_messages_select_authenticated" on public.group_messages;
drop policy if exists "group_messages_insert_authenticated" on public.group_messages;

create policy "group_messages_select_own_city" on public.group_messages
  for select using (
    exists (
      select 1
      from public.groups g
      join public.profiles p on p.ville = g.ville
      where g.id = group_messages.group_id
        and p.id = auth.uid()
    )
  );

create policy "group_messages_insert_own_city" on public.group_messages
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.groups g
      join public.profiles p on p.ville = g.ville
      where g.id = group_messages.group_id
        and p.id = auth.uid()
    )
  );

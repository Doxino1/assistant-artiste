-- Fils de discussion à un niveau : une réponse pointe vers le message racine
-- auquel elle répond (jamais vers une autre réponse — c'est l'UI qui impose
-- cette règle en ne proposant "Répondre" que sur les messages de premier
-- niveau). on delete cascade : supprimer un message racine supprime ses
-- réponses avec lui plutôt que de laisser des réponses orphelines.
alter table public.group_messages
  add column parent_id uuid references public.group_messages (id) on delete cascade;

create index group_messages_parent_idx on public.group_messages (parent_id);

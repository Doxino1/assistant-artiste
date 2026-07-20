-- Blocage et signalement d'utilisateurs (sécurité, priorité 1).

create type report_reason as enum ('spam', 'comportement', 'usurpation', 'autre');

-- ---------------------------------------------------------------------------
-- blocks
-- ---------------------------------------------------------------------------

create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);

alter table public.blocks enable row level security;

-- Les deux parties peuvent voir la relation (nécessaire pour que la personne
-- bloquée filtre aussi le contenu du bloqueur côté client, ex. chat de
-- communauté qui n'a pas de granularité par paire d'utilisateurs).
create policy "blocks_select_involved" on public.blocks
  for select using (auth.uid() = blocker_id or auth.uid() = blocked_id);
create policy "blocks_owner_insert" on public.blocks
  for insert with check (auth.uid() = blocker_id);
create policy "blocks_owner_delete" on public.blocks
  for delete using (auth.uid() = blocker_id);

-- ---------------------------------------------------------------------------
-- profiles : un profil bloqué (dans un sens ou l'autre) devient invisible.
-- Cette seule policy suffit à faire disparaître la personne du répertoire
-- d'artistes, des suggestions de matching, et de la vue profil public —
-- tout repose sur une lecture de `profiles`.
-- ---------------------------------------------------------------------------

drop policy if exists "profiles_select_all" on public.profiles;

create policy "profiles_select_not_blocked" on public.profiles
  for select using (
    not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = profiles.id)
         or (b.blocker_id = profiles.id and b.blocked_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- comments : empêche un commentaire entre deux utilisateurs qui se sont
-- bloqués (dans un sens ou l'autre), même si l'un des deux ne voit plus le
-- profil de l'autre.
-- ---------------------------------------------------------------------------

drop policy if exists "comments_insert_authenticated" on public.comments;

create policy "comments_insert_not_blocked" on public.comments
  for insert with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.posts po
      where po.id = comments.post_id
        and exists (
          select 1 from public.blocks b
          where (b.blocker_id = po.user_id and b.blocked_id = auth.uid())
             or (b.blocker_id = auth.uid() and b.blocked_id = po.user_id)
        )
    )
  );

-- ---------------------------------------------------------------------------
-- reports — stockage seul, pas d'écran de consultation pour l'instant
-- (revue manuelle via le SQL editor / Table Editor, avec service_role qui
-- contourne le RLS). Aucune policy select : ni les utilisateurs normaux ni
-- les signalés ne peuvent lire cette table via l'API.
-- ---------------------------------------------------------------------------

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reported_user_id uuid not null references public.profiles (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  motif report_reason not null,
  description text,
  created_at timestamptz not null default now()
);

create index reports_reported_user_idx on public.reports (reported_user_id);

alter table public.reports enable row level security;

create policy "reports_insert_authenticated" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- Niveau 3 : portfolio, bibliothèque privée, boutiques, stockage d'images.
-- posts/comments/follows existent déjà depuis 0001 (jamais utilisés côté UI
-- jusqu'ici) — pas besoin de nouvelle table pour ça.

-- ---------------------------------------------------------------------------
-- Stockage : un seul bucket public, chemin préfixé par l'uuid du propriétaire
-- (ex. "{user_id}/portfolio/xxx.jpg") pour que les policies restent simples.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

create policy "images_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "images_owner_update" on storage.objects
  for update using (
    bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- portfolio_items
-- ---------------------------------------------------------------------------

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  titre text not null,
  technique text,
  annee int,
  image_url text,
  created_at timestamptz not null default now()
);

create index portfolio_items_user_idx on public.portfolio_items (user_id);

alter table public.portfolio_items enable row level security;

create policy "portfolio_items_select_public_or_own" on public.portfolio_items
  for select using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles p where p.id = portfolio_items.user_id and p.portfolio_public)
  );
create policy "portfolio_items_owner_insert" on public.portfolio_items
  for insert with check (auth.uid() = user_id);
create policy "portfolio_items_owner_update" on public.portfolio_items
  for update using (auth.uid() = user_id);
create policy "portfolio_items_owner_delete" on public.portfolio_items
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- library_items (bibliothèque privée — jamais partagée, aucune policy publique)
-- ---------------------------------------------------------------------------

create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  titre text not null,
  contenu text,
  image_url text,
  created_at timestamptz not null default now()
);

create index library_items_user_idx on public.library_items (user_id);

alter table public.library_items enable row level security;

create policy "library_items_owner_all" on public.library_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- shops (boutiques de matériel artistique — annuaire géré par les modérateurs)
-- ---------------------------------------------------------------------------

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  ville text not null,
  adresse text,
  description text,
  lien text,
  created_at timestamptz not null default now()
);

create index shops_ville_idx on public.shops (ville);

alter table public.shops enable row level security;

create policy "shops_select_all" on public.shops for select using (true);
create policy "shops_moderator_insert" on public.shops
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_moderator)
  );
create policy "shops_moderator_update" on public.shops
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_moderator)
  );
create policy "shops_moderator_delete" on public.shops
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_moderator)
  );

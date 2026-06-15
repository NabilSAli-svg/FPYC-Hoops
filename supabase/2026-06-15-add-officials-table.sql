-- Officials (referees) table: backs the Officials roster/payments view.
-- Previously refs were a hardcoded REFS_INITIAL array in local state, so
-- adding officials, marking them paid, or toggling availability never
-- persisted across reloads.

create table if not exists public.officials (
  id        text primary key,
  name      text not null,
  cert      text,
  phone     text,
  email     text,
  games     int default 0,
  rate      int default 0,
  paid      boolean default true,
  available boolean default true
);

alter table public.officials enable row level security;

create policy "officials_staff_all" on public.officials for all using (public.is_staff());

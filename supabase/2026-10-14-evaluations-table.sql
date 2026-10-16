-- Player evaluations (house league / rec, and Select) used to live only in
-- each coach's browser localStorage -- no sync across devices or coaches.
-- Move them into a real table so entries made on a coach's phone show up
-- for everyone with access.

create table if not exists public.evaluations (
  id        text primary key,  -- `${sport}_${player_id}`
  player_id text not null references public.players(id) on delete cascade,
  sport     text not null,     -- basketball | soccer
  skills    jsonb not null default '{}',
  notes     text default ''
);

alter table public.evaluations enable row level security;

create policy "evaluations_staff_all" on public.evaluations for all using (public.is_staff());

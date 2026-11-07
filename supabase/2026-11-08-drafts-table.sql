-- Draft board sessions used to live only in whichever browser created them
-- (useLocalStorage), so nobody else -- not even the same admin on another
-- device -- could see or continue a draft. Stored as one jsonb blob per
-- session since the shape (teams, roster, pick log, no-show handling) is too
-- free-form to model relationally.

create table if not exists public.drafts (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);

alter table public.drafts enable row level security;

create policy "drafts_staff_all" on public.drafts for all using (public.is_staff());

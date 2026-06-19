-- Budget table — stores the full budget as a single JSON document
create table if not exists public.budget (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz default now()
);

-- Allow authenticated users to read/write
alter table public.budget enable row level security;

create policy "Admin read budget"
  on public.budget for select
  using (auth.role() = 'authenticated');

create policy "Admin write budget"
  on public.budget for all
  using (auth.role() = 'authenticated');

-- Registrations table: backs the commissioner Registrations tab and the
-- public /register flow. Previously this was a hardcoded INITIAL_REGISTRATIONS
-- array stored in localStorage, so registrations never synced across devices
-- and the public registration form's submissions were lost per-browser.

create table if not exists public.registrations (
  id          text primary key,
  parent      text,
  player      text,
  grade       text,
  division    text,
  date        text,
  paid        boolean default false,
  waiver      boolean default false,
  status      text default 'pending',  -- pending | approved | waitlisted
  player_id   text,
  confirm_num text
);

alter table public.registrations enable row level security;

create policy "registrations_public_insert" on public.registrations for insert with check (true);
create policy "registrations_staff_all" on public.registrations for all using (public.is_staff());
grant insert on public.registrations to anon, authenticated;

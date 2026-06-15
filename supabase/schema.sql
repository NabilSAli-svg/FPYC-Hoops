-- ============================================================
-- FPYC Hoops — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── Profiles (extends auth.users) ───────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  parent_name text,
  first_name  text,
  role        text not null default 'family',  -- 'commissioner' | 'coach' | 'family'
  player_id   text,
  team        text
);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Players ──────────────────────────────────────────────────────────────────

create table if not exists public.players (
  id        text primary key,
  number    int,
  name      text not null,
  grade     text,
  school    text,
  guardian  text,
  phone     text,
  position  text,
  status    text default 'active',
  waiver    boolean default false,
  program   text,
  division  text,
  team      text
);

-- ── Games ────────────────────────────────────────────────────────────────────

create table if not exists public.games (
  id         text primary key,
  team       text,
  opponent   text,
  day        text,
  date       int,
  month      text,
  "time"     text,
  location   text,
  home       boolean default true,
  status     text default 'scheduled',  -- scheduled | live | final
  us         int,
  them       int,
  quarter    int,
  note       text,
  confirmed  int default 0,
  score_pin  text  -- 4-digit PIN for scorekeeper access
);

-- ── Practices ────────────────────────────────────────────────────────────────

create table if not exists public.practices (
  id            text primary key,
  team          text,
  date          text,
  "time"        text,
  timerange     text,
  location      text,
  practice_type text,
  notes         text,
  month         text,
  day_num       int,
  status        text default 'upcoming'
);

-- ── Announcements ────────────────────────────────────────────────────────────

create table if not exists public.announcements (
  id      text primary key,
  "type"  text default 'info',   -- info | general | urgent
  title   text not null,
  body    text,
  target  text default 'All families',
  date    text,
  pinned  boolean default false,
  author  text default 'Commissioner'
);

-- ── Staff & Volunteers ───────────────────────────────────────────────────────

create table if not exists public.staff (
  id             text primary key,
  name           text not null,
  role           text,
  program        text,  -- Recreation | Select | Training
  team           text,
  email          text,
  phone          text,
  bg_check_status text default 'Not Started',  -- Not Started | Pending | Cleared | Expired | Failed
  bg_check_date  text
);

-- ── Messages (coach/commissioner → families) ────────────────────────────────

create table if not exists public.messages (
  id      text primary key,
  "from"  text not null,
  "time"  text,
  subject text,
  body    text,
  target  text default 'All families',  -- 'All families' or a team name
  unread  boolean default true,
  created_at timestamptz default now()
);

-- ── Payments ─────────────────────────────────────────────────────────────────

create table if not exists public.payments (
  id        text primary key,
  player_id text not null references public.players(id) on delete cascade,
  "desc"    text not null,
  date      text,
  amount    numeric not null,
  status    text default 'due',  -- paid | due | applied
  method    text,
  receipt   text,
  created_at timestamptz default now()
);

-- ── Attendance ───────────────────────────────────────────────────────────────

create table if not exists public.attendance (
  id         text primary key,  -- `${player_id}_${session_id}`
  player_id  text not null references public.players(id) on delete cascade,
  session_id text not null,     -- game or practice id
  status     text not null      -- present | absent | excused
);

-- ── Official Assignments ─────────────────────────────────────────────────────

create table if not exists public.official_assignments (
  game_id text primary key,
  refs    text[] not null default '{"TBD","TBD"}',
  status  text not null default 'unassigned'
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.players              enable row level security;
alter table public.games                enable row level security;
alter table public.practices            enable row level security;
alter table public.announcements        enable row level security;
alter table public.official_assignments enable row level security;
alter table public.staff                enable row level security;
alter table public.messages             enable row level security;
alter table public.payments             enable row level security;
alter table public.attendance           enable row level security;

-- Profiles: users see only their own row; commissioner sees all
create policy "profiles_self_read"    on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update"  on public.profiles for update using (auth.uid() = id);

-- Everything else: any authenticated user can read
create policy "games_read"         on public.games               for select using (auth.role() = 'authenticated');
create policy "practices_read"     on public.practices           for select using (auth.role() = 'authenticated');
create policy "announcements_read" on public.announcements       for select using (auth.role() = 'authenticated');
create policy "assignments_read"   on public.official_assignments for select using (auth.role() = 'authenticated');
create policy "messages_read"      on public.messages              for select using (auth.role() = 'authenticated');

-- Players & staff contain PII (guardian email/phone). Commissioners and coaches
-- see everyone; families only see rows for their own child's team.
create or replace function public.is_staff()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('commissioner', 'coach')
  );
$$;

create policy "players_staff_read"  on public.players for select using (public.is_staff());
create policy "players_family_read" on public.players for select using (
  team = (select team from public.profiles where id = auth.uid())
);
create policy "staff_staff_read"  on public.staff for select using (public.is_staff());
create policy "staff_family_read" on public.staff for select using (
  team = (select team from public.profiles where id = auth.uid())
);

-- Payments: families see only their own linked player's payment records;
-- commissioners/coaches see all.
create policy "payments_own_read" on public.payments for select using (
  player_id = (select player_id from public.profiles where id = auth.uid())
);
create policy "payments_staff_read" on public.payments for select using (public.is_staff());

-- Attendance: families see only their own linked player's records;
-- commissioners/coaches see and manage all.
create policy "attendance_own_read" on public.attendance for select using (
  player_id = (select player_id from public.profiles where id::text = auth.uid()::text)
);
create policy "attendance_staff_all" on public.attendance for all using (public.is_staff());

-- Public read for games/announcements (scoreboard + website are unauthenticated)
create policy "games_public_read"   on public.games         for select using (true);
create policy "ann_public_read"     on public.announcements for select using (true);

-- Commissioner writes everything (checked via profiles.role)
create or replace function public.is_commissioner()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'commissioner'
  );
$$;

create policy "games_commissioner_write"    on public.games               for all using (public.is_commissioner());
create policy "practices_commissioner_write" on public.practices          for all using (public.is_commissioner());
create policy "ann_commissioner_write"      on public.announcements       for all using (public.is_commissioner());
create policy "players_commissioner_write"  on public.players             for all using (public.is_commissioner());
create policy "assignments_commissioner_write" on public.official_assignments for all using (public.is_commissioner());
create policy "staff_commissioner_write"    on public.staff               for all using (public.is_commissioner());
create policy "messages_commissioner_write" on public.messages             for all using (public.is_commissioner());
create policy "payments_commissioner_write" on public.payments             for all using (public.is_commissioner());
create policy "profiles_commissioner_read"  on public.profiles            for select using (public.is_commissioner());
create policy "profiles_commissioner_write" on public.profiles            for update using (public.is_commissioner());

-- ── Score PIN update (no auth needed — scorekeeper uses PIN only) ─────────────

create or replace function public.update_game_score(
  p_game_id text,
  p_pin     text,
  p_us      int,
  p_them    int,
  p_status  text default 'live',
  p_quarter int default null
)
returns json language plpgsql security definer as $$
declare
  v_pin text;
begin
  select score_pin into v_pin from public.games where id = p_game_id;
  if v_pin is null or v_pin <> p_pin then
    return json_build_object('ok', false, 'error', 'Invalid PIN');
  end if;

  update public.games
  set us = p_us, them = p_them, status = p_status, quarter = p_quarter
  where id = p_game_id;

  return json_build_object('ok', true);
end;
$$;

-- Grant anon role permission to call the score RPC
grant execute on function public.update_game_score to anon, authenticated;

-- ============================================================
-- Make yourself commissioner — run AFTER you sign up
-- Replace with your actual email address
-- ============================================================
-- update public.profiles set role = 'commissioner' where email = 'your@email.com';

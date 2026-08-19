-- ============================================================================
-- FPYC Hoops — fresh database bootstrap
-- ============================================================================
--
-- Stands up an empty database with the current schema, helpers and policies in
-- one run. Intended for a new Supabase project (staging, or a rebuild) so you
-- do not have to replay 38 dated migrations in order.
--
-- Safe to re-run: every statement is guarded.
--
-- WHAT THIS IS NOT
-- ----------------
-- This is a reconstruction from the migration history plus the columns the app
-- actually reads and writes. It is not a dump of production. `schema.sql` had
-- drifted from the live database (it declared practices.location /
-- practice_type where the live table has gym / type / rsvp), so before trusting
-- staging to mirror production, run `supabase db dump --schema public` against
-- the live project and diff it against this file.
--
-- ORDER: tables -> columns -> helpers -> policies -> RPCs
-- ============================================================================


-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  parent_name text,
  first_name  text,
  role        text not null default 'parent',
  player_id   text,
  team        text,
  phone       text
);

comment on column public.profiles.role is
  'admin | ops_director | community_director | select_director | rec_director | ref_director | training_director | league_director | coach | parent | ref';

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
  for each row execute function public.handle_new_user();


-- ── Players ─────────────────────────────────────────────────────────────────
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

-- The registration form and payments view write these in camelCase, so the
-- columns are quoted to match exactly what the client sends.
alter table public.players add column if not exists email            text;
alter table public.players add column if not exists "guardianEmail"  text;
alter table public.players add column if not exists "guardianPhone"  text;
alter table public.players add column if not exists "amountOwed"     numeric default 0;
alter table public.players add column if not exists "amountPaid"     numeric default 0;
alter table public.players add column if not exists "paymentStatus"  text default 'unpaid';
alter table public.players add column if not exists "discountCodeId" text;
alter table public.players add column if not exists notes            text;


-- ── Games ───────────────────────────────────────────────────────────────────
create table if not exists public.games (
  id         text primary key,
  team       text,
  opponent   text,
  day        text,
  date       int,
  month      text,
  weekday    text,
  "time"     text,
  location   text,
  home       boolean default true,
  status     text default 'scheduled',   -- scheduled | live | final
  us         int,
  them       int,
  quarter    int,
  note       text,
  refs       text,
  confirmed  int default 0,
  score_pin  text
);

alter table public.games add column if not exists weekday text;
alter table public.games add column if not exists note    text;
alter table public.games add column if not exists us      int;
alter table public.games add column if not exists them    int;
alter table public.games add column if not exists refs    text;


-- ── Practices ───────────────────────────────────────────────────────────────
-- NOTE: the live table uses gym / type / rsvp. The old schema.sql declared
-- location / practice_type / timerange, which never matched the app.
create table if not exists public.practices (
  id     text primary key,
  team   text,
  date   text,
  "time" text,
  gym    text,
  "type" text default 'Practice',   -- Practice | Scrimmage | Conditioning | Clinic
  rsvp   int default 0,
  notes  text
);

alter table public.practices add column if not exists gym    text;
alter table public.practices add column if not exists "type" text;
alter table public.practices add column if not exists rsvp   int default 0;


-- ── Announcements & messages ────────────────────────────────────────────────
create table if not exists public.announcements (
  id     text primary key,
  "type" text default 'info',        -- info | general | urgent
  title  text not null,
  body   text,
  target text default 'All families',
  date   text,
  pinned boolean default false,
  author text default 'Commissioner'
);

create table if not exists public.messages (
  id         text primary key,
  "from"     text not null,
  "time"     text,
  subject    text,
  body       text,
  target     text default 'All families',
  unread     boolean default true,
  created_at timestamptz default now()
);


-- ── Staff ───────────────────────────────────────────────────────────────────
create table if not exists public.staff (
  id              text primary key,
  name            text not null,
  role            text,
  program         text,
  team            text,
  email           text,
  phone           text,
  bg_check_status text default 'Not Started',
  bg_check_date   text
);


-- ── Payments, attendance, registrations ─────────────────────────────────────
create table if not exists public.payments (
  id         text primary key,
  player_id  text not null references public.players(id) on delete cascade,
  "desc"     text not null,
  date       text,
  amount     numeric not null,
  status     text default 'due',
  method     text,
  receipt    text,
  created_at timestamptz default now()
);

create table if not exists public.attendance (
  id         text primary key,   -- `${player_id}_${session_id}`
  player_id  text not null references public.players(id) on delete cascade,
  session_id text not null,
  status     text not null       -- present | absent | excused
);

create table if not exists public.registrations (
  id          text primary key,
  parent      text,
  player      text,
  grade       text,
  division    text,
  date        text,
  paid        boolean default false,
  waiver      boolean default false,
  status      text default 'pending',
  player_id   text,
  confirm_num text
);


-- ── Officials ───────────────────────────────────────────────────────────────
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

create table if not exists public.official_assignments (
  game_id text primary key,
  refs    text[] not null default '{"TBD","TBD"}',
  status  text not null default 'unassigned'
);


-- ── Practice attendance & notes (coach portal) ──────────────────────────────
create table if not exists public.practice_attendance (
  practice_id text        not null,
  player_id   text        not null,
  team_id     text        not null,
  present     boolean     not null default false,
  updated_at  timestamptz not null default now(),
  primary key (practice_id, player_id)
);

create table if not exists public.practice_notes (
  practice_id text        primary key,
  team_id     text        not null,
  notes       text        not null default '',
  updated_at  timestamptz not null default now()
);


-- ── Scheduler: permits & blackouts ──────────────────────────────────────────
create table if not exists public.gym_permits (
  id         text primary key,
  gym_name   text not null,
  season     text not null,
  year       int  not null default 2026,
  start_date text,
  end_date   text,
  days       text[] default '{}',
  start_time text,
  end_time   text,
  sport      text,
  notes      text,
  created_at timestamptz default now()
);

create table if not exists public.blackout_dates (
  id         text primary key,
  date       text not null,
  reason     text,
  scope      text default 'all',
  created_at timestamptz default now()
);


-- ── Budget / inventory (jsonb blobs keyed by id) ────────────────────────────
create table if not exists public.budget (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);


-- ── Coach credentials (team codes) ──────────────────────────────────────────
create table if not exists public.coach_credentials (
  team_id    text primary key,
  password   text not null,
  team_name  text not null,
  updated_at timestamptz default now()
);


-- ── Roles & scopes ──────────────────────────────────────────────────────────
create table if not exists public.user_scopes (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  scope_type  text not null check (scope_type in ('team','division','age_group','player','official')),
  scope_value text not null,
  created_at  timestamptz default now(),
  unique (user_id, scope_type, scope_value)
);

create index if not exists user_scopes_user_idx on public.user_scopes (user_id);


-- ── Public sign-up inboxes ──────────────────────────────────────────────────
create table if not exists public.ref_signups (
  id           text primary key,
  name         text not null,
  email        text not null,
  phone        text,
  experience   text,
  availability text,
  note         text,
  status       text default 'new',
  created_at   timestamptz default now()
);

create table if not exists public.volunteer_signups (
  id         text primary key,
  name       text not null,
  email      text not null,
  role       text,
  note       text,
  status     text default 'new',
  created_at timestamptz default now()
);


-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles             enable row level security;
alter table public.players              enable row level security;
alter table public.games                enable row level security;
alter table public.practices            enable row level security;
alter table public.announcements        enable row level security;
alter table public.messages             enable row level security;
alter table public.staff                enable row level security;
alter table public.payments             enable row level security;
alter table public.attendance           enable row level security;
alter table public.registrations        enable row level security;
alter table public.officials            enable row level security;
alter table public.official_assignments enable row level security;
alter table public.practice_attendance  enable row level security;
alter table public.practice_notes       enable row level security;
alter table public.gym_permits          enable row level security;
alter table public.blackout_dates       enable row level security;
alter table public.budget               enable row level security;
alter table public.coach_credentials    enable row level security;
alter table public.user_scopes          enable row level security;
alter table public.ref_signups          enable row level security;
alter table public.volunteer_signups    enable row level security;


-- ── Role helpers ────────────────────────────────────────────────────────────
create or replace function public.user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.user_role() = 'admin', false)
$$;

-- Admin plus the Ops Director: the only roles that touch money or facilities.
create or replace function public.can_manage_ops()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.user_role() in ('admin','ops_director'), false)
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.user_role() in (
    'admin','ops_director','community_director','select_director',
    'rec_director','ref_director','training_director','league_director','coach'
  ), false)
$$;

-- Retained so older policies referencing is_commissioner() keep working.
create or replace function public.is_commissioner()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
$$;

create or replace function public.has_scope(p_type text, p_value text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_scopes
    where user_id = auth.uid() and scope_type = p_type and scope_value = p_value
  )
$$;


-- ── Policies ────────────────────────────────────────────────────────────────
-- Dropped first so the file can be re-run.

drop policy if exists "profiles_self_read"        on public.profiles;
drop policy if exists "profiles_self_update"      on public.profiles;
drop policy if exists "profiles_self_insert"      on public.profiles;
drop policy if exists "profiles_staff_read"       on public.profiles;
create policy "profiles_self_read"   on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id or public.is_admin());
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = id);

-- Anyone signed in may read the schedule and league-wide notices.
drop policy if exists "games_read"         on public.games;
drop policy if exists "practices_read"     on public.practices;
drop policy if exists "announcements_read" on public.announcements;
drop policy if exists "assignments_read"   on public.official_assignments;
drop policy if exists "messages_read"      on public.messages;
create policy "games_read"         on public.games               for select using (auth.role() = 'authenticated');
create policy "practices_read"     on public.practices           for select using (auth.role() = 'authenticated');
create policy "announcements_read" on public.announcements       for select using (auth.role() = 'authenticated');
create policy "assignments_read"   on public.official_assignments for select using (auth.role() = 'authenticated');
create policy "messages_read"      on public.messages             for select using (auth.role() = 'authenticated');

-- Staff read personal data.
drop policy if exists "players_staff_read" on public.players;
drop policy if exists "staff_staff_read"   on public.staff;
create policy "players_staff_read" on public.players for select using (public.is_staff());
create policy "staff_staff_read"   on public.staff   for select using (public.is_staff());

-- Admin writes league data.
drop policy if exists "games_admin_write"       on public.games;
drop policy if exists "practices_admin_write"   on public.practices;
drop policy if exists "ann_admin_write"         on public.announcements;
drop policy if exists "players_admin_write"     on public.players;
drop policy if exists "assignments_admin_write" on public.official_assignments;
drop policy if exists "staff_admin_write"       on public.staff;
drop policy if exists "messages_admin_write"    on public.messages;
create policy "games_admin_write"       on public.games                for all using (public.is_admin());
create policy "practices_admin_write"   on public.practices            for all using (public.is_admin());
create policy "ann_admin_write"         on public.announcements        for all using (public.is_admin());
create policy "players_admin_write"     on public.players              for all using (public.is_admin());
create policy "assignments_admin_write" on public.official_assignments for all using (public.is_admin());
create policy "staff_admin_write"       on public.staff                for all using (public.is_admin());
create policy "messages_admin_write"    on public.messages             for all using (public.is_admin());

-- Staff-managed operational tables.
drop policy if exists "attendance_staff_all"    on public.attendance;
drop policy if exists "registrations_staff_all" on public.registrations;
drop policy if exists "officials_staff_all"     on public.officials;
create policy "attendance_staff_all"    on public.attendance    for all using (public.is_staff());
create policy "registrations_staff_all" on public.registrations for all using (public.is_staff());
create policy "officials_staff_all"     on public.officials     for all using (public.is_staff());

-- A referee reads their own officials row, matched on email. `ref` is
-- deliberately not staff, so without this they cannot resolve who they are.
drop policy if exists "officials_self_read" on public.officials;
create policy "officials_self_read" on public.officials for select
  using (lower(email) = lower((select email from public.profiles where id = auth.uid())));

-- Money and facilities: Admin and Ops only.
drop policy if exists "budget_ops_all"         on public.budget;
drop policy if exists "payments_ops_all"       on public.payments;
drop policy if exists "gym_permits_ops"        on public.gym_permits;
drop policy if exists "blackout_dates_ops"     on public.blackout_dates;
create policy "budget_ops_all"     on public.budget         for all using (public.can_manage_ops());
create policy "payments_ops_all"   on public.payments       for all using (public.can_manage_ops());
create policy "gym_permits_ops"    on public.gym_permits    for all using (public.can_manage_ops());
create policy "blackout_dates_ops" on public.blackout_dates for all using (public.can_manage_ops());
-- Staff still need to read permits when scheduling.
drop policy if exists "gym_permits_staff_read"    on public.gym_permits;
drop policy if exists "blackout_dates_staff_read" on public.blackout_dates;
create policy "gym_permits_staff_read"    on public.gym_permits    for select using (public.is_staff());
create policy "blackout_dates_staff_read" on public.blackout_dates for select using (public.is_staff());

-- Coach portal practice tracking.
drop policy if exists "allow all attendance" on public.practice_attendance;
drop policy if exists "allow all notes"      on public.practice_notes;
create policy "allow all attendance" on public.practice_attendance for all using (true) with check (true);
create policy "allow all notes"      on public.practice_notes      for all using (true) with check (true);

-- Team codes are never readable from the client; access is via the RPCs below.
-- (RLS on with no policy = no direct access.)

-- Scopes.
drop policy if exists "user_scopes_self_read"          on public.user_scopes;
drop policy if exists "user_scopes_admin_all"          on public.user_scopes;
drop policy if exists "user_scopes_self_link_player"   on public.user_scopes;
drop policy if exists "user_scopes_self_unlink_player" on public.user_scopes;
create policy "user_scopes_self_read" on public.user_scopes for select
  using (user_id = auth.uid() or public.is_staff());
create policy "user_scopes_admin_all" on public.user_scopes for all
  using (public.is_admin());
-- Parents link their own children from the family portal.
create policy "user_scopes_self_link_player" on public.user_scopes for insert
  with check (user_id = auth.uid() and scope_type = 'player');
create policy "user_scopes_self_unlink_player" on public.user_scopes for delete
  using (user_id = auth.uid() and scope_type = 'player');

-- Public sign-up forms: anyone submits, only staff read.
drop policy if exists "ref_signups_public_insert"       on public.ref_signups;
drop policy if exists "ref_signups_staff_read"          on public.ref_signups;
drop policy if exists "ref_signups_staff_update"        on public.ref_signups;
drop policy if exists "ref_signups_staff_delete"        on public.ref_signups;
create policy "ref_signups_public_insert" on public.ref_signups for insert with check (true);
create policy "ref_signups_staff_read"    on public.ref_signups for select using (public.is_staff());
create policy "ref_signups_staff_update"  on public.ref_signups for update using (public.is_staff());
create policy "ref_signups_staff_delete"  on public.ref_signups for delete using (public.is_staff());

drop policy if exists "volunteer_signups_public_insert" on public.volunteer_signups;
drop policy if exists "volunteer_signups_staff_read"    on public.volunteer_signups;
drop policy if exists "volunteer_signups_staff_update"  on public.volunteer_signups;
drop policy if exists "volunteer_signups_staff_delete"  on public.volunteer_signups;
create policy "volunteer_signups_public_insert" on public.volunteer_signups for insert with check (true);
create policy "volunteer_signups_staff_read"    on public.volunteer_signups for select using (public.is_staff());
create policy "volunteer_signups_staff_update"  on public.volunteer_signups for update using (public.is_staff());
create policy "volunteer_signups_staff_delete"  on public.volunteer_signups for delete using (public.is_staff());


-- ============================================================================
-- Coach portal RPCs (team codes, never exposing the table)
-- ============================================================================

create or replace function public.coach_login(p_password text)
returns table(team_id text, team_name text)
language sql security definer set search_path = public as $$
  select team_id, team_name
  from public.coach_credentials
  where password = p_password
  limit 1;
$$;

create or replace function public.coach_change_password(
  p_team_id      text,
  p_old_password text,
  p_new_password text
)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if length(trim(p_new_password)) < 6 then
    return false;
  end if;
  if exists (
    select 1 from public.coach_credentials
    where team_id = p_team_id and password = p_old_password
  ) then
    update public.coach_credentials
    set password = p_new_password, updated_at = now()
    where team_id = p_team_id;
    return true;
  end if;
  return false;
end;
$$;


-- ============================================================================
-- After this file
-- ============================================================================
-- 1. Create your own account through the app, then promote it:
--      update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- 2. Seed the season data you want in staging. The dated files under supabase/
--    are the record — e.g. 2026-07-29-winter-coach-credentials.sql for team
--    codes, 2026-07-29-fall-2026-gym-permits.sql for the permit.
--
-- 3. Point the staging deployment at this project with its own
--    VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
-- ============================================================================

-- Master Scheduler tables: gym permits (by season), blackout dates

-- ── Gym Permits ───────────────────────────────────────────────────────────────
-- One row per season permit block for a facility.
-- A facility may have multiple permits (e.g. different days/times within a season).

create table if not exists public.gym_permits (
  id          text primary key,
  gym_name    text not null,           -- matches games.location / practices.gym
  season      text not null,           -- 'fall' | 'winter' | 'spring' | 'summer'
  year        int  not null default 2026,
  start_date  text,                    -- 'YYYY-MM-DD'
  end_date    text,                    -- 'YYYY-MM-DD'
  days        text[] default '{}',     -- ['Mon','Wed','Fri']
  start_time  text,                    -- '06:00 PM'
  end_time    text,                    -- '09:00 PM'
  sport       text,                    -- optional: 'basketball' | 'soccer' | 'football' | null = all
  notes       text,
  created_at  timestamptz default now()
);

-- ── Blackout Dates ────────────────────────────────────────────────────────────
-- School closings, holidays, facility conflicts that block scheduling.

create table if not exists public.blackout_dates (
  id          text primary key,
  date        text not null,           -- 'YYYY-MM-DD'
  reason      text,                    -- 'School closed', 'Holiday', etc.
  scope       text default 'all',      -- 'all' | specific gym_name
  created_at  timestamptz default now()
);

-- RLS
alter table public.gym_permits   enable row level security;
alter table public.blackout_dates enable row level security;

-- Commissioners manage permits and blackout dates
create policy "gym_permits_commissioner"   on public.gym_permits   for all using (public.is_commissioner());
create policy "blackout_dates_commissioner" on public.blackout_dates for all using (public.is_commissioner());

-- Staff can read (for scheduling reference)
create policy "gym_permits_staff_read"    on public.gym_permits   for select using (public.is_staff());
create policy "blackout_dates_staff_read" on public.blackout_dates for select using (public.is_staff());

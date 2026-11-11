-- Lets League Directors (and admins) create teams within their own age
-- group, so they can assign coaches and run a draft for a team that isn't
-- in the hardcoded TEAMS_INFO list. `age_group` is the scope key
-- (user_scopes.scope_value, e.g. '5/6 Girls') a director must hold to
-- manage a given team -- same has_scope() check used elsewhere.

create table if not exists public.teams (
  id text primary key,
  name text not null unique,
  division text not null,
  sport text not null default 'basketball',
  color text not null default '#1D4ED8',
  age_group text not null,
  coach text,
  no_draft boolean not null default false,
  archived boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;

drop policy if exists "teams_read_staff" on public.teams;
drop policy if exists "teams_write_scoped" on public.teams;

create policy "teams_read_staff" on public.teams for select using (public.is_staff());

create policy "teams_write_scoped" on public.teams for all
  using (public.is_admin() or public.has_scope('team', age_group) or public.has_scope('age_group', age_group))
  with check (public.is_admin() or public.has_scope('team', age_group) or public.has_scope('age_group', age_group));

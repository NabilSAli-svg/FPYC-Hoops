-- FPYC role model
--
-- Replaces the three-role scheme (commissioner / coach / family) with named
-- roles plus a scope table, so one person can hold several teams and a parent
-- can have several children.
--
-- Money and league-wide settings are Admin-only, except that the Ops Director
-- owns budget, payments, inventory and facilities. Program directors (Select,
-- Rec, Ref, Training) get read access across their own program and nothing
-- financial.

-- ── Roles ────────────────────────────────────────────────────────────────────
-- admin               full access, including granting permissions
-- ops_director        budget, payments, inventory, scheduler, gym permits
-- community_director  announcements and sponsorship outreach
-- select_director     read across all Select teams
-- rec_director        read across all Rec teams
-- ref_director        read across officials and assignments
-- training_director   read across clinic / training groups
-- league_director     one age group, via a scope row
-- coach               their team(s), via scope rows
-- parent              their child(ren), via scope rows
-- ref                 their own game assignments

-- ── Scopes ───────────────────────────────────────────────────────────────────
create table if not exists public.user_scopes (
  id         bigserial primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  scope_type text not null check (scope_type in ('team', 'division', 'age_group', 'player', 'official')),
  scope_value text not null,
  created_at timestamptz default now(),
  unique (user_id, scope_type, scope_value)
);

create index if not exists user_scopes_user_idx on public.user_scopes (user_id);

alter table public.user_scopes enable row level security;

-- ── Helpers ──────────────────────────────────────────────────────────────────
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
  select coalesce(public.user_role() in ('admin', 'ops_director'), false)
$$;

-- Anyone with a staff-side console role. Used for read policies.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.user_role() in (
    'admin', 'ops_director', 'community_director', 'select_director',
    'rec_director', 'ref_director', 'training_director', 'league_director',
    'coach'
  ), false)
$$;

-- Kept so existing policies referencing is_commissioner() keep working.
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

-- ── Scope policies ───────────────────────────────────────────────────────────
create policy "user_scopes_self_read"  on public.user_scopes
  for select using (user_id = auth.uid() or public.is_staff());
create policy "user_scopes_admin_all"  on public.user_scopes
  for all using (public.is_admin());

-- ── Migrate existing rows ────────────────────────────────────────────────────
update public.profiles set role = 'admin'  where role = 'commissioner';
update public.profiles set role = 'parent' where role = 'family';

-- Carry each coach's single team onto a scope row.
insert into public.user_scopes (user_id, scope_type, scope_value)
select id, 'team', team
from public.profiles
where role = 'coach' and team is not null and team <> ''
on conflict (user_id, scope_type, scope_value) do nothing;

-- Carry each parent's linked child onto a scope row so multi-child works.
insert into public.user_scopes (user_id, scope_type, scope_value)
select id, 'player', player_id
from public.profiles
where role = 'parent' and player_id is not null and player_id <> ''
on conflict (user_id, scope_type, scope_value) do nothing;

-- Widen the role column's documented values.
comment on column public.profiles.role is
  'admin | ops_director | community_director | select_director | rec_director | ref_director | training_director | league_director | coach | parent | ref';

-- ── Money and settings: Admin + Ops only ─────────────────────────────────────
drop policy if exists "budget_commissioner_all" on public.budget;
create policy "budget_ops_all"    on public.budget    for all using (public.can_manage_ops());

drop policy if exists "payments_staff_read" on public.payments;
create policy "payments_ops_all"  on public.payments  for all using (public.can_manage_ops());

drop policy if exists "gym_permits_commissioner"   on public.gym_permits;
drop policy if exists "blackout_dates_commissioner" on public.blackout_dates;
create policy "gym_permits_ops"    on public.gym_permits    for all using (public.can_manage_ops());
create policy "blackout_dates_ops" on public.blackout_dates for all using (public.can_manage_ops());

-- Parents link their own children from the family portal, so they need to be
-- able to add player scopes for themselves. Limited to scope_type 'player' and
-- to their own user_id — everything else stays Admin-only.
drop policy if exists "user_scopes_self_link_player" on public.user_scopes;
create policy "user_scopes_self_link_player"
  on public.user_scopes for insert
  with check (user_id = auth.uid() and scope_type = 'player');

drop policy if exists "user_scopes_self_unlink_player" on public.user_scopes;
create policy "user_scopes_self_unlink_player"
  on public.user_scopes for delete
  using (user_id = auth.uid() and scope_type = 'player');

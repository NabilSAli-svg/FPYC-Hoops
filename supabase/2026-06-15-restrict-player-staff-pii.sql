-- Restrict access to players/staff PII (guardian email, phone, etc).
-- Previously any authenticated user could read every player/staff row across
-- all teams. Now: commissioners and coaches see everyone; families only see
-- rows for their own child's team.

drop policy if exists "players_read" on public.players;
drop policy if exists "staff_read"   on public.staff;

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

-- Backfill profiles.team for already-linked family accounts so the new
-- family-read policies work for existing users.
update public.profiles p
set team = pl.team
from public.players pl
where p.player_id = pl.id and p.team is null;

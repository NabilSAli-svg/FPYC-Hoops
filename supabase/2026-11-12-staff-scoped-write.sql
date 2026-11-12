-- League Directors can now add/edit/remove staff & run background checks
-- for their own age group's teams (Settings > Staff & Volunteers). Admin
-- keeps full access via the existing staff_admin_write policy; this adds
-- a second policy scoping writes to a user's own team/age_group, same
-- pattern as custom_teams.

drop policy if exists "staff_scoped_write" on public.staff;
create policy "staff_scoped_write" on public.staff for all
  using (public.has_scope('team', team) or public.has_scope('age_group', team))
  with check (public.has_scope('team', team) or public.has_scope('age_group', team));

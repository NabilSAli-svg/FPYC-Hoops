-- Allow commissioners to view and manage all profiles (needed for the
-- Coaches & Permissions admin-access toggle in Settings).
create policy "profiles_commissioner_read"  on public.profiles for select using (public.is_commissioner());
create policy "profiles_commissioner_write" on public.profiles for update using (public.is_commissioner());

-- Referees need to find their own record to see their assignments.
--
-- `officials` is staff-only, and the `ref` role is deliberately not staff, so
-- without this a signed-in referee cannot resolve who they are. This grants
-- read access to their own row only, matched on email.
--
-- Run after 2026-08-16-roles-and-scopes.sql.

drop policy if exists "officials_self_read" on public.officials;
create policy "officials_self_read"
  on public.officials for select
  using (
    lower(email) = lower((select email from public.profiles where id = auth.uid()))
  );

-- Referees also read the game and assignment tables. Both already allow any
-- authenticated user to select, so no extra policy is needed there:
--   games_read       -> auth.role() = 'authenticated'
--   assignments_read -> auth.role() = 'authenticated'

-- Optional: link a referee account to an officials row explicitly, for cases
-- where the ref signs in with a different email than the roster holds.
-- Admins set this from the console; the ref cannot grant it to themselves.
--   insert into public.user_scopes (user_id, scope_type, scope_value)
--   values ('<auth-user-id>', 'official', '<officials.id>');

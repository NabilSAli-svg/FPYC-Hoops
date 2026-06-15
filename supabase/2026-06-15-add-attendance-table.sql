-- Attendance table: backs real coach-recorded attendance for practices/games.
-- Previously attendance was stored in localStorage with hardcoded seed data,
-- so it never synced across devices and the "attendance below 80%" warning
-- shown to families was computed from per-browser fake data.

create table if not exists public.attendance (
  id         text primary key,  -- `${player_id}_${session_id}`
  player_id  text not null references public.players(id) on delete cascade,
  session_id text not null,     -- game or practice id
  status     text not null      -- present | absent | excused
);

alter table public.attendance enable row level security;

create policy "attendance_own_read" on public.attendance for select using (
  player_id = (select player_id from public.profiles where id::text = auth.uid()::text)
);
create policy "attendance_staff_all" on public.attendance for all using (public.is_staff());

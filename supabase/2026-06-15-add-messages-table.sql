-- Messages table: backs the coach/commissioner -> family Messages feature.
-- Previously stored client-side in localStorage (didn't sync across users/devices).

create table if not exists public.messages (
  id      text primary key,
  "from"  text not null,
  "time"  text,
  subject text,
  body    text,
  target  text default 'All families',
  unread  boolean default true,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_read"            on public.messages for select using (auth.role() = 'authenticated');
create policy "messages_commissioner_write" on public.messages for all using (public.is_commissioner());

-- Seed with the existing demo messages so the family inbox isn't empty.
insert into public.messages (id, "from", "time", subject, body, target, unread) values
('m1', 'Coach M. Davis', '2h ago', 'Game day info — Dec 7 vs. Vienna Storm',
 'Hawks family!' || E'\n\n' || 'Just a reminder that this Saturday''s game is at Robinson Secondary, Gym B at 10:00 AM. Please arrive by 9:30 for warm-ups.' || E'\n\n' || 'We''ll be wearing our NAVY jerseys (home game). If you need a carpool, check the sheet in your email — 3 families already volunteered.' || E'\n\n' || 'Let''s go Hawks!' || E'\n' || '— Coach Davis', 'All families', true),
('m2', 'Coach M. Davis', 'Yesterday', 'Practice update — Monday @ Daniels Run',
 'Quick note: Monday''s practice is confirmed at Daniels Run ES, starting at 6:00 PM sharp. We''ll be working on our pick-and-roll defense and transition offense.' || E'\n\n' || 'Please bring water and sneakers. See you there!' || E'\n' || '— Coach Davis', 'All families', true),
('m3', 'FPYC Commissioner', '3 days ago', 'Season standings update',
 'The Fairfax Hawks are currently 2nd in the division at 6–3. Top 4 teams advance to playoffs. Keep up the great work!' || E'\n\n' || 'Full standings are available at fpycsports.org.', 'All families', false),
('m4', 'Coach M. Davis', 'Nov 30', 'Great win today! 48–39',
 'Proud of the team today — that was a great defensive effort in the second half. Jordan had a fantastic game.' || E'\n\n' || 'Next up: Reston Wolves on Dec 14. Enjoy your week!' || E'\n' || '— Coach Davis', 'All families', false)
on conflict (id) do nothing;

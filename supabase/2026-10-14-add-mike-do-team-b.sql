-- Michael Do joins 5th Boys Select B as assistant coach (alongside Nabil Ali)
-- since 6th Girls Select isn't fielding a team this season. His existing
-- 6th Girls Select staff row is left as-is in case that changes.
insert into staff (id, name, role, program, team, email, phone, "bgCheckStatus", "bgCheckDate") values
  ('sel_c6g2', 'Michael Do', 'Assistant Coach', 'Select', '5th Boys Select B', 'michaeldo82@gmail.com', '571-328-8126', 'Not Started', null)
on conflict (id) do update set
  name = excluded.name, role = excluded.role, program = excluded.program, team = excluded.team,
  email = excluded.email, phone = excluded.phone;

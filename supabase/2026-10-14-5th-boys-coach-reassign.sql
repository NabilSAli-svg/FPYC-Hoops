-- Coach reassignment for the two 5th Boys Select teams: Aidris Daud and
-- Mike Hartwich co-coach Team A; Nabil Ali takes Team B.
update staff set role = 'Assistant Coach', team = '5th Boys Select A' where id = 'sel_c5b2';

insert into staff (id, name, role, program, team, email, phone, "bgCheckStatus", "bgCheckDate") values
  ('sel_c5b3', 'Nabil Ali', 'Head Coach', 'Select', '5th Boys Select B', 'syednabilali@gmail.com', '703-994-2211', 'Not Started', null)
on conflict (id) do update set
  name = excluded.name, role = excluded.role, program = excluded.program, team = excluded.team,
  email = excluded.email, phone = excluded.phone;

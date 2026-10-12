-- New "6th Boys Select 3" team (Matthew Dennis) -- a third 6th grade boys
-- Select team discovered from the roster export.
insert into staff (id, name, role, program, team, email, phone, "bgCheckStatus", "bgCheckDate") values
  ('sel_c6b3', 'Matthew Dennis', 'Head Coach', 'Select', '6th Boys Select 3', 'matthewsdennis@gmail.com', '', 'Not Started', null)
on conflict (id) do update set
  name = excluded.name, role = excluded.role, program = excluded.program, team = excluded.team,
  email = excluded.email, phone = excluded.phone;

-- Rider Bohman, Christian Carter, Kai Lowery, and Adrian Amartuvshin were
-- already registered Select players (unassigned) -- update their existing
-- rows to their team instead of inserting duplicates.
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select 2' where id = 'p60';  -- Rider Bohman
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select 2' where id = 'p129'; -- Christian Carter
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select 3' where id = 'p66';  -- Kai Lowery
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select 3' where id = 'p69';  -- Adrian Amartuvshin

-- The rest are new -- this was a partial export without guardian/school info.
insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p284', null, 'Quentin Potter', '6th', '', '', '',               '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 2'),
  ('p285', null, 'Jackson Chong',  '6th', '', '', '',               '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 2'),
  ('p286', null, 'Zeeshan Akhtar', '6th', '', '', '(703) 984-9226', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 2'),
  ('p287', null, 'Imran Akhtar',   '6th', '', '', '(703) 984-9226', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 2'),
  ('p288', null, 'Max Krug',       '6th', '', '', '(703) 517-1682', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 3'),
  ('p289', null, 'Sawyer Dennis',  '6th', '', '', '(703) 915-9415', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 3'),
  ('p290', null, 'William Agnew',  '6th', '', '', '(703) 640-4849', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 3'),
  ('p291', null, 'Gio Flores',     '6th', '', '', '(703) 209-6062', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select 3')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position, status = excluded.status,
  waiver = excluded.waiver, program = excluded.program, division = excluded.division, team = excluded.team;

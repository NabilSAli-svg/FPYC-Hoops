-- Partial roster for 6th Boys Select (Tom Schneider's team) -- the
-- registration export for these 6 didn't include guardian name/email or
-- school, so those are left blank for now.
insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p278', null, 'Joey Grandizio',         '6th', '', '', '(703) 298-3413', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p279', null, 'Giovanni Firenze',       '6th', '', '', '(850) 529-5349', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p280', null, 'Gavin Bowles',           '6th', '', '', '(703) 835-1546', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p281', null, 'Ridaan Gadkar',          '6th', '', '', '(202) 957-4953', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p282', null, 'Vicente Lopez Zawadzki', '6th', '', '', '',               '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p283', null, 'Judah Pak',              '6th', '', '', '(703) 589-4845', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position, status = excluded.status,
  waiver = excluded.waiver, program = excluded.program, division = excluded.division, team = excluded.team;

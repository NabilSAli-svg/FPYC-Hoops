-- Roster for 6th Boys Select (Tom Schneider's team).
--
-- Joey Grandizio and Vicente Lopez Zawadzki were already registered Select
-- players (p94, p147, unassigned) from earlier in the season -- update their
-- existing rows to this team instead of inserting duplicates.
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select' where id = 'p94';
update players set grade = '6th', division = 'Winter Select', team = '6th Boys Select' where id = 'p147';

-- The rest are new -- this was a partial export without guardian/school info.
insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p279', null, 'Giovanni Firenze', '6th', '', '', '(850) 529-5349', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p280', null, 'Gavin Bowles',     '6th', '', '', '(703) 835-1546', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p281', null, 'Ridaan Gadkar',    '6th', '', '', '(202) 957-4953', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select'),
  ('p283', null, 'Judah Pak',        '6th', '', '', '(703) 589-4845', '', 'active', true, 'Select', 'Winter Select', '6th Boys Select')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position, status = excluded.status,
  waiver = excluded.waiver, program = excluded.program, division = excluded.division, team = excluded.team;

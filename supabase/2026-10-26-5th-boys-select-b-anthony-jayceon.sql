-- Add Anthony Del Fiore and Jayceon Murphy to 5th Boys Select B.

insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p299', null, 'Anthony Del Fiore', '5th', 'Fox Mill Elementary', 'jimdelf@gmail.com',        '(401) 261-0205', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p300', null, 'Jayceon Murphy',    '5th', 'Providence',          'kaitlynmmurphy13@gmail.com','(571) 418-9613', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position,
  status = excluded.status, waiver = excluded.waiver, program = excluded.program,
  division = excluded.division, team = excluded.team;

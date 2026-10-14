-- Roster for 5th Boys Select B.
--
-- Hamza Ali was already registered on Team A -- moved to Team B instead of
-- duplicating.
update players set team = '5th Boys Select B' where id = 'p277';

-- The rest are new registrations (Sep-Oct 2026).
insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p292', null, 'Nathan Fuge',           '5th', 'Daniels Run',              'emclaughlin929@gmail.com', '(703) 915-4299', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p293', null, 'Samuel Greenberg-Rios', '5th', 'Daniel''s Run',            'erios55@hotmail.com',      '(989) 501-5028', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p294', null, 'Julian Hanna',          '5th', 'Daniels Run ES',           'hannatom15@gmail.com',     '(703) 268-8735', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p295', null, 'Grant Larson',          '5th', 'Trinity Christian School', 'merissaklarson@yahoo.com', '(703) 585-1546', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p296', null, 'Kabir Kintgen',         '5th', 'Providence',               'ekintgen@gmail.com',       '(812) 340-4749', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p297', null, 'Logan Guill',           '5th', 'Home school',              'guilljp2@gmail.com',       '(571) 239-7699', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B'),
  ('p298', null, 'Andrew Kennedy',        '5th', 'Providence',               'jfkmail@yahoo.com',        '(202) 445-1111', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select B')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position, status = excluded.status,
  waiver = excluded.waiver, program = excluded.program, division = excluded.division, team = excluded.team;

-- New registrations for 5th Boys Select, from the Sep 2026 registration export.
insert into players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
  ('p269', null, 'Jameson Lucas',   '5th', 'Mosaic Elementary',         'zoya.lucas@gmail.com',     '(703) 347-1443', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p270', null, 'Andrew Donnelly', '5th', 'Providence',                'mikedonnelly25@gmail.com', '(703) 728-5083', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p271', null, 'Adam Hartwich',   '5th', 'Fairhill Elementary School','gatrheel@gmail.com',       '(919) 260-8350', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p272', null, 'Connor Meacham',  '5th', 'Providence',                'keithmeacham@gmail.com',   '(571) 414-8707', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p273', null, 'Seva Singh',      '5th', 'Willow Springs',            'meenooksingh@gmail.com',   '(703) 389-3986', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p274', null, 'Luke Anderson',   '5th', 'Immanuel Christian',        'timjanderson7@gmail.com',  '(915) 474-8825', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p275', null, 'Calvin Hallmark', '5th', 'Mantua elementary',         'rosalie.hallmark@gmail.com','(703) 623-0854', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p276', null, 'Lawson Gutzler',  '5th', 'Mosaic ES',                 'eb_law@yahoo.com',         '(510) 847-7837', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select'),
  ('p277', null, 'Hamza Ali',       '5th', 'Daniels Run',               'syednabilali@gmail.com',   '(703) 994-2211', '', 'active', true, 'Select', 'Winter Select', '5th Boys Select')
on conflict (id) do update set
  number = excluded.number, name = excluded.name, grade = excluded.grade, school = excluded.school,
  guardian = excluded.guardian, phone = excluded.phone, position = excluded.position, status = excluded.status,
  waiver = excluded.waiver, program = excluded.program, division = excluded.division, team = excluded.team;

-- Run in Supabase SQL Editor to add the latest 3v3 registrations to live data.

update public.players set name = 'Rhys Mancl' where id = 'p36';

insert into public.players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
('p195', null, 'Anna Arshad', '4th & 5th', 'Saint Leo the Great Catholic School', 'l.richardson17@gmail.com', '(202)718-7188', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p196', null, 'David Sparling', '4th & 5th', 'Providence elementary', 'yvonnemsparling@gmail.com', '(703) 927-1062', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p197', null, 'AARON Guison-Dowdy', '4th & 5th', 'Fairhill ES', 'xai2k@hotmail.com', '(703)280-0970', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p198', null, 'Cru Tarugsa', '2nd & 3rd', 'Greenbriar West', 'natee.tarugsa@gmail.com', '(818) 388-9426', '', 'active', true, 'Recreation', 'Rising 2nd-3rd Boys', 'Rising 2nd-3rd Boys'),
('p199', null, 'Zach Ali', '4th & 5th', 'Willow Springs', 'shaunali34@gmail.com', '(703) 989-0847', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p200', null, 'Dean Ali', '4th & 5th', 'Willow Springs', 'shaunali34@gmail.com', '(703) 989-0847', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p201', null, 'Amen Emun', '6th-8th', 'Mosaic Elementary school', 'hilawemun@gmail.com', '(571)685-0566', '', 'active', true, 'Recreation', 'Rising 6th-8th Boys', 'Rising 6th-8th Boys'),
('p202', null, 'Taye Olibah', '4th & 5th', 'Willow Springs Elementary School', 'bzolibah@gmail.com', '(571) 214-1701', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p203', null, 'James Schrecengost', '4th & 5th', 'Louise Archer Elementary', 'rosengost.family@gmail.com', '(202) 937-5119', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p204', null, 'Jordan Schrecengost', '2nd & 3rd', 'Flint Hill Elementary', 'rosengost.family@gmail.com', '(202) 937-5119', '', 'active', true, 'Recreation', 'Girls 3v3 (2nd-8th)', 'Girls 3v3 (2nd-8th)'),
('p205', null, 'Linus Lee', '4th & 5th', 'Fairhill Elementary School', 'kkiang@gmail.com', '(970) 623-9363', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p206', null, 'Luke Tran', '4th & 5th', 'Providence Elementary School', 'dltran1216@gmail.com', '(540) 797-4777', '', 'active', true, 'Recreation', 'Rising 4th-5th Boys', 'Rising 4th-5th Boys'),
('p207', null, 'Arantza Rivera Garcia', '6th-8th', 'Fairfax Villa', 'ngarcia9680@hotmail.com', '(703) 899-0013', '', 'active', true, 'Recreation', 'Girls 3v3 (2nd-8th)', 'Girls 3v3 (2nd-8th)'),
('p208', null, 'Anibal Rivera Garcia', '6th-8th', 'Fairfax Villa', 'ngarcia9680@hotmail.com', '(703) 899-0013', '', 'active', true, 'Recreation', 'Rising 6th-8th Boys', 'Rising 6th-8th Boys');

insert into public.staff (id, name, role, program, team, email, phone, bg_check_status, bg_check_date) values
('st9', 'Adam Schrecengost', 'Assistant Coach', 'Recreation', 'Rising 4th-5th Boys', 'schreckdc@gmail.com', '(202)937-5119', 'Not Started', ''),
('st10', 'Adam Schrecengost', 'Assistant Coach', 'Recreation', 'Girls 3v3 (2nd-8th)', 'schreckdc@gmail.com', '(202)937-5119', 'Not Started', ''),
('st11', 'Dale Van Wagner', 'Assistant Coach', 'Recreation', 'Unassigned', 'dale.vanwagner@gmail.com', '(215) 499-5165', 'Not Started', '');

-- Run in Supabase SQL Editor to rebuild the Training roster from the latest registration export.

-- Remove the old Training roster rows
delete from public.players where program = 'Training';

-- Renumber the 3v3 players that previously occupied p195-p208 (now reused by Training)
update public.players set id = 'p254' where id = 'p208';
update public.players set id = 'p255' where id = 'p207';
update public.players set id = 'p256' where id = 'p206';
update public.players set id = 'p257' where id = 'p205';
update public.players set id = 'p258' where id = 'p204';
update public.players set id = 'p259' where id = 'p203';
update public.players set id = 'p260' where id = 'p202';
update public.players set id = 'p261' where id = 'p201';
update public.players set id = 'p262' where id = 'p200';
update public.players set id = 'p263' where id = 'p199';
update public.players set id = 'p264' where id = 'p198';
update public.players set id = 'p265' where id = 'p197';
update public.players set id = 'p266' where id = 'p196';
update public.players set id = 'p267' where id = 'p195';

-- Insert the new Training roster (97 players)
insert into public.players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
('p157', null, 'Anthony Del Fiore', '4th', '', 'jimdelf@gmail.com', '(401) 261-0205', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p158', null, 'Adam Nawaz', '1st', '', 'imran.nawaz@gmail.com', '(703) 625-6873', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p159', null, 'Jay McGrane', '5th', '', 'jason.mcgrane@ey.com', '(724)980-6624', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p160', null, 'Leah Godofsky', '1st', '', 'alex.godofsky@gmail.com', '(703) 298-0975', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p161', null, 'Ethan Kim', '1st', '', 'bambina833@gmail.com', '(703) 473-6168', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p162', null, 'Josander Contreras', '8th', '', 'carla.chicas@gmail.com', '(703) 895-8576', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p163', null, 'Dilan Amin', '4th', '', 'kaushalpurvee@gmail.com', '(703) 994-6338', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p164', null, 'Aiden Oh', '2nd', '', 'mike_oh1981@hotmail.co.kr', '(703)899-5098', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p165', null, 'Kaito Springer', '1st', '', 'springeryoko@gmail.com', '(917) 702-8504', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p166', null, 'Sean Bullen', '8th', '', 'bullenjl@gmail.com', '(703) 975-3362', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p167', null, 'Dylan Choque', '2nd', '', 'bilop25@outlook.com', '5718392728', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p168', null, 'Veeraj Roy', '2nd', '', 'shanonbrar1@gmail.com', '(703) 229-3016', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p169', null, 'Nishaan Khangoora', '3rd', '', 'v.khangoora@gmail.com', '(410) 865-9672', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p170', null, 'Nathaniel Roettger', '5th', '', 'stuartandsuzanne21@yahoo.com', '(540) 287-4703', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p171', null, 'Kayden Nathani', '3rd', '', 'afzaa.khwaja@gmail.com', '(770) 596-5638', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p172', null, 'Nate Fuge', '4th', '', 'davidfuge@gmail.com', '(703) 244-2244', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p173', null, 'Jack Kurtz', '4th', '', 'searchkm@gmail.com', '(571) 216-3162', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p174', null, 'Alan N. Veliz', '3rd', '', 'alan4veliz@gmail.com', '2403838624', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p175', null, 'Jacob Abraham', 'K', '', 'noahmaxepstein@gmail.com', '(646) 385-5858', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p176', null, 'Ulysses Hunstock', '2nd', '', 'drewhunstock@gmail.com', '(325)261-2622', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p177', null, 'Gaius Hunstock', '5th', '', 'drewhunstock@gmail.com', '(325)261-2622', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p178', null, 'Drea Seaton', '5th', '', 'deenarusso@mac.com', '(240)447-0602', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p179', null, 'Mia Angulo', '1st', '', 'sangulo1031@gmail.com', '7036061486', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p180', null, 'Camilla Doan', '2nd', 'Willow Springs ES', 'moonheedoan@gmail.com', '(703) 463-7307', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p181', null, 'Faris Hamid', '3rd', '', 'hamid.ahmedm@gmail.com', '(571) 331-1483', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p182', null, 'Kaiden Moscova', '1st', '', 'tiffany_parkes@yahoo.com', '(646) 245-3201', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p183', null, 'Kavi Uhlig', '3rd', '', 'pmanocha@gmail.com', '(646) 642-0837', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p184', null, 'Rohan Uhlig', 'K', '', 'pmanocha@gmail.com', '(646) 642-0837', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p185', null, 'Rose Dwyer', '3rd', '', 'dwyer.eo@gmail.com', '(908) 337-3928', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p186', null, 'Molly Dwyer', '3rd', '', 'dwyer.eo@gmail.com', '(908) 337-3928', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p187', null, 'Gael Crespo', '4th', '', 'crespojhanett@gmail.com', '5714899702', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p188', null, 'Deacon Linton', '9th Grade', '', 'jaymelinton@gmail.com', '(828) 999-2066', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p189', null, 'Tyler Esterline', '4th', '', 'esterlinefamilyva@gmail.com', '(520)390-7486', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p190', null, 'Charlie Meyers', '8th', '', 'georgiaseeley@hotmail.com', '(703) 400-1962', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p191', null, 'Lillian Jones', '9th Grade', '', 'curtjones@mac.com', '(901)679-7240', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p192', null, 'Aisha Aldayarova', '6th', '', 'gulira.alieva@gmail.com', '(202) 805-8050', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p193', null, 'Zacharia Shah', 'K', '', 'imran.m.shah@gmail.com', '(703) 296-7762', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p194', null, 'Alejandro Chavez', '2nd', '', 'spot82@gmail.com', '(301) 704-4543', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p195', null, 'Jake Gunnoe', '1st', '', 'jennigunnoe@gmail.com', '(234)359-9810', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p196', null, 'Khizar Usman', '5th', '', 'usman.7@hotmail.com', '(713) 396-9806', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p197', null, 'Sulaiman Chaudhry', '5th', '', 'naimahjamal@gmail.com', '(571) 499-9927', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p198', null, 'Antony Bustamante', '8th', '', 'kbustamante@cox.net', '(703) 795-0345', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p199', null, 'Arthur Casarim', '6th', '', 'fcasarim@gmail.com', '(202) 520-0265', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p200', null, 'Kingston Perry', '9th Grade', '', 'personalemale@pm.me', '(312) 576-1637', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p201', null, 'Mergen Darby', '9th Grade', '', 'markusdarby@gmail.com', '(703) 725-7006', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p202', null, 'Wren Evans', '5th', '', 'staceykluck@msn.com', '(703) 785-6557', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p203', null, 'Leonel Hidalgo', '7th', '', 'hidalgofamily2708@gmail.com', '(571) 215-6489', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p204', null, 'Valentina Hidalgo', '10th Grade', '', 'hidalgofamily2708@gmail.com', '(571) 215-6489', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p205', null, 'Mila Singh', '3rd', '', 'meenooksingh@gmail.com', '(703) 389-3986', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p206', null, 'Jack Gibson', '8th', '', 'andy.gibson@outlook.com', '(703) 395-2108', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p207', null, 'ABDURAKHMON BOBOYOROV', '7th', '', 'boburboboyorov@gmail.com', '(615) 589-8837', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p208', null, 'Aariv Amin', '5th', '', 'purveeamin@gmail.com', '(703)994-6338', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p209', null, 'Rashdan Khan', 'K', '', 'emonfiu@yahoo.com', '(240) 551-6822', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p210', null, 'Jonah Harris', '6th', '', 'staceyrose55@gmail.com', '(703) 304-7568', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p211', null, 'Rhys Mancl', '6th', '', 'mancl.amy@gmail.com', '559-908-1523', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p212', null, 'Rohan Chandarana', '5th', '', 'cmohit@yahoo.com', '(703) 870-6875', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p213', null, 'Elias Nishanov', '6th', '', 'dilya.pulatova@gmail.com', '(202) 817-4036', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p214', null, 'Lily Booher', '8th', '', 'analiafelixbooher@yahoo.com', '(918) 257-1079', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p215', null, 'Lía Booher', '2nd', '', 'analiafelixbooher@yahoo.com', '(918) 257-1079', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p216', null, 'Cullen Shanahan', '7th', '', 'stephanieshanahan@yahoo.com', '(360) 672-4077', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p217', null, 'Samuel Kim', '9th Grade', '', 'jinajykim07@gmail.com', '(510) 828-3064', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p218', null, 'Jaxson Shajib', '1st', 'Eagle view', 'milani.shajib@gmail.com', '(240) 535-1318', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p219', null, 'Rylen Shajib', '2nd', 'eagle view', 'milani.shajib@gmail.com', '(240) 535-1318', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p220', null, 'Conner Yi', '9th Grade', '', 'qyi0204@gmail.com', '(703) 618-6838', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p221', null, 'Jaden Chu', '10th Grade', '', 'sarahchoi21@gmail.com', '(510)381-9173', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p222', null, 'Evan Chu', '9th Grade', '', 'sarahchoi21@gmail.com', '(510)381-9173', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p223', null, 'Sarah Ferreira', '9th Grade', '', 'celsomoller@hotmail.com', '(979) 204-3398', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p224', null, 'Pakhin Chongtrakul', '9th Grade', '', 'plesuda@hotmail.com', '(571) 235-0642', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p225', null, 'Roxy Witenstein', '9th Grade', '', 'bwitenstein@hotmail.com', '(540) 454-6201', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p226', null, 'Samuel Espinosa', '9th Grade', '', 'adrianaluciamoros@gmail.com', '7038683706', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p227', null, 'Zeeshan Akhtar', '5th', '', 'azer.akhtar@gmail.com', '(703) 984-9226', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p228', null, 'Imran Akhtar', '5th', '', 'azer.akhtar@gmail.com', '(703) 984-9226', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p229', null, 'Puttajak Ratansuban', '9th Grade', '', 'ratanasuban@gmail.com', '(657) 257-9144', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p230', null, 'Ianthina Osman', '3rd', '', 'shoukut@gmail.com', '(571)386-9047', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p231', null, 'Alisha Zaidi', '9th Grade', '', 'najiahus@gmail.com', '(571)412-7827', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p232', null, 'Alex Nguyen', '3rd', '', 'yanniegwu@yahoo.com', '(202) 299-7665', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p233', null, 'Enzo Rinker', '4th', '', 'justin.rinker@gmail.com', '(571) 383-8879', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p234', null, 'Christopher Barahona', '7th', '', 'alfredobarahona82@gmail.com', '(703)732-0200', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p235', null, 'Jude Rowland', '4th', '', 'rowland.andrewj@gmail.com', '(703) 408-7388', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p236', null, 'Jacob Rowland', '1st', '', 'rowland.andrewj@gmail.com', '(703) 408-7388', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p237', null, 'Arjun Armwood', '2nd', '', 'amishaster@gmail.com', '(412) 443-4528', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p238', null, 'Rishaan Gudishetty', '3rd', '', 'radhikanookala@gmail.com', '(571) 268-3754', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p239', null, 'Harper Schiavone', '4th', '', 'helen_r44444@yahoo.com', '(571) 265-4621', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p240', null, 'Elias Flores', '8th', '', 'jonrobflo@gmail.com', '(703) 362-5518', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p241', null, 'Aiden Machuca', '3rd', '', 'jackelynmachuca@gmail.com', '(703) 231-6974', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p242', null, 'Aarav Jain', '7th', '', 'pulugundlak@gmail.com', '(571) 214-5589', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p243', null, 'Aarit Chandarana', '10th Grade', '', 'cmohit@yahoo.com', '(703) 870-6875', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p244', null, 'Ethan Douglas', '1st', '', 'wudd82@gmail.com', '(571) 306-0306', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p245', null, 'Sufian Chhipa', '5th', '', 'k.chhipa@gmail.com', '(585) 802-2734', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p246', null, 'Mira Asiri', '1st', '', 'alsulami4t@gmail.com', '(703)478-4651', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p247', null, 'Greyson Quintana', '1st', '', 'maheba_pedroso@yahoo.com', '(305)613-1809', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p248', null, 'Michael Sharkey', '2nd', '', 'thesharkeys12@gmail.com', '(419) 349-7783', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p249', null, 'Mohil Bhandari', '4th', '', 'rishabh.bhandari@gmail.com', '(804) 432-4867', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p250', null, 'Adrianna Walker', '9th Grade', '', 'acsourmany@gmail.com', '(240) 421-0648', '', 'active', true, 'Training', 'Intermediate/Advanced', 'Training - Intermediate/Advanced'),
('p251', null, 'Lucas Saal', '4th', 'Mantua', 'b_saal@yahoo.com', '(703) 609-4994', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p252', null, 'James Coscia', '1st', '', 'shelleythomp@gmail.com', '(805)698-1220', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner'),
('p253', null, 'Jordan Lesniewski', 'K', '', 'emilyhopk@gmail.com', '(703) 862-7467', '', 'active', true, 'Training', 'Beginner', 'Training - Beginner');

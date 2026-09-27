-- Winter 2026-27 Select tryout schedule. KJMS sessions default to gym #1 —
-- the schedule didn't specify a half.
insert into practices (id, team, date, "time", gym, "type", rsvp, notes) values
  ('tr_5b_1001', '5th Boys Select', 'Thu, Oct 1',  '7:30-9:00 PM', 'Providence ES', 'Tryout', 0, 'Coach Aidris Daud'),
  ('tr_5b_1005', '5th Boys Select', 'Mon, Oct 5',  '6:00-7:30 PM', 'KJMS #1',       'Tryout', 0, 'Coach Aidris Daud'),
  ('tr_5b_1006', '5th Boys Select', 'Tue, Oct 6',  '6:00-7:30 PM', 'Providence ES', 'Tryout', 0, 'Coach Aidris Daud'),
  ('tr_5b_1008', '5th Boys Select', 'Thu, Oct 8',  '7:30-9:00 PM', 'Providence ES', 'Tryout', 0, 'Coach Aidris Daud'),

  ('tr_6b_1001', '6th Boys Select', 'Thu, Oct 1',  '6:00-7:30 PM', 'Providence ES', 'Tryout', 0, 'Coach Thomas Schneider'),
  ('tr_6b_1006', '6th Boys Select', 'Tue, Oct 6',  '6:00-7:30 PM', 'KJMS #1',       'Tryout', 0, 'Coach Thomas Schneider'),
  ('tr_6b_1008', '6th Boys Select', 'Thu, Oct 8',  '6:00-7:30 PM', 'Providence ES', 'Tryout', 0, 'Coach Thomas Schneider'),

  ('tr_7b_1002', '7th Boys Select', 'Fri, Oct 2',  '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Tim Anderson'),
  ('tr_7b_1005', '7th Boys Select', 'Mon, Oct 5',  '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Tim Anderson'),
  ('tr_7b_1009', '7th Boys Select', 'Fri, Oct 9',  '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Tim Anderson'),
  ('tr_7b_1012', '7th Boys Select', 'Mon, Oct 12', '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Tim Anderson'),

  ('tr_8b_1001', '8th Boys Select', 'Thu, Oct 1',  '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Mike Lee / Kuen Yoo'),
  ('tr_8b_1005', '8th Boys Select', 'Mon, Oct 5',  '7:30-9:00 PM', 'KJMS #1', 'Tryout', 0, 'Coach Mike Lee / Kuen Yoo'),
  ('tr_8b_1008', '8th Boys Select', 'Thu, Oct 8',  '6:00-7:30 PM', 'KJMS #1', 'Tryout', 0, 'Coach Mike Lee / Kuen Yoo'),

  ('tr_5g_1001', '5th Girls Select', 'Thu, Oct 1',  '6:00-7:30 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Fazle Taher'),
  ('tr_5g_1007', '5th Girls Select', 'Wed, Oct 7',  '6:00-7:30 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Fazle Taher'),
  ('tr_5g_1012', '5th Girls Select', 'Mon, Oct 12', '6:00-7:30 PM', 'KJMS #1',        'Tryout', 0, 'Coach Fazle Taher'),
  ('tr_5g_1013', '5th Girls Select', 'Tue, Oct 13', '6:00-7:30 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Fazle Taher'),

  ('tr_6g_1005', '6th Girls Select', 'Mon, Oct 5',  '6:00-7:30 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Michael Do'),
  ('tr_6g_1007', '6th Girls Select', 'Wed, Oct 7',  '6:00-7:30 PM', 'Providence ES',  'Tryout', 0, 'Coach Michael Do'),
  ('tr_6g_1012', '6th Girls Select', 'Mon, Oct 12', '6:00-7:30 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Michael Do'),
  ('tr_6g_1013', '6th Girls Select', 'Tue, Oct 13', '6:00-7:30 PM', 'Providence ES',  'Tryout', 0, 'Coach Michael Do'),

  ('tr_7g_1001', '7th Girls Select', 'Thu, Oct 1', '7:30-9:00 PM', 'KJMS #1', 'Tryout', 0, 'Coach Earnest Williams'),
  ('tr_7g_1002', '7th Girls Select', 'Fri, Oct 2', '7:30-9:00 PM', 'KJMS #1', 'Tryout', 0, 'Coach Earnest Williams'),
  ('tr_7g_1007', '7th Girls Select', 'Thu, Oct 7', '7:30-9:00 PM', 'KJMS #1', 'Tryout', 0, 'Coach Earnest Williams'),
  ('tr_7g_1009', '7th Girls Select', 'Fri, Oct 9', '7:30-9:00 PM', 'KJMS #1', 'Tryout', 0, 'Coach Earnest Williams'),

  ('tr_8g_1001', '8th Girls Select', 'Thu, Oct 1', '7:30-9:00 PM', 'KJMS #1',        'Tryout', 0, 'Coach Brett Schmitz'),
  ('tr_8g_1005', '8th Girls Select', 'Mon, Oct 5', '7:30-9:00 PM', 'Daniels Run ES', 'Tryout', 0, 'Coach Brett Schmitz'),
  ('tr_8g_1007', '8th Girls Select', 'Wed, Oct 7', '7:30-9:00 PM', 'Providence ES',  'Tryout', 0, 'Coach Brett Schmitz'),
  ('tr_8g_1009', '8th Girls Select', 'Fri, Oct 9', '7:30-9:00 PM', 'Providence ES',  'Tryout', 0, 'Coach Brett Schmitz')
on conflict (id) do update set
  team = excluded.team, date = excluded.date, "time" = excluded."time",
  gym = excluded.gym, "type" = excluded."type", notes = excluded.notes;

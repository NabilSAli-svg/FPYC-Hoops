-- Winter 2026-27 coach portal credentials
-- Requires 2026-06-22-coach-credentials.sql to have been run first.

INSERT INTO coach_credentials (team_id, password, team_name) VALUES
  -- Rec
  ('k3-3v3',  'k3hoops27',   'K-3 3v3'),
  ('34boys',  'boys34win',   '3/4 Boys'),
  ('34girls', 'girls34win',  '3/4 Girls'),
  ('56boys',  'boys56win',   '5/6 Boys'),
  ('56girls', 'girls56win',  '5/6 Girls'),
  ('78boys',  'boys78win',   '7/8 Boys'),
  ('78girls', 'girls78win',  '7/8 Girls'),
  ('hsboys',  'hsboyswin',   'HS Boys'),
  ('hsgirls', 'hsgirlswin',  'HS Girls'),
  -- Select
  ('sel-5b',  'sel5boys27',  '5th Boys Select'),
  ('sel-5g',  'sel5girls27', '5th Girls Select'),
  ('sel-6b',  'sel6boys27',  '6th Boys Select'),
  ('sel-6g',  'sel6girls27', '6th Girls Select'),
  ('sel-7b',  'sel7boys27',  '7th Boys Select'),
  ('sel-7g',  'sel7girls27', '7th Girls Select'),
  ('sel-8b',  'sel8boys27',  '8th Boys Select'),
  ('sel-8g',  'sel8girls27', '8th Girls Select')
ON CONFLICT (team_id) DO NOTHING;

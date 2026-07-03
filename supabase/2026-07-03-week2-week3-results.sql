-- Week 2 (Jun 25) and Week 3 (Jul 2) results — individual matchup records
-- Remove the combined single-record entries
DELETE FROM games WHERE id IN ('g452', 'g682', 'g453', 'g683');

-- 4th/5th Boys — Week 2: King of the Court (Thu Jun 25, 6:30–7:30 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g452a', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '6:30 PM - 7:30 PM', 'Celtics vs Rockets', 'Providence Elementary School', true, 'Rising 4th-5th Boys', 38, 12, '38 – 12 · Celtics win')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, us = EXCLUDED.us, them = EXCLUDED.them,
  opponent = EXCLUDED.opponent, location = EXCLUDED.location, note = EXCLUDED.note;

-- 6th/8th Boys — Week 2: King of the Court (Thu Jun 25, 7:30–9:00 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g682a', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '7:30 PM - 9:00 PM', 'Warriors vs Swish',  'Providence Elementary School', true, 'Rising 6th-8th Boys',  8,  8, '8 – 8 · Tie'),
  ('g682b', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '7:30 PM - 9:00 PM', 'Wolves vs Swish',    'Providence Elementary School', true, 'Rising 6th-8th Boys', 12,  6, '12 – 6 · Wolves win'),
  ('g682c', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '7:30 PM - 9:00 PM', 'Wolves vs Warriors', 'Providence Elementary School', true, 'Rising 6th-8th Boys', 19, 14, '19 – 14 · Wolves win'),
  ('g682d', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '7:30 PM - 9:00 PM', 'Swish vs Warriors',  'Providence Elementary School', true, 'Rising 6th-8th Boys',  6,  4, '6 – 4 · Swish win'),
  ('g682e', 'final', 'Jun', 25, 'Thu', 'Thu, Jun 25', '7:30 PM - 9:00 PM', 'Wolves vs Swish',    'Providence Elementary School', true, 'Rising 6th-8th Boys', 17, 15, '17 – 15 · Wolves win')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, us = EXCLUDED.us, them = EXCLUDED.them,
  opponent = EXCLUDED.opponent, location = EXCLUDED.location, note = EXCLUDED.note;

-- 4th/5th Boys — Week 3: World Cup Night (Thu Jul 2, 6:30–7:30 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g453a', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '6:30 PM - 7:30 PM', 'France vs Spain', 'Providence Elementary School', true, 'Rising 4th-5th Boys', 35, 16, '35 – 16 · France wins')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, us = EXCLUDED.us, them = EXCLUDED.them,
  opponent = EXCLUDED.opponent, location = EXCLUDED.location, note = EXCLUDED.note;

-- 6th/8th Boys — Week 3: World Cup Night (Thu Jul 2, 7:30–9:00 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g683a', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '7:30 PM - 9:00 PM', 'Senegal vs France',    'Providence Elementary School', true, 'Rising 6th-8th Boys', 16, 14, '16 – 14 · Senegal wins'),
  ('g683b', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '7:30 PM - 9:00 PM', 'Argentina vs Senegal', 'Providence Elementary School', true, 'Rising 6th-8th Boys', 16,  7, '16 – 7 · Argentina wins'),
  ('g683c', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '7:30 PM - 9:00 PM', 'Argentina vs France',  'Providence Elementary School', true, 'Rising 6th-8th Boys',  8,  7, '8 – 7 · Argentina wins'),
  ('g683d', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '7:30 PM - 9:00 PM', 'France vs Senegal',    'Providence Elementary School', true, 'Rising 6th-8th Boys',  6,  4, '6 – 4 · France wins'),
  ('g683e', 'final', 'Jul', 2, 'Thu', 'Thu, Jul 2', '7:30 PM - 9:00 PM', 'Argentina vs France',  'Providence Elementary School', true, 'Rising 6th-8th Boys',  3,  0, '3 – 0 · Argentina wins')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, us = EXCLUDED.us, them = EXCLUDED.them,
  opponent = EXCLUDED.opponent, location = EXCLUDED.location, note = EXCLUDED.note;

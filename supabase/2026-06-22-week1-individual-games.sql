-- Replace combined Week 1 division records with individual matchup records

-- Remove the combined single-record entries for each division
DELETE FROM games WHERE id IN ('g451', 'g681');

-- 4th/5th Boys Week 1 — Opening Night Tournament (Thu Jun 18, 6:30–7:30 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g451a', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'Knicks vs DEndz',   'Providence Elementary School', true, 'Rising 4th-5th Boys',  8,  8, '8 – 8 · Tie'),
  ('g451b', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'Knicks vs Celtics', 'Providence Elementary School', true, 'Rising 4th-5th Boys', 22,  4, '22 – 4 · Knicks win'),
  ('g451c', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'Celtics vs DEndz',  'Providence Elementary School', true, 'Rising 4th-5th Boys',  6,  2, '6 – 2 · Celtics win')
ON CONFLICT (id) DO UPDATE SET
  status   = EXCLUDED.status,
  us       = EXCLUDED.us,
  them     = EXCLUDED.them,
  opponent = EXCLUDED.opponent,
  location = EXCLUDED.location,
  note     = EXCLUDED.note;

-- 6th/8th Boys Week 1 — Opening Night Tournament (Thu Jun 18, 7:30–9:00 PM)
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them, note) VALUES
  ('g681a', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Ravens vs Jaguars',   'Providence Elementary School', true, 'Rising 6th-8th Boys', 16,  2, '16 – 2 · Ravens win'),
  ('g681b', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Warriors vs Spurs',   'Providence Elementary School', true, 'Rising 6th-8th Boys', 16, 10, '16 – 10 · Warriors win'),
  ('g681c', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Warriors vs Jaguars', 'Providence Elementary School', true, 'Rising 6th-8th Boys', 16,  8, '16 – 8 · Warriors win'),
  ('g681d', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Spurs vs Ravens',     'Providence Elementary School', true, 'Rising 6th-8th Boys',  8,  6, '8 – 6 · Spurs win')
ON CONFLICT (id) DO UPDATE SET
  status   = EXCLUDED.status,
  us       = EXCLUDED.us,
  them     = EXCLUDED.them,
  opponent = EXCLUDED.opponent,
  location = EXCLUDED.location,
  note     = EXCLUDED.note;

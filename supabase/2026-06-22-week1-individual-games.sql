-- Replace combined Week 1 division records with individual matchup records

-- Remove the combined single-record entries for each division
DELETE FROM games WHERE id IN ('g451', 'g681');

-- 4th/5th Boys Week 1 — Opening Night Tournament (Thu Jun 18, 6:30–7:30 PM)
-- Round-robin: Knicks, Celtics, DEndz
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them) VALUES
  ('g451a', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'DEndz',   'Providence Elementary School', true, 'Rising 4th-5th Boys',  8,  8),
  ('g451b', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'Celtics', 'Providence Elementary School', true, 'Rising 4th-5th Boys', 22,  4),
  ('g451c', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '6:30 PM - 7:30 PM', 'DEndz',   'Providence Elementary School', true, 'Rising 4th-5th Boys',  6,  2)
ON CONFLICT (id) DO UPDATE SET
  status   = EXCLUDED.status,
  us       = EXCLUDED.us,
  them     = EXCLUDED.them,
  opponent = EXCLUDED.opponent,
  location = EXCLUDED.location;

-- Add notes identifying each matchup's home team
UPDATE games SET note = 'Knicks vs DEndz'   WHERE id = 'g451a';
UPDATE games SET note = 'Knicks vs Celtics' WHERE id = 'g451b';
UPDATE games SET note = 'Celtics vs DEndz'  WHERE id = 'g451c';

-- 6th/8th Boys Week 1 — Opening Night Tournament (Thu Jun 18, 7:30–9:00 PM)
-- Round-robin: Warriors, Ravens, Jaguars, Spurs
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team, us, them) VALUES
  ('g681a', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Jaguars', 'Providence Elementary School', true, 'Rising 6th-8th Boys', 16,  2),
  ('g681b', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Spurs',   'Providence Elementary School', true, 'Rising 6th-8th Boys', 16, 10),
  ('g681c', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Jaguars', 'Providence Elementary School', true, 'Rising 6th-8th Boys', 16,  8),
  ('g681d', 'final', 'Jun', 18, 'Thu', 'Thu, Jun 18', '7:30 PM - 9:00 PM', 'Ravens',  'Providence Elementary School', true, 'Rising 6th-8th Boys',  8,  6)
ON CONFLICT (id) DO UPDATE SET
  status   = EXCLUDED.status,
  us       = EXCLUDED.us,
  them     = EXCLUDED.them,
  opponent = EXCLUDED.opponent,
  location = EXCLUDED.location;

UPDATE games SET note = 'Ravens vs Jaguars'  WHERE id = 'g681a';
UPDATE games SET note = 'Warriors vs Spurs'  WHERE id = 'g681b';
UPDATE games SET note = 'Warriors vs Jaguars' WHERE id = 'g681c';
UPDATE games SET note = 'Spurs vs Ravens'    WHERE id = 'g681d';

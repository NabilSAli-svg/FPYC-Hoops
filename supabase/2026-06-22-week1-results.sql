-- Add note column to games if it doesn't exist
ALTER TABLE games ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS us integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS them integer;

-- 4th/5th Boys — Week 1: Opening Night Tournament results
UPDATE games SET
  status = 'final',
  us     = 1,
  them   = 1,
  note   = 'Opening Night results — Knicks vs DEndz: 8-8 | Knicks vs Celtics: 22-4 | Celtics vs DEndz: 6-2'
WHERE id = 'g451';

-- 6th/8th Boys — Week 1: Opening Night Tournament, Warriors win
UPDATE games SET
  status = 'final',
  us     = 1,
  them   = 0,
  note   = '🏆 Warriors win Opening Night! — Ravens vs Jaguars: 16-2 | Warriors vs Spurs: 16-10 | Warriors vs Jaguars: 16-8 | Spurs vs Ravens: 8-6'
WHERE id = 'g681';

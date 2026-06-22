-- Week 1 for Tuesday divisions was pickup/open play
UPDATE games SET
  status = 'final',
  us     = 0,
  them   = 0,
  note   = 'Pickup / Open Play'
WHERE id IN ('g231', 'gg1');

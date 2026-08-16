-- Fall 2026 gym share: volleyball takes both Johnson MS gyms on Wednesdays.
-- Volleyball fall season runs Sep 16 - Nov 18, Wednesdays only, at KJMS.
-- Basketball keeps Providence ES and Daniels Run ES on those nights.
-- Run after 2026-07-29-fall-2026-gym-permits.sql.

INSERT INTO blackout_dates (id, date, reason, scope) VALUES
  ('bo-vb-kjms1-0916', '2026-09-16', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-0916', '2026-09-16', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-0923', '2026-09-23', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-0923', '2026-09-23', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-0930', '2026-09-30', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-0930', '2026-09-30', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1007', '2026-10-07', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1007', '2026-10-07', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1014', '2026-10-14', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1014', '2026-10-14', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1021', '2026-10-21', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1021', '2026-10-21', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1028', '2026-10-28', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1028', '2026-10-28', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1104', '2026-11-04', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1104', '2026-11-04', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1111', '2026-11-11', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1111', '2026-11-11', 'Volleyball — fall season', 'KJMS #2'),
  ('bo-vb-kjms1-1118', '2026-11-18', 'Volleyball — fall season', 'KJMS #1'),
  ('bo-vb-kjms2-1118', '2026-11-18', 'Volleyball — fall season', 'KJMS #2')
ON CONFLICT (id) DO UPDATE SET
  date   = EXCLUDED.date,
  reason = EXCLUDED.reason,
  scope  = EXCLUDED.scope;

-- Note the share on the permits themselves.
UPDATE gym_permits
SET notes = notes || ' · Wednesdays Sep 16-Nov 18 held for volleyball'
WHERE id IN ('gp-fall26-kjms1', 'gp-fall26-kjms2')
  AND notes NOT LIKE '%volleyball%';

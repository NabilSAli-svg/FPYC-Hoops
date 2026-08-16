-- FPYC Fall 2026 gym permit (issued Jul 7, 2026)
-- Mon-Fri 6:00-9:00 PM at four gyms, Sep 8 - Nov 24 2026.

INSERT INTO gym_permits
  (id, gym_name, season, year, days, start_time, end_time, start_date, end_date, sport, notes) VALUES
  ('gp-fall26-prov',   'Providence ES',  'fall', 2026, ARRAY['Mon','Tue','Wed','Thu','Fri'], '18:00', '21:00', '2026-09-08', '2026-11-24', 'basketball', 'ProvGymFPYCM-FFall2026 — no Mon Sep 21'),
  ('gp-fall26-danrun', 'Daniels Run ES', 'fall', 2026, ARRAY['Mon','Tue','Wed','Thu','Fri'], '18:00', '21:00', '2026-09-08', '2026-11-24', 'basketball', 'DanRunGymFPYCM-FFall2026'),
  ('gp-fall26-kjms1',  'KJMS #1',        'fall', 2026, ARRAY['Mon','Tue','Wed','Thu','Fri'], '18:00', '21:00', '2026-09-08', '2026-11-24', 'basketball', 'KJMSGymFPYCM-FFall2026 (Johnson MS Gym #1) — no Mon Sep 21'),
  ('gp-fall26-kjms2',  'KJMS #2',        'fall', 2026, ARRAY['Mon','Tue','Wed','Thu','Fri'], '18:00', '21:00', '2026-09-08', '2026-11-24', 'basketball', 'KJMSGymFPYCM-FFall2026 (Johnson MS Gym #2) — no Mon Sep 21')
ON CONFLICT (id) DO UPDATE SET
  gym_name   = EXCLUDED.gym_name,
  season     = EXCLUDED.season,
  year       = EXCLUDED.year,
  days       = EXCLUDED.days,
  start_time = EXCLUDED.start_time,
  end_time   = EXCLUDED.end_time,
  start_date = EXCLUDED.start_date,
  end_date   = EXCLUDED.end_date,
  sport      = EXCLUDED.sport,
  notes      = EXCLUDED.notes;

-- Permit skip dates.
-- Veterans Day (Nov 11) is NOT listed: the permit closes the gym only until
-- 1:59 PM, and the 6-9 PM slot still runs that evening.
INSERT INTO blackout_dates (id, date, reason, scope) VALUES
  ('bo-fall26-labor',      '2026-09-07', 'Labor Day — schools closed',        'all'),
  ('bo-fall26-fallfest',   '2026-10-10', 'Fall Festival — facilities closed', 'all'),
  ('bo-fall26-thanks-thu', '2026-11-26', 'Thanksgiving — schools closed',     'all'),
  ('bo-fall26-thanks-fri', '2026-11-27', 'Thanksgiving break — schools closed','all'),
  -- Sep 21 is booked at Daniels Run only.
  ('bo-fall26-sep21-prov',  '2026-09-21', 'No permit — Providence ES', 'Providence ES'),
  ('bo-fall26-sep21-kjms1', '2026-09-21', 'No permit — KJMS #1',       'KJMS #1'),
  ('bo-fall26-sep21-kjms2', '2026-09-21', 'No permit — KJMS #2',       'KJMS #2')
ON CONFLICT (id) DO UPDATE SET
  date   = EXCLUDED.date,
  reason = EXCLUDED.reason,
  scope  = EXCLUDED.scope;

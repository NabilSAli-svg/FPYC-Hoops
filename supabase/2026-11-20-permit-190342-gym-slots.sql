-- Fairfax County Permit #190342 (confirmed by the treasurer), Winter Gym
-- season, Nov 2026 - Mar 2027. Adds four new gym locations not previously
-- in gym_permits: Eagle View ES, Fairfax Villa ES, Frost MS (2 gyms), and
-- Mosaic ES. Day/time varies a bit week to week on the actual permit
-- calendar; these are the predominant weekly patterns -- gray/unmarked
-- days on the permit itself are not granted time and are left out.

insert into public.gym_permits (id, gym_name, season, year, days, start_time, end_time, start_date, end_date, sport, notes) values
  ('gp-190342-eagleview-weekday', 'Eagle View ES', 'winter', 2026, array['Mon','Tue','Wed','Thu'], '17:30', '21:00', '2026-11-16', '2027-03-31', 'basketball', 'Permit #190342 — Gym 1. Some Thursdays end 8:30 PM instead; check full permit for exceptions.'),
  ('gp-190342-eagleview-fri', 'Eagle View ES', 'winter', 2026, array['Fri'], '17:30', '20:30', '2026-11-16', '2027-03-31', 'basketball', 'Permit #190342 — Gym 1'),
  ('gp-190342-eagleview-sat', 'Eagle View ES', 'winter', 2026, array['Sat'], '09:00', '17:00', '2027-01-02', '2027-03-31', 'basketball', 'Permit #190342 — Gym 1, Saturdays start in January'),
  ('gp-190342-fairfaxvilla-weekday', 'Fairfax Villa ES', 'winter', 2026, array['Mon','Tue','Wed','Thu'], '17:30', '20:30', '2026-11-16', '2027-03-15', 'basketball', 'Permit #190342 — Gym 1. End time varies 8:00/8:30 PM by date; Thursdays run until 9:00 PM — check full permit for exceptions.'),
  ('gp-190342-fairfaxvilla-fri', 'Fairfax Villa ES', 'winter', 2026, array['Fri'], '17:30', '21:00', '2026-11-16', '2027-03-15', 'basketball', 'Permit #190342 — Gym 1'),
  ('gp-190342-fairfaxvilla-sat', 'Fairfax Villa ES', 'winter', 2026, array['Sat'], '09:00', '17:00', '2027-01-02', '2027-03-15', 'basketball', 'Permit #190342 — Gym 1, Saturdays start in January'),
  ('gp-190342-frost-gym1-sat', 'Frost MS', 'winter', 2027, array['Sat'], '13:00', '18:00', '2027-01-02', '2027-03-31', 'basketball', 'Permit #190342 — Gym 1, Saturdays only'),
  ('gp-190342-frost-gym2-tue', 'Frost MS', 'winter', 2026, array['Tue'], '19:00', '21:00', '2026-11-17', '2027-03-31', 'basketball', 'Permit #190342 — Gym 2'),
  ('gp-190342-frost-gym2-mon', 'Frost MS', 'winter', 2027, array['Mon'], '18:00', '21:00', '2027-02-01', '2027-03-31', 'basketball', 'Permit #190342 — Gym 2, Mondays added starting February'),
  ('gp-190342-mosaic-sat', 'Mosaic ES', 'winter', 2027, array['Sat'], '09:00', '17:00', '2027-03-01', '2027-03-31', 'basketball', 'Permit #190342 — Gym 1, Saturdays only. Only March shown on the permit document.')
on conflict (id) do nothing;

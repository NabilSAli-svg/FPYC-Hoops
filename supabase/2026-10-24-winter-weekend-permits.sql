-- Winter 2026-27 weekend space -- a preview from the City of Fairfax, not
-- yet finalized. Loaded now so it can be reserved for house league
-- evaluations and Select scrimmages/practices before the 11/9 deadline to
-- tell the city if it's not being used (to avoid being charged).

insert into gym_permits (id, gym_name, season, year, days, start_time, end_time, start_date, end_date, sport, notes) values
  ('gp-winter26-daniels-sat', 'Daniels Run ES', 'winter', 2026, array['Sat'], '08:00', '19:00', '2026-12-05', '2027-03-20', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-daniels-sun', 'Daniels Run ES', 'winter', 2026, array['Sun'], '11:45', '19:00', '2026-12-06', '2027-03-21', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-prov-sat',    'Providence ES',  'winter', 2026, array['Sat'], '08:00', '19:00', '2026-12-05', '2027-03-20', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9 · no Sundays'),
  ('gp-winter26-kjms1-sat',   'KJMS #1',        'winter', 2026, array['Sat'], '08:00', '21:00', '2026-12-05', '2027-03-20', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-kjms2-sat',   'KJMS #2',        'winter', 2026, array['Sat'], '08:00', '21:00', '2026-12-05', '2027-03-20', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-kjms1-sun',   'KJMS #1',        'winter', 2026, array['Sun'], '11:45', '19:00', '2026-12-06', '2027-03-21', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-kjms2-sun',   'KJMS #2',        'winter', 2026, array['Sun'], '11:45', '19:00', '2026-12-06', '2027-03-21', 'basketball', 'Preview — Select weekend space, confirm with City of Fairfax by 11/9'),
  ('gp-winter26-fhs-sun',     'Fairfax HS',     'winter', 2026, array['Sun'], '11:45', '19:00', '2026-12-06', '2027-03-14', 'basketball', 'Preview — Select weekend space (FHS Main Gym), confirm with City of Fairfax by 11/9')
on conflict (id) do update set
  gym_name = excluded.gym_name, season = excluded.season, year = excluded.year,
  days = excluded.days, start_time = excluded.start_time, end_time = excluded.end_time,
  start_date = excluded.start_date, end_date = excluded.end_date,
  sport = excluded.sport, notes = excluded.notes;

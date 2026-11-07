-- The Winter 2026-27 weekend space (Daniels Run ES, Providence ES, KJMS #1/#2,
-- Fairfax HS Main Gym) is closed on school holidays and winter break. FCPS
-- winter break runs Mon 12/21 through Fri 1/1 (see 2026-09-12-fcps-student-
-- holidays.sql for the weekday closures); this adds the weekends inside and
-- adjoining that break, which aren't otherwise covered.

insert into blackout_dates (id, date, reason, scope) values
  ('bo-winter26-1219', '2026-12-19', 'Winter break — weekend space closed', 'all'),
  ('bo-winter26-1220', '2026-12-20', 'Winter break — weekend space closed', 'all'),
  ('bo-winter26-1226', '2026-12-26', 'Winter break — weekend space closed', 'all'),
  ('bo-winter26-1227', '2026-12-27', 'Winter break — weekend space closed', 'all'),
  ('bo-winter26-0102', '2027-01-02', 'Winter break — weekend space closed', 'all'),
  ('bo-winter26-0103', '2027-01-03', 'Winter break — weekend space closed', 'all')
on conflict (id) do update set
  date = excluded.date,
  reason = excluded.reason,
  scope = excluded.scope;

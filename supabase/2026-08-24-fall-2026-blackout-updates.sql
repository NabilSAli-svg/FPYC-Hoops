-- New facility closures for fall 2026, on top of what's already in
-- 2026-07-29-fall-2026-gym-permits.sql and 2026-07-29-fall-2026-volleyball-share.sql.
--
-- Dates already covered by existing rows and NOT repeated here:
--   9/21   — already closes Providence ES, KJMS #1, KJMS #2 (bo-fall26-sep21-*)
--   11/26  — already an 'all'-scope Thanksgiving closure (bo-fall26-thanks-thu)
--   11/27  — already an 'all'-scope Thanksgiving closure (bo-fall26-thanks-fri)

insert into blackout_dates (id, date, reason, scope) values
  ('bo-fall26-0909-prov', '2026-09-09', 'No permit — Providence ES', 'Providence ES'),
  ('bo-fall26-0917-prov', '2026-09-17', 'No permit — Providence ES', 'Providence ES'),
  ('bo-fall26-1105-prov', '2026-11-05', 'No permit — Providence ES', 'Providence ES'),

  ('bo-fall26-0917-daniels', '2026-09-17', 'No permit — Daniels Run ES', 'Daniels Run ES'),
  ('bo-fall26-0921-daniels', '2026-09-21', 'No permit — Daniels Run ES', 'Daniels Run ES'),
  ('bo-fall26-1102-daniels', '2026-11-02', 'No permit — Daniels Run ES', 'Daniels Run ES'),
  ('bo-fall26-1103-daniels', '2026-11-03', 'No permit — Daniels Run ES', 'Daniels Run ES'),

  ('bo-fall26-1125-all', '2026-11-25', 'Thanksgiving break — schools closed', 'all')
on conflict (id) do update set
  date = excluded.date,
  reason = excluded.reason,
  scope = excluded.scope;

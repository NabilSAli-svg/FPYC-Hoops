-- FCPS 2026-2027 Standard School Year Calendar (fcps.edu/calendars) — every
-- "Student Holiday" (H) day, all facilities closed. Teacher workdays / staff
-- development / school planning days (TW/SD/SP) are intentionally excluded —
-- schools are closed to students those days too, but per the league's own
-- read only "H" days should be treated as full closures.
--
-- Already covered by earlier migrations and not repeated here:
--   2026-09-07 (Labor Day), 2026-09-21 (Yom Kippur),
--   2026-11-25/26/27 (Thanksgiving)

insert into blackout_dates (id, date, reason, scope) values
  ('bo-fcps-2026-0904', '2026-09-04', 'FCPS student holiday', 'all'),

  ('bo-fcps-2026-1221', '2026-12-21', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1222', '2026-12-22', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1223', '2026-12-23', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1224', '2026-12-24', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1225', '2026-12-25', 'FCPS student holiday — Christmas', 'all'),
  ('bo-fcps-2026-1228', '2026-12-28', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1229', '2026-12-29', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1230', '2026-12-30', 'FCPS student holiday — Winter Break', 'all'),
  ('bo-fcps-2026-1231', '2026-12-31', 'FCPS student holiday — Winter Break', 'all'),

  ('bo-fcps-2027-0101', '2027-01-01', 'FCPS student holiday — New Year''s Day', 'all'),
  ('bo-fcps-2027-0118', '2027-01-18', 'FCPS student holiday — MLK Day', 'all'),

  ('bo-fcps-2027-0215', '2027-02-15', 'FCPS student holiday — Presidents'' Day', 'all'),

  ('bo-fcps-2027-0310', '2027-03-10', 'FCPS student holiday', 'all'),
  ('bo-fcps-2027-0322', '2027-03-22', 'FCPS student holiday — Spring Break', 'all'),
  ('bo-fcps-2027-0323', '2027-03-23', 'FCPS student holiday — Spring Break', 'all'),
  ('bo-fcps-2027-0324', '2027-03-24', 'FCPS student holiday — Spring Break', 'all'),
  ('bo-fcps-2027-0325', '2027-03-25', 'FCPS student holiday — Spring Break', 'all'),
  ('bo-fcps-2027-0326', '2027-03-26', 'FCPS student holiday — Spring Break / Good Friday', 'all'),

  ('bo-fcps-2027-0517', '2027-05-17', 'FCPS student holiday — Eid al-Adha', 'all'),
  ('bo-fcps-2027-0531', '2027-05-31', 'FCPS student holiday — Memorial Day', 'all'),

  ('bo-fcps-2027-0618', '2027-06-18', 'FCPS student holiday — Juneteenth (observed)', 'all')
on conflict (id) do update set
  date = excluded.date,
  reason = excluded.reason,
  scope = excluded.scope;

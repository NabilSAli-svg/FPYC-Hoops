-- Daniels Run ES is closed Fri 11/6 — add to the blackout list so the
-- scheduler stops offering that slot. No practices were booked there that
-- day, so nothing needs to move.

insert into blackout_dates (id, date, reason, scope) values
  ('bo-fall26-1106-daniels', '2026-11-06', 'No permit — Daniels Run ES', 'Daniels Run ES')
on conflict (id) do update set
  date = excluded.date,
  reason = excluded.reason,
  scope = excluded.scope;

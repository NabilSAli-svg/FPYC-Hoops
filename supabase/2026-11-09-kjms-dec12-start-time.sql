-- Sat 12/12 at KJMS starts at 1:00 PM instead of the usual 8:00 AM Saturday
-- start. gym_permits is a recurring weekly window, not per-date, so this is
-- noted on the permit rather than modeled as a separate time range.

update gym_permits
set notes = 'Select weekend space · Sat 12/12 starts at 1:00 PM instead of 8:00 AM'
where id in ('gp-winter26-kjms1-sat', 'gp-winter26-kjms2-sat');

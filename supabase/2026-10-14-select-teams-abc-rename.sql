-- Rename Select team labels from numeric suffixes to letters:
--   "<grade> Boys Select"   -> "<grade> Boys Select A"
--   "<grade> Boys Select 2" -> "<grade> Boys Select B"
--   "<grade> Boys Select 3" -> "<grade> Boys Select C"
-- (Girls teams are untouched -- each grade only has one.)
--
-- Run this AFTER 2026-10-13-6th-boys-select-roster.sql and
-- 2026-10-13-6th-boys-select-teamsBC.sql, since those still insert rows
-- using the old "6th Boys Select" / "6th Boys Select 2" / "6th Boys Select 3"
-- names -- if you haven't run those two yet, run them first.

do $$
declare
  grade text;
begin
  foreach grade in array array['5th','6th','7th','8th'] loop
    update practices set team = grade || ' Boys Select A' where team = grade || ' Boys Select';
    update practices set team = grade || ' Boys Select B' where team = grade || ' Boys Select 2';
    update practices set team = grade || ' Boys Select C' where team = grade || ' Boys Select 3';

    update players set team = grade || ' Boys Select A' where team = grade || ' Boys Select';
    update players set team = grade || ' Boys Select B' where team = grade || ' Boys Select 2';
    update players set team = grade || ' Boys Select C' where team = grade || ' Boys Select 3';

    update staff set team = grade || ' Boys Select A' where team = grade || ' Boys Select';
    update staff set team = grade || ' Boys Select B' where team = grade || ' Boys Select 2';
    update staff set team = grade || ' Boys Select C' where team = grade || ' Boys Select 3';
  end loop;
end $$;

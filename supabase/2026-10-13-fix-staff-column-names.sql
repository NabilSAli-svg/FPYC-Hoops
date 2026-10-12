-- The staff table's background-check columns were created as snake_case
-- (bg_check_status / bg_check_date), but every piece of app code -- the
-- auto-seed on load, the Add/Edit form in Staff & Volunteers, every
-- INITIAL_STAFF entry -- reads and writes camelCase (bgCheckStatus /
-- bgCheckDate). Supabase/PostgREST rejects an upsert payload that
-- references a column that doesn't exist, so every one of those writes has
-- been silently failing in production (the UI still looked right because
-- state updates optimistically before the write confirms).
--
-- Rename the columns to match what the app actually sends, instead of
-- chasing every call site. Run this before any staff insert/update that
-- includes bgCheckStatus/bgCheckDate (including
-- 2026-10-12-select-practice-schedule.sql). Safe to run more than once.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'staff' and column_name = 'bg_check_status'
  ) then
    alter table staff rename column bg_check_status to "bgCheckStatus";
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'staff' and column_name = 'bg_check_date'
  ) then
    alter table staff rename column bg_check_date to "bgCheckDate";
  end if;
end $$;

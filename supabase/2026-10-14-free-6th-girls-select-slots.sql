-- 6th Girls Select isn't fielding a team this season. Remove the regular
-- season practice slots that were reserved for it, so the gym time shows as
-- open again in the Master Scheduler. Historical Open Gym / Tryout records
-- from Sep/Oct are left alone -- those already happened.
delete from practices where id like 'sp_6g_%';

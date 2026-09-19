-- Remove the expired Summer 2026 "Daniels Run ES Gym #1" permit
-- (gp-4686424, ran 2026-07-01 to 2026-07-31). It's distinct from the
-- current Fall 2026 "Daniels Run ES" permit (gp-fall26-danrun) and was
-- only showing up as a stray, unusable facility name.
delete from gym_permits where id = 'gp-4686424';

-- Assign previously "Unassigned" volunteers to 3v3 teams to maximize coverage
-- and align with their child's group.

update public.staff set team = 'Rising 2nd-3rd Boys' where id = 'st2';
update public.staff set team = 'Girls 3v3 (2nd-8th)' where id = 'st5';
update public.staff set team = 'Rising 6th-8th Boys' where id = 'st11';

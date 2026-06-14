-- Add Kesara Liyanage as Coach for Rising 4th-5th Boys, and grant admin access
-- (run the profiles update only after kliyanage30@gmail.com has logged in at least once)

insert into public.staff (id, name, role, program, team, email, phone, bg_check_status, bg_check_date) values
('st12', 'Kesara Liyanage', 'Coach', 'Recreation', 'Rising 4th-5th Boys', 'kliyanage30@gmail.com', '', 'Not Started', '');

update public.profiles set role = 'commissioner' where email = 'kliyanage30@gmail.com';

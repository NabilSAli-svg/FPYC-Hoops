-- Aidris Daud had 3 staff rows: the current 5th Boys Select entry (with his
-- real email) plus two legacy rows from the archived Travel Select summer
-- season and Training with no email on file. Settings > Coaches groups staff
-- by email, so a blank email meant these showed as separate "people" instead
-- of merging into one. Filling in the email fixes the duplicate display.
update staff set email = 'aidris@keydmv.com', phone = '703-447-1184' where id in ('ts_c1', 'tr4');

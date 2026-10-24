-- Correction: the Skills Clinic never actually moved to Tuesdays -- it's
-- still Mondays, with two sessions left (Oct 19, Oct 26) at Providence ES.
update practices set date = 'Mon, Sep 28', notes = 'Gym subject to change' where id in ('fc_beg_3', 'fc_int_3', 'fc_adv_3');
update practices set date = 'Mon, Oct 5'  where id in ('fc_beg_4', 'fc_int_4', 'fc_adv_4');
update practices set date = 'Mon, Oct 19' where id in ('fc_beg_5', 'fc_int_5', 'fc_adv_5');
update practices set date = 'Mon, Oct 26' where id in ('fc_beg_6', 'fc_int_6', 'fc_adv_6');

-- Correct the announcement that wrongly said the clinic moved to Tuesdays.
update announcements
set title = 'Fall Skills Clinic: Two Sessions Left',
    body = 'Reminder: the Fall Skills Clinic is still on Mondays at Providence ES (Beginner 6-7, Intermediate 7-8, Advanced 8-9). Two sessions remain -- Oct 19 and Oct 26 -- wrapping up the fall clinic. Spring and Summer Skills Clinics are planned for later in the year; watch for registration details.',
    "type" = 'general'
where id = 'ann-skills-clinic-tuesday-2026';

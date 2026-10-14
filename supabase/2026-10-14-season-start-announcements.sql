-- Three season-start announcements for the family-facing Announcements feed.
insert into announcements (id, "type", title, body, target, date, pinned, author) values
  (
    'ann-select-placements-2026',
    'general',
    '2026-27 Select Team Placements Are Set!',
    'Tryouts are complete and teams are finalized for the Winter 2026-27 Select season! Coaches will be reaching out directly with your team assignment, practice schedule, and next steps. Questions? Contact your team''s coach directly, or email fpycselect@gmail.com.',
    'All families',
    'Oct 14',
    true,
    'Admin'
  ),
  (
    'ann-skills-clinic-tuesday-2026',
    'urgent',
    'Fall Skills Clinic Now Meets Tuesdays',
    'Heads up — the Fall Skills Clinic has moved from Mondays to Tuesdays, effective Sep 29. Same location and times (Providence ES: Beginner 6-7, Intermediate 7-8, Advanced 8-9). The Sep 14 and Sep 21 sessions ran on the original Monday schedule; from Sep 29 on, see your coach on Tuesdays instead.',
    'All families',
    'Oct 14',
    true,
    'Admin'
  ),
  (
    'ann-fcps-holidays-2026',
    'info',
    'Gyms Closed on FCPS School Holidays',
    'Reminder: all FPYC gyms are closed whenever Fairfax County Public Schools are closed for a student holiday — including Thanksgiving week (Nov 25-27), Winter Break (Dec 21 - Jan 1), MLK Day (Jan 18), Presidents'' Day (Feb 15), Spring Break (Mar 22-26), and more. Check the Master Scheduler for the full list of closures — no practices or games are held on these dates.',
    'All families',
    'Oct 14',
    false,
    'Admin'
  )
on conflict (id) do update set
  "type" = excluded."type", title = excluded.title, body = excluded.body,
  target = excluded.target, date = excluded.date, pinned = excluded.pinned, author = excluded.author;

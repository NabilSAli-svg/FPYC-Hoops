-- Fall 2026 Select Open Gyms (not tryouts), updated 9/9/26. Mirrors the
-- INITIAL_PRACTICES seed added to src/shared/store.js so the Master
-- Scheduler shows these instead of only the public website. KJMS sessions
-- default to gym #1 -- the physical space is split by a divider, so which
-- half actually runs may vary.
--
-- 7th grade boys and 8th grade girls have no open gym dates published yet
-- and are intentionally omitted.

insert into practices (id, team, date, "time", gym, "type", rsvp, notes) values
  ('og_5b_0910', '5th Boys Select', 'Thu, Sep 10', '7:30-9:00 PM', 'Providence ES', 'Open Gym', 0, 'Coach Aidris Daud'),
  ('og_5b_0911', '5th Boys Select', 'Fri, Sep 11', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Aidris Daud'),
  ('og_5b_0918', '5th Boys Select', 'Fri, Sep 18', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Aidris Daud'),
  ('og_5b_0924', '5th Boys Select', 'Thu, Sep 24', '7:30-9:00 PM', 'Providence ES', 'Open Gym', 0, 'Coach Aidris Daud'),
  ('og_5b_0925', '5th Boys Select', 'Fri, Sep 25', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Aidris Daud'),

  ('og_6b_0908', '6th Boys Select', 'Tue, Sep 8',  '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),
  ('og_6b_0910', '6th Boys Select', 'Thu, Sep 10', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),
  ('og_6b_0915', '6th Boys Select', 'Tue, Sep 15', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),
  ('og_6b_0917', '6th Boys Select', 'Thu, Sep 17', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),
  ('og_6b_0922', '6th Boys Select', 'Tue, Sep 22', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),
  ('og_6b_0924', '6th Boys Select', 'Thu, Sep 24', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Thomas Schneider'),

  ('og_8b_0910', '8th Boys Select', 'Thu, Sep 10', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Mike Lee'),
  ('og_8b_0914', '8th Boys Select', 'Mon, Sep 14', '7:30-9:00 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Mike Lee'),
  ('og_8b_0917', '8th Boys Select', 'Thu, Sep 17', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Mike Lee'),
  ('og_8b_0924', '8th Boys Select', 'Thu, Sep 24', '6:00-7:30 PM', 'KJMS #1', 'Open Gym', 0, 'Coach Mike Lee'),

  ('og_5g_0916', '5th Girls Select', 'Wed, Sep 16', '6:00-7:30 PM', 'Daniels Run ES', 'Open Gym', 0, 'Coach Fazle Taher'),
  ('og_5g_0923', '5th Girls Select', 'Wed, Sep 23', '6:00-7:30 PM', 'Daniels Run ES', 'Open Gym', 0, 'Coach Fazle Taher'),

  ('og_6g_0914', '6th Girls Select', 'Mon, Sep 14', '6:00-7:30 PM', 'Daniels Run ES', 'Open Gym', 0, 'Coach Michael Do'),
  ('og_6g_0916', '6th Girls Select', 'Wed, Sep 16', '6:00-7:30 PM', 'Providence ES',  'Open Gym', 0, 'Coach Michael Do'),
  ('og_6g_0923', '6th Girls Select', 'Wed, Sep 23', '6:00-7:30 PM', 'Providence ES',  'Open Gym', 0, 'Coach Michael Do'),

  ('og_7g_0910', '7th Girls Select', 'Thu, Sep 10', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Earnest Williams'),
  ('og_7g_0911', '7th Girls Select', 'Fri, Sep 11', '7:30-9:00 PM', 'Providence ES', 'Open Gym', 0, 'Coach Earnest Williams'),
  ('og_7g_0917', '7th Girls Select', 'Thu, Sep 17', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Earnest Williams'),
  ('og_7g_0918', '7th Girls Select', 'Fri, Sep 18', '7:30-9:00 PM', 'Providence ES', 'Open Gym', 0, 'Coach Earnest Williams'),
  ('og_7g_0924', '7th Girls Select', 'Thu, Sep 24', '7:30-9:00 PM', 'KJMS #1',       'Open Gym', 0, 'Coach Earnest Williams'),
  ('og_7g_0925', '7th Girls Select', 'Fri, Sep 25', '7:30-9:00 PM', 'Providence ES', 'Open Gym', 0, 'Coach Earnest Williams')
on conflict (id) do update set
  team = excluded.team, date = excluded.date, "time" = excluded."time",
  gym = excluded.gym, "type" = excluded."type", notes = excluded.notes;

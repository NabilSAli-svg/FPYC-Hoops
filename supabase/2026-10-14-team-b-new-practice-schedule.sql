-- Replace 5th Boys Select B's practice schedule with Nabil Ali's new
-- recurring slots: Monday 7:30-9:00 PM at KJMS #1, Wednesday 7:30-9:00 PM at
-- Providence ES. Replaces the old Tue/Wed KJMS #1 + Fri Providence ES slots
-- from the imported coordinator schedule. Dates that were CLOSED, or
-- already used by another team that week, are skipped.

delete from practices where id like 'sp_5b2_%';

insert into practices (id, team, date, "time", gym, "type", rsvp) values
  ('sp_5b2_m001', '5th Boys Select B', 'Mon, Sep 14', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m002', '5th Boys Select B', 'Mon, Sep 28', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m003', '5th Boys Select B', 'Mon, Oct 12', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m004', '5th Boys Select B', 'Mon, Oct 19', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m005', '5th Boys Select B', 'Mon, Oct 26', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m006', '5th Boys Select B', 'Mon, Nov 2', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m007', '5th Boys Select B', 'Mon, Nov 9', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m008', '5th Boys Select B', 'Mon, Nov 16', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m009', '5th Boys Select B', 'Mon, Nov 23', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m010', '5th Boys Select B', 'Mon, Nov 30', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m011', '5th Boys Select B', 'Mon, Dec 7', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m012', '5th Boys Select B', 'Mon, Dec 14', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m013', '5th Boys Select B', 'Mon, Jan 4', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m014', '5th Boys Select B', 'Mon, Jan 11', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m015', '5th Boys Select B', 'Mon, Jan 25', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m016', '5th Boys Select B', 'Mon, Feb 1', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m017', '5th Boys Select B', 'Mon, Feb 8', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m018', '5th Boys Select B', 'Mon, Feb 22', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_m019', '5th Boys Select B', 'Mon, Mar 1', '7:30-9:00 PM', 'KJMS #1', 'Practice', 0),
  ('sp_5b2_w001', '5th Boys Select B', 'Wed, Sep 9', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w002', '5th Boys Select B', 'Wed, Sep 16', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w003', '5th Boys Select B', 'Wed, Sep 30', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w004', '5th Boys Select B', 'Wed, Oct 7', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w005', '5th Boys Select B', 'Wed, Oct 14', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w006', '5th Boys Select B', 'Wed, Oct 21', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w007', '5th Boys Select B', 'Wed, Oct 28', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w008', '5th Boys Select B', 'Wed, Nov 4', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w009', '5th Boys Select B', 'Wed, Nov 11', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w010', '5th Boys Select B', 'Wed, Nov 18', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w011', '5th Boys Select B', 'Wed, Dec 2', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w012', '5th Boys Select B', 'Wed, Dec 9', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w013', '5th Boys Select B', 'Wed, Dec 16', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w014', '5th Boys Select B', 'Wed, Jan 6', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w015', '5th Boys Select B', 'Wed, Jan 13', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w016', '5th Boys Select B', 'Wed, Jan 20', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w017', '5th Boys Select B', 'Wed, Jan 27', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w018', '5th Boys Select B', 'Wed, Feb 3', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w019', '5th Boys Select B', 'Wed, Feb 10', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w020', '5th Boys Select B', 'Wed, Feb 17', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w021', '5th Boys Select B', 'Wed, Feb 24', '7:30-9:00 PM', 'Providence ES', 'Practice', 0),
  ('sp_5b2_w022', '5th Boys Select B', 'Wed, Mar 3', '7:30-9:00 PM', 'Providence ES', 'Practice', 0)
on conflict (id) do update set
  team = excluded.team, date = excluded.date, "time" = excluded."time",
  gym = excluded.gym, "type" = excluded."type";

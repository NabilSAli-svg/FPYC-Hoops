-- Fall 2026 Skills Clinic — 6 Mondays, Sep 14 - Oct 26 (gym subject to change).
-- Beginner 6-7 PM · Intermediate 7-8 PM · Advanced 8-9 PM. No session Oct 12.
--
-- Providence ES every week except Sep 21, which is at Daniels Run ES —
-- Providence has no permit that Monday.

INSERT INTO practices (id, date, time, gym, type, rsvp, notes, team) VALUES
  ('fc_beg_1', 'Mon, Sep 14', '6:00-7:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Beginner'),
  ('fc_int_1', 'Mon, Sep 14', '7:00-8:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Intermediate'),
  ('fc_adv_1', 'Mon, Sep 14', '8:00-9:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Advanced'),
  ('fc_beg_2', 'Mon, Sep 21', '6:00-7:00 PM', 'Daniels Run ES', 'Clinic', 0, 'At Daniels Run ES this week — no Providence permit Sep 21', 'Training - Beginner'),
  ('fc_int_2', 'Mon, Sep 21', '7:00-8:00 PM', 'Daniels Run ES', 'Clinic', 0, 'At Daniels Run ES this week — no Providence permit Sep 21', 'Training - Intermediate'),
  ('fc_adv_2', 'Mon, Sep 21', '8:00-9:00 PM', 'Daniels Run ES', 'Clinic', 0, 'At Daniels Run ES this week — no Providence permit Sep 21', 'Training - Advanced'),
  ('fc_beg_3', 'Mon, Sep 28', '6:00-7:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Beginner'),
  ('fc_int_3', 'Mon, Sep 28', '7:00-8:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Intermediate'),
  ('fc_adv_3', 'Mon, Sep 28', '8:00-9:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Advanced'),
  ('fc_beg_4', 'Mon, Oct 5', '6:00-7:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Beginner'),
  ('fc_int_4', 'Mon, Oct 5', '7:00-8:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Intermediate'),
  ('fc_adv_4', 'Mon, Oct 5', '8:00-9:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Advanced'),
  ('fc_beg_5', 'Mon, Oct 19', '6:00-7:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Beginner'),
  ('fc_int_5', 'Mon, Oct 19', '7:00-8:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Intermediate'),
  ('fc_adv_5', 'Mon, Oct 19', '8:00-9:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Advanced'),
  ('fc_beg_6', 'Mon, Oct 26', '6:00-7:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Beginner'),
  ('fc_int_6', 'Mon, Oct 26', '7:00-8:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Intermediate'),
  ('fc_adv_6', 'Mon, Oct 26', '8:00-9:00 PM', 'Providence ES', 'Clinic', 0, 'Gym subject to change', 'Training - Advanced')
ON CONFLICT (id) DO UPDATE SET
  date  = EXCLUDED.date,
  time  = EXCLUDED.time,
  gym   = EXCLUDED.gym,
  type  = EXCLUDED.type,
  notes = EXCLUDED.notes,
  team  = EXCLUDED.team;

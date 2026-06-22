-- Summer training announcements — June 22, 2026
-- Remove old placeholder announcements first
DELETE FROM announcements WHERE id IN ('a1', 'a2', 'a3', 'a4');

INSERT INTO announcements (id, type, title, body, target, date, pinned, author) VALUES
(
  'ann-summer-location',
  'urgent',
  'Location change starting June 29 — Fairfax HS',
  'Starting this Sunday June 29, all remaining summer training sessions move to Fairfax High School. This is a change from Providence Recreation Center where we started on June 1.

Beginner: 6:30 – 7:30 PM
Intermediate / Advanced: 7:30 – 8:30 PM

Please make note of the new location and plan accordingly. See you there!',
  'All families',
  'Jun 22',
  true,
  'Commissioner'
),
(
  'ann-summer-schedule',
  'info',
  'Summer training schedule — remaining dates',
  'Here''s a look at what''s left in our summer training program. All sessions are at Fairfax High School.

• Sunday, June 29
• Sunday, July 13
• Sunday, July 20
• Sunday, July 27

Beginner: 6:30 – 7:30 PM · Intermediate / Advanced: 7:30 – 8:30 PM

No session on July 4th or July 6th — enjoy the holiday weekend!',
  'All families',
  'Jun 22',
  false,
  'Commissioner'
),
(
  'ann-summer-whattobring',
  'general',
  'What to bring to training',
  'A few reminders for all summer training sessions:

• Arrive 10 minutes early and ready to work
• Bring a labeled water bottle — there are no breaks to find water
• Wear basketball shoes — no running shoes or sandals
• Players should wear comfortable athletic clothing

Questions? Reach out through the family portal or contact the commissioner.',
  'All families',
  'Jun 22',
  false,
  'Commissioner'
)
ON CONFLICT (id) DO UPDATE SET
  type   = EXCLUDED.type,
  title  = EXCLUDED.title,
  body   = EXCLUDED.body,
  target = EXCLUDED.target,
  date   = EXCLUDED.date,
  pinned = EXCLUDED.pinned,
  author = EXCLUDED.author;

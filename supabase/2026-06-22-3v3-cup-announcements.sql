-- 3v3 Summer Cup announcements — June 22, 2026
INSERT INTO announcements (id, type, title, body, target, date, pinned, author) VALUES
(
  'ann-3v3-schedule',
  'urgent',
  '3v3 Summer Cup is underway — full schedule inside',
  'The FPYC 3v3 Summer Cup is here! Six weeks of competitive 3v3 basketball with a different themed format each week.

Tuesday Nights — Providence Elementary School
Rising 2nd–3rd Boys · 6:30–7:30 PM
Girls Division (2nd–8th) · 7:30–8:30 PM
Dates: June 16, 23, 30 · July 7, 14, 21

Thursday Nights — Providence Elementary School
Rising 4th–5th Boys · 6:30–7:30 PM
Rising 6th–8th Boys · 7:30–9:00 PM
Dates: June 18, 25 · July 2, 9, 16, 23

Please arrive 10–15 minutes before your scheduled start time.',
  'All families',
  'Jun 22',
  true,
  'Commissioner'
),
(
  'ann-3v3-week2',
  'general',
  'This week — King of the Court (Week 2)',
  'This week is King of the Court night! Winners stay on the court and keep playing — the team with the most wins at the end of the night takes the crown.

Tuesday, June 23 — Providence ES
Rising 2nd–3rd Boys · 6:30–7:30 PM
Girls Division · 7:30–8:30 PM

Thursday, June 25 — Providence ES
Rising 4th–5th Boys · 6:30–7:30 PM
Rising 6th–8th Boys · 7:30–9:00 PM

Arrive 10–15 minutes early!',
  'All families',
  'Jun 22',
  false,
  'Commissioner'
),
(
  'ann-3v3-allweeks',
  'info',
  'What to expect — all 6 weeks of Summer Cup',
  'Every week of the Summer Cup has its own theme. Here''s what''s coming:

Week 1 (June 16/18) — Opening Night Tournament ✓
Teams assigned and competed in an opening-night tournament. Opening Night Champions crowned!

Week 2 (June 23/25) — King of the Court ← This week
Winners stay on the court. Most wins takes the crown.

Week 3 (June 30 / July 2) — World Cup Night
Teams represent countries, group play, standings, and a championship match.

Week 4 (July 7/9) — Rivalry Night
Special matchups, challenge games, and high-energy bonus competitions.

Week 5 (July 14/16) — All-Star Challenge
Skills competitions — shooting contests, knockout, team challenges — then back to 3v3.

Week 6 (July 21/23) — Summer Cup Finals 🏆
Championship tournament. Division titles and Summer Cup bragging rights on the line.',
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

-- Family Portal signup announcement — July 3, 2026
INSERT INTO announcements (id, type, title, body, target, date, pinned, author) VALUES
(
  'ann-family-portal',
  'info',
  '📱 New: FPYC Family Portal — Sign Up Today!',
  'The FPYC Family Portal is live! Create your free account to see your child''s game schedule, team roster, live results, and messages from your coach — all in one place.

How to sign up:
1. Go to fpyc-hoops.vercel.app/family
2. Tap "Create an account"
3. Sign up with the same email you used at registration — your child will be linked automatically

Tip: add the portal to your phone''s home screen for quick access.

Questions? Contact your commissioner.',
  'All families',
  'Jul 3',
  true,
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

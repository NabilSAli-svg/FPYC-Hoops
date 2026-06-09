-- ============================================================
-- FPYC Hoops — seed data + schema alignment
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Safe to re-run (upserts on conflict).
-- ============================================================

-- ── Align columns with the app's data shape ─────────────────────────────────

alter table public.players
  add column if not exists number   int,
  add column if not exists name     text,
  add column if not exists grade    text,
  add column if not exists school   text,
  add column if not exists guardian text,
  add column if not exists phone    text,
  add column if not exists position text,
  add column if not exists status   text default 'active',
  add column if not exists waiver   boolean default false,
  add column if not exists program  text,
  add column if not exists division text,
  add column if not exists team     text;

alter table public.games
  add column if not exists team      text,
  add column if not exists opponent  text,
  add column if not exists day       text,
  add column if not exists date      int,
  add column if not exists month     text,
  add column if not exists "time"    text,
  add column if not exists location  text,
  add column if not exists home      boolean default true,
  add column if not exists status    text default 'scheduled',
  add column if not exists us        int,
  add column if not exists them      int,
  add column if not exists quarter   int,
  add column if not exists note      text,
  add column if not exists confirmed int default 0,
  add column if not exists score_pin text,
  add column if not exists weekday   text,
  add column if not exists refs      text,
  add column if not exists countdown int;

alter table public.practices
  add column if not exists team   text,
  add column if not exists date   text,
  add column if not exists "time" text,
  add column if not exists notes  text,
  add column if not exists gym    text,
  add column if not exists "type" text,
  add column if not exists rsvp   int default 0;

alter table public.announcements
  add column if not exists "type" text default 'info',
  add column if not exists title  text,
  add column if not exists body   text,
  add column if not exists target text default 'All families',
  add column if not exists date   text,
  add column if not exists pinned boolean default false,
  add column if not exists author text default 'Commissioner';

-- ── Players ──────────────────────────────────────────────────────────────────

insert into public.players (id, number, name, grade, school, guardian, phone, position, status, waiver, program, division, team) values
('p1',  23, 'Jordan Reeves',   '6th', 'Daniels Run ES', 'A. Reeves',   '(703) 555-0123', 'Guard',   'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p2',   7, 'Maya Chen',       '5th', 'Providence ES',  'L. Chen',     '(703) 555-0144', 'Guard',   'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p3',  14, 'Devon Brooks',    '6th', 'Lanier MS',      'K. Brooks',   '(703) 555-0192', 'Forward', 'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p4',   3, 'Sam Whitaker',    '5th', 'Daniels Run ES', 'P. Whitaker', '(703) 555-0118', 'Forward', 'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p5',  32, 'Tariq Singh',     '6th', 'Providence ES',  'R. Singh',    '(703) 555-0177', 'Center',  'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p6',  11, 'Alex Romero',     '5th', 'Mosby Woods ES', 'M. Romero',   '(703) 555-0166', 'Guard',   'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p7',   4, 'Riley O''Connor', '6th', 'Lanier MS',      'S. O''Connor','(703) 555-0102', 'Guard',   'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p8',  21, 'Imani Walker',    '5th', 'Daniels Run ES', 'B. Walker',   '(703) 555-0151', 'Forward', 'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p9',  15, 'Ethan Park',      '6th', 'Lanier MS',      'H. Park',     '(703) 555-0189', 'Guard',   'pending',  false, 'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p10',  9, 'Noah Patel',      '5th', 'Providence ES',  'V. Patel',    '(703) 555-0173', 'Forward', 'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p11', 25, 'Luca Bianchi',    '6th', 'Mosby Woods ES', 'G. Bianchi',  '(703) 555-0128', 'Center',  'active',   true,  'House League',  'Boys 5–6 House',  'Fairfax Hawks'),
('p12',  8, 'Chloe Adebayo',   '5th', 'Daniels Run ES', 'O. Adebayo',  '(703) 555-0145', 'Guard',   'inactive', true,  'House League',  'Girls 5–6 House', 'Fairfax Wolves'),
('p13',  5, 'Devon Williams',  '7th', 'Lanier MS',      'D. Williams', '(703) 555-0301', 'Forward', 'active',   true,  'Select Travel', 'Boys 7–8 Select', 'Fairfax Eagles'),
('p14', 11, 'Marcus Johnson',  '8th', 'Cooper MS',      'T. Johnson',  '(703) 555-0315', 'Guard',   'active',   true,  'Select Travel', 'Boys 7–8 Select', 'Fairfax Eagles'),
('p15', 12, 'Sofia Hernandez', '5th', 'Daniels Run ES', 'R. Hernandez','(703) 555-0328', 'Guard',   'active',   true,  'House League',  'Girls 5–6 House', 'Fairfax Wolves'),
('p16',  9, 'Casey Walsh',     '5th', 'Providence ES',  'P. Walsh',    '(703) 555-0342', 'Forward', 'active',   true,  'House League',  'Girls 5–6 House', 'Fairfax Wolves'),
('p17',  4, 'Emma Morrison',   '4th', 'Mosby Woods ES', 'T. Morrison', '(703) 555-0356', 'Guard',   'active',   true,  'House League',  'Girls 3–4 House', 'Fairfax Cougars'),
('p18',  8, 'Lily Park',       '3rd', 'Daniels Run ES', 'E. Park',     '(703) 555-0367', 'Forward', 'active',   true,  'House League',  'Girls 3–4 House', 'Fairfax Cougars')
on conflict (id) do nothing;

-- ── Games (scheduled games get a score PIN) ───────────────────────────────────

insert into public.games (id, status, month, date, weekday, day, "time", opponent, location, home, refs, confirmed, note, team, us, them, score_pin) values
('g1',  'scheduled', 'Dec', 7,  'Sat', 'Sat, Dec 7',  '10:00 AM', 'Vienna Storm',      'Robinson Secondary · Gym B', true,  'J. Park, M. Lee', 11, 'Carpool sheet posted — 3 families volunteered to drive.', 'Fairfax Hawks', null, null, '4821'),
('g2',  'scheduled', 'Dec', 14, 'Sat', 'Sat, Dec 14', '11:30 AM', 'Reston Wolves',     'South Lakes HS · Gym A',     false, null, 9,  null, 'Fairfax Hawks', null, null, '7350'),
('g3',  'scheduled', 'Dec', 21, 'Sat', 'Sat, Dec 21', '9:00 AM',  'Burke Lakers',      'Lake Braddock HS · Main',    false, null, 8,  null, 'Fairfax Hawks', null, null, '1964'),
('g4',  'final',     'Nov', 30, 'Sat', 'Sat, Nov 30', '10:00 AM', 'Oakton Patriots',   'Robinson Secondary · Gym B', true,  null, 0,  null, 'Fairfax Hawks', 48, 39, null),
('g5',  'final',     'Nov', 23, 'Sat', 'Sat, Nov 23', '10:00 AM', 'McLean Mustangs',   'Cooper MS · Main',           false, null, 0,  null, 'Fairfax Hawks', 42, 47, null),
('g6',  'final',     'Nov', 16, 'Sat', 'Sat, Nov 16', '11:30 AM', 'Centreville Eagles','Robinson Secondary · Gym B', true,  null, 0,  null, 'Fairfax Hawks', 55, 50, null),
('gw1', 'scheduled', 'Dec', 21, 'Sat', 'Sat, Dec 21', '1:00 PM',  'Vienna Rockets',    'South Lakes HS · Gym A',     true,  null, 0,  null, 'Fairfax Wolves', null, null, '6027'),
('gw2', 'scheduled', 'Jan', 11, 'Sat', 'Sat, Jan 11', '9:00 AM',  'McLean Cardinals',  'Robinson Secondary · Gym B', false, null, 0,  null, 'Fairfax Wolves', null, null, '3198'),
('gw3', 'final',     'Dec', 14, 'Sat', 'Sat, Dec 14', '10:00 AM', 'McLean Cardinals',  'Cooper MS · Main',           true,  null, 0,  null, 'Fairfax Wolves', 38, 35, null),
('gw4', 'final',     'Nov', 30, 'Sat', 'Sat, Nov 30', '11:30 AM', 'Herndon Thunder',   'Robinson Secondary · Gym B', true,  null, 0,  null, 'Fairfax Wolves', 42, 28, null),
('gw5', 'final',     'Nov', 23, 'Sat', 'Sat, Nov 23', '10:00 AM', 'Arlington Stars',   'South Lakes HS · Gym A',     false, null, 0,  null, 'Fairfax Wolves', 31, 44, null),
('gw6', 'final',     'Nov', 16, 'Sat', 'Sat, Nov 16', '1:00 PM',  'Reston Blaze',      'Lake Braddock HS · Main',    false, null, 0,  null, 'Fairfax Wolves', 29, 36, null),
('ge1', 'scheduled', 'Dec', 21, 'Sat', 'Sat, Dec 21', '11:30 AM', 'Chantilly Force',   'Robinson Secondary · Gym B', true,  null, 0,  null, 'Fairfax Eagles', null, null, '8542'),
('ge2', 'scheduled', 'Jan', 11, 'Sat', 'Sat, Jan 11', '1:00 PM',  'McLean Select',     'South Lakes HS · Gym A',     false, null, 0,  null, 'Fairfax Eagles', null, null, '2716'),
('ge3', 'final',     'Dec', 7,  'Sat', 'Sat, Dec 7',  '1:00 PM',  'McLean Select',     'Robinson Secondary · Gym B', true,  null, 0,  null, 'Fairfax Eagles', 62, 48, null),
('ge4', 'final',     'Nov', 30, 'Sat', 'Sat, Nov 30', '10:00 AM', 'Arlington Gold',    'Cooper MS · Main',           false, null, 0,  null, 'Fairfax Eagles', 57, 41, null),
('ge5', 'final',     'Nov', 23, 'Sat', 'Sat, Nov 23', '11:30 AM', 'Reston Select',     'South Lakes HS · Gym A',     true,  null, 0,  null, 'Fairfax Eagles', 54, 39, null),
('ge6', 'final',     'Nov', 16, 'Sat', 'Sat, Nov 16', '10:00 AM', 'Vienna Elite',      'Lake Braddock HS · Main',    false, null, 0,  null, 'Fairfax Eagles', 44, 51, null),
('gc1', 'scheduled', 'Dec', 21, 'Sat', 'Sat, Dec 21', '9:00 AM',  'Vienna Flames',     'Daniels Run ES · Gym',       true,  null, 0,  null, 'Fairfax Cougars', null, null, '5083'),
('gc2', 'scheduled', 'Jan', 11, 'Sat', 'Sat, Jan 11', '10:00 AM', 'Herndon Comets',    'Providence ES · Main',       false, null, 0,  null, 'Fairfax Cougars', null, null, '9460'),
('gc3', 'final',     'Dec', 7,  'Sat', 'Sat, Dec 7',  '9:00 AM',  'Reston Stars',      'Robinson Secondary · Gym B', false, null, 0,  null, 'Fairfax Cougars', 24, 31, null),
('gc4', 'final',     'Nov', 30, 'Sat', 'Sat, Nov 30', '9:00 AM',  'Herndon Comets',    'Daniels Run ES · Gym',       true,  null, 0,  null, 'Fairfax Cougars', 29, 18, null),
('gc5', 'final',     'Nov', 23, 'Sat', 'Sat, Nov 23', '9:00 AM',  'McLean Gems',       'Providence ES · Main',       false, null, 0,  null, 'Fairfax Cougars', 26, 22, null),
('gc6', 'final',     'Nov', 16, 'Sat', 'Sat, Nov 16', '9:00 AM',  'Arlington Aces',    'Lake Braddock HS · Main',    false, null, 0,  null, 'Fairfax Cougars', 17, 35, null)
on conflict (id) do nothing;

-- ── Practices ────────────────────────────────────────────────────────────────

insert into public.practices (id, date, "time", gym, "type", rsvp, notes, team) values
('pr1', 'Mon, Dec 2',  '6:00–7:30 PM', 'Daniels Run ES · Gym',    'Regular',      10, 'Focus: ball handling and pick-and-roll defense', 'Fairfax Hawks'),
('pr2', 'Wed, Dec 4',  '6:00–7:30 PM', 'Providence ES · Main',    'Regular',      11, '',                                  'Fairfax Hawks'),
('pr3', 'Mon, Dec 9',  '6:00–7:30 PM', 'Daniels Run ES · Gym',    'Scrimmage',    12, 'Scrimmage vs. Hawks 7–8 team',      'Fairfax Hawks'),
('pr4', 'Wed, Dec 11', '6:00–7:30 PM', 'Providence ES · Main',    'Regular',       9, '',                                  'Fairfax Hawks'),
('pr5', 'Mon, Dec 16', '6:00–7:30 PM', 'Daniels Run ES · Gym',    'Conditioning',  8, 'Film review first 20 min',          'Fairfax Hawks'),
('pr6', 'Wed, Dec 18', '6:00–7:30 PM', 'TBD',                     'Regular',       0, 'Gym TBD — check back Dec 10',       'Fairfax Hawks'),
('pw1', 'Tue, Dec 3',  '5:00–6:30 PM', 'South Lakes HS · Gym A',  'Regular',       8, '',                                  'Fairfax Wolves'),
('pw2', 'Thu, Dec 5',  '5:00–6:30 PM', 'South Lakes HS · Gym A',  'Regular',       9, '',                                  'Fairfax Wolves'),
('pe1', 'Tue, Dec 3',  '7:00–8:30 PM', 'Lake Braddock HS · Main', 'Regular',      12, 'Film review: McLean Select',        'Fairfax Eagles'),
('pe2', 'Thu, Dec 5',  '7:00–8:30 PM', 'Lake Braddock HS · Main', 'Scrimmage',    14, 'Scrimmage vs Eagles 5–6',           'Fairfax Eagles'),
('pc1', 'Tue, Dec 3',  '4:00–5:00 PM', 'Daniels Run ES · Gym',    'Regular',       7, '',                                  'Fairfax Cougars'),
('pc2', 'Thu, Dec 5',  '4:00–5:00 PM', 'Daniels Run ES · Gym',    'Conditioning',  8, '',                                  'Fairfax Cougars')
on conflict (id) do nothing;

-- ── Announcements ────────────────────────────────────────────────────────────

insert into public.announcements (id, "type", title, body, target, date, pinned, author) values
('a1', 'urgent',  'Late fees begin November 15',          'Registration fees increase by $45 after Nov 15. Please complete registration before this date to avoid the surcharge.', 'All families',    'Nov 1',  true,  'Commissioner'),
('a3', 'info',    'Season opener Dec 7',                  'House League season kicks off Saturday December 7. All teams report to your assigned gyms by 9:30 AM.',                'All families',    'Nov 15', false, 'Commissioner'),
('a2', 'info',    'Walk-in registration — Oct 11',        'Final walk-in registration session this Saturday, Oct 11, 10am–12pm at the FPYC office, 3955 Pickett Rd.',             'All families',    'Oct 9',  false, 'Commissioner'),
('a4', 'general', 'Select Travel tryout results posted',  'Coaches have notified all participants. Check your email for placement details.',                                      'Boys 7–8 Select', 'Sep 12', false, 'Commissioner')
on conflict (id) do nothing;

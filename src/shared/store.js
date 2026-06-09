import { useLocalStorage } from './useLocalStorage.js';

export const TEAM_INFO = {
  name: 'Fairfax Hawks',
  division: 'Boys 5–6 House',
  record: '6–3',
  seed: '2nd',
  coach: 'Coach M. Davis',
  coachEmail: 'coach.davis@fpycsports.org',
};

export const TEAMS_INFO = {
  'Fairfax Hawks':   { id: 'hawks',   name: 'Fairfax Hawks',   division: 'Boys 5–6 House',  coach: 'Coach M. Davis',    color: 'var(--court-navy)' },
  'Fairfax Wolves':  { id: 'wolves',  name: 'Fairfax Wolves',  division: 'Girls 5–6 House', coach: 'Coach S. Thompson', color: '#1F8A5B' },
  'Fairfax Eagles':  { id: 'eagles',  name: 'Fairfax Eagles',  division: 'Boys 7–8 Select', coach: 'Coach J. Williams', color: '#C8102E' },
  'Fairfax Cougars': { id: 'cougars', name: 'Fairfax Cougars', division: 'Girls 3–4 House', coach: 'Coach D. Park',     color: 'var(--basketball-orange)' },
};

export const INITIAL_PLAYERS = [
  { id: 'p1',  number: 23, name: 'Jordan Reeves',   grade: '6th', school: 'Daniels Run ES', guardian: 'A. Reeves',   phone: '(703) 555-0123', position: 'Guard',   status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p2',  number:  7, name: 'Maya Chen',        grade: '5th', school: 'Providence ES',  guardian: 'L. Chen',     phone: '(703) 555-0144', position: 'Guard',   status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p3',  number: 14, name: 'Devon Brooks',     grade: '6th', school: 'Lanier MS',      guardian: 'K. Brooks',   phone: '(703) 555-0192', position: 'Forward', status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p4',  number:  3, name: 'Sam Whitaker',     grade: '5th', school: 'Daniels Run ES', guardian: 'P. Whitaker', phone: '(703) 555-0118', position: 'Forward', status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p5',  number: 32, name: 'Tariq Singh',      grade: '6th', school: 'Providence ES',  guardian: 'R. Singh',    phone: '(703) 555-0177', position: 'Center',  status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p6',  number: 11, name: 'Alex Romero',      grade: '5th', school: 'Mosby Woods ES', guardian: 'M. Romero',   phone: '(703) 555-0166', position: 'Guard',   status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p7',  number:  4, name: "Riley O'Connor",   grade: '6th', school: 'Lanier MS',      guardian: "S. O'Connor", phone: '(703) 555-0102', position: 'Guard',   status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p8',  number: 21, name: 'Imani Walker',     grade: '5th', school: 'Daniels Run ES', guardian: 'B. Walker',   phone: '(703) 555-0151', position: 'Forward', status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p9',  number: 15, name: 'Ethan Park',       grade: '6th', school: 'Lanier MS',      guardian: 'H. Park',     phone: '(703) 555-0189', position: 'Guard',   status: 'pending',  waiver: false, program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p10', number:  9, name: 'Noah Patel',       grade: '5th', school: 'Providence ES',  guardian: 'V. Patel',    phone: '(703) 555-0173', position: 'Forward', status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p11', number: 25, name: 'Luca Bianchi',     grade: '6th', school: 'Mosby Woods ES', guardian: 'G. Bianchi',  phone: '(703) 555-0128', position: 'Center',  status: 'active',   waiver: true,  program: 'House League',  division: 'Boys 5–6 House',  team: 'Fairfax Hawks'   },
  { id: 'p12', number:  8, name: 'Chloe Adebayo',    grade: '5th', school: 'Daniels Run ES', guardian: 'O. Adebayo',  phone: '(703) 555-0145', position: 'Guard',   status: 'inactive', waiver: true,  program: 'House League',  division: 'Girls 5–6 House', team: 'Fairfax Wolves'  },
  { id: 'p13', number:  5, name: 'Devon Williams',  grade: '7th', school: 'Lanier MS',      guardian: 'D. Williams',  phone: '(703) 555-0301', position: 'Forward', status: 'active', waiver: true,  program: 'Select Travel', division: 'Boys 7–8 Select',  team: 'Fairfax Eagles'  },
  { id: 'p14', number: 11, name: 'Marcus Johnson',   grade: '8th', school: 'Cooper MS',      guardian: 'T. Johnson',   phone: '(703) 555-0315', position: 'Guard',   status: 'active', waiver: true,  program: 'Select Travel', division: 'Boys 7–8 Select',  team: 'Fairfax Eagles'  },
  { id: 'p15', number: 12, name: 'Sofia Hernandez',  grade: '5th', school: 'Daniels Run ES', guardian: 'R. Hernandez', phone: '(703) 555-0328', position: 'Guard',   status: 'active', waiver: true,  program: 'House League',  division: 'Girls 5–6 House', team: 'Fairfax Wolves'  },
  { id: 'p16', number:  9, name: 'Casey Walsh',      grade: '5th', school: 'Providence ES',  guardian: 'P. Walsh',     phone: '(703) 555-0342', position: 'Forward', status: 'active', waiver: true,  program: 'House League',  division: 'Girls 5–6 House', team: 'Fairfax Wolves'  },
  { id: 'p17', number:  4, name: 'Emma Morrison',    grade: '4th', school: 'Mosby Woods ES', guardian: 'T. Morrison',  phone: '(703) 555-0356', position: 'Guard',   status: 'active', waiver: true,  program: 'House League',  division: 'Girls 3–4 House', team: 'Fairfax Cougars' },
  { id: 'p18', number:  8, name: 'Lily Park',        grade: '3rd', school: 'Daniels Run ES', guardian: 'E. Park',      phone: '(703) 555-0367', position: 'Forward', status: 'active', waiver: true,  program: 'House League',  division: 'Girls 3–4 House', team: 'Fairfax Cougars' },
];

export const INITIAL_GAMES = [
  { id: 'g1', status: 'scheduled', month: 'Dec', date: 7,  weekday: 'Sat', day: 'Sat, Dec 7',  time: '10:00 AM', opponent: 'Vienna Storm',     location: 'Robinson Secondary · Gym B', home: true,  refs: 'J. Park, M. Lee', countdown: 4, confirmed: 11, note: 'Carpool sheet posted — 3 families volunteered to drive.', team: 'Fairfax Hawks' },
  { id: 'g2', status: 'scheduled', month: 'Dec', date: 14, weekday: 'Sat', day: 'Sat, Dec 14', time: '11:30 AM', opponent: 'Reston Wolves',     location: 'South Lakes HS · Gym A',      home: false, countdown: 11, confirmed: 9, team: 'Fairfax Hawks' },
  { id: 'g3', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '9:00 AM',  opponent: 'Burke Lakers',       location: 'Lake Braddock HS · Main',     home: false, countdown: 18, confirmed: 8, team: 'Fairfax Hawks' },
  { id: 'g4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '10:00 AM', opponent: 'Oakton Patriots',    location: 'Robinson Secondary · Gym B',  home: true,  us: 48, them: 39, team: 'Fairfax Hawks' },
  { id: 'g5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '10:00 AM', opponent: 'McLean Mustangs',    location: 'Cooper MS · Main',            home: false, us: 42, them: 47, team: 'Fairfax Hawks' },
  { id: 'g6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '11:30 AM', opponent: 'Centreville Eagles', location: 'Robinson Secondary · Gym B',  home: true,  us: 55, them: 50, team: 'Fairfax Hawks' },
  // Fairfax Wolves — Girls 5–6 House
  { id: 'gw1', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '1:00 PM',  opponent: 'Vienna Rockets',   location: 'South Lakes HS · Gym A',      home: true,  team: 'Fairfax Wolves',  countdown: 18 },
  { id: 'gw2', status: 'scheduled', month: 'Jan', date: 11, weekday: 'Sat', day: 'Sat, Jan 11', time: '9:00 AM',  opponent: 'McLean Cardinals',  location: 'Robinson Secondary · Gym B',  home: false, team: 'Fairfax Wolves',  countdown: 39 },
  { id: 'gw3', status: 'final',     month: 'Dec', date: 14, weekday: 'Sat', day: 'Sat, Dec 14', time: '10:00 AM', opponent: 'McLean Cardinals',  location: 'Cooper MS · Main',             home: true,  team: 'Fairfax Wolves',  us: 38, them: 35 },
  { id: 'gw4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '11:30 AM', opponent: 'Herndon Thunder',   location: 'Robinson Secondary · Gym B',  home: true,  team: 'Fairfax Wolves',  us: 42, them: 28 },
  { id: 'gw5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '10:00 AM', opponent: 'Arlington Stars',   location: 'South Lakes HS · Gym A',      home: false, team: 'Fairfax Wolves',  us: 31, them: 44 },
  { id: 'gw6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '1:00 PM',  opponent: 'Reston Blaze',      location: 'Lake Braddock HS · Main',     home: false, team: 'Fairfax Wolves',  us: 29, them: 36 },
  // Fairfax Eagles — Boys 7–8 Select
  { id: 'ge1', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '11:30 AM', opponent: 'Chantilly Force',   location: 'Robinson Secondary · Gym B',  home: true,  team: 'Fairfax Eagles',  countdown: 18 },
  { id: 'ge2', status: 'scheduled', month: 'Jan', date: 11, weekday: 'Sat', day: 'Sat, Jan 11', time: '1:00 PM',  opponent: 'McLean Select',     location: 'South Lakes HS · Gym A',      home: false, team: 'Fairfax Eagles',  countdown: 39 },
  { id: 'ge3', status: 'final',     month: 'Dec', date:  7, weekday: 'Sat', day: 'Sat, Dec 7',  time: '1:00 PM',  opponent: 'McLean Select',     location: 'Robinson Secondary · Gym B',  home: true,  team: 'Fairfax Eagles',  us: 62, them: 48 },
  { id: 'ge4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '10:00 AM', opponent: 'Arlington Gold',    location: 'Cooper MS · Main',             home: false, team: 'Fairfax Eagles',  us: 57, them: 41 },
  { id: 'ge5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '11:30 AM', opponent: 'Reston Select',     location: 'South Lakes HS · Gym A',      home: true,  team: 'Fairfax Eagles',  us: 54, them: 39 },
  { id: 'ge6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '10:00 AM', opponent: 'Vienna Elite',      location: 'Lake Braddock HS · Main',     home: false, team: 'Fairfax Eagles',  us: 44, them: 51 },
  // Fairfax Cougars — Girls 3–4 House
  { id: 'gc1', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '9:00 AM',  opponent: 'Vienna Flames',     location: 'Daniels Run ES · Gym',         home: true,  team: 'Fairfax Cougars', countdown: 18 },
  { id: 'gc2', status: 'scheduled', month: 'Jan', date: 11, weekday: 'Sat', day: 'Sat, Jan 11', time: '10:00 AM', opponent: 'Herndon Comets',    location: 'Providence ES · Main',          home: false, team: 'Fairfax Cougars', countdown: 39 },
  { id: 'gc3', status: 'final',     month: 'Dec', date:  7, weekday: 'Sat', day: 'Sat, Dec 7',  time: '9:00 AM',  opponent: 'Reston Stars',      location: 'Robinson Secondary · Gym B',  home: false, team: 'Fairfax Cougars', us: 24, them: 31 },
  { id: 'gc4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '9:00 AM',  opponent: 'Herndon Comets',    location: 'Daniels Run ES · Gym',         home: true,  team: 'Fairfax Cougars', us: 29, them: 18 },
  { id: 'gc5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '9:00 AM',  opponent: 'McLean Gems',       location: 'Providence ES · Main',          home: false, team: 'Fairfax Cougars', us: 26, them: 22 },
  { id: 'gc6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '9:00 AM',  opponent: 'Arlington Aces',    location: 'Lake Braddock HS · Main',     home: false, team: 'Fairfax Cougars', us: 17, them: 35 },
];

export const INITIAL_PRACTICES = [
  { id: 'pr1', date: 'Mon, Dec 2',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Regular',      rsvp: 10, notes: 'Focus: ball handling and pick-and-roll defense', team: 'Fairfax Hawks' },
  { id: 'pr2', date: 'Wed, Dec 4',  time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 11, notes: '', team: 'Fairfax Hawks' },
  { id: 'pr3', date: 'Mon, Dec 9',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Scrimmage',    rsvp: 12, notes: 'Scrimmage vs. Hawks 7–8 team', team: 'Fairfax Hawks' },
  { id: 'pr4', date: 'Wed, Dec 11', time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 9,  notes: '', team: 'Fairfax Hawks' },
  { id: 'pr5', date: 'Mon, Dec 16', time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Conditioning', rsvp: 8,  notes: 'Film review first 20 min', team: 'Fairfax Hawks' },
  { id: 'pr6', date: 'Wed, Dec 18', time: '6:00–7:30 PM', gym: 'TBD',                  type: 'Regular',      rsvp: 0,  notes: 'Gym TBD — check back Dec 10', team: 'Fairfax Hawks' },
  { id: 'pw1', date: 'Tue, Dec 3',  time: '5:00–6:30 PM', gym: 'South Lakes HS · Gym A',  type: 'Regular',      rsvp: 8,  notes: '',                           team: 'Fairfax Wolves'  },
  { id: 'pw2', date: 'Thu, Dec 5',  time: '5:00–6:30 PM', gym: 'South Lakes HS · Gym A',  type: 'Regular',      rsvp: 9,  notes: '',                           team: 'Fairfax Wolves'  },
  { id: 'pe1', date: 'Tue, Dec 3',  time: '7:00–8:30 PM', gym: 'Lake Braddock HS · Main', type: 'Regular',      rsvp: 12, notes: 'Film review: McLean Select', team: 'Fairfax Eagles'  },
  { id: 'pe2', date: 'Thu, Dec 5',  time: '7:00–8:30 PM', gym: 'Lake Braddock HS · Main', type: 'Scrimmage',    rsvp: 14, notes: 'Scrimmage vs Eagles 5–6',   team: 'Fairfax Eagles'  },
  { id: 'pc1', date: 'Tue, Dec 3',  time: '4:00–5:00 PM', gym: 'Daniels Run ES · Gym',    type: 'Regular',      rsvp: 7,  notes: '',                           team: 'Fairfax Cougars' },
  { id: 'pc2', date: 'Thu, Dec 5',  time: '4:00–5:00 PM', gym: 'Daniels Run ES · Gym',    type: 'Conditioning', rsvp: 8,  notes: '',                           team: 'Fairfax Cougars' },
];

export const INITIAL_MESSAGES = [
  {
    id: 'm1', from: 'Coach M. Davis', time: '2h ago', unread: true,
    subject: 'Game day info — Dec 7 vs. Vienna Storm',
    body: `Hawks family!\n\nJust a reminder that this Saturday's game is at Robinson Secondary, Gym B at 10:00 AM. Please arrive by 9:30 for warm-ups.\n\nWe'll be wearing our NAVY jerseys (home game). If you need a carpool, check the sheet in your email — 3 families already volunteered.\n\nLet's go Hawks!\n— Coach Davis`,
  },
  {
    id: 'm2', from: 'Coach M. Davis', time: 'Yesterday', unread: true,
    subject: 'Practice update — Monday @ Daniels Run',
    body: `Quick note: Monday's practice is confirmed at Daniels Run ES, starting at 6:00 PM sharp. We'll be working on our pick-and-roll defense and transition offense.\n\nPlease bring water and sneakers. See you there!\n— Coach Davis`,
  },
  {
    id: 'm3', from: 'FPYC Commissioner', time: '3 days ago', unread: false,
    subject: 'Season standings update',
    body: `The Fairfax Hawks are currently 2nd in the division at 6–3. Top 4 teams advance to playoffs. Keep up the great work!\n\nFull standings are available at fpycsports.org.`,
  },
  {
    id: 'm4', from: 'Coach M. Davis', time: 'Nov 30', unread: false,
    subject: 'Great win today! 48–39',
    body: `Proud of the team today — that was a great defensive effort in the second half. Jordan had a fantastic game.\n\nNext up: Reston Wolves on Dec 14. Enjoy your week!\n— Coach Davis`,
  },
];

export function usePlayers() {
  return useLocalStorage('fpyc-players', INITIAL_PLAYERS);
}

export function useGames() {
  return useLocalStorage('fpyc-games', INITIAL_GAMES);
}

export function usePractices() {
  return useLocalStorage('fpyc-practices', INITIAL_PRACTICES);
}

export function useMessages() {
  return useLocalStorage('fpyc-messages', INITIAL_MESSAGES);
}

// ─── Draft Board ──────────────────────────────────────────────────────────────

export const DRAFT_PLAYERS = [
  { id: 'u1',  number: 1,  name: 'Marcus Williams', grade: '5th', position: 'Guard',   school: 'Daniels Run ES', skill: 4.2 },
  { id: 'u2',  number: 2,  name: 'Sofia Torres',    grade: '5th', position: 'Forward', school: 'Providence ES',  skill: 3.8 },
  { id: 'u3',  number: 3,  name: 'Kai Johnson',     grade: '6th', position: 'Center',  school: 'Lanier MS',      skill: 4.5 },
  { id: 'u4',  number: 4,  name: 'Priya Nair',      grade: '6th', position: 'Guard',   school: 'Mosby Woods ES', skill: 3.5 },
  { id: 'u5',  number: 5,  name: 'Zach Carter',     grade: '5th', position: 'Forward', school: 'Daniels Run ES', skill: 4.0 },
  { id: 'u6',  number: 6,  name: 'Lily Okafor',     grade: '6th', position: 'Guard',   school: 'Providence ES',  skill: 3.2 },
  { id: 'u7',  number: 7,  name: 'Drew Kim',        grade: '5th', position: 'Center',  school: 'Lanier MS',      skill: 3.9 },
  { id: 'u8',  number: 8,  name: 'Aaliyah Brown',   grade: '6th', position: 'Forward', school: 'Daniels Run ES', skill: 4.3 },
  { id: 'u9',  number: 9,  name: 'Finn Murphy',     grade: '5th', position: 'Guard',   school: 'Mosby Woods ES', skill: 3.6 },
  { id: 'u10', number: 10, name: 'Nia Peterson',    grade: '6th', position: 'Center',  school: 'Providence ES',  skill: 4.1 },
  { id: 'u11', number: 11, name: 'Liam Burke',      grade: '5th', position: 'Guard',   school: 'Lanier MS',      skill: 3.4 },
  { id: 'u12', number: 12, name: 'Aria Shah',       grade: '6th', position: 'Forward', school: 'Daniels Run ES', skill: 3.7 },
];

export const DRAFT_TEAMS = [
  { id: 'hawks',   name: 'Hawks',   coach: 'M. Davis',    color: '#0A1F3D' },
  { id: 'wolves',  name: 'Wolves',  coach: 'S. Thompson', color: '#1F8A5B' },
  { id: 'eagles',  name: 'Eagles',  coach: 'J. Williams', color: '#C8102E' },
  { id: 'cougars', name: 'Cougars', coach: 'D. Park',     color: '#E87722' },
];

export function buildSnakeOrder(teamIds, rounds) {
  const order = [];
  for (let r = 0; r < rounds; r++) {
    const round = r % 2 === 0 ? [...teamIds] : [...teamIds].reverse();
    order.push(...round);
  }
  return order;
}

export const INITIAL_DRAFT = {
  status: 'setup',  // 'setup' | 'open' | 'live' | 'completed'
  division: 'Boys 5–6 House',
  season: '2025–26',
  draftOrder: ['hawks', 'wolves', 'eagles', 'cougars'],
  totalRounds: 3,
  currentPick: 0,
  roster: { hawks: [], wolves: [], eagles: [], cougars: [] },
  log: [],
};

export function useDraftState() {
  return useLocalStorage('fpyc-draft-state', INITIAL_DRAFT);
}

// ─── Playoff Bracket ──────────────────────────────────────────────────────────
// 4-team single-elimination. Seeds are indices into the seeds array.

const DIVISION_SEEDS = {
  'Boys 5–6 House': [
    { seed: 1, name: 'Centreville Eagles', record: '8–1', fpyc: false },
    { seed: 2, name: 'Fairfax Hawks',       record: '6–3', fpyc: true  },
    { seed: 3, name: 'Vienna Storm',        record: '5–4', fpyc: false },
    { seed: 4, name: 'Reston Wolves',       record: '5–4', fpyc: false },
  ],
  'Girls 5–6 House': [
    { seed: 1, name: 'Arlington Stars',  record: '7–2', fpyc: false },
    { seed: 2, name: 'McLean Cardinals', record: '6–3', fpyc: false },
    { seed: 3, name: 'Vienna Rockets',   record: '5–4', fpyc: false },
    { seed: 4, name: 'Fairfax Wolves',   record: '4–5', fpyc: true  },
  ],
  'Boys 7–8 Select': [
    { seed: 1, name: 'Fairfax Eagles', record: '8–1', fpyc: true  },
    { seed: 2, name: 'McLean Select',  record: '7–2', fpyc: false },
    { seed: 3, name: 'Reston Select',  record: '5–4', fpyc: false },
    { seed: 4, name: 'Arlington Gold', record: '4–5', fpyc: false },
  ],
  'Girls 3–4 House': [
    { seed: 1, name: 'Arlington Aces',  record: '7–2', fpyc: false },
    { seed: 2, name: 'Reston Stars',    record: '6–3', fpyc: false },
    { seed: 3, name: 'Vienna Flames',   record: '5–4', fpyc: false },
    { seed: 4, name: 'Fairfax Cougars', record: '3–6', fpyc: true  },
  ],
};

function makeBracket(division) {
  return {
    status: 'setup',
    division,
    season: '2025–26',
    seeds: DIVISION_SEEDS[division],
    semis: [
      { id: 's1', top: 0, bottom: 3, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 11', time: '10:00 AM', location: 'Robinson Secondary · Gym B' },
      { id: 's2', top: 1, bottom: 2, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 11', time: '11:30 AM', location: 'Robinson Secondary · Gym B' },
    ],
    final: { top: null, bottom: null, scoreTop: null, scoreBottom: null, winner: null, date: 'Sat, Jan 18', time: '10:00 AM', location: 'Robinson Secondary · Gym A' },
    champion: null,
  };
}

export const INITIAL_BRACKETS = {
  'Boys 5–6 House':  makeBracket('Boys 5–6 House'),
  'Girls 5–6 House': makeBracket('Girls 5–6 House'),
  'Boys 7–8 Select': makeBracket('Boys 7–8 Select'),
  'Girls 3–4 House': makeBracket('Girls 3–4 House'),
};

export function useBrackets() {
  return useLocalStorage('fpyc-brackets', INITIAL_BRACKETS);
}

// Legacy single-bracket shim (Boys 5–6 House) — used by SeasonRecap
export const INITIAL_BRACKET = INITIAL_BRACKETS['Boys 5–6 House'];
export function useBracket() {
  return useLocalStorage('fpyc-bracket', INITIAL_BRACKET);
}

// ─── Standings ────────────────────────────────────────────────────────────────

export const PLAYOFF_SPOTS = 4;

export const INITIAL_STANDINGS = {
  'Boys 5–6 House': [
    { rank: 1, team: 'Centreville Eagles', fpyc: false, w: 8, l: 1, pf: 524, pa: 398, streak: 'W3' },
    { rank: 2, team: 'Fairfax Hawks',       fpyc: true,  w: 6, l: 3, pf: 487, pa: 423, streak: 'W2' },
    { rank: 3, team: 'Vienna Storm',        fpyc: false, w: 5, l: 4, pf: 461, pa: 448, streak: 'L1' },
    { rank: 4, team: 'Reston Wolves',       fpyc: false, w: 5, l: 4, pf: 439, pa: 441, streak: 'W1' },
    { rank: 5, team: 'Oakton Patriots',     fpyc: false, w: 4, l: 5, pf: 412, pa: 459, streak: 'L2' },
    { rank: 6, team: 'McLean Mustangs',     fpyc: false, w: 3, l: 6, pf: 398, pa: 467, streak: 'L3' },
    { rank: 7, team: 'Burke Lakers',        fpyc: false, w: 2, l: 7, pf: 374, pa: 492, streak: 'L4' },
    { rank: 8, team: 'Springfield Bulls',   fpyc: false, w: 1, l: 8, pf: 352, pa: 520, streak: 'L5' },
  ],
  'Girls 5–6 House': [
    { rank: 1, team: 'Arlington Stars',     fpyc: false, w: 7, l: 2, pf: 498, pa: 412, streak: 'W4' },
    { rank: 2, team: 'McLean Cardinals',    fpyc: false, w: 6, l: 3, pf: 471, pa: 438, streak: 'W1' },
    { rank: 3, team: 'Vienna Rockets',      fpyc: false, w: 5, l: 4, pf: 449, pa: 441, streak: 'W2' },
    { rank: 4, team: 'Reston Blaze',        fpyc: false, w: 4, l: 5, pf: 422, pa: 449, streak: 'L1' },
    { rank: 5, team: 'Fairfax Wolves',      fpyc: true,  w: 4, l: 5, pf: 418, pa: 461, streak: 'L2' },
    { rank: 6, team: 'Herndon Thunder',     fpyc: false, w: 2, l: 7, pf: 378, pa: 501, streak: 'L3' },
  ],
  'Boys 7–8 Select': [
    { rank: 1, team: 'Fairfax Eagles',      fpyc: true,  w: 8, l: 1, pf: 612, pa: 489, streak: 'W5' },
    { rank: 2, team: 'McLean Select',       fpyc: false, w: 7, l: 2, pf: 588, pa: 511, streak: 'W2' },
    { rank: 3, team: 'Reston Select',       fpyc: false, w: 5, l: 4, pf: 562, pa: 534, streak: 'L1' },
    { rank: 4, team: 'Arlington Gold',      fpyc: false, w: 4, l: 5, pf: 531, pa: 558, streak: 'W1' },
    { rank: 5, team: 'Vienna Elite',        fpyc: false, w: 3, l: 6, pf: 501, pa: 587, streak: 'L4' },
    { rank: 6, team: 'Chantilly Force',     fpyc: false, w: 1, l: 8, pf: 467, pa: 612, streak: 'L5' },
  ],
  'Girls 3–4 House': [
    { rank: 1, team: 'Arlington Aces',      fpyc: false, w: 7, l: 2, pf: 312, pa: 278, streak: 'W3' },
    { rank: 2, team: 'Reston Stars',        fpyc: false, w: 6, l: 3, pf: 301, pa: 289, streak: 'L1' },
    { rank: 3, team: 'Vienna Flames',       fpyc: false, w: 5, l: 4, pf: 290, pa: 298, streak: 'W2' },
    { rank: 4, team: 'McLean Gems',         fpyc: false, w: 4, l: 5, pf: 276, pa: 309, streak: 'L2' },
    { rank: 5, team: 'Fairfax Cougars',     fpyc: true,  w: 3, l: 6, pf: 261, pa: 324, streak: 'L3' },
    { rank: 6, team: 'Herndon Comets',      fpyc: false, w: 1, l: 8, pf: 234, pa: 342, streak: 'L4' },
  ],
};

export function useStandings() {
  return useLocalStorage('fpyc-standings', INITIAL_STANDINGS);
}

// ─── Player Stats ─────────────────────────────────────────────────────────────
// { [gameId]: { [playerId]: { pts, ast, reb, fls } } }

export const INITIAL_STATS = {
  g4: { // W 48–39 vs Oakton Patriots
    p1: { pts: 14, ast: 3, reb: 5, fls: 2 },
    p2: { pts:  8, ast: 4, reb: 3, fls: 1 },
    p3: { pts:  6, ast: 1, reb: 8, fls: 3 },
    p4: { pts:  4, ast: 2, reb: 6, fls: 2 },
    p5: { pts:  8, ast: 0, reb: 9, fls: 4 },
    p6: { pts:  4, ast: 5, reb: 2, fls: 1 },
    p7: { pts:  2, ast: 2, reb: 3, fls: 2 },
    p8: { pts:  2, ast: 1, reb: 4, fls: 1 },
  },
  g5: { // L 42–47 vs McLean Mustangs
    p1: { pts: 12, ast: 2, reb: 4, fls: 3 },
    p2: { pts:  6, ast: 3, reb: 2, fls: 1 },
    p3: { pts:  8, ast: 1, reb: 7, fls: 4 },
    p4: { pts:  4, ast: 2, reb: 5, fls: 2 },
    p5: { pts:  6, ast: 0, reb: 8, fls: 4 },
    p6: { pts:  3, ast: 4, reb: 2, fls: 1 },
    p7: { pts:  2, ast: 2, reb: 3, fls: 2 },
    p8: { pts:  1, ast: 1, reb: 3, fls: 1 },
  },
  g6: { // W 55–50 vs Centreville Eagles
    p1: { pts: 18, ast: 4, reb:  6, fls: 2 },
    p2: { pts:  8, ast: 5, reb:  3, fls: 1 },
    p3: { pts: 10, ast: 2, reb:  9, fls: 3 },
    p4: { pts:  6, ast: 2, reb:  7, fls: 2 },
    p5: { pts:  5, ast: 0, reb: 10, fls: 4 },
    p6: { pts:  4, ast: 6, reb:  2, fls: 1 },
    p7: { pts:  2, ast: 2, reb:  3, fls: 2 },
    p8: { pts:  2, ast: 1, reb:  5, fls: 1 },
  },
  // Fairfax Wolves — Girls 5–6 House (p12, p15, p16)
  gw3: { // W 38–35 vs McLean Cardinals
    p12: { pts:  9, ast: 2, reb: 4, fls: 1 },
    p15: { pts: 11, ast: 3, reb: 5, fls: 2 },
    p16: { pts:  8, ast: 1, reb: 7, fls: 3 },
  },
  gw4: { // W 42–28 vs Herndon Thunder
    p12: { pts:  6, ast: 3, reb: 3, fls: 2 },
    p15: { pts: 14, ast: 2, reb: 6, fls: 1 },
    p16: { pts: 10, ast: 1, reb: 8, fls: 2 },
  },
  gw5: { // L 31–44 vs Arlington Stars
    p12: { pts:  4, ast: 1, reb: 2, fls: 3 },
    p15: { pts:  9, ast: 4, reb: 4, fls: 2 },
    p16: { pts:  8, ast: 0, reb: 9, fls: 4 },
  },
  gw6: { // L 29–36 vs Reston Blaze
    p12: { pts:  3, ast: 2, reb: 3, fls: 2 },
    p15: { pts:  7, ast: 3, reb: 3, fls: 3 },
    p16: { pts:  6, ast: 1, reb: 6, fls: 2 },
  },
  // Fairfax Eagles — Boys 7–8 Select (p13, p14)
  ge3: { // W 62–48 vs McLean Select
    p13: { pts: 22, ast: 4, reb:  8, fls: 2 },
    p14: { pts: 18, ast: 7, reb:  5, fls: 1 },
  },
  ge4: { // W 57–41 vs Arlington Gold
    p13: { pts: 19, ast: 5, reb: 10, fls: 3 },
    p14: { pts: 16, ast: 6, reb:  4, fls: 2 },
  },
  ge5: { // W 54–39 vs Reston Select
    p13: { pts: 16, ast: 3, reb:  7, fls: 2 },
    p14: { pts: 14, ast: 8, reb:  3, fls: 1 },
  },
  ge6: { // L 44–51 vs Vienna Elite
    p13: { pts: 14, ast: 2, reb:  6, fls: 4 },
    p14: { pts: 12, ast: 5, reb:  4, fls: 3 },
  },
  // Fairfax Cougars — Girls 3–4 House (p17, p18)
  gc3: { // L 24–31 vs Reston Stars
    p17: { pts:  8, ast: 2, reb: 4, fls: 2 },
    p18: { pts:  6, ast: 0, reb: 7, fls: 3 },
  },
  gc4: { // W 29–18 vs Herndon Comets
    p17: { pts: 10, ast: 3, reb: 5, fls: 1 },
    p18: { pts:  9, ast: 1, reb: 8, fls: 2 },
  },
  gc5: { // W 26–22 vs McLean Gems
    p17: { pts:  7, ast: 4, reb: 3, fls: 2 },
    p18: { pts:  8, ast: 0, reb: 9, fls: 1 },
  },
  gc6: { // L 17–35 vs Arlington Aces
    p17: { pts:  4, ast: 1, reb: 3, fls: 3 },
    p18: { pts:  2, ast: 0, reb: 5, fls: 2 },
  },
};

export function useStats() {
  return useLocalStorage('fpyc-stats', INITIAL_STATS);
}

// ─── Announcements ────────────────────────────────────────────────────────────

export const INITIAL_ANNOUNCEMENTS = [
  { id: 'a1', type: 'urgent', title: 'Late fees begin November 15', body: 'Registration fees increase by $45 after Nov 15. Please complete registration before this date to avoid the surcharge.', target: 'All families', date: 'Nov 1',  pinned: true,  author: 'Commissioner' },
  { id: 'a3', type: 'info',   title: 'Season opener Dec 7',          body: 'House League season kicks off Saturday December 7. All teams report to your assigned gyms by 9:30 AM.',               target: 'All families', date: 'Nov 15', pinned: false, author: 'Commissioner' },
  { id: 'a2', type: 'info',   title: 'Walk-in registration — Oct 11', body: 'Final walk-in registration session this Saturday, Oct 11, 10am–12pm at the FPYC office, 3955 Pickett Rd.',          target: 'All families', date: 'Oct 9',  pinned: false, author: 'Commissioner' },
  { id: 'a4', type: 'general', title: 'Select Travel tryout results posted', body: 'Coaches have notified all participants. Check your email for placement details.',                            target: 'Boys 7–8 Select', date: 'Sep 12', pinned: false, author: 'Commissioner' },
];

export function useAnnouncements() {
  return useLocalStorage('fpyc-announcements', INITIAL_ANNOUNCEMENTS);
}

// ─── Official Assignments ─────────────────────────────────────────────────────
// Shape: { [gameId]: { refs: string[], status: 'confirmed'|'partial'|'unassigned' } }

export const INITIAL_OFFICIAL_ASSIGNMENTS = {};

export function useOfficialAssignments() {
  return useLocalStorage('fpyc-official-assignments', INITIAL_OFFICIAL_ASSIGNMENTS);
}

// Derive family-facing event list from admin games + practices
export function deriveEvents(games, practices) {
  const gameEvents = games.map(g => ({
    id: g.id,
    type: 'game',
    date: g.day,
    time: g.time,
    label: g.home ? `vs. ${g.opponent}` : `@ ${g.opponent}`,
    opponent: g.opponent,
    location: g.location,
    home: g.home,
    status: g.status === 'final' ? 'final' : g.status === 'live' ? 'live' : 'upcoming',
    us: g.us,
    them: g.them,
    quarter: g.quarter,
    note: g.note || '',
    confirmed: g.confirmed || 0,
    month: g.month,
    dayNum: g.date,
    team: g.team || 'Fairfax Hawks',
  }));

  const practiceEvents = practices.map(p => ({
    id: p.id,
    type: 'practice',
    date: p.date,
    time: p.time.split('–')[0].trim(),
    timeRange: p.time,
    label: p.type === 'Scrimmage' ? 'Scrimmage' : 'Practice',
    practiceType: p.type,
    location: p.gym,
    home: true,
    status: 'upcoming',
    notes: p.notes || '',
    team: p.team || 'Fairfax Hawks',
  }));

  return [...gameEvents, ...practiceEvents];
}

// ─── Registrations ───────────────────────────────────────────────────────────

export const INITIAL_REGISTRATIONS = [
  { id: 'r1',  parent: 'A. Reeves',    player: 'Jordan Reeves',   grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 3',  paid: true,  waiver: true,  status: 'approved', playerId: 'p1' },
  { id: 'r2',  parent: 'L. Chen',      player: 'Maya Chen',       grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 3',  paid: true,  waiver: true,  status: 'approved', playerId: 'p2' },
  { id: 'r3',  parent: 'K. Brooks',    player: 'Devon Brooks',    grade: '6th', division: 'Boys 7–8 Select', date: 'Oct 5',  paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r4',  parent: 'P. Whitaker',  player: 'Sam Whitaker',    grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 7',  paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r5',  parent: 'R. Singh',     player: 'Tariq Singh',     grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 8',  paid: true,  waiver: false, status: 'approved', playerId: null },
  { id: 'r6',  parent: 'M. Romero',    player: 'Alex Romero',     grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 9',  paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r7',  parent: 'G. Bianchi',   player: 'Luca Bianchi',    grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 10', paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r8',  parent: 'H. Park',      player: 'Ethan Park',      grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 12', paid: false, waiver: false, status: 'pending',  playerId: null },
  { id: 'r9',  parent: 'O. Adeyemi',   player: 'Tolu Adeyemi',    grade: '5th', division: 'Boys 5–6 House',  date: 'Nov 28', paid: false, waiver: false, status: 'pending',  playerId: null },
  { id: 'r10', parent: 'P. Walsh',     player: 'Casey Walsh',     grade: '5th', division: 'Girls 5–6 House', date: 'Nov 27', paid: true,  waiver: false, status: 'pending',  playerId: null },
  { id: 'r11', parent: 'R. Hernandez', player: 'Sofia Hernandez', grade: '4th', division: 'Girls 3–4 House', date: 'Nov 24', paid: false, waiver: false, status: 'pending',  playerId: null },
  { id: 'r12', parent: 'T. Morrison',  player: 'Jake Morrison',   grade: '5th', division: 'Boys 5–6 House',  date: 'Nov 22', paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r13', parent: 'D. Okafor',    player: 'Imani Okafor',    grade: '7th', division: 'Boys 7–8 Select', date: 'Nov 20', paid: true,  waiver: true,  status: 'waitlisted', playerId: null },
  { id: 'r14', parent: 'V. Patel',     player: 'Noah Patel',      grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 15', paid: true,  waiver: true,  status: 'approved', playerId: null },
  { id: 'r15', parent: 'B. Walker',    player: 'Imani Walker',    grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 11', paid: true,  waiver: false, status: 'approved', playerId: null },
];

export function useRegistrations() {
  return useLocalStorage('fpyc-registrations', INITIAL_REGISTRATIONS);
}

// ─── RSVPs ────────────────────────────────────────────────────────────────────
// { [gameId]: { [familyKey]: 'yes' | 'no' } }
// e.g. { g1: { reeves: 'yes', chen: 'no' } }

export function useRsvps() {
  return useLocalStorage('fpyc-rsvps', {});
}

export function countRsvps(rsvps, gameId) {
  const game = rsvps[gameId] || {};
  return Object.values(game).filter(v => v === 'yes').length;
}

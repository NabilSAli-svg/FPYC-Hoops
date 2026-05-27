import { useLocalStorage } from './useLocalStorage.js';

export const TEAM_INFO = {
  name: 'Fairfax Hawks',
  division: 'Boys 5–6 House',
  record: '6–3',
  seed: '2nd',
  coach: 'Coach M. Davis',
  coachEmail: 'coach.davis@fpycsports.org',
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
];

export const INITIAL_GAMES = [
  { id: 'g1', status: 'scheduled', month: 'Dec', date: 7,  weekday: 'Sat', day: 'Sat, Dec 7',  time: '10:00 AM', opponent: 'Vienna Storm',     location: 'Robinson Secondary · Gym B', home: true,  refs: 'J. Park, M. Lee', countdown: 4, confirmed: 11, note: 'Carpool sheet posted — 3 families volunteered to drive.' },
  { id: 'g2', status: 'scheduled', month: 'Dec', date: 14, weekday: 'Sat', day: 'Sat, Dec 14', time: '11:30 AM', opponent: 'Reston Wolves',     location: 'South Lakes HS · Gym A',      home: false, countdown: 11, confirmed: 9 },
  { id: 'g3', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '9:00 AM',  opponent: 'Burke Lakers',       location: 'Lake Braddock HS · Main',     home: false, countdown: 18, confirmed: 8 },
  { id: 'g4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '10:00 AM', opponent: 'Oakton Patriots',    location: 'Robinson Secondary · Gym B',  home: true,  us: 48, them: 39 },
  { id: 'g5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '10:00 AM', opponent: 'McLean Mustangs',    location: 'Cooper MS · Main',            home: false, us: 42, them: 47 },
  { id: 'g6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '11:30 AM', opponent: 'Centreville Eagles', location: 'Robinson Secondary · Gym B',  home: true,  us: 55, them: 50 },
];

export const INITIAL_PRACTICES = [
  { id: 'pr1', date: 'Mon, Dec 2',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Regular',      rsvp: 10, notes: 'Focus: ball handling and pick-and-roll defense' },
  { id: 'pr2', date: 'Wed, Dec 4',  time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 11, notes: '' },
  { id: 'pr3', date: 'Mon, Dec 9',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Scrimmage',    rsvp: 12, notes: 'Scrimmage vs. Hawks 7–8 team' },
  { id: 'pr4', date: 'Wed, Dec 11', time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 9,  notes: '' },
  { id: 'pr5', date: 'Mon, Dec 16', time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Conditioning', rsvp: 8,  notes: 'Film review first 20 min' },
  { id: 'pr6', date: 'Wed, Dec 18', time: '6:00–7:30 PM', gym: 'TBD',                  type: 'Regular',      rsvp: 0,  notes: 'Gym TBD — check back Dec 10' },
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
  }));

  return [...gameEvents, ...practiceEvents];
}

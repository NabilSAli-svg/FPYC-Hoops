export const FAMILIES = {
  reeves: {
    parent: 'A. Reeves',
    firstName: 'Alex',
    email: 'a.reeves@email.com',
    child: { name: 'Jordan Reeves', number: 23, position: 'Guard', grade: '6th', status: 'active' },
  },
  chen: {
    parent: 'L. Chen',
    firstName: 'Lin',
    email: 'l.chen@email.com',
    child: { name: 'Maya Chen', number: 7, position: 'Guard', grade: '5th', status: 'active' },
  },
};

export const TEAM = { name: 'Fairfax Hawks', division: 'Boys 5–6 House', record: '6–3', seed: '2nd' };

export const PLAYERS = [
  { number: 23, name: 'Jordan Reeves', position: 'Guard',   grade: '6th' },
  { number:  7, name: 'Maya Chen',     position: 'Guard',   grade: '5th' },
  { number: 14, name: 'Devon Brooks',  position: 'Forward', grade: '6th' },
  { number:  3, name: 'Sam Whitaker',  position: 'Forward', grade: '5th' },
  { number: 32, name: 'Tariq Singh',   position: 'Center',  grade: '6th' },
  { number: 11, name: 'Alex Romero',   position: 'Guard',   grade: '5th' },
  { number:  4, name: "Riley O'Connor",position: 'Guard',   grade: '6th' },
  { number: 21, name: 'Imani Walker',  position: 'Forward', grade: '5th' },
  { number:  9, name: 'Noah Patel',    position: 'Forward', grade: '5th' },
  { number: 25, name: 'Luca Bianchi',  position: 'Center',  grade: '6th' },
];

export const EVENTS = [
  { id: 'e1', type: 'game',     date: 'Sat, Dec 7',  time: '10:00 AM', label: 'vs. Vienna Storm',      location: 'Robinson Secondary · Gym B', home: true,  status: 'upcoming', rsvp: 'yes' },
  { id: 'e2', type: 'practice', date: 'Mon, Dec 2',  time: '6:00 PM',  label: 'Practice',              location: 'Daniels Run ES · Gym',       home: true,  status: 'upcoming', rsvp: 'yes' },
  { id: 'e3', type: 'practice', date: 'Wed, Dec 4',  time: '6:00 PM',  label: 'Practice',              location: 'Providence ES · Main',        home: true,  status: 'upcoming', rsvp: null  },
  { id: 'e4', type: 'game',     date: 'Sat, Dec 14', time: '11:30 AM', label: '@ Reston Wolves',       location: 'South Lakes HS · Gym A',     home: false, status: 'upcoming', rsvp: null  },
  { id: 'e5', type: 'practice', date: 'Mon, Dec 9',  time: '6:00 PM',  label: 'Scrimmage',             location: 'Daniels Run ES · Gym',       home: true,  status: 'upcoming', rsvp: null  },
  { id: 'e6', type: 'game',     date: 'Sat, Dec 21', time: '9:00 AM',  label: '@ Burke Lakers',        location: 'Lake Braddock HS · Main',    home: false, status: 'upcoming', rsvp: null  },
  { id: 'e7', type: 'game',     date: 'Sat, Nov 30', time: '10:00 AM', label: 'vs. Oakton Patriots',   location: 'Robinson Secondary · Gym B', home: true,  status: 'final',    us: 48, them: 39 },
  { id: 'e8', type: 'game',     date: 'Sat, Nov 23', time: '10:00 AM', label: 'vs. McLean Mustangs',   location: 'Cooper MS · Main',           home: false, status: 'final',    us: 42, them: 47 },
  { id: 'e9', type: 'game',     date: 'Sat, Nov 16', time: '11:30 AM', label: 'vs. Centreville Eagles',location: 'Robinson Secondary · Gym B', home: true,  status: 'final',    us: 55, them: 50 },
];

export const MESSAGES = [
  {
    id: 'm1', from: 'Coach M. Davis', time: '2h ago', unread: true,
    subject: 'Game day info — Dec 7 vs. Vienna Storm',
    body: `Hawks family!\n\nJust a reminder that this Saturday's game is at Robinson Secondary, Gym B at 10:00 AM. Please arrive by 9:30 for warm-ups.\n\nWe'll be wearing our NAVY jerseys (home game). If you need a carpool, check the sheet in your email — 3 families already volunteered.\n\nLet's go Hawks! 🏀\n— Coach Davis`,
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

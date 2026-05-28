export const GYMS = [
  { id: 'rob-b',    name: 'Robinson Secondary · Gym B',  address: '5035 Robinson Rd, Fairfax, VA', capacity: 250, notes: 'Primary home gym' },
  { id: 'rob-a',    name: 'Robinson Secondary · Gym A',  address: '5035 Robinson Rd, Fairfax, VA', capacity: 300, notes: 'Finals / large events' },
  { id: 'daniels',  name: 'Daniels Run ES · Gym',       address: '4014 Olley Ln, Fairfax, VA',    capacity: 150, notes: 'Mon/Wed practices' },
  { id: 'prov',     name: 'Providence ES · Main',        address: '3616 Grand Masters Ln, Fairfax, VA', capacity: 150, notes: 'Wed practices' },
  { id: 'mosby',    name: 'Mosby Woods ES · Gym',        address: '9209 Forest Run Dr, Fairfax, VA', capacity: 150, notes: '' },
  { id: 'lanier',   name: 'Lanier MS · Gym',             address: '4301 Lorcom Ln, Arlington, VA', capacity: 200, notes: '' },
  { id: 'southlakes', name: 'South Lakes HS · Gym A',   address: '11400 South Lakes Dr, Reston, VA', capacity: 350, notes: 'Away games' },
  { id: 'cooper',   name: 'Cooper MS · Main',            address: '977 Balls Hill Rd, McLean, VA', capacity: 200, notes: 'Away games' },
  { id: 'lakebraddock', name: 'Lake Braddock HS · Main', address: '9270 Burke Lake Rd, Burke, VA', capacity: 350, notes: 'Away games' },
];

export function gymById(id) {
  return GYMS.find(g => g.id === id) || null;
}

export function gymByName(name) {
  return GYMS.find(g => g.name === name) || null;
}

// Check if two time ranges on the same day conflict.
// Simple check: same gym, same day string.
export function findGymConflicts(games, practices) {
  const slots = [];
  games.filter(g => g.status !== 'cancelled').forEach(g => {
    if (g.location) slots.push({ type: 'game', id: g.id, day: g.day, location: g.location, time: g.time, label: `vs. ${g.opponent}` });
  });
  practices.filter(p => p.gym && p.gym !== 'TBD').forEach(p => {
    slots.push({ type: 'practice', id: p.id, day: p.date, location: p.gym, time: p.time, label: p.type });
  });

  const conflicts = [];
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slots[i].day === slots[j].day && slots[i].location === slots[j].location) {
        conflicts.push([slots[i], slots[j]]);
      }
    }
  }
  return conflicts;
}

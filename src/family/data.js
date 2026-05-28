export const FAMILIES = {
  reeves: {
    parent: 'A. Reeves',
    firstName: 'Alex',
    email: 'a.reeves@email.com',
    child: { name: 'Jordan Reeves', number: 23, position: 'Guard', grade: '6th', status: 'active', team: 'Fairfax Hawks' },
  },
  chen: {
    parent: 'L. Chen',
    firstName: 'Lin',
    email: 'l.chen@email.com',
    child: { name: 'Maya Chen', number: 7, position: 'Guard', grade: '5th', status: 'active', team: 'Fairfax Hawks' },
  },
  williams: {
    parent: 'D. Williams',
    firstName: 'Dana',
    email: 'd.williams@email.com',
    child: { name: 'Devon Williams', number: 5, position: 'Forward', grade: '7th', status: 'active', team: 'Fairfax Eagles' },
  },
  hernandez: {
    parent: 'R. Hernandez',
    firstName: 'Rosa',
    email: 'r.hernandez@email.com',
    child: { name: 'Sofia Hernandez', number: 12, position: 'Guard', grade: '5th', status: 'active', team: 'Fairfax Wolves' },
  },
  morrison: {
    parent: 'T. Morrison',
    firstName: 'Tanya',
    email: 't.morrison@email.com',
    child: { name: 'Emma Morrison', number: 4, position: 'Guard', grade: '4th', status: 'active', team: 'Fairfax Cougars' },
  },
};

export const PAYMENTS = [
  {
    id: 'pay1',
    desc: 'House League registration — 2025–26',
    date: 'Oct 3, 2025',
    amount: 195.00,
    status: 'paid',
    method: 'Visa ****4321',
    receipt: 'FPYC-A7K2M9',
  },
  {
    id: 'pay2',
    desc: 'Sibling discount (10%)',
    date: 'Oct 3, 2025',
    amount: -19.50,
    status: 'applied',
    method: null,
    receipt: null,
  },
];

export const BALANCE = { due: 0, paid: 175.50, nextDue: null };

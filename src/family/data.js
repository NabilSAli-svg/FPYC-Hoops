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

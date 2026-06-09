import { useLocalStorage } from './useLocalStorage.js';
import { useSupabaseTable, useSupabaseAssignments } from './useSupabaseTable.js';

export const TEAM_INFO = {
  name: 'Rising 2nd-3rd Boys',
  division: '3v3 Summer Cup',
  record: '0–0',
  seed: '—',
  coach: 'Coach',
  coachEmail: '',
};

export const TEAMS_INFO = {
  'Rising 2nd-3rd Boys': { id: '23boys', name: 'Rising 2nd-3rd Boys', division: '3v3 Summer Cup', coach: 'Coach', color: 'var(--court-navy)' },
  'Girls 3v3 (2nd-8th)': { id: 'girls',  name: 'Girls 3v3 (2nd-8th)', division: '3v3 Summer Cup', coach: 'Coach', color: '#1F8A5B' },
  'Rising 4th-5th Boys': { id: '45boys', name: 'Rising 4th-5th Boys', division: '3v3 Summer Cup', coach: 'Coach', color: '#C8102E' },
  'Rising 6th-8th Boys': { id: '68boys', name: 'Rising 6th-8th Boys', division: '3v3 Summer Cup', coach: 'Coach', color: 'var(--basketball-orange)' },
};

export const INITIAL_PLAYERS = [
  { id: 'p1', number: null, name: "Ishaaq Adam", grade: "2nd & 3rd", school: '', guardian: "adamfamily0312@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p2', number: null, name: "Ismaeel Adam", grade: "4th & 5th", school: '', guardian: "adamfamily0312@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p3', number: null, name: "Jenny Ahn", grade: "4th & 5th", school: '', guardian: "hello323235@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p4', number: null, name: "Hamza Ali", grade: "4th & 5th", school: '', guardian: "syednabilali@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p5', number: null, name: "Neal Beesam", grade: "4th & 5th", school: '', guardian: "ashley@beesam.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p6', number: null, name: "Michael Blessing", grade: "2nd & 3rd", school: '', guardian: "stephanie.wyckoff@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p7', number: null, name: "Derrick Booker jr", grade: "6th-8th", school: '', guardian: "devita_shorter@msn.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p8', number: null, name: "Alexander Chang", grade: "6th-8th", school: '', guardian: "dcnycjjpkr@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p9', number: null, name: "Misdy Contreras Martínez", grade: "2nd & 3rd", school: '', guardian: "karrrymartines@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p10', number: null, name: "Abby Cook", grade: "6th-8th", school: '', guardian: "dhciii@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p11', number: null, name: "Alexsandra Cossio", grade: "6th-8th", school: '', guardian: "alexsandrocossio@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p12', number: null, name: "kirubel daniel", grade: "6th-8th", school: '', guardian: "dagnu44@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p13', number: null, name: "Anthony Del Fiore", grade: "4th & 5th", school: '', guardian: "jimdelf@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p14', number: null, name: "Cole Denton", grade: "6th-8th", school: '', guardian: "erinldenton@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p15', number: null, name: "Mason Drummey", grade: "4th & 5th", school: '', guardian: "saraabawi@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p16', number: null, name: "Holden Duble", grade: "6th-8th", school: '', guardian: "martin.duble@verizon.net", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p17', number: null, name: "Gio Flores", grade: "6th-8th", school: '', guardian: "jonrobflo@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p18', number: null, name: "Nate Fuge", grade: "4th & 5th", school: '', guardian: "davidfuge@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p19', number: null, name: "Joshua Garvin", grade: "2nd & 3rd", school: '', guardian: "tarhealrn08@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p20', number: null, name: "Faris Hamid", grade: "2nd & 3rd", school: '', guardian: "hamid.ahmedm@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p21', number: null, name: "Alex Handy", grade: "6th-8th", school: '', guardian: "wangl01@hotmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p22', number: null, name: "Mira Hardwick", grade: "6th-8th", school: '', guardian: "sw0000sh11@hotmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p23', number: null, name: "Emerson Harvey", grade: "6th-8th", school: '', guardian: "jeniharvey9@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p24', number: null, name: "Ryan Harvey", grade: "4th & 5th", school: '', guardian: "jeniharvey9@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p25', number: null, name: "Campbell Hastings", grade: "2nd & 3rd", school: '', guardian: "biohokie08@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p26', number: null, name: "Declan Holmes", grade: "6th-8th", school: '', guardian: "slimkim35@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p27', number: null, name: "Nathan Jones", grade: "6th-8th", school: '', guardian: "branjithan@yahoo.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p28', number: null, name: "Norah Kamra- Rajpal", grade: "2nd & 3rd", school: '', guardian: "h.analyst777@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p29', number: null, name: "Ethan Kim", grade: "2nd & 3rd", school: '', guardian: "bambina833@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p30', number: null, name: "Arjun Kintgen", grade: "6th-8th", school: '', guardian: "ekintgen@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p31', number: null, name: "Kabir Kintgen", grade: "4th & 5th", school: '', guardian: "ekintgen@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p32', number: null, name: "Mishel Kletska", grade: "6th-8th", school: '', guardian: "rudolfina0908@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p33', number: null, name: "BRUCE LEE", grade: "6th-8th", school: '', guardian: "blee5451@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p34', number: null, name: "Kenson Lee", grade: "6th-8th", school: '', guardian: "maziejae@aol.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p35', number: null, name: "Abu Bakr Lodin", grade: "4th & 5th", school: '', guardian: "shukriahd@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p36', number: null, name: "Rhys Mancil", grade: "6th-8th", school: '', guardian: "mancl.amy@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p37', number: null, name: "Avery McCray", grade: "4th & 5th", school: '', guardian: "rj.mccray@irs.gov", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p38', number: null, name: "Levi McCray", grade: "2nd & 3rd", school: '', guardian: "rj.mccray@irs.gov", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p39', number: null, name: "Aditya Menon", grade: "6th-8th", school: '', guardian: "binds29@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p40', number: null, name: "Isaac Nunes", grade: "4th & 5th", school: '', guardian: "nunes8787@hotmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p41', number: null, name: "Aiden Oh", grade: "2nd & 3rd", school: '', guardian: "mike_oh1981@hotmail.co.kr", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p42', number: null, name: "Owen Pham", grade: "6th-8th", school: '', guardian: "phamharvey@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p43', number: null, name: "Oscar Potter", grade: "2nd & 3rd", school: '', guardian: "liciaroberts@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p44', number: null, name: "Quentin potter", grade: "6th-8th", school: '', guardian: "liciaroberts@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p45', number: null, name: "Adrian Prado", grade: "6th-8th", school: '', guardian: "twojagerbombs@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p46', number: null, name: "Benjamin Quinn", grade: "4th & 5th", school: '', guardian: "james.john.quinn@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p47', number: null, name: "Alonso Rivera", grade: "6th-8th", school: '', guardian: "twojagerbombs@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p48', number: null, name: "Antonio Rivera", grade: "2nd & 3rd", school: '', guardian: "twojagerbombs@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p49', number: null, name: "Lucas Saal", grade: "4th & 5th", school: '', guardian: "b_saal@yahoo.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p50', number: null, name: "Lucas RR Seal", grade: "2nd & 3rd", school: '', guardian: "seals_home@yahoo.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p51', number: null, name: "Thomas RR Seal", grade: "2nd & 3rd", school: '', guardian: "seals_home@yahoo.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p52', number: null, name: "Drea Seaton", grade: "6th-8th", school: '', guardian: "deenarusso@mac.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p53', number: null, name: "Rylen Shajib", grade: "2nd & 3rd", school: '', guardian: "milani.shajib@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p54', number: null, name: "Jaxson Shajib", grade: "2nd & 3rd", school: '', guardian: "milani.shajib@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p55', number: null, name: "Hannah Swiercz", grade: "2nd & 3rd", school: '', guardian: "kelly.cage@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p56', number: null, name: "Philip Tran", grade: "4th & 5th", school: '', guardian: "marwei.tam@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p57', number: null, name: "Chase Vadakedathu", grade: "6th-8th", school: '', guardian: "linandcass@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p58', number: null, name: "Sarah Vadakedathu", grade: "6th-8th", school: '', guardian: "linandcass@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p59', number: null, name: "Kyrie Varela", grade: "4th & 5th", school: '', guardian: "zelda.varela@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: '3v3 Summer Cup', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
];

export const INITIAL_GAMES = [
  { id: 'g231', status: 'scheduled', month: 'Jun', date: 16, weekday: 'Tue', day: 'Tue, Jun 16', time: '6:30 PM - 7:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g232', status: 'scheduled', month: 'Jun', date: 23, weekday: 'Tue', day: 'Tue, Jun 23', time: '6:30 PM - 7:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g233', status: 'scheduled', month: 'Jun', date: 30, weekday: 'Tue', day: 'Tue, Jun 30', time: '6:30 PM - 7:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g234', status: 'scheduled', month: 'Jul', date: 7, weekday: 'Tue', day: 'Tue, Jul 7', time: '6:30 PM - 7:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g235', status: 'scheduled', month: 'Jul', date: 14, weekday: 'Tue', day: 'Tue, Jul 14', time: '6:30 PM - 7:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'g236', status: 'scheduled', month: 'Jul', date: 21, weekday: 'Tue', day: 'Tue, Jul 21', time: '6:30 PM - 7:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 2nd-3rd Boys' },
  { id: 'gg1', status: 'scheduled', month: 'Jun', date: 16, weekday: 'Tue', day: 'Tue, Jun 16', time: '7:30 PM - 8:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg2', status: 'scheduled', month: 'Jun', date: 23, weekday: 'Tue', day: 'Tue, Jun 23', time: '7:30 PM - 8:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg3', status: 'scheduled', month: 'Jun', date: 30, weekday: 'Tue', day: 'Tue, Jun 30', time: '7:30 PM - 8:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg4', status: 'scheduled', month: 'Jul', date: 7, weekday: 'Tue', day: 'Tue, Jul 7', time: '7:30 PM - 8:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg5', status: 'scheduled', month: 'Jul', date: 14, weekday: 'Tue', day: 'Tue, Jul 14', time: '7:30 PM - 8:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'gg6', status: 'scheduled', month: 'Jul', date: 21, weekday: 'Tue', day: 'Tue, Jul 21', time: '7:30 PM - 8:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Girls 3v3 (2nd-8th)' },
  { id: 'g451', status: 'scheduled', month: 'Jun', date: 18, weekday: 'Thu', day: 'Thu, Jun 18', time: '6:30 PM - 7:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g452', status: 'scheduled', month: 'Jun', date: 25, weekday: 'Thu', day: 'Thu, Jun 25', time: '6:30 PM - 7:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g453', status: 'scheduled', month: 'Jul', date: 2, weekday: 'Thu', day: 'Thu, Jul 2', time: '6:30 PM - 7:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g454', status: 'scheduled', month: 'Jul', date: 9, weekday: 'Thu', day: 'Thu, Jul 9', time: '6:30 PM - 7:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g455', status: 'scheduled', month: 'Jul', date: 16, weekday: 'Thu', day: 'Thu, Jul 16', time: '6:30 PM - 7:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g456', status: 'scheduled', month: 'Jul', date: 23, weekday: 'Thu', day: 'Thu, Jul 23', time: '6:30 PM - 7:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 4th-5th Boys' },
  { id: 'g681', status: 'scheduled', month: 'Jun', date: 18, weekday: 'Thu', day: 'Thu, Jun 18', time: '7:30 PM - 8:30 PM', opponent: 'Week 1: Opening Night Tournament', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g682', status: 'scheduled', month: 'Jun', date: 25, weekday: 'Thu', day: 'Thu, Jun 25', time: '7:30 PM - 8:30 PM', opponent: 'Week 2: King of the Court', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g683', status: 'scheduled', month: 'Jul', date: 2, weekday: 'Thu', day: 'Thu, Jul 2', time: '7:30 PM - 8:30 PM', opponent: 'Week 3: World Cup Night', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g684', status: 'scheduled', month: 'Jul', date: 9, weekday: 'Thu', day: 'Thu, Jul 9', time: '7:30 PM - 8:30 PM', opponent: 'Week 4: Rivalry Night', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g685', status: 'scheduled', month: 'Jul', date: 16, weekday: 'Thu', day: 'Thu, Jul 16', time: '7:30 PM - 8:30 PM', opponent: 'Week 5: All-Star Challenge', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
  { id: 'g686', status: 'scheduled', month: 'Jul', date: 23, weekday: 'Thu', day: 'Thu, Jul 23', time: '7:30 PM - 8:30 PM', opponent: 'Week 6: Summer Cup Finals', location: 'TBD', home: true, team: 'Rising 6th-8th Boys' },
];

export const INITIAL_PRACTICES = [];

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
  return useSupabaseTable('players', INITIAL_PLAYERS);
}

export function useGames() {
  return useSupabaseTable('games', INITIAL_GAMES);
}

export function usePractices() {
  return useSupabaseTable('practices', INITIAL_PRACTICES);
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
  return useSupabaseTable('announcements', INITIAL_ANNOUNCEMENTS);
}

// ─── Official Assignments ─────────────────────────────────────────────────────
// Shape: { [gameId]: { refs: string[], status: 'confirmed'|'partial'|'unassigned' } }

export const INITIAL_OFFICIAL_ASSIGNMENTS = {};

export function useOfficialAssignments() {
  return useSupabaseAssignments();
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

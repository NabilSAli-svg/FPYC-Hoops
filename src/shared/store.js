import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { useSupabaseTable, useSupabaseAssignments } from './useSupabaseTable.js';
import { supabase } from './supabase.js';

export const TEAM_INFO = {
  name: 'Rising 2nd-3rd Boys',
  division: '3v3 Summer Cup',
  record: '0–0',
  seed: '—',
  coach: 'Coach',
  coachEmail: '',
};

export const SPORTS = [
  { id: 'basketball', label: 'Basketball', tagline: 'FPYC Basketball', icon: 'circle-dot' },
  { id: 'soccer',     label: 'Soccer',     tagline: 'FPYC Soccer',     icon: 'circle' },
  { id: 'football',   label: 'Football',   tagline: 'FPYC Lions Football', icon: 'shield' },
];

export const TEAMS_INFO = {
  'Rising 2nd-3rd Boys': { id: '23boys', name: 'Rising 2nd-3rd Boys', division: '3v3 Summer Cup', coach: 'Nick Blessing', color: 'var(--court-navy)', sport: 'basketball' },
  'Girls 3v3 (2nd-8th)': { id: 'girls',  name: 'Girls 3v3 (2nd-8th)', division: '3v3 Summer Cup', coach: 'Coach', color: '#1F8A5B', sport: 'basketball' },
  'Rising 4th-5th Boys': { id: '45boys', name: 'Rising 4th-5th Boys', division: '3v3 Summer Cup', coach: 'Joshua Nehr, Jim Quinn & Shaun Ali', color: '#C8102E', sport: 'basketball' },
  'Rising 6th-8th Boys': { id: '68boys', name: 'Rising 6th-8th Boys', division: '3v3 Summer Cup', coach: 'Coach', color: 'var(--basketball-orange)', sport: 'basketball' },
  // Travel Select — Summer 2026
  'Aidris B5':   { id: 'ts-ab5',  name: 'Aidris B5',   division: 'Travel Select', coach: 'Coach Aidris',   color: '#7C3AED', sport: 'basketball' },
  'Tom B6':      { id: 'ts-tb6',  name: 'Tom B6',      division: 'Travel Select', coach: 'Coach Tom',      color: '#0369A1', sport: 'basketball' },
  'Mike Do G6':  { id: 'ts-mdg6', name: 'Mike Do G6',  division: 'Travel Select', coach: 'Mike Do',        color: '#059669', sport: 'basketball' },
  'Earnest G7':  { id: 'ts-eg7',  name: 'Earnest G7',  division: 'Travel Select', coach: 'Coach Earnest',  color: '#D97706', sport: 'basketball' },
  'Rene B7':     { id: 'ts-rb7',  name: 'Rene B7',     division: 'Travel Select', coach: 'Coach Rene',     color: '#BE185D', sport: 'basketball' },
  'Mike Lee B8': { id: 'ts-mlb8', name: 'Mike Lee B8', division: 'Travel Select', coach: 'Mike Lee',       color: '#1D4ED8', sport: 'basketball' },
  'Keun B8-2':   { id: 'ts-kb82', name: 'Keun B8-2',   division: 'Travel Select', coach: 'Coach Keun',     color: '#374151', sport: 'basketball' },
  'U9 Fairfax FC':  { id: 'soccer-u9',  name: 'U9 Fairfax FC',  division: 'PowerRec U9-U10',  coach: 'Rich Crowder', color: '#1F8A5B', sport: 'soccer' },
  'U12 Fairfax FC': { id: 'soccer-u12', name: 'U12 Fairfax FC', division: 'NCSL Rec U11-U19', coach: 'Coach', color: '#C8102E', sport: 'soccer' },

  // FPYC Flag Football — Spring 2026 (scheduler.leaguelobster.com/2636555/fpyc-flag-football)
  'Steelers (8U)':   { id: 'fb-8u-steelers',   name: 'Steelers (8U)',   division: '8U Coed Flag',  coach: 'Coach Morris',    color: '#C8102E', sport: 'football' },
  'Bucs (8U)':       { id: 'fb-8u-bucs',       name: 'Bucs (8U)',       division: '8U Coed Flag',  coach: 'Coach Mueller',   color: '#C8102E', sport: 'football' },
  'Dolphins (8U)':   { id: 'fb-8u-dolphins',   name: 'Dolphins (8U)',   division: '8U Coed Flag',  coach: 'Coach Townes',    color: '#C8102E', sport: 'football' },
  'Eagles (8U)':     { id: 'fb-8u-eagles',     name: 'Eagles (8U)',     division: '8U Coed Flag',  coach: 'Coach Fiallo',    color: '#C8102E', sport: 'football' },

  'Dolphins (10U)':  { id: 'fb-10u-dolphins',  name: 'Dolphins (10U)',  division: '10U Coed Flag', coach: 'Coach Pollack',   color: '#C8102E', sport: 'football' },
  'Broncos (10U)':   { id: 'fb-10u-broncos',   name: 'Broncos (10U)',   division: '10U Coed Flag', coach: 'Coach Greenberg', color: '#C8102E', sport: 'football' },
  'Commanders (10U)':{ id: 'fb-10u-commanders',name: 'Commanders (10U)',division: '10U Coed Flag', coach: 'Coach Turner',    color: '#C8102E', sport: 'football' },
  'Saints (10U)':    { id: 'fb-10u-saints',    name: 'Saints (10U)',    division: '10U Coed Flag', coach: 'Coach Rossman',   color: '#C8102E', sport: 'football' },
  'Ravens (10U)':    { id: 'fb-10u-ravens',    name: 'Ravens (10U)',    division: '10U Coed Flag', coach: 'Coach Ali',       color: '#C8102E', sport: 'football' },
  'Steelers (10U)':  { id: 'fb-10u-steelers',  name: 'Steelers (10U)',  division: '10U Coed Flag', coach: 'Coach Nehr',      color: '#C8102E', sport: 'football' },
  'Bucs (10U)':      { id: 'fb-10u-bucs',      name: 'Bucs (10U)',      division: '10U Coed Flag', coach: 'Coach Nishanov',  color: '#C8102E', sport: 'football' },
  'Eagles (10U)':    { id: 'fb-10u-eagles',    name: 'Eagles (10U)',    division: '10U Coed Flag', coach: 'Coach Vilasi',    color: '#C8102E', sport: 'football' },

  'Bucs (12U)':      { id: 'fb-12u-bucs',      name: 'Bucs (12U)',      division: '12U Coed Flag', coach: 'Coach Helmstutler', color: '#C8102E', sport: 'football' },
  'Saints (12U)':    { id: 'fb-12u-saints',    name: 'Saints (12U)',    division: '12U Coed Flag', coach: 'Coach Pollack',      color: '#C8102E', sport: 'football' },
  'Ravens (12U)':    { id: 'fb-12u-ravens',    name: 'Ravens (12U)',    division: '12U Coed Flag', coach: 'Coach Jeffress',     color: '#C8102E', sport: 'football' },
  'Commanders (12U)':{ id: 'fb-12u-commanders',name: 'Commanders (12U)',division: '12U Coed Flag', coach: 'Coach Komaily',      color: '#C8102E', sport: 'football' },
  'Steelers (12U)':  { id: 'fb-12u-steelers',  name: 'Steelers (12U)',  division: '12U Coed Flag', coach: 'Coach Vigna',        color: '#C8102E', sport: 'football' },
  'Eagles (12U)':    { id: 'fb-12u-eagles',    name: 'Eagles (12U)',    division: '12U Coed Flag', coach: 'Coach Millen',       color: '#C8102E', sport: 'football' },

  'Saints (15U)':    { id: 'fb-15u-saints',    name: 'Saints (15U)',    division: '15U Coed Flag', coach: 'Coach Justin',       color: '#C8102E', sport: 'football' },
  'Eagles (15U)':    { id: 'fb-15u-eagles',    name: 'Eagles (15U)',    division: '15U Coed Flag', coach: 'Coach Vecchione',    color: '#C8102E', sport: 'football' },
  'Steelers (15U)':  { id: 'fb-15u-steelers',  name: 'Steelers (15U)',  division: '15U Coed Flag', coach: 'Coach Ruiz',         color: '#C8102E', sport: 'football' },
  'Ravens (15U)':    { id: 'fb-15u-ravens',    name: 'Ravens (15U)',    division: '15U Coed Flag', coach: 'Coach Bruce',        color: '#C8102E', sport: 'football' },
  'Bucs (15U)':      { id: 'fb-15u-bucs',      name: 'Bucs (15U)',      division: '15U Coed Flag', coach: 'Coach Whitlock',     color: '#C8102E', sport: 'football' },
  'Commanders (15U)':{ id: 'fb-15u-commanders',name: 'Commanders (15U)',division: '15U Coed Flag', coach: 'Coach Parish',       color: '#C8102E', sport: 'football' },
};


export const INITIAL_PLAYERS = [
  { id: 'p1', number: null, name: "Ishaaq Adam", grade: "2nd & 3rd", school: "Eagle View", guardian: "adamfamily0312@gmail.com", phone: "(703) 338-9601", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p2', number: null, name: "Ismaeel Adam", grade: "4th & 5th", school: "Eagle View", guardian: "adamfamily0312@gmail.com", phone: "(703) 338-9601", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p3', number: null, name: "Jenny Ahn", grade: "4th & 5th", school: "Mantua", guardian: "hello323235@gmail.com", phone: "7039091838", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p4', number: null, name: "Hamza Ali", grade: "4th & 5th", school: "Daniel’s Run", guardian: "syednabilali@gmail.com", phone: "(703) 994-2211", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p5', number: null, name: "Neal Beesam", grade: "4th & 5th", school: "Graham Road ES", guardian: "ashley@beesam.com", phone: "5714806621", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p6', number: null, name: "Michael Blessing", grade: "2nd & 3rd", school: "Greenbriar east", guardian: "stephanie.wyckoff@gmail.com", phone: "(571) 276-1154", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p7', number: null, name: "Derrick Booker jr", grade: "6th-8th", school: "Laurel Ridge Elementary", guardian: "devita_shorter@msn.com", phone: "6105643757", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p8', number: null, name: "Alexander Chang", grade: "6th-8th", school: "Mantua ES", guardian: "dcnycjjpkr@gmail.com", phone: "(703) 939-2859", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p9', number: null, name: "Misdy Contreras Martínez", grade: "2nd & 3rd", school: '', guardian: "karrrymartines@gmail.com", phone: '', position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p10', number: null, name: "Abby Cook", grade: "6th-8th", school: "Woodson", guardian: "dhciii@gmail.com", phone: "2408135457", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p11', number: null, name: "Alexsandra Cossio", grade: "6th-8th", school: "Cunnighan park", guardian: "alexsandrocossio@gmail.com", phone: "5714902828", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p12', number: null, name: "kirubel daniel", grade: "6th-8th", school: "Mosaic Elementary", guardian: "dagnu44@gmail.com", phone: "(615) 457-9822", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p13', number: null, name: "Anthony Del Fiore", grade: "4th & 5th", school: "willow Springs ES", guardian: "jimdelf@gmail.com", phone: "(401) 261-0205", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p14', number: null, name: "Cole Denton", grade: "6th-8th", school: "Daniels Run", guardian: "erinldenton@gmail.com", phone: "(571)379-6079", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p15', number: null, name: "Mason Drummey", grade: "4th & 5th", school: "Daniels Run Elementary", guardian: "saraabawi@gmail.com", phone: "703-328-5143", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p16', number: null, name: "Holden Duble", grade: "6th-8th", school: "Eagle View", guardian: "martin.duble@verizon.net", phone: "(703)968-5516", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p17', number: null, name: "Gio Flores", grade: "6th-8th", school: "Daniel’s Run", guardian: "jonrobflo@gmail.com", phone: "(703)209-6062", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p18', number: null, name: "Nate Fuge", grade: "4th & 5th", school: "Daniels Run ES", guardian: "davidfuge@gmail.com", phone: "(703) 244-2244", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p19', number: null, name: "Joshua Garvin", grade: "2nd & 3rd", school: "London Towne", guardian: "tarhealrn08@gmail.com", phone: "(703) 200-2179", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p20', number: null, name: "Faris Hamid", grade: "2nd & 3rd", school: "Eagle View", guardian: "hamid.ahmedm@gmail.com", phone: "(571) 331-1543", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p21', number: null, name: "Alex Handy", grade: "6th-8th", school: "Mantua", guardian: "wangl01@hotmail.com", phone: "(201) 320-3625", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p22', number: null, name: "Mira Hardwick", grade: "6th-8th", school: "Frost Middle School", guardian: "sw0000sh11@hotmail.com", phone: "575-749-2991", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p23', number: null, name: "Emerson Harvey", grade: "6th-8th", school: "Daniels Run Elementary School", guardian: "jeniharvey9@gmail.com", phone: "(703) 346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p24', number: null, name: "Ryan Harvey", grade: "4th & 5th", school: "Daniels Run Elementary School", guardian: "jeniharvey9@gmail.com", phone: "(703)346-1194", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p25', number: null, name: "Campbell Hastings", grade: "2nd & 3rd", school: "greenbriar east", guardian: "biohokie08@gmail.com", phone: "(540) 622-4484", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p26', number: null, name: "Declan Holmes", grade: "6th-8th", school: "Daniels Run", guardian: "slimkim35@gmail.com", phone: "(301)461-9447", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p27', number: null, name: "Nathan Jones", grade: "6th-8th", school: "Providence", guardian: "branjithan@yahoo.com", phone: "(703) 216-2728", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p28', number: null, name: "Norah Kamra- Rajpal", grade: "2nd & 3rd", school: "Providence ES", guardian: "h.analyst777@gmail.com", phone: "(516) 813-8657", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p29', number: null, name: "Ethan Kim", grade: "2nd & 3rd", school: "Province Elementary", guardian: "bambina833@gmail.com", phone: "(703) 473-6168", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p30', number: null, name: "Arjun Kintgen", grade: "6th-8th", school: "Mosaic", guardian: "ekintgen@gmail.com", phone: "8123404749", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p31', number: null, name: "Kabir Kintgen", grade: "4th & 5th", school: "Mosaic", guardian: "ekintgen@gmail.com", phone: "(812) 340-4749", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p32', number: null, name: "Mishel Kletska", grade: "6th-8th", school: "Daniel's Run elementary school", guardian: "rudolfina0908@gmail.com", phone: "5716405535", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p33', number: null, name: "BRUCE LEE", grade: "6th-8th", school: "Willow spring", guardian: "blee5451@gmail.com", phone: "(703)473-2341", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p34', number: null, name: "Kenson Lee", grade: "6th-8th", school: "Oak view", guardian: "maziejae@aol.com", phone: "(703) 474-5573", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p35', number: null, name: "Abu Bakr Lodin", grade: "4th & 5th", school: "Fairfax Villa Elementary School", guardian: "shukriahd@gmail.com", phone: "(571)318-7536", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p36', number: null, name: "Rhys Mancl", grade: "6th-8th", school: "Daniels Run", guardian: "mancl.amy@gmail.com", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p37', number: null, name: "Avery McCray", grade: "4th & 5th", school: "Daniels Run", guardian: "rj.mccray@irs.gov", phone: "(318) 792-5330", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p38', number: null, name: "Levi McCray", grade: "2nd & 3rd", school: "Daniels Run", guardian: "rj.mccray@irs.gov", phone: "(318) 792-5330", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p39', number: null, name: "Aditya Menon", grade: "6th-8th", school: "Daniels Run Elementary", guardian: "binds29@gmail.com", phone: "(214)554-2004", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p40', number: null, name: "Isaac Nunes", grade: "4th & 5th", school: "oak view", guardian: "nunes8787@hotmail.com", phone: "(571) 621-2240", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p41', number: null, name: "Aiden Oh", grade: "2nd & 3rd", school: "Fairfax Villa elementary", guardian: "mike_oh1981@hotmail.co.kr", phone: "(703)899-5098", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p42', number: null, name: "Owen Pham", grade: "6th-8th", school: "Eagle View Elementary", guardian: "phamharvey@gmail.com", phone: "(757) 646-0336", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p43', number: null, name: "Oscar Potter", grade: "2nd & 3rd", school: "Daniel’s run", guardian: "liciaroberts@gmail.com", phone: "(571) 239-1370", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p44', number: null, name: "Quentin potter", grade: "6th-8th", school: "Daniel’s run", guardian: "liciaroberts@gmail.com", phone: "(571) 239-1370", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p45', number: null, name: "Adrian Prado", grade: "6th-8th", school: "Katherine Johnson Middle School", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p46', number: null, name: "Benjamin Quinn", grade: "4th & 5th", school: "Oakton Elementary", guardian: "james.john.quinn@gmail.com", phone: "(201)951-2824", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p47', number: null, name: "Alonso Rivera", grade: "6th-8th", school: "Providence ES", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p48', number: null, name: "Antonio Rivera", grade: "2nd & 3rd", school: "Katherine Johnson Middle School", guardian: "twojagerbombs@gmail.com", phone: "(703)296-1607", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p49', number: null, name: "Lucas Saal", grade: "4th & 5th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4998", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p50', number: null, name: "Lucas RR Seal", grade: "2nd & 3rd", school: "Oakton ES", guardian: "seals_home@yahoo.com", phone: "(571)236-1351", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p51', number: null, name: "Thomas RR Seal", grade: "2nd & 3rd", school: "Oakton ES", guardian: "seals_home@yahoo.com", phone: "(571)236-1351", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p52', number: null, name: "Drea Seaton", grade: "6th-8th", school: "Providence", guardian: "deenarusso@mac.com", phone: "(240) 447-0602", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p53', number: null, name: "Rylen Shajib", grade: "2nd & 3rd", school: "eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p54', number: null, name: "Jaxson Shajib", grade: "2nd & 3rd", school: "Eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p55', number: null, name: "Hannah Swiercz", grade: "2nd & 3rd", school: "Mantua elem", guardian: "kelly.cage@gmail.com", phone: "(202) 425-3227", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p56', number: null, name: "Philip Tran", grade: "4th & 5th", school: "Daniels Run", guardian: "marwei.tam@gmail.com", phone: "(301) 806-0520", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p57', number: null, name: "Chase Vadakedathu", grade: "6th-8th", school: "Mantua Elementary", guardian: "linandcass@gmail.com", phone: "(508)556-0616", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p58', number: null, name: "Sarah Vadakedathu", grade: "6th-8th", school: "Mantua Elementary", guardian: "linandcass@gmail.com", phone: "(508)556-0616", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p59', number: null, name: "Kyrie Varela", grade: "4th & 5th", school: "Providence", guardian: "zelda.varela@gmail.com", phone: "(210) 286-1263", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p254', number: null, name: "Anna Arshad", grade: "4th & 5th", school: "Saint Leo the Great Catholic School", guardian: "l.richardson17@gmail.com", phone: "(202)718-7188", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p255', number: null, name: "David Sparling", grade: "4th & 5th", school: "Providence elementary", guardian: "yvonnemsparling@gmail.com", phone: "(703) 927-1062", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p256', number: null, name: "AARON Guison-Dowdy", grade: "4th & 5th", school: "Fairhill ES", guardian: "xai2k@hotmail.com", phone: "(703)280-0970", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p257', number: null, name: "Cru Tarugsa", grade: "2nd & 3rd", school: "Greenbriar West", guardian: "natee.tarugsa@gmail.com", phone: "(818) 388-9426", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 2nd-3rd Boys", team: "Rising 2nd-3rd Boys" },
  { id: 'p258', number: null, name: "Zach Ali", grade: "4th & 5th", school: "Willow Springs", guardian: "shaunali34@gmail.com", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p259', number: null, name: "Dean Ali", grade: "4th & 5th", school: "Willow Springs", guardian: "shaunali34@gmail.com", phone: "(703) 989-0847", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p260', number: null, name: "Amen Emun", grade: "6th-8th", school: "Mosaic Elementary school", guardian: "hilawemun@gmail.com", phone: "(571)685-0566", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p261', number: null, name: "Taye Olibah", grade: "4th & 5th", school: "Willow Springs Elementary School", guardian: "bzolibah@gmail.com", phone: "(571) 214-1701", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p262', number: null, name: "James Schrecengost", grade: "4th & 5th", school: "Louise Archer Elementary", guardian: "rosengost.family@gmail.com", phone: "(202) 937-5119", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p263', number: null, name: "Jordan Schrecengost", grade: "2nd & 3rd", school: "Flint Hill Elementary", guardian: "rosengost.family@gmail.com", phone: "(202) 937-5119", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p264', number: null, name: "Linus Lee", grade: "4th & 5th", school: "Fairhill Elementary School", guardian: "kkiang@gmail.com", phone: "(970) 623-9363", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p265', number: null, name: "Luke Tran", grade: "4th & 5th", school: "Providence Elementary School", guardian: "dltran1216@gmail.com", phone: "(540) 797-4777", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p266', number: null, name: "Arantza Rivera Garcia", grade: "6th-8th", school: "Fairfax Villa", guardian: "ngarcia9680@hotmail.com", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Girls 3v3 (2nd-8th)", team: "Girls 3v3 (2nd-8th)" },
  { id: 'p267', number: null, name: "Anibal Rivera Garcia", grade: "6th-8th", school: "Fairfax Villa", guardian: "ngarcia9680@hotmail.com", phone: "(703) 899-0013", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 6th-8th Boys", team: "Rising 6th-8th Boys" },
  { id: 'p268', number: null, name: "Jack Van Wagner", grade: "4th & 5th", school: "Sunrise Valley ES", guardian: "dale.vanwagner@gmail.com", phone: "(215) 499-5165", position: '', status: 'active', waiver: true, program: 'Recreation', division: "Rising 4th-5th Boys", team: "Rising 4th-5th Boys" },
  { id: 'p60', number: null, name: "Rider Bohman", grade: "5th", school: "Daniels Run", guardian: "bohmanc@gmail.com", phone: "(571)606-7943", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p61', number: null, name: "Oliver Rodriguez", grade: "7th", school: "Daniels Run", guardian: "nancyrichman@gmail.com", phone: "(571) 388-6743", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p62', number: null, name: "Elias Nishanov", grade: "6th", school: "Fairfax HS, KJ MS", guardian: "dilya.pulatova@gmail.com", phone: "(202) 817-4036", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p63', number: null, name: "Zane MAsri", grade: "6th", school: "Oak View Elem", guardian: "wmasri@gmu.edu", phone: "(571) 470-3065", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p64', number: null, name: "Robert Stovall", grade: "8th", school: "Frost/Woodson", guardian: "ellen.sutey@gmail.com", phone: "7039693076", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p65', number: null, name: "Leonel Helmstutler", grade: "6th", school: "Providence ES", guardian: "s_yeganeh@hotmail.com", phone: "(703) 216-4235", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p66', number: null, name: "Kai Lowery", grade: "5th", school: "Daniels Run", guardian: "lowerykm@gmail.com", phone: "(703) 587-6556", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p67', number: null, name: "Sebastian Hanna", grade: "7th", school: "Fairfax HS", guardian: "hannatom15@gmail.com", phone: "(703) 268-8735", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p68', number: null, name: "Marshall Lee", grade: "7th", school: "Willow springs", guardian: "bannwang@gmail.com", phone: "(703) 801-7863", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p69', number: null, name: "Adrian Amartuvshin", grade: "5th", school: "Katherine Johnson MS", guardian: "oskoamartuvshin@gmail.com", phone: "(703) 389-3887", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p70', number: null, name: "Junu Yoo", grade: "7th", school: "Eagles ES", guardian: "ekchoi81@gmail.com", phone: "7037327785", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p71', number: null, name: "Sam Hartwich", grade: "6th", school: "Fairhill Elementary School", guardian: "gatrheel@gmail.com", phone: "(703) 516-0492", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p72', number: null, name: "Adam Hartwich", grade: "4th", school: "Fairhill Elementary School", guardian: "gatrheel@gmail.com", phone: "(703) 516-0492", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p73', number: null, name: "Charlotte Wallace", grade: "6th", school: "Katherine Johnson Middle", guardian: "wallace.k.omar@gmail.com", phone: "(301) 257-2923", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p74', number: null, name: "MARC OBANDO", grade: "8th", school: "Mantua ES", guardian: "meghendrickson@gmail.com", phone: "(703) 638-3998", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p75', number: null, name: "Jackson Seal", grade: "8th", school: "Fairview ES", guardian: "leslie.seal@fts-intl.com", phone: "(703) 744-0100", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p76', number: null, name: "Kai Douglas", grade: "6th", school: "Lee Corner", guardian: "natejdoug13@gmail.com", phone: "(562) 673-3773", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p77', number: null, name: "Nathaniel Anderson", grade: "6th", school: "Eagle View", guardian: "timjanderson7@gmail.com", phone: "(915) 474-8825", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p78', number: null, name: "Kinaan Phillips", grade: "6th", school: "Oak View elementary", guardian: "andrewsudan@yahoo.com.au", phone: "(571)587-9929", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p79', number: null, name: "Evan Kim", grade: "7th", school: "Rocky Run MS", guardian: "junkim1105@gmail.com", phone: "7033078305", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p80', number: null, name: "Ishan Natnithithadha", grade: "7th", school: "Daniels Run ES", guardian: "nnatnith@hotmail.com", phone: "2027468253", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p81', number: null, name: "Emerson Lee", grade: "5th", school: "Katherine Johnson", guardian: "lee.family.etc@gmail.com", phone: "(571) 730-8166", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p82', number: null, name: "Maddox Lee", grade: "7th", school: "Katherine Johnson", guardian: "lee.family.etc@gmail.com", phone: "(571) 730-8166", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p83', number: null, name: "Jeremiah Valts", grade: "8th", school: "Willow springs elementary", guardian: "samia3j@gmail.com", phone: "5712530372", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p84', number: null, name: "Abigail Barnhart", grade: "7th", school: "Frost", guardian: "parents@barnhart.family", phone: "(571) 488-3076", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p85', number: null, name: "JW Morgan", grade: "5th", school: "Providence Elementary", guardian: "justin.b.morgan@gmail.com", phone: "(240)925-6022", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p86', number: null, name: "Mercedes Burke", grade: "6th", school: "Providence", guardian: "cnsmith0725@gmail.com", phone: "(571)235-9389", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p87', number: null, name: "Eiman Hamidi", grade: "8th", school: "Colin Powell ES", guardian: "roya.o.hamid@gmail.com", phone: "(703) 740-6690", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p88', number: null, name: "David williams", grade: "8th", school: "Franklin Farm MD", guardian: "willangela78@gmail.com", phone: "(501)408-6159", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p89', number: null, name: "Milan Kanaan", grade: "7th", school: "Virginia Run Elementary", guardian: "ninapatel7@gmail.com", phone: "(773)677-2401", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p90', number: null, name: "Isaac Pearson", grade: "6th", school: "Providence ES", guardian: "justin.k.pearson@gmail.com", phone: "(703) 623-0738", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p91', number: null, name: "Olivia Clough", grade: "6th", school: "Williamsburg", guardian: "ginaclough@gmail.com", phone: "(703)915-1357", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p92', number: null, name: "Grant Sikorski", grade: "8th", school: "Willow Springs", guardian: "brian.j.sikorski@gmail.com", phone: "(703) 579-7862", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p93', number: null, name: "Maddox Drew", grade: "8th", school: "willow springs", guardian: "squeaky20@aol.com", phone: "(703)402-8985", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p94', number: null, name: "Joey Grandizio", grade: "5th", school: "Daniels Run", guardian: "lmgrandizio@verizon.net", phone: "(703)298-3413", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p95', number: null, name: "Kameron Singh", grade: "7th", school: "Colin Powell Elem", guardian: "singhkevinm@gmail.com", phone: "(703)869-0200", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p96', number: null, name: "Soliana Beyene", grade: "7th", school: "Frost", guardian: "helenkibrom1@yahoo.com", phone: "(703)395-1769", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p97', number: null, name: "Payton Cross", grade: "6th", school: "Liberty MS", guardian: "pocross23@gmail.com", phone: "5712832040", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p98', number: null, name: "Holden Lee", grade: "5th", school: "Fairfax Villa", guardian: "sanglee23@gmail.com", phone: "(301) 257-2368", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p99', number: null, name: "Joshua Bochert", grade: "5th", school: "Providence ES", guardian: "hsbochert@gmail.com", phone: "(703) 967-5679", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p100', number: null, name: "Bryce Hanlon", grade: "8th", school: "Willow Springs", guardian: "gayle.hanlon@gmail.com", phone: "2024414892", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p101', number: null, name: "Gabriel Alonso", grade: "8th", school: "Providence", guardian: "emilioalonso13@yahoo.com", phone: "(703) 731-6913", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p102', number: null, name: "Maxwell Menis", grade: "8th", school: "KATHERINE JOHNSON", guardian: "heathershawmenis@gmail.com", phone: "(301) 793-3399", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p103', number: null, name: "Sofia Ossenova-Singh", grade: "7th", school: "Franklin Farm", guardian: "asingh99@gmail.com", phone: "(703) 851-2129", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p104', number: null, name: "Mathew Lee", grade: "8th", school: "Liberty MS", guardian: "mky8282@hotmail.com", phone: "(213) 505-4881", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p105', number: null, name: "Emre Gallo", grade: "5th", school: "Terra Centre ES", guardian: "aylinsezmis1@gmail.com", phone: "(202) 379-6775", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p106', number: null, name: "Paresa Chongtrakul", grade: "6th", school: "Greenbriar east elementary school", guardian: "plesuda@hotmail.com", phone: "(571) 235-0642", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p107', number: null, name: "Dominic Shin", grade: "7th", school: "katherine johnson", guardian: "killersmile123@gmail.com", phone: "(858)761-5770", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p108', number: null, name: "London Yoo", grade: "7th", school: "Colin Powell", guardian: "keunyoo29@gmail.com", phone: "(703) 887-3034", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p109', number: null, name: "Kayla Kolar", grade: "7th", school: "Vienna elementary", guardian: "jkolar69@gmail.com", phone: "(703) 915-9231", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p110', number: null, name: "Dustin Lee", grade: "7th", school: "Rachel Carlson MS", guardian: "jlee1013@gmail.com", phone: "(703) 727-8274", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p111', number: null, name: "Anthony Head", grade: "5th", school: "Oak View", guardian: "brianjhead@gmail.com", phone: "2675468301", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p112', number: null, name: "Jason Ndukwe", grade: "7th", school: "Eagle view elementary", guardian: "irynaskids4@gmail.com", phone: "(571) 244-8216", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p113', number: null, name: "Lincoln Lee", grade: "7th", school: "Willow Springs ES", guardian: "michael.lee24@gmail.com", phone: "(703) 965-8104", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p114', number: null, name: "Avery Komaily", grade: "6th", school: "Oak View", guardian: "amykomaily@yahoo.com", phone: "(240) 498-5264", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p115', number: null, name: "Claire Bocian", grade: "6th", school: "Kathern Johnson Elementary", guardian: "alexandra.bocian@gmail.com", phone: "(202) 641-5259", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p116', number: null, name: "Ian Choi", grade: "8th", school: "Robinson MS", guardian: "philchoi1@gmail.com", phone: "(530) 848-7056", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p117', number: null, name: "Antony Bustamante", grade: "8th", school: "Fairfax HS", guardian: "kbustamante@cox.net", phone: "7037950345", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p118', number: null, name: "Riley Young", grade: "7th", school: "Daniels run", guardian: "casiea02@aol.com", phone: "(703)307-3839", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p119', number: null, name: "Ebenezer Esaias", grade: "8th", school: "Cooper Middle School", guardian: "tikdem0511@gmail.com", phone: "(240)688-2406", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p120', number: null, name: "Leia Lee", grade: "7th", school: "Shrevewood Elementary", guardian: "ml1herrell@gmail.com", phone: "(703) 867-0785", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p121', number: null, name: "Noelle Taylor", grade: "7th", school: "DANIELS RUN ES", guardian: "ciel.l.elizabeth@gmail.com", phone: "3023597780", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p122', number: null, name: "Logan McClevey", grade: "5th", school: "Fairfax Villa Elementary", guardian: "mccleveyfamily@gmail.com", phone: "(703) 338-5053", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p123', number: null, name: "Mary Alice Taylor", grade: "6th", school: "Fairfax Villa", guardian: "cstora@gmail.com", phone: "(703)919-4669", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p124', number: null, name: "Gram Paley", grade: "7th", school: "Katherine Johnson MS", guardian: "mgpaley@gmail.com", phone: "(571) 217-5836", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p125', number: null, name: "Vincent Velazco", grade: "6th", school: "Kings Glen ES", guardian: "rvela51@gmail.com", phone: "(703)338-6674", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p126', number: null, name: "Brady Schneider", grade: "5th", school: "Waples Mill Elementary", guardian: "schnet@gmail.com", phone: "(603) 809-2483", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p127', number: null, name: "Chase Yankosky", grade: "5th", school: "Mantua", guardian: "ljyankosky@gmail.com", phone: "(678)596-9576", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p128', number: null, name: "Brooks Yankosky", grade: "8th", school: "Frost", guardian: "lapolk@gmail.com", phone: "(404) 695-8780", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p129', number: null, name: "Christian Carter", grade: "5th", school: "Katherine Johnson Middle School", guardian: "bcarter1818@gmail.com", phone: "(202) 262-9769", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p130', number: null, name: "Oscar Manalansan", grade: "8th", school: "Willow Springs", guardian: "oscar-sharon@hotmail.com", phone: "(571)230-2883", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p131', number: null, name: "Chase Reinecke", grade: "8th", school: "St Leo the Great", guardian: "kevinreinecke@yahoo.com", phone: "(703) 507-1050", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p132', number: null, name: "Logan Saal", grade: "8th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4994", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p133', number: null, name: "Devin Kenworthy", grade: "8th", school: "Daniels Run ES", guardian: "jenfrancioli@hotmail.com", phone: "(914) 589-7820", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p134', number: null, name: "Dane Mack", grade: "8th", school: "Frost", guardian: "kristopher.n.mack@gmail.com", phone: "(719) 930-2913", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p135', number: null, name: "Patrick Walsh", grade: "5th", school: "Waples Mill ES", guardian: "owenpwalsh@aol.com", phone: "(703)626-9392", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p136', number: null, name: "Morgan Ponzar", grade: "8th", school: "Liberty Middle School", guardian: "ponzarlaw@yahoo.com", phone: "(636) 577-1212", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p137', number: null, name: "Noah Clay", grade: "7th", school: "Mantua", guardian: "professor.clay@gmail.com", phone: "(312) 451-4795", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p138', number: null, name: "Joshua Plummer", grade: "8th", school: "Fairfax", guardian: "kevin.plummer@gmail.com", phone: "(540) 226-2105", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p139', number: null, name: "Olivia Johnson", grade: "7th", school: "Daniels Run", guardian: "jenwricsu@yahoo.com", phone: "(614) 266-3014", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p140', number: null, name: "Ellie Young", grade: "5th", school: "Daniels run", guardian: "casiea02@aol.com", phone: "(703) 307-3839", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p141', number: null, name: "Maddox Brown", grade: "5th", school: "Robinson", guardian: "gzne.brown@gmail.com", phone: "(770) 851-8470", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p142', number: null, name: "Maylee Bland", grade: "6th", school: "Canterbury Woods", guardian: "joibland@gmail.com", phone: "(704) 608-9162", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p143', number: null, name: "yusuf mohiuddin", grade: "8th", school: "Willow springs", guardian: "yusufrulesthesuns@gmail.com", phone: "(703) 899-4407", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p144', number: null, name: "Noah Chaudhry", grade: "7th", school: "Frost Middle School", guardian: "bilal.n.chaudhry@gmail.com", phone: "(703) 505-3703", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p145', number: null, name: "Genesis-Grace Mpeh", grade: "6th", school: "Daniels run", guardian: "cawadzi@verizon.net", phone: "(703) 565-8914", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p146', number: null, name: "Julia McGrath", grade: "5th", school: "Laurel Ridge Elemetary", guardian: "tyej3049@yahoo.com", phone: "5852306402", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p147', number: null, name: "Vicente Lopez Zawadzki", grade: "5th", school: "Waples Mill ES", guardian: "clopezvilardell@gmail.com", phone: "(415) 844-0244", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p148', number: null, name: "Rod A", grade: "7th", school: "Frost MS", guardian: "tammy1117@icloud.com", phone: "(703)419-0429", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p149', number: null, name: "Akash Adhikari", grade: "8th", school: "Katherine Johnson", guardian: "bishwosangit@gmail.com", phone: "7032686490", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p150', number: null, name: "Jack Agnew", grade: "7th", school: "Frost", guardian: "agnewjt4@hotmail.com", phone: "(703) 640-4849", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p151', number: null, name: "Bradley Banks", grade: "8th", school: "Oakton Elementary", guardian: "cwillisbanks@gmail.com", phone: "(703) 508-4708", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p152', number: null, name: "Landon McIntosh", grade: "5th", school: "Oakton ES", guardian: "ummcintosh@gmail.com", phone: "(703) 226-9368", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p153', number: null, name: "Luc Piguet", grade: "7th", school: "Frost Middle", guardian: "alexpiguet43@gmail.com", phone: "(571) 447-8095", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p154', number: null, name: "Noah Robel", grade: "4th", school: "Katherine Johnson", guardian: "robel.asheber@yahoo.com", phone: "(571)550-1777", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p155', number: null, name: "Gabriella Robel", grade: "6th", school: "Katherine JOhnson", guardian: "robel.asheber@yahoo.com", phone: "(571)550-1777", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p156', number: null, name: "Boaz Rowe", grade: "8th", school: "Rocky", guardian: "chargod2001@yahoo.com", phone: "(904)708-2693", position: '', status: 'active', waiver: true, program: 'Select', division: '—', team: 'Unassigned' },
  { id: 'p157', number: null, name: "Anthony Del Fiore", grade: "4th", school: "", guardian: "jimdelf@gmail.com", phone: "(401) 261-0205", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p158', number: null, name: "Adam Nawaz", grade: "1st", school: "", guardian: "imran.nawaz@gmail.com", phone: "(703) 625-6873", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p159', number: null, name: "Jay McGrane", grade: "5th", school: "", guardian: "jason.mcgrane@ey.com", phone: "(724)980-6624", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p160', number: null, name: "Leah Godofsky", grade: "1st", school: "", guardian: "alex.godofsky@gmail.com", phone: "(703) 298-0975", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p161', number: null, name: "Ethan Kim", grade: "1st", school: "", guardian: "bambina833@gmail.com", phone: "(703) 473-6168", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p162', number: null, name: "Josander Contreras", grade: "8th", school: "", guardian: "carla.chicas@gmail.com", phone: "(703) 895-8576", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p163', number: null, name: "Dilan Amin", grade: "4th", school: "", guardian: "kaushalpurvee@gmail.com", phone: "(703) 994-6338", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p164', number: null, name: "Aiden Oh", grade: "2nd", school: "", guardian: "mike_oh1981@hotmail.co.kr", phone: "(703)899-5098", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p165', number: null, name: "Kaito Springer", grade: "1st", school: "", guardian: "springeryoko@gmail.com", phone: "(917) 702-8504", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p166', number: null, name: "Sean Bullen", grade: "8th", school: "", guardian: "bullenjl@gmail.com", phone: "(703) 975-3362", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p167', number: null, name: "Dylan Choque", grade: "2nd", school: "", guardian: "bilop25@outlook.com", phone: "5718392728", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p168', number: null, name: "Veeraj Roy", grade: "2nd", school: "", guardian: "shanonbrar1@gmail.com", phone: "(703) 229-3016", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p169', number: null, name: "Nishaan Khangoora", grade: "3rd", school: "", guardian: "v.khangoora@gmail.com", phone: "(410) 865-9672", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p170', number: null, name: "Nathaniel Roettger", grade: "5th", school: "", guardian: "stuartandsuzanne21@yahoo.com", phone: "(540) 287-4703", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p171', number: null, name: "Kayden Nathani", grade: "3rd", school: "", guardian: "afzaa.khwaja@gmail.com", phone: "(770) 596-5638", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p172', number: null, name: "Nate Fuge", grade: "4th", school: "", guardian: "davidfuge@gmail.com", phone: "(703) 244-2244", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p173', number: null, name: "Jack Kurtz", grade: "4th", school: "", guardian: "searchkm@gmail.com", phone: "(571) 216-3162", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p174', number: null, name: "Alan N. Veliz", grade: "3rd", school: "", guardian: "alan4veliz@gmail.com", phone: "2403838624", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p175', number: null, name: "Jacob Abraham", grade: "K", school: "", guardian: "noahmaxepstein@gmail.com", phone: "(646) 385-5858", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p176', number: null, name: "Ulysses Hunstock", grade: "2nd", school: "", guardian: "drewhunstock@gmail.com", phone: "(325)261-2622", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p177', number: null, name: "Gaius Hunstock", grade: "5th", school: "", guardian: "drewhunstock@gmail.com", phone: "(325)261-2622", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p178', number: null, name: "Drea Seaton", grade: "5th", school: "", guardian: "deenarusso@mac.com", phone: "(240)447-0602", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p179', number: null, name: "Mia Angulo", grade: "1st", school: "", guardian: "sangulo1031@gmail.com", phone: "7036061486", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p180', number: null, name: "Camilla Doan", grade: "2nd", school: "Willow Springs ES", guardian: "moonheedoan@gmail.com", phone: "(703) 463-7307", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p181', number: null, name: "Faris Hamid", grade: "3rd", school: "", guardian: "hamid.ahmedm@gmail.com", phone: "(571) 331-1483", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p182', number: null, name: "Kaiden Moscova", grade: "1st", school: "", guardian: "tiffany_parkes@yahoo.com", phone: "(646) 245-3201", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p183', number: null, name: "Kavi Uhlig", grade: "3rd", school: "", guardian: "pmanocha@gmail.com", phone: "(646) 642-0837", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p184', number: null, name: "Rohan Uhlig", grade: "K", school: "", guardian: "pmanocha@gmail.com", phone: "(646) 642-0837", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p185', number: null, name: "Rose Dwyer", grade: "3rd", school: "", guardian: "dwyer.eo@gmail.com", phone: "(908) 337-3928", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p186', number: null, name: "Molly Dwyer", grade: "3rd", school: "", guardian: "dwyer.eo@gmail.com", phone: "(908) 337-3928", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p187', number: null, name: "Gael Crespo", grade: "4th", school: "", guardian: "crespojhanett@gmail.com", phone: "5714899702", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p188', number: null, name: "Deacon Linton", grade: "9th Grade", school: "", guardian: "jaymelinton@gmail.com", phone: "(828) 999-2066", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p189', number: null, name: "Tyler Esterline", grade: "4th", school: "", guardian: "esterlinefamilyva@gmail.com", phone: "(520)390-7486", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p190', number: null, name: "Charlie Meyers", grade: "8th", school: "", guardian: "georgiaseeley@hotmail.com", phone: "(703) 400-1962", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p191', number: null, name: "Lillian Jones", grade: "9th Grade", school: "", guardian: "curtjones@mac.com", phone: "(901)679-7240", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p192', number: null, name: "Aisha Aldayarova", grade: "6th", school: "", guardian: "gulira.alieva@gmail.com", phone: "(202) 805-8050", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p193', number: null, name: "Zacharia Shah", grade: "K", school: "", guardian: "imran.m.shah@gmail.com", phone: "(703) 296-7762", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p194', number: null, name: "Alejandro Chavez", grade: "2nd", school: "", guardian: "spot82@gmail.com", phone: "(301) 704-4543", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p195', number: null, name: "Jake Gunnoe", grade: "1st", school: "", guardian: "jennigunnoe@gmail.com", phone: "(234)359-9810", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p196', number: null, name: "Khizar Usman", grade: "5th", school: "", guardian: "usman.7@hotmail.com", phone: "(713) 396-9806", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p197', number: null, name: "Sulaiman Chaudhry", grade: "5th", school: "", guardian: "naimahjamal@gmail.com", phone: "(571) 499-9927", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p198', number: null, name: "Antony Bustamante", grade: "8th", school: "", guardian: "kbustamante@cox.net", phone: "(703) 795-0345", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p199', number: null, name: "Arthur Casarim", grade: "6th", school: "", guardian: "fcasarim@gmail.com", phone: "(202) 520-0265", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p200', number: null, name: "Kingston Perry", grade: "9th Grade", school: "", guardian: "personalemale@pm.me", phone: "(312) 576-1637", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p201', number: null, name: "Mergen Darby", grade: "9th Grade", school: "", guardian: "markusdarby@gmail.com", phone: "(703) 725-7006", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p202', number: null, name: "Wren Evans", grade: "5th", school: "", guardian: "staceykluck@msn.com", phone: "(703) 785-6557", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p203', number: null, name: "Leonel Hidalgo", grade: "7th", school: "", guardian: "hidalgofamily2708@gmail.com", phone: "(571) 215-6489", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p204', number: null, name: "Valentina Hidalgo", grade: "10th Grade", school: "", guardian: "hidalgofamily2708@gmail.com", phone: "(571) 215-6489", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p205', number: null, name: "Mila Singh", grade: "3rd", school: "", guardian: "meenooksingh@gmail.com", phone: "(703) 389-3986", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p206', number: null, name: "Jack Gibson", grade: "8th", school: "", guardian: "andy.gibson@outlook.com", phone: "(703) 395-2108", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p207', number: null, name: "ABDURAKHMON BOBOYOROV", grade: "7th", school: "", guardian: "boburboboyorov@gmail.com", phone: "(615) 589-8837", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p208', number: null, name: "Aariv Amin", grade: "5th", school: "", guardian: "purveeamin@gmail.com", phone: "(703)994-6338", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p209', number: null, name: "Rashdan Khan", grade: "K", school: "", guardian: "emonfiu@yahoo.com", phone: "(240) 551-6822", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p210', number: null, name: "Jonah Harris", grade: "6th", school: "", guardian: "staceyrose55@gmail.com", phone: "(703) 304-7568", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p211', number: null, name: "Rhys Mancl", grade: "6th", school: "", guardian: "mancl.amy@gmail.com", phone: "559-908-1523", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p212', number: null, name: "Rohan Chandarana", grade: "5th", school: "", guardian: "cmohit@yahoo.com", phone: "(703) 870-6875", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p213', number: null, name: "Elias Nishanov", grade: "6th", school: "", guardian: "dilya.pulatova@gmail.com", phone: "(202) 817-4036", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p214', number: null, name: "Lily Booher", grade: "8th", school: "", guardian: "analiafelixbooher@yahoo.com", phone: "(918) 257-1079", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p215', number: null, name: "Lía Booher", grade: "2nd", school: "", guardian: "analiafelixbooher@yahoo.com", phone: "(918) 257-1079", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p216', number: null, name: "Cullen Shanahan", grade: "7th", school: "", guardian: "stephanieshanahan@yahoo.com", phone: "(360) 672-4077", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p217', number: null, name: "Samuel Kim", grade: "9th Grade", school: "", guardian: "jinajykim07@gmail.com", phone: "(510) 828-3064", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p218', number: null, name: "Jaxson Shajib", grade: "1st", school: "Eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p219', number: null, name: "Rylen Shajib", grade: "2nd", school: "eagle view", guardian: "milani.shajib@gmail.com", phone: "(240) 535-1318", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p220', number: null, name: "Conner Yi", grade: "9th Grade", school: "", guardian: "qyi0204@gmail.com", phone: "(703) 618-6838", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p221', number: null, name: "Jaden Chu", grade: "10th Grade", school: "", guardian: "sarahchoi21@gmail.com", phone: "(510)381-9173", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p222', number: null, name: "Evan Chu", grade: "9th Grade", school: "", guardian: "sarahchoi21@gmail.com", phone: "(510)381-9173", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p223', number: null, name: "Sarah Ferreira", grade: "9th Grade", school: "", guardian: "celsomoller@hotmail.com", phone: "(979) 204-3398", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p224', number: null, name: "Pakhin Chongtrakul", grade: "9th Grade", school: "", guardian: "plesuda@hotmail.com", phone: "(571) 235-0642", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p225', number: null, name: "Roxy Witenstein", grade: "9th Grade", school: "", guardian: "bwitenstein@hotmail.com", phone: "(540) 454-6201", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p226', number: null, name: "Samuel Espinosa", grade: "9th Grade", school: "", guardian: "adrianaluciamoros@gmail.com", phone: "7038683706", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p227', number: null, name: "Zeeshan Akhtar", grade: "5th", school: "", guardian: "azer.akhtar@gmail.com", phone: "(703) 984-9226", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p228', number: null, name: "Imran Akhtar", grade: "5th", school: "", guardian: "azer.akhtar@gmail.com", phone: "(703) 984-9226", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p229', number: null, name: "Puttajak Ratansuban", grade: "9th Grade", school: "", guardian: "ratanasuban@gmail.com", phone: "(657) 257-9144", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p230', number: null, name: "Ianthina Osman", grade: "3rd", school: "", guardian: "shoukut@gmail.com", phone: "(571)386-9047", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p231', number: null, name: "Alisha Zaidi", grade: "9th Grade", school: "", guardian: "najiahus@gmail.com", phone: "(571)412-7827", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p232', number: null, name: "Alex Nguyen", grade: "3rd", school: "", guardian: "yanniegwu@yahoo.com", phone: "(202) 299-7665", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p233', number: null, name: "Enzo Rinker", grade: "4th", school: "", guardian: "justin.rinker@gmail.com", phone: "(571) 383-8879", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p234', number: null, name: "Christopher Barahona", grade: "7th", school: "", guardian: "alfredobarahona82@gmail.com", phone: "(703)732-0200", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p235', number: null, name: "Jude Rowland", grade: "4th", school: "", guardian: "rowland.andrewj@gmail.com", phone: "(703) 408-7388", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p236', number: null, name: "Jacob Rowland", grade: "1st", school: "", guardian: "rowland.andrewj@gmail.com", phone: "(703) 408-7388", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p237', number: null, name: "Arjun Armwood", grade: "2nd", school: "", guardian: "amishaster@gmail.com", phone: "(412) 443-4528", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p238', number: null, name: "Rishaan Gudishetty", grade: "3rd", school: "", guardian: "radhikanookala@gmail.com", phone: "(571) 268-3754", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p239', number: null, name: "Harper Schiavone", grade: "4th", school: "", guardian: "helen_r44444@yahoo.com", phone: "(571) 265-4621", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p240', number: null, name: "Elias Flores", grade: "8th", school: "", guardian: "jonrobflo@gmail.com", phone: "(703) 362-5518", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p241', number: null, name: "Aiden Machuca", grade: "3rd", school: "", guardian: "jackelynmachuca@gmail.com", phone: "(703) 231-6974", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p242', number: null, name: "Aarav Jain", grade: "7th", school: "", guardian: "pulugundlak@gmail.com", phone: "(571) 214-5589", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p243', number: null, name: "Aarit Chandarana", grade: "10th Grade", school: "", guardian: "cmohit@yahoo.com", phone: "(703) 870-6875", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p244', number: null, name: "Ethan Douglas", grade: "1st", school: "", guardian: "wudd82@gmail.com", phone: "(571) 306-0306", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p245', number: null, name: "Sufian Chhipa", grade: "5th", school: "", guardian: "k.chhipa@gmail.com", phone: "(585) 802-2734", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p246', number: null, name: "Mira Asiri", grade: "1st", school: "", guardian: "alsulami4t@gmail.com", phone: "(703)478-4651", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p247', number: null, name: "Greyson Quintana", grade: "1st", school: "", guardian: "maheba_pedroso@yahoo.com", phone: "(305)613-1809", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p248', number: null, name: "Michael Sharkey", grade: "2nd", school: "", guardian: "thesharkeys12@gmail.com", phone: "(419) 349-7783", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p249', number: null, name: "Mohil Bhandari", grade: "4th", school: "", guardian: "rishabh.bhandari@gmail.com", phone: "(804) 432-4867", position: '', status: 'active', waiver: true, program: 'Training', division: "Intermediate", team: "Training - Intermediate" },
  { id: 'p250', number: null, name: "Adrianna Walker", grade: "9th Grade", school: "", guardian: "acsourmany@gmail.com", phone: "(240) 421-0648", position: '', status: 'active', waiver: true, program: 'Training', division: "Advanced", team: "Training - Advanced" },
  { id: 'p251', number: null, name: "Lucas Saal", grade: "4th", school: "Mantua", guardian: "b_saal@yahoo.com", phone: "(703) 609-4994", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p252', number: null, name: "James Coscia", grade: "1st", school: "", guardian: "shelleythomp@gmail.com", phone: "(805)698-1220", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  { id: 'p253', number: null, name: "Jordan Lesniewski", grade: "K", school: "", guardian: "emilyhopk@gmail.com", phone: "(703) 862-7467", position: '', status: 'active', waiver: true, program: 'Training', division: "Beginner", team: "Training - Beginner" },
  // Soccer — Spring 2026
  { id: 'sp1', number: 2,  name: "Owen Carter",    grade: "3rd", school: "Daniels Run", guardian: "carterfamily@example.com", phone: "(703) 555-1101", position: 'Defender', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp2', number: 7,  name: "Maya Singh",     grade: "4th", school: "Mantua",      guardian: "singhfamily@example.com",  phone: "(703) 555-1102", position: 'Forward',  status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp3', number: 1,  name: "Leo Martinez",   grade: "4th", school: "Eagle View",  guardian: "martinezfamily@example.com", phone: "(703) 555-1103", position: 'Goalkeeper', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp4', number: 9,  name: "Ava Thompson",   grade: "3rd", school: "Greenbriar East", guardian: "thompsonfamily@example.com", phone: "(703) 555-1104", position: 'Forward', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp5', number: 4,  name: "Noah Kim",       grade: "5th", school: "Woodson",     guardian: "kimfamily@example.com", phone: "(703) 555-1105", position: 'Midfielder', status: 'active', waiver: true, program: 'Recreation', division: "PowerRec U9-U10", team: "U9 Fairfax FC" },
  { id: 'sp11', number: 5, name: "Sofia Hernandez", grade: "6th", school: "Lanier MS",  guardian: "hernandezfamily@example.com", phone: "(703) 555-1111", position: 'Defender', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp12', number: 10, name: "Ethan Brooks",  grade: "6th", school: "Lanier MS",  guardian: "brooksfamily@example.com", phone: "(703) 555-1112", position: 'Midfielder', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp13', number: 11, name: "Chloe Davis",   grade: "7th", school: "Frost MS",    guardian: "davisfamily@example.com", phone: "(703) 555-1113", position: 'Forward', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },
  { id: 'sp14', number: 12, name: "Mason Lee",     grade: "7th", school: "Frost MS",    guardian: "leefamily@example.com", phone: "(703) 555-1114", position: 'Goalkeeper', status: 'active', waiver: true, program: 'Select', division: "NCSL Rec U11-U19", team: "U12 Fairfax FC" },

  // ── Travel Select — Summer 2026 ──────────────────────────────────────────────
  { id: 'tsp1', number: null, name: 'Vihaan Gupta', grade: '4th Grade', school: 'Mantua', guardian: 'vikashdgupta@gmail.com', phone: '(703) 200-5804', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp2', number: null, name: 'Sai Jackson', grade: '4th Grade', school: 'Mantua', guardian: 'gavin320@gmail.com', phone: '(703)835-3902', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp3', number: null, name: 'Baron Camacho', grade: '4th Grade', school: 'Westbriar ES', guardian: 'gcamacho33@gmail.com', phone: '(703) 599-9376', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp4', number: null, name: 'Adam Hartwich', grade: '4th Grade', school: 'Fairhill Elementary School', guardian: 'gatrheel@gmail.com', phone: '(919) 260-8350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp5', number: null, name: 'Connor Steel', grade: '5th Grade', school: 'Willow Springs Elementary School', guardian: 'shawn@famofsteel.com', phone: '(703) 350-5940', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp6', number: null, name: 'Jameson Lucas', grade: '5th Grade', school: 'Mosaic Elementary', guardian: 'timluc30@gmail.com', phone: '(703) 209-2531', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp7', number: null, name: 'Rylan Dodge', grade: '5th Grade', school: 'Oakton Elementary School', guardian: 'kyle.dodge28@gmail.com', phone: '(757) 871-8764', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp8', number: null, name: 'Michael Gutzler', grade: '4th Grade', school: 'Mosaic ES', guardian: 'eb_law@yahoo.com', phone: '(510) 847-7837', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp9', number: null, name: 'Andrew Donnelly', grade: '4th Grade', school: 'Providence ES', guardian: 'mikedonnelly25@gmail.com', phone: '(703) 728-5083', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp10', number: null, name: 'Jayceon Murphy', grade: '4th Grade', school: 'Providence', guardian: 'kaitlynmmurphy13@gmail.com', phone: '(571) 418-9613', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp11', number: null, name: 'Aryan Kamawal', grade: '5th Grade', school: 'Eagle View', guardian: 'akamawal@yahoo.com', phone: '(571) 363-8444', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp12', number: null, name: 'Mikhail Chaudhry', grade: '5th Grade', school: 'Mantua Elementary', guardian: 'bilal.n.chaudhry@gmail.com', phone: '(703) 505-3703', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp13', number: null, name: 'Christian Carter', grade: '5th Grade', school: 'Waples Mill ES', guardian: 'bcarter1818@gmail.com', phone: '(202) 262-9769', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp14', number: null, name: 'Kian Shirazi', grade: '4th Grade', school: 'Oakton Elementary School', guardian: 'ehsan1shirazi@gmail.com', phone: '(410) 300-0877', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp15', number: null, name: 'Jonas Lee', grade: '5th Grade', school: 'Stenwood Elementary School', guardian: 'popcorn2424@gmail.com', phone: '(703) 489-5016', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp16', number: null, name: 'Cyan McLaurin', grade: '5th Grade', school: 'Flint Hill Lower School', guardian: 'mclaurint@gmail.com', phone: '7034739410', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp17', number: null, name: 'Wren Evans', grade: '5th Grade', school: 'Mantua', guardian: 'staceykluck@msn.com', phone: '(703) 785-6557', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 5th Grade Boys', team: 'Aidris B5' },
  { id: 'tsp18', number: null, name: 'Kai Lowery', grade: '6th Grade', school: 'Mosaic', guardian: 'lowerykm@gmail.com', phone: '(703) 587-6556', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp19', number: null, name: 'JW Morgan', grade: '6th Grade', school: 'Providence Elementary', guardian: 'justin.b.morgan@gmail.com', phone: '(240) 925-6022', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp20', number: null, name: 'Sulaiman Chaudhry', grade: '5th Grade', school: 'Oakton Elementary', guardian: 'naimahjamal@gmail.com', phone: '(571) 499-9927', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp21', number: null, name: 'Joey Grandizio', grade: '5th Grade', school: 'Daniels Run', guardian: 'lmgrandizio@verizon.net', phone: '(703) 298-3413', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp22', number: null, name: 'Adrian Amartuvshin', grade: '6th Grade', school: 'Willow Springs ES', guardian: 'oskoamartuvshin@gmail.com', phone: '(703) 389-3887', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp23', number: null, name: 'Aariv Amin', grade: '5th Grade', school: 'Daniels Run Elementary School', guardian: 'kaushalpurvee@gmail.com', phone: '(703) 994-6338', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp24', number: null, name: 'Gavin Bowles', grade: '6th Grade', school: 'Providence Elementary', guardian: 'lauralbowles@gmail.com', phone: '(703) 835-1546', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp25', number: null, name: 'Joshua Bochert', grade: '6th Grade', school: 'Providence', guardian: 'jodimichele1517@gmail.com', phone: '(703) 967-5679', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp26', number: null, name: 'Ethan Lee', grade: '5th Grade', school: 'Greenbriar West ES', guardian: 'jennyhwang26@gmail.com', phone: '(267) 992-9886', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp27', number: null, name: 'Gio Flores', grade: '5th Grade', school: "Daniel's Run Elementary", guardian: 'jonrobflo@gmail.com', phone: '(703) 362-5518', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp28', number: null, name: 'Emerson Lee', grade: '5th Grade', school: 'Fairfax Villa Elementary', guardian: 'lee.family.etc@gmail.com', phone: '(571) 730-8166', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp29', number: null, name: 'Holden Lee', grade: '5th Grade', school: 'Providence', guardian: 'sanglee23@gmail.com', phone: '(301) 257-2368', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp30', number: null, name: 'Emre Gallo', grade: '5th Grade', school: 'Orange Hunt ES', guardian: 'aylinsezmis1@gmail.com', phone: '(202) 379-6775', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp31', number: null, name: 'Brady Schneider', grade: '5th Grade', school: 'St. Leo', guardian: 'schnet@gmail.com', phone: '(603) 809-2483', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp32', number: null, name: 'Cole LaVine', grade: '5th Grade', school: 'Daniels Run', guardian: 'kennethlavine@gmail.com', phone: '(301) 775-1186', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Boys', team: 'Tom B6' },
  { id: 'tsp33', number: null, name: 'Alexandra Do', grade: '5th Grade', school: 'Mantua', guardian: 'michaeldo82@gmail.com', phone: '(571) 328-8126', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp34', number: null, name: 'Avery Jensen', grade: '6th Grade', school: 'Mantua', guardian: 'jen.jensen345@gmail.com', phone: '(801) 995-0452', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp35', number: null, name: 'Ruby Tran', grade: 'Pre-K', school: 'Fairfax Villa', guardian: 'hauquyen2008@gmail.com', phone: '(703) 371-3293', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp36', number: null, name: 'Lilliana Chu', grade: '5th Grade', school: 'Mantua Elementary School', guardian: 'juliet.sue.kim@gmail.com', phone: '(571)230-9204', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp37', number: null, name: 'Ellie Young', grade: '5th Grade', school: 'Providence', guardian: 'casiea02@aol.com', phone: '(703) 307-3839', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp38', number: null, name: 'Arya Nguyen', grade: '5th Grade', school: 'Mosaic ES', guardian: 'tonyn107@gmail.com', phone: '(714) 851-0070', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp39', number: null, name: 'Drea Seaton', grade: '5th Grade', school: 'Fairfax Villa', guardian: 'deenarusso@mac.com', phone: '(240)447-0602', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp40', number: null, name: 'Lily Buhr', grade: '5th Grade', school: 'Fairfax Villa', guardian: 'jeannierose@gmail.com', phone: '(703) 859-1477', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp41', number: null, name: 'Eliana Smith', grade: '6th Grade', school: 'Orange Hunt', guardian: 'nadiamike814@gmail.com', phone: '(301) 752-9863', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 6th Grade Girls', team: 'Mike Do G6' },
  { id: 'tsp42', number: null, name: 'Jayden Swain', grade: '6th Grade', school: 'Mary Ellen Henderson MS', guardian: 'autumnalena@gmail.com', phone: '(608)217-2172', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp43', number: null, name: 'Ethan Sontag', grade: '7th Grade', school: 'Franklin MS', guardian: 'jennsontag@gmail.com', phone: '(703) 861-1620', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp44', number: null, name: 'Zane Masri', grade: '6th Grade', school: 'Oak View Elem', guardian: 'wmasri@gmu.edu', phone: '(857) 242-8371', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp45', number: null, name: 'Ellis Harrison', grade: '7th Grade', school: 'Flint Hill Elementary School', guardian: 'drewbharrison@gmail.com', phone: '(571) 277-5125', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp46', number: null, name: 'Arthur Casarim', grade: '6th Grade', school: 'Daniels Run', guardian: 'fcasarim@gmail.com', phone: '(202) 520-0265', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp47', number: null, name: 'Mason Cavada', grade: '6th Grade', school: 'Willow Springs', guardian: 'jcavada19@gmail.com', phone: '(703) 568-6848', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp48', number: null, name: 'Vincent Velazco', grade: '6th Grade', school: 'Daniels Run ES', guardian: 'rvela51@gmail.com', phone: '(703) 338-6674', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp49', number: null, name: 'Tyler Khuon', grade: '7th Grade', school: 'Providence Elementary', guardian: 'po.khuon@gmail.com', phone: '(571) 594-0175', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp50', number: null, name: 'Sam Hartwich', grade: '6th Grade', school: 'Fairhill Elementary School', guardian: 'gatrheel@gmail.com', phone: '(919) 260-8350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp51', number: null, name: 'Mason Greenzweig', grade: '7th Grade', school: 'Providence', guardian: 'jamiemgreenzweig@gmail.com', phone: '(571) 585-9196', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp52', number: null, name: 'Elijah Atashbarghi-Nehr', grade: '6th Grade', school: 'Providence', guardian: 'satashbarghi@gmail.com', phone: '(703) 727-3927', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp53', number: null, name: 'Kinaan Phillips', grade: '6th Grade', school: 'Oak View Elementary', guardian: 'andrewsudan@yahoo.com.au', phone: '(571) 587-9929', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp54', number: null, name: 'Ibraheem Adam', grade: '6th Grade', school: 'Al-Huda School', guardian: 'adamfamily0312@gmail.com', phone: '(703) 338-9601', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp55', number: null, name: 'Elias Nishanov', grade: '6th Grade', school: 'Providence', guardian: 'dilya.pulatova@gmail.com', phone: '(202) 817-4036', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp56', number: null, name: 'Leonel Helmstutler', grade: '6th Grade', school: 'Providence', guardian: 's_yeganeh@hotmail.com', phone: '(703) 216-4235', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp57', number: null, name: 'Jason Ndukwe', grade: '7th Grade', school: 'Kathleen Johnson Middle School', guardian: 'irynaskids4@gmail.com', phone: '(571) 244-8216', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp58', number: null, name: 'Mark Schneider', grade: '6th Grade', school: 'St. Leo', guardian: 'schnet@gmail.com', phone: '(603) 809-2483', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp59', number: null, name: 'Nathaniel Anderson', grade: '7th Grade', school: 'Immanuel Christian', guardian: 'timjanderson7@gmail.com', phone: '(915) 474-8825', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp60', number: null, name: 'Rehan Samir', grade: '7th Grade', school: 'Cooper Middle', guardian: 'homeva2011@gmail.com', phone: '(703) 828-7746', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Boys', team: 'Rene B7' },
  { id: 'tsp61', number: null, name: 'Paresa Chongtrakul', grade: '6th Grade', school: 'Greenbrier East Elementary School', guardian: 'plesuda@hotmail.com', phone: '(571) 235-0642', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp62', number: null, name: 'Mary Alice Taylor', grade: '7th Grade', school: 'Frost Middle', guardian: 'cstora@gmail.com', phone: '(703) 919-4669', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp63', number: null, name: 'Genesis-Grace Mpeh', grade: '6th Grade', school: 'Mosaic Elementary', guardian: 'cawadzi@verizon.net', phone: '(703) 565-8914', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp64', number: null, name: 'Maylee Bland', grade: '7th Grade', school: 'Canterbury Woods ES', guardian: 'joibland@gmail.com', phone: '(704) 608-9162', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp65', number: null, name: 'Olivia Clough', grade: '7th Grade', school: 'Williamsburg Middle School', guardian: 'ginaclough@gmail.com', phone: '(703) 915-1357', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp66', number: null, name: 'Aisha Aldayarova', grade: '6th Grade', school: 'Mosaic ES', guardian: 'gulira.alieva@gmail.com', phone: '(202) 805-8050', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp67', number: null, name: 'Evelyn Shirk', grade: '6th Grade', school: 'Sangster', guardian: 'cynthia.shirk@gmail.com', phone: '(920) 344-6068', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp68', number: null, name: 'Alison Zou', grade: '6th Grade', school: 'Kent Gardens Elementary School', guardian: 'shenli2004@gmail.com', phone: '(518) 424-5488', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp69', number: null, name: 'Charlotte Wallace', grade: '6th Grade', school: 'Waples Mills', guardian: 'wallace.k.omar@gmail.com', phone: '(301) 257-1854', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp70', number: null, name: 'Reenad Refaat', grade: '6th Grade', school: 'Mantua ES', guardian: 'haidynada@hotmail.com', phone: '(571) 244-2494', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp71', number: null, name: 'Mercedes Burke', grade: '6th Grade', school: 'Providence Elementary School', guardian: 'cheriesmith0725@yahoo.com', phone: '(571) 235-9389', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp72', number: null, name: 'Rohi Sapkota', grade: '6th Grade', school: 'Mantua Elementary School', guardian: 'sur78@yahoo.com', phone: '(703)509-1127', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp73', number: null, name: 'Kensie Isabella', grade: '6th Grade', school: 'Lemon Road Elementary', guardian: 'coryji02@gmail.com', phone: '(703)798-6909', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp74', number: null, name: 'Piper Jackson', grade: '6th Grade', school: 'Springfield Estates Elementary', guardian: 'shenwalk@gmail.com', phone: '(919)451-5037', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp75', number: null, name: 'Julia McGrath', grade: '5th Grade', school: 'Laurel Ridge Elementary', guardian: 'tyej3049@yahoo.com', phone: '5852306402', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 7th Grade Girls', team: 'Earnest G7' },
  { id: 'tsp76', number: null, name: 'Celine Ngo', grade: '7th Grade', school: 'Mary Ellen Henderson', guardian: 'chloenguyen10@gmail.com', phone: '(202) 531-1494', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp77', number: null, name: 'Marshall Lee', grade: '8th Grade', school: 'KJMS', guardian: 'bannwang@gmail.com', phone: '(703) 801-7863', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp78', number: null, name: 'Silas Kareliusson', grade: '7th Grade', school: 'Frost Middle School', guardian: 'jennclore@gmail.com', phone: '(703) 477-7350', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp79', number: null, name: 'Noah Chaudhry', grade: '7th Grade', school: 'Frost Middle School', guardian: 'bilal.n.chaudhry@gmail.com', phone: '(703) 505-3703', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp80', number: null, name: 'Oliver Rodriguez', grade: '7th Grade', school: 'Katherine Johnson Middle', guardian: 'nancyrichman@gmail.com', phone: '(571) 201-2010', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp81', number: null, name: 'Luc Piguet', grade: '8th Grade', school: 'Frost Middle', guardian: 'alexpiguet43@gmail.com', phone: '(703) 966-4684', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp82', number: null, name: 'Rod Asadzadeh', grade: '7th Grade', school: 'Frost MS', guardian: 'tammy1117@icloud.com', phone: '(703) 419-0429', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp83', number: null, name: 'Timothy Nguyen', grade: '8th Grade', school: 'Luther Jackson', guardian: 'mqtrieu@gmail.com', phone: '(703) 677-6704', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp84', number: null, name: 'Christopher Barahona', grade: '7th Grade', school: 'Katherine Johnson Middle School', guardian: 'alfredobarahona82@gmail.com', phone: '(703)732-0200', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp85', number: null, name: 'Princeton Antoine', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'onerichardantoine@gmail.com', phone: '(301) 996-4795', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp86', number: null, name: 'Gram Paley', grade: '7th Grade', school: 'Katherine Johnson MS', guardian: 'mgpaley@gmail.com', phone: '(571)217-2650', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Mike Lee B8' },
  { id: 'tsp87', number: null, name: 'Junu Yoo', grade: '8th Grade', school: 'Katherine Johnson', guardian: 'ekchoi81@gmail.com', phone: '(703) 789-6778', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp88', number: null, name: 'Klenz Danleigh Martinez', grade: '7th Grade', school: 'Glasgow MS', guardian: 'klenzdanleigh@yahoo.com', phone: '(571) 775-9128', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp89', number: null, name: 'Milan Kanaan', grade: '7th Grade', school: 'Stone Middle School', guardian: 'ninapatel7@gmail.com', phone: '(773) 677-2401', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp90', number: null, name: 'Kameron Singh', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'priyamath@gmail.com', phone: '(202) 255-6225', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp91', number: null, name: 'Rod Asadzadeh', grade: '8th Grade', school: 'Frost Middle School', guardian: 'tammy1117@icloud.com', phone: '(703) 419-0429', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp92', number: null, name: 'Dominic Shin', grade: '7th Grade', school: 'Frost Middle School', guardian: 'killersmile123@gmail.com', phone: '(703) 505-3456', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp93', number: null, name: 'Maddox Lee', grade: '7th Grade', school: 'Frost Middle School', guardian: 'lee.family.etc@gmail.com', phone: '(571) 730-8166', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp94', number: null, name: 'Lincoln Lee', grade: '7th Grade', school: 'Katherine Johnson MS', guardian: 'michael.lee24@gmail.com', phone: '(703) 965-8104', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp95', number: null, name: 'Sebastian Hanna', grade: '7th Grade', school: 'KJMS', guardian: 'hannatom15@gmail.com', phone: '(703) 268-8735', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp96', number: null, name: 'London Yoo', grade: '7th Grade', school: 'Katherine Johnson', guardian: 'keunyoo29@gmail.com', phone: '(702) 887-3034', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
  { id: 'tsp97', number: null, name: 'Noah Clay', grade: '8th Grade', school: 'Frost', guardian: 'curtisclay@gmail.com', phone: '(312)451-4795', position: '', status: 'active', waiver: true, program: 'Travel Select', division: 'Travel Select · 8th Grade Boys', team: 'Keun B8-2' },
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
  // Soccer — Spring 2026
  { id: 'sg1', status: 'final', us: 4, them: 1, month: 'Apr', date: 11, weekday: 'Sat', day: 'Sat, Apr 11', time: '9:00 AM', opponent: 'Vienna Youth SC', location: 'Westmore Park', home: true, team: 'U9 Fairfax FC' },
  { id: 'sg2', status: 'final', us: 1, them: 2, month: 'Apr', date: 18, weekday: 'Sat', day: 'Sat, Apr 18', time: '9:00 AM', opponent: 'Reston Rovers', location: 'Daniels Run Park', home: false, team: 'U9 Fairfax FC' },
  { id: 'sg3', status: 'final', us: 3, them: 0, month: 'Apr', date: 25, weekday: 'Sat', day: 'Sat, Apr 25', time: '9:00 AM', opponent: 'Oakton United', location: 'Westmore Park', home: true, team: 'U9 Fairfax FC' },
  { id: 'sg4', status: 'scheduled', month: 'May', date: 2, weekday: 'Sat', day: 'Sat, May 2', time: '9:00 AM', opponent: 'Centreville SC', location: 'Greenbriar Park', home: false, team: 'U9 Fairfax FC' },
  { id: 'sg11', status: 'final', us: 2, them: 1, month: 'Apr', date: 11, weekday: 'Sat', day: 'Sat, Apr 11', time: '11:00 AM', opponent: 'Annandale SC', location: 'Westmore Park', home: true, team: 'U12 Fairfax FC' },
  { id: 'sg12', status: 'final', us: 0, them: 3, month: 'Apr', date: 18, weekday: 'Sat', day: 'Sat, Apr 18', time: '12:30 PM', opponent: 'Burke United', location: 'Burke Lake Park', home: false, team: 'U12 Fairfax FC' },
  { id: 'sg13', status: 'final', us: 5, them: 2, month: 'Apr', date: 25, weekday: 'Sat', day: 'Sat, Apr 25', time: '11:00 AM', opponent: 'Springfield FC', location: 'Westmore Park', home: true, team: 'U12 Fairfax FC' },
  { id: 'sg14', status: 'scheduled', month: 'May', date: 2, weekday: 'Sat', day: 'Sat, May 2', time: '1:00 PM', opponent: 'Vienna Youth SC', location: 'James Madison HS', home: false, team: 'U12 Fairfax FC' },
];

export const INITIAL_PRACTICES = [
  // ── Summer 2026 Travel Select ─────────────────────────────────────────────────
  // Mon/Wed/Fri · 8 weeks (Jun 15 – Aug 7)
  // Week 1 (Jun 15/17/19): Providence ES
  //   Court A 6:00–7:30 PM → Aidris B5, Mike Do G6
  //   Court B 7:30–9:00 PM → Tom B6, Earnest G7
  // Weeks 2–8 (Jun 22 – Aug 7): KJMS
  //   KJMS #1 6:00–7:30 PM → Aidris B5 · 7:30–9:00 PM → Tom B6
  //   KJMS #2 6:00–7:30 PM → Mike Do G6 · 7:30–9:00 PM → Earnest G7

  // Week 1 — Providence ES
  { id: 'ts_ab5_1',  date: 'Mon, Jun 15', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_1', date: 'Mon, Jun 15', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_1',  date: 'Mon, Jun 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_1',  date: 'Mon, Jun 15', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_2',  date: 'Wed, Jun 17', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_2', date: 'Wed, Jun 17', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_2',  date: 'Wed, Jun 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_2',  date: 'Wed, Jun 17', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_3',  date: 'Fri, Jun 19', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_mdg6_3', date: 'Fri, Jun 19', time: '6:00-7:30 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_tb6_3',  date: 'Fri, Jun 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_eg7_3',  date: 'Fri, Jun 19', time: '7:30-9:00 PM', gym: 'Providence ES', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 2 — KJMS (Jun 22/24/26)
  { id: 'ts_ab5_4',  date: 'Mon, Jun 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_4',  date: 'Mon, Jun 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_4', date: 'Mon, Jun 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_4',  date: 'Mon, Jun 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_5',  date: 'Wed, Jun 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_5',  date: 'Wed, Jun 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_5', date: 'Wed, Jun 24', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_5',  date: 'Wed, Jun 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_6',  date: 'Fri, Jun 26', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_6',  date: 'Fri, Jun 26', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_6', date: 'Fri, Jun 26', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_6',  date: 'Fri, Jun 26', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 3 — KJMS (Jun 29 / Jul 1 / Jul 3)
  { id: 'ts_ab5_7',  date: 'Mon, Jun 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_7',  date: 'Mon, Jun 29', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_7', date: 'Mon, Jun 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_7',  date: 'Mon, Jun 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_8',  date: 'Wed, Jul 1',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_8',  date: 'Wed, Jul 1',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_8', date: 'Wed, Jul 1',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_8',  date: 'Wed, Jul 1',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_9',  date: 'Fri, Jul 3',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_9',  date: 'Fri, Jul 3',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_9', date: 'Fri, Jul 3',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_9',  date: 'Fri, Jul 3',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 4 — KJMS (Jul 6/8/10)
  { id: 'ts_ab5_10',  date: 'Mon, Jul 6',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_10',  date: 'Mon, Jul 6',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_10', date: 'Mon, Jul 6',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_10',  date: 'Mon, Jul 6',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_11',  date: 'Wed, Jul 8',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_11',  date: 'Wed, Jul 8',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_11', date: 'Wed, Jul 8',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_11',  date: 'Wed, Jul 8',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_12',  date: 'Fri, Jul 10', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_12',  date: 'Fri, Jul 10', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_12', date: 'Fri, Jul 10', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_12',  date: 'Fri, Jul 10', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 5 — KJMS (Jul 13/15/17)
  { id: 'ts_ab5_13',  date: 'Mon, Jul 13', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_13',  date: 'Mon, Jul 13', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_13', date: 'Mon, Jul 13', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_13',  date: 'Mon, Jul 13', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_14',  date: 'Wed, Jul 15', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_14',  date: 'Wed, Jul 15', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_14', date: 'Wed, Jul 15', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_14',  date: 'Wed, Jul 15', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_15',  date: 'Fri, Jul 17', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_15',  date: 'Fri, Jul 17', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_15', date: 'Fri, Jul 17', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_15',  date: 'Fri, Jul 17', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 6 — KJMS (Jul 20/22/24)
  { id: 'ts_ab5_16',  date: 'Mon, Jul 20', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_16',  date: 'Mon, Jul 20', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_16', date: 'Mon, Jul 20', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_16',  date: 'Mon, Jul 20', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_17',  date: 'Wed, Jul 22', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_17',  date: 'Wed, Jul 22', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_17', date: 'Wed, Jul 22', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_17',  date: 'Wed, Jul 22', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_18',  date: 'Fri, Jul 24', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_18',  date: 'Fri, Jul 24', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_18', date: 'Fri, Jul 24', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_18',  date: 'Fri, Jul 24', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 7 — KJMS (Jul 27/29/31)
  { id: 'ts_ab5_19',  date: 'Mon, Jul 27', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_19',  date: 'Mon, Jul 27', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_19', date: 'Mon, Jul 27', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_19',  date: 'Mon, Jul 27', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_20',  date: 'Wed, Jul 29', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_20',  date: 'Wed, Jul 29', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_20', date: 'Wed, Jul 29', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_20',  date: 'Wed, Jul 29', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_21',  date: 'Fri, Jul 31', time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_21',  date: 'Fri, Jul 31', time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_21', date: 'Fri, Jul 31', time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_21',  date: 'Fri, Jul 31', time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },

  // Week 8 — KJMS (Aug 3/5/7)
  { id: 'ts_ab5_22',  date: 'Mon, Aug 3',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_22',  date: 'Mon, Aug 3',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_22', date: 'Mon, Aug 3',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_22',  date: 'Mon, Aug 3',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_23',  date: 'Wed, Aug 5',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_23',  date: 'Wed, Aug 5',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_23', date: 'Wed, Aug 5',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_23',  date: 'Wed, Aug 5',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
  { id: 'ts_ab5_24',  date: 'Fri, Aug 7',  time: '6:00-7:30 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Aidris B5' },
  { id: 'ts_tb6_24',  date: 'Fri, Aug 7',  time: '7:30-9:00 PM', gym: 'KJMS #1', type: 'Practice', rsvp: 0, notes: '', team: 'Tom B6' },
  { id: 'ts_mdg6_24', date: 'Fri, Aug 7',  time: '6:00-7:30 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Mike Do G6' },
  { id: 'ts_eg7_24',  date: 'Fri, Aug 7',  time: '7:30-9:00 PM', gym: 'KJMS #2', type: 'Practice', rsvp: 0, notes: '', team: 'Earnest G7' },
];

export const INITIAL_MESSAGES = [
  {
    id: 'm1', from: 'Coach M. Davis', time: '2h ago', unread: true, target: 'All families',
    subject: 'Game day info — Dec 7 vs. Vienna Storm',
    body: `Hawks family!\n\nJust a reminder that this Saturday's game is at Robinson Secondary, Gym B at 10:00 AM. Please arrive by 9:30 for warm-ups.\n\nWe'll be wearing our NAVY jerseys (home game). If you need a carpool, check the sheet in your email — 3 families already volunteered.\n\nLet's go Hawks!\n— Coach Davis`,
  },
  {
    id: 'm2', from: 'Coach M. Davis', time: 'Yesterday', unread: true, target: 'All families',
    subject: 'Practice update — Monday @ Daniels Run',
    body: `Quick note: Monday's practice is confirmed at Daniels Run ES, starting at 6:00 PM sharp. We'll be working on our pick-and-roll defense and transition offense.\n\nPlease bring water and sneakers. See you there!\n— Coach Davis`,
  },
  {
    id: 'm3', from: 'FPYC Commissioner', time: '3 days ago', unread: false, target: 'All families',
    subject: 'Season standings update',
    body: `The Fairfax Hawks are currently 2nd in the division at 6–3. Top 4 teams advance to playoffs. Keep up the great work!\n\nFull standings are available at fpycsports.org.`,
  },
  {
    id: 'm4', from: 'Coach M. Davis', time: 'Nov 30', unread: false, target: 'All families',
    subject: 'Great win today! 48–39',
    body: `Proud of the team today — that was a great defensive effort in the second half. Jordan had a fantastic game.\n\nNext up: Reston Wolves on Dec 14. Enjoy your week!\n— Coach Davis`,
  },
];

export const INITIAL_STAFF = [
  { id: 'st1', name: "Joshua Nehr", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "joshuanehr@gmail.com", phone: "(720) 532-5737", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st2', name: "Artemus Gwynn", role: "Scorekeeper", program: 'Recreation', team: "Rising 2nd-3rd Boys", email: "artemus.gwynn@gmail.com", phone: "(336) 577-4105", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st3', name: "Nabil Ali", role: "League Director", program: 'Recreation', team: "Rising 4th-5th Boys", email: "syednabilali@gmail.com", phone: "(703) 994-2211", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st4', name: "Gene Kintgen", role: "Assistant Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "ekintgen@gmail.com", phone: "(812) 340-4749", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st5', name: "Braylen Coleman", role: "Scorekeeper", program: 'Recreation', team: "Girls 3v3 (2nd-8th)", email: "braylenjcoleman@icloud.com", phone: "(571) 221-2134", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st6', name: "Nick Blessing", role: "Coach", program: 'Recreation', team: "Rising 2nd-3rd Boys", email: "n.blessing33@gmail.com", phone: "7034479462", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st7', name: "Jim Quinn", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "james.john.quinn@gmail.com", phone: "(201)951-2824", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st8', name: "Shaun Ali", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "shaunali34@gmail.com", phone: "(703) 989-0847", bgCheckStatus: "Expired", bgCheckDate: '' },
  { id: 'st9', name: "Adam Schrecengost", role: "Assistant Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "schreckdc@gmail.com", phone: "(202)937-5119", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st10', name: "Adam Schrecengost", role: "Assistant Coach", program: 'Recreation', team: "Girls 3v3 (2nd-8th)", email: "schreckdc@gmail.com", phone: "(202)937-5119", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st11', name: "Dale Van Wagner", role: "Assistant Coach", program: 'Recreation', team: "Rising 6th-8th Boys", email: "dale.vanwagner@gmail.com", phone: "(215) 499-5165", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'st12', name: "Kesara Liyanage", role: "Coach", program: 'Recreation', team: "Rising 4th-5th Boys", email: "kliyanage30@gmail.com", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  // Travel Select coaches — Summer 2026 (program: 'Select' so they appear under the Select tab)
  { id: 'ts_c1', name: "Aidris Daud",   role: "Head Coach", program: 'Select', team: "Aidris B5",   email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c2', name: "Coach Tom",     role: "Head Coach", program: 'Select', team: "Tom B6",      email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c3', name: "Mike Do",       role: "Head Coach", program: 'Select', team: "Mike Do G6",  email: "michaeldo82@gmail.com", phone: "(571) 328-8126", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c4', name: "Coach Earnest", role: "Head Coach", program: 'Select', team: "Earnest G7",  email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c5', name: "Coach Rene",    role: "Head Coach", program: 'Select', team: "Rene B7",     email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c6', name: "Mike Lee",      role: "Head Coach", program: 'Select', team: "Mike Lee B8", email: "", phone: "", bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'ts_c7', name: "Coach Keun",    role: "Head Coach", program: 'Select', team: "Keun B8-2",   email: "keunyoo29@gmail.com", phone: "(702) 887-3034", bgCheckStatus: "Not Started", bgCheckDate: '' },
  // Training staff
  { id: 'tr1', name: "Nabil Ali",            role: "Director",  program: 'Training', team: '', email: "syednabilali@gmail.com",  phone: "(703) 994-2211", bgCheckStatus: "Expired",     bgCheckDate: '' },
  { id: 'tr2', name: "Shaun Ali",            role: "Trainer",   program: 'Training', team: '', email: "shaunali34@gmail.com",    phone: "(703) 989-0847", bgCheckStatus: "Expired",     bgCheckDate: '' },
  { id: 'tr3', name: "Kesara Liyanage",      role: "Trainer",   program: 'Training', team: '', email: "kliyanage30@gmail.com",   phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'tr4', name: "Aidris Daud",          role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'tr5', name: "PJ Kelly",             role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'tr6', name: "Nikan",                role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'tr7', name: "Margad Choijilsuren",  role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
  { id: 'tr8', name: "Hafsa Ali",            role: "Trainer",   program: 'Training', team: '', email: "",                        phone: "",               bgCheckStatus: "Not Started", bgCheckDate: '' },
];

export function useStaff() {
  return useSupabaseTable('staff', INITIAL_STAFF);
}

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
  return useSupabaseTable('messages', INITIAL_MESSAGES);
}

export function usePayments() {
  return useSupabaseTable('payments', []);
}

export function useAttendance() {
  return useSupabaseTable('attendance', []);
}

export function useOfficials() {
  return useSupabaseTable('officials', []);
}

// Summer 2026 gym permits — from NCS permit system
const INITIAL_GYM_PERMITS = [
  {
    id: 'gp-4686422',
    gym_name: 'Providence ES',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-15',
    end_date: '2026-07-31',
    sport: 'basketball',
    notes: 'Permit #4686422 — FPYC Summer Basketball',
  },
  {
    id: 'gp-4686424',
    gym_name: 'Daniels Run ES Gym #1',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-07-01',
    end_date: '2026-07-31',
    sport: 'basketball',
    notes: 'Permit #4686424 — FPYC Summer Basketball',
  },
  {
    id: 'gp-4698157',
    gym_name: 'KJMS #1',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-22',
    end_date: '2026-08-07',
    sport: 'basketball',
    notes: 'Permit #4698157 — Summer Basketball FPYC (Johnson MS Gym #1)',
  },
  {
    id: 'gp-4698157-2',
    gym_name: 'KJMS #2',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-22',
    end_date: '2026-08-07',
    sport: 'basketball',
    notes: 'Permit #4698157 — Summer Basketball FPYC (Johnson MS Gym #2)',
  },
  {
    id: 'gp-4700223',
    gym_name: 'Fairfax HS',
    season: 'summer',
    year: 2026,
    days: ['Mon', 'Wed', 'Fri'],
    start_time: '18:00',
    end_time: '21:00',
    start_date: '2026-06-15',
    end_date: '2026-07-27',
    sport: 'basketball',
    notes: 'Permit #4700223 — Summer Basketball FPYC FH 6pm-9pm',
  },
];

export function useGymPermits() {
  return useSupabaseTable('gym_permits', INITIAL_GYM_PERMITS);
}

export function useBlackoutDates() {
  return useSupabaseTable('blackout_dates', []);
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
  'PowerRec U9-U10': [
    { rank: 1, team: 'Reston Rovers',     fpyc: false, w: 3, l: 1, pf: 9, pa: 6, streak: 'W1' },
    { rank: 2, team: 'U9 Fairfax FC',     fpyc: true,  w: 2, l: 1, pf: 8, pa: 3, streak: 'W1' },
    { rank: 3, team: 'Oakton United',     fpyc: false, w: 1, l: 2, pf: 5, pa: 6, streak: 'L1' },
    { rank: 4, team: 'Vienna Youth SC',   fpyc: false, w: 1, l: 2, pf: 4, pa: 7, streak: 'L2' },
    { rank: 5, team: 'Centreville SC',    fpyc: false, w: 1, l: 2, pf: 4, pa: 8, streak: 'L1' },
  ],
  'NCSL Rec U11-U19': [
    { rank: 1, team: 'U12 Fairfax FC',    fpyc: true,  w: 2, l: 1, pf: 7, pa: 4, streak: 'W1' },
    { rank: 2, team: 'Springfield FC',    fpyc: false, w: 2, l: 1, pf: 6, pa: 6, streak: 'L1' },
    { rank: 3, team: 'Annandale SC',      fpyc: false, w: 1, l: 1, pf: 3, pa: 3, streak: 'L1' },
    { rank: 4, team: 'Burke United',      fpyc: false, w: 1, l: 1, pf: 3, pa: 2, streak: 'W1' },
    { rank: 5, team: 'Vienna Youth SC',   fpyc: false, w: 0, l: 2, pf: 2, pa: 6, streak: 'L2' },
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
  // U9 Fairfax FC — Soccer (sp1-sp5)
  sg1: { // W 4-1 vs Vienna Youth SC
    sp2: { gls: 2, ast: 1, yc: 0, rc: 0 },
    sp4: { gls: 2, ast: 0, yc: 0, rc: 0 },
    sp5: { gls: 0, ast: 2, yc: 0, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg2: { // L 1-2 @ Reston Rovers
    sp2: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp4: { gls: 0, ast: 1, yc: 0, rc: 0 },
    sp5: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg3: { // W 3-0 vs Oakton United
    sp4: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp2: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp5: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp1: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp3: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  // U12 Fairfax FC — Soccer (sp11-sp14)
  sg11: { // W 2-1 vs Annandale SC
    sp13: { gls: 1, ast: 1, yc: 0, rc: 0 },
    sp12: { gls: 1, ast: 0, yc: 1, rc: 0 },
    sp11: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg12: { // L 0-3 @ Burke United
    sp13: { gls: 0, ast: 0, yc: 0, rc: 0 },
    sp12: { gls: 0, ast: 0, yc: 1, rc: 0 },
    sp11: { gls: 0, ast: 0, yc: 0, rc: 1 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
  },
  sg13: { // W 5-2 vs Springfield FC
    sp13: { gls: 3, ast: 1, yc: 0, rc: 0 },
    sp12: { gls: 1, ast: 2, yc: 0, rc: 0 },
    sp11: { gls: 1, ast: 0, yc: 0, rc: 0 },
    sp14: { gls: 0, ast: 0, yc: 0, rc: 0 },
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
    time: p.time.split(/[–-]/)[0].trim(),
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

export function useRegistrations() {
  return useSupabaseTable('registrations', []);
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

// ── Budget ────────────────────────────────────────────────────────────────────

export const INITIAL_BUDGET = {
  id: 'budget-2526',
  year: '2025-26',
  projectedPlayers: 795,
  feeTypes: [
    { id: 'ft1', label: 'Regular',       players: 485, fee: 195  },
    { id: 'ft2', label: 'Scholarship',   players: 50,  fee: 75   },
    { id: 'ft3', label: 'Late Fee',      players: 75,  fee: 45   },
    { id: 'ft4', label: 'Select Winter', players: 100, fee: 245  },
    { id: 'ft5', label: 'Select Summer', players: 85,  fee: 215  },
    { id: 'ft6', label: 'Skills Clinic', players: 75,  fee: 65   },
  ],
  revenueOther: [
    { id: 'ro1', account: '1027-08', label: 'Donations', budgeted: 0, actual: 1786 },
  ],
  expenses: [
    { id: 'e1',  account: '5050-08', label: 'Admin Contributions',    perPlayer: 12.50, budget: null, actual: 0, notes: 'Basketball share toward FPYC expense' },
    { id: 'e3',  account: '5058-08', label: 'Capital Improvement',    perPlayer: 7.41,  budget: null, actual: 0, notes: 'Building/fields expenses' },
    { id: 'e5',  account: '5060-08', label: 'Database',               perPlayer: 1.00,  budget: null, actual: 0, notes: 'Demosphere + TeamSnap' },
    { id: 'e7',  account: '5068-08', label: 'Ins / Clubhouse',        perPlayer: 0.60,  budget: null, actual: 0, notes: '' },
    { id: 'e8',  account: '5070-08', label: 'Ins / L&A',             perPlayer: 15.35, budget: null, actual: 0, notes: '' },
    { id: 'e9',  account: '5071-08', label: 'Ins / D&O',             perPlayer: 0.39,  budget: null, actual: 0, notes: '' },
    { id: 'e2',  account: '5051-08', label: 'Annual Reception',       perPlayer: null,  budget: 650,   actual: 0, notes: 'End of year food/bar tab for coaches' },
    { id: 'e4',  account: '5059-08', label: 'County / City Fees',     perPlayer: null,  budget: 30000, actual: 0, notes: 'Gym fees' },
    { id: 'e6',  account: '5062-08', label: 'Equipment',              perPlayer: null,  budget: 4500,  actual: 0, notes: 'Basketballs and other equipment' },
    { id: 'e10', account: '5074-08', label: 'Miscellaneous',          perPlayer: null,  budget: 8000,  actual: 0, notes: 'Travel league FCYBL fees' },
    { id: 'e11', account: '5084-08', label: 'Referees / Umpires',     perPlayer: null,  budget: 30000, actual: 0, notes: 'Refs' },
    { id: 'e12', account: '5086-08', label: 'Refunds',                perPlayer: null,  budget: 500,   actual: 0, notes: 'Post-season refunds' },
    { id: 'e13', account: '5088-08', label: 'Registrations (Expense)',perPlayer: null,  budget: 5000,  actual: 0, notes: '' },
    { id: 'e14', account: '5093-08', label: 'Spirit Wear / Coaches',  perPlayer: null,  budget: 3000,  actual: 0, notes: 'Coaches gear 2026' },
    { id: 'e15', account: '5096-08', label: 'Training',               perPlayer: null,  budget: 21000, actual: 0, notes: 'Shaun / TYS / Evolution' },
    { id: 'e16', account: '5098-08', label: 'Trophies / Plaques',     perPlayer: null,  budget: 3000,  actual: 0, notes: 'Awards' },
    { id: 'e17', account: '5099-08', label: 'Uniforms',               perPlayer: null,  budget: 14000, actual: 0, notes: 'Uniforms' },
  ],
};

export function useBudget() {
  const [budget, setBudgetState] = useState(INITIAL_BUDGET);

  useEffect(() => {
    supabase.from('budget').select('data').eq('id', 'budget-2526').single().then(({ data, error }) => {
      if (!error && data?.data) setBudgetState(data.data);
    });
  }, []);

  async function saveBudget(newBudget) {
    setBudgetState(newBudget);
    await supabase.from('budget').upsert({ id: 'budget-2526', data: newBudget, updated_at: new Date().toISOString() });
  }

  return [budget, saveBudget];
}

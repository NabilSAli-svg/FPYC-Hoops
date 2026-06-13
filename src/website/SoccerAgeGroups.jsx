import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SoccerSubNav from './SoccerSubNav.jsx';
import { SectionHead } from './Programs.jsx';

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

const AGE_GROUPS = [
  { group: 'U04 Coed',         start: '01/01/2022', end: '06/30/2023' },
  { group: 'U05 Coed',         start: '01/01/2021', end: '12/31/2021' },
  { group: 'U06 Boys & Girls',  start: '01/01/2020', end: '12/31/2020' },
  { group: 'U07 Boys & Girls',  start: '01/01/2019', end: '12/31/2019' },
  { group: 'U08 Boys & Girls',  start: '01/01/2018', end: '12/31/2018' },
  { group: 'U09 Boys & Girls',  start: '01/01/2017', end: '12/31/2017' },
  { group: 'U10 Boys & Girls',  start: '01/01/2016', end: '12/31/2016' },
  { group: 'U11 Boys & Girls',  start: '01/01/2015', end: '12/31/2015' },
  { group: 'U12 Boys & Girls',  start: '01/01/2014', end: '12/31/2014' },
  { group: 'U13 Boys & Girls',  start: '01/01/2013', end: '12/31/2013' },
  { group: 'U14 Boys & Girls',  start: '01/01/2012', end: '12/31/2012' },
  { group: 'U16 Boys & Girls',  start: '01/01/2010', end: '12/31/2011' },
  { group: 'U19 Boys & Girls',  start: '01/01/2007', end: '12/31/2009' },
];

export default function SoccerAgeGroups() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <SoccerSubNav active="age-groups" />
      <main>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 96px' }}>
          <SectionHead
            eyebrow="FPYC Soccer"
            title="Age group chart"
            sub="Age group eligibility for Fall 2025 – Spring 2026, based on the player's date of birth."
          />
          <div style={{ marginTop: 32, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-1)', maxWidth: 720 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--court-navy)', color: '#fff' }}>
                  <th style={th}>Age group</th>
                  <th style={th}>Beginning date</th>
                  <th style={th}>Ending date</th>
                </tr>
              </thead>
              <tbody>
                {AGE_GROUPS.map((g, i) => (
                  <tr key={g.group} style={{ background: i % 2 ? 'var(--bone)' : '#fff' }}>
                    <td style={td}>{g.group}</td>
                    <td style={td}>{g.start}</td>
                    <td style={td}>{g.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const th = { textAlign: 'left', padding: '12px 18px', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' };
const td = { padding: '10px 18px', borderBottom: '1px solid var(--border)', color: 'var(--fg)' };

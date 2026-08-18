import { SectionHead } from './Programs.jsx';
import { REGISTER_URL } from '../shared/store.js';

const EVENTS = [
  {
    date: 'Sept 14',
    title: 'Fall Skills Clinic begins',
    desc: 'Mondays at Providence ES · Beginner 6–7, Intermediate 7–8, Advanced 8–9',
    category: 'play',
  },
  {
    date: 'Fall',
    title: 'Walk-in registration',
    desc: 'Saturdays 10am–12pm · FPYC Clubhouse, 10701 West Dr · dates posted at fpycsports.com',
    category: 'reg',
  },
  {
    date: 'Oct 26',
    title: 'Fall Skills Clinic ends',
    desc: 'Six sessions complete · no clinic Oct 12 (Columbus Day)',
    category: 'play',
  },
  {
    date: 'Nov 15',
    title: 'Late fees begin',
    desc: '$45 surcharge added · register before this date',
    category: 'warn',
  },
  {
    date: 'Mid Nov',
    title: 'Team placements',
    desc: 'Commissioner assigns players to balanced rosters',
    category: 'team',
  },
  {
    date: 'Late Nov',
    title: 'Coach contact',
    desc: 'Your coach reaches out with practice details',
    category: 'team',
  },
  {
    date: 'Early Dec',
    title: 'Winter practices begin',
    desc: 'Weekday practices at local Fairfax County school gyms',
    category: 'play',
  },
  {
    date: 'Dec',
    title: 'Season opener',
    desc: 'First games of the 2026–27 Rec and Select seasons',
    category: 'play',
  },
  {
    date: 'Mar',
    title: 'Championships',
    desc: 'FPYC Basketball Championship Weekend — all divisions',
    category: 'champ',
  },
];

const CAT = {
  reg:   { color: 'var(--court-navy)',        bg: 'rgba(10,31,61,0.08)',      label: 'Registration' },
  warn:  { color: 'var(--foul-red)',           bg: 'rgba(200,16,46,0.08)',     label: 'Deadline'     },
  team:  { color: 'var(--basketball-orange)', bg: 'rgba(232,119,34,0.10)',    label: 'Team'         },
  play:  { color: '#059669',                  bg: 'rgba(5,150,105,0.08)',     label: 'Games'        },
  champ: { color: '#D97706',                  bg: 'rgba(217,119,6,0.10)',     label: 'Championship' },
};

export default function SeasonCalendar() {
  return (
    <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 44 }}>
          <SectionHead
            eyebrow="Season 2026–27"
            title="Key dates"
            sub="Everything from registration to championship — mark your calendar."
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(CAT).map(([k, c]) => (
              <span key={k} style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                background: c.bg, color: c.color,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{c.label}</span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div className="cal-hline" style={{
            position: 'absolute', top: 28, left: 27, right: 27, height: 2,
            background: 'var(--border)', zIndex: 0,
          }} />

          <style>{`@media(max-width:768px){.cal-grid{display:flex!important;flex-direction:column!important}.cal-hline{display:none!important}}`}</style>
          <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${EVENTS.length}, 1fr)`, gap: 12, position: 'relative', zIndex: 1 }}>
            {EVENTS.map((e, i) => {
              const c = CAT[e.category];
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  {/* Node */}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                    background: '#fff',
                    border: `3px solid ${c.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 0 4px ${c.bg}`,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: c.color,
                    }} />
                  </div>

                  {/* Card */}
                  <div style={{
                    background: '#fff', border: `1px solid var(--border)`,
                    borderTop: `3px solid ${c.color}`,
                    borderRadius: 10, padding: '12px 10px',
                    width: '100%', boxSizing: 'border-box',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-1)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: c.color, textTransform: 'uppercase', lineHeight: 1, marginBottom: 6 }}>{e.date}</div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--court-navy)', lineHeight: 1.2, marginBottom: 6 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.45 }}>{e.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA bar */}
        <div style={{
          marginTop: 36,
          background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
          padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', align: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--basketball-orange)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>
              <strong>Walk-in registration</strong> · Saturdays 10am–12pm at the FPYC Clubhouse, 10701 West Dr, Fairfax VA 22030
            </span>
          </div>
          <a href={REGISTER_URL} target="_blank" rel="noreferrer" style={{
            background: 'var(--varsity-gold)', color: 'var(--court-navy)',
            padding: '10px 18px', borderRadius: 8, textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            Register online now →
          </a>
        </div>
      </div>
    </section>
  );
}

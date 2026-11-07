import { SectionHead } from './Programs.jsx';
import { REGISTER_URL } from '../shared/store.js';

const EVENTS = [
  {
    date: 'Nov 14',
    title: 'House League evaluations',
    desc: 'Rec players 3rd grade and up — scores feed the draft that follows',
    category: 'team',
  },
  {
    date: 'Nov 15',
    title: 'Late fees begin',
    desc: '$45 surcharge added · register before this date',
    category: 'warn',
  },
  {
    date: 'After evals',
    title: 'Rec draft',
    desc: 'Evaluated players are drafted onto balanced Rec teams by age group',
    category: 'team',
  },
  {
    date: 'Dec 5',
    title: 'Select weekend play begins',
    desc: 'Daniels Run, Providence, KJMS & Fairfax HS, weekends through mid-March',
    category: 'play',
  },
  {
    date: 'Dec 19–Jan 3',
    title: 'Winter break',
    desc: 'No practices or games — facilities closed for the holidays',
    category: 'warn',
  },
  {
    date: 'Through Mar',
    title: 'Rec & Select seasons',
    desc: 'Weekday Rec practices and games · Select weekday practices plus weekend play',
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

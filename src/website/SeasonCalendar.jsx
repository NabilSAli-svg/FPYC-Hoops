import { SectionHead } from './Programs.jsx';

const EVENTS = [
  {
    date: 'Sept 27',
    title: 'Walk-in registration',
    desc: 'Saturday 10am–12pm · FPYC Office, 3955 Pickett Rd',
    category: 'reg',
  },
  {
    date: 'Oct 11',
    title: 'Final walk-in session',
    desc: 'Last chance for in-person help · same location',
    category: 'reg',
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
    date: 'Dec 2',
    title: 'Practices begin',
    desc: 'Weekday practices at local Fairfax County school gyms',
    category: 'play',
  },
  {
    date: 'Dec 7',
    title: 'Season opener',
    desc: 'First games of the 2025–26 House League season',
    category: 'play',
  },
  {
    date: 'Feb 22',
    title: 'Regular season ends',
    desc: 'Last regular season games across all divisions',
    category: 'play',
  },
  {
    date: 'Mar 1–8',
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
            eyebrow="Season 2025–26"
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
          <div style={{
            position: 'absolute', top: 28, left: 27, right: 27, height: 2,
            background: 'var(--border)', zIndex: 0,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 12, position: 'relative', zIndex: 1 }}>
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
              <strong>Walk-in registration</strong> is Sept 27 & Oct 11 · Saturdays 10am–12pm at 3955 Pickett Rd, Fairfax VA
            </span>
          </div>
          <a href="/register" style={{
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

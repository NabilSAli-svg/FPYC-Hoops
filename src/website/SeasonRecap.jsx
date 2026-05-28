import { SectionHead } from './Programs.jsx';
import { useBracket } from '../shared/store.js';

const SEASON = '2025–26';

const FPYC_TEAMS = [
  { name: 'Fairfax Hawks',   division: 'Boys 5–6 House',  record: '6–3', rank: 2,  playoff: true,  color: 'var(--court-navy)'        },
  { name: 'Fairfax Eagles',  division: 'Boys 7–8 Select', record: '8–1', rank: 1,  playoff: true,  color: '#C8102E'                   },
  { name: 'Fairfax Wolves',  division: 'Girls 5–6 House', record: '4–5', rank: 5,  playoff: false, color: '#1F8A5B'                   },
  { name: 'Fairfax Cougars', division: 'Girls 3–4 House', record: '3–6', rank: 5,  playoff: false, color: 'var(--basketball-orange)'  },
];

const NUMBERS = [
  { value: '147', label: 'Players in the league' },
  { value: '4',   label: 'FPYC teams' },
  { value: '32',  label: 'Volunteer coaches' },
  { value: '9',   label: 'Weeks of basketball' },
];

const AWARDS = [
  { award: 'Division Champion',   team: 'Centreville Eagles', detail: 'Boys 5–6 House · 9–1',       icon: 'trophy'     },
  { award: 'FPYC Top Team',       team: 'Fairfax Eagles',     detail: 'Boys 7–8 Select · 8–1 · #1', icon: 'star'       },
  { award: 'Coach of the Year',   team: 'J. Williams',        detail: 'Fairfax Eagles',              icon: 'award'      },
  { award: 'Sportsmanship Award', team: 'Fairfax Hawks',      detail: 'Boys 5–6 House',              icon: 'heart'      },
];

export default function SeasonRecap() {
  const [bracket] = useBracket();
  const champ = bracket.champion != null ? bracket.seeds[bracket.champion] : null;

  return (
    <section id="season-recap" style={{ background: 'var(--court-navy)', padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 8 }}>Season Recap</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', textTransform: 'uppercase', color: '#fff', lineHeight: 1, letterSpacing: '0.02em' }}>
              {SEASON} Season
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>
              Fairfax Police Youth Club Basketball · Fairfax, VA
            </div>
          </div>
          {champ && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, background: 'rgba(255,199,44,0.15)', border: '2px solid var(--varsity-gold)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--varsity-gold)" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Champion: {champ.name}</span>
            </div>
          )}
        </div>

        {/* Season numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
          {NUMBERS.map(n => (
            <div key={n.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '20px 22px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--varsity-gold)', lineHeight: 1, marginBottom: 6 }}>{n.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{n.label}</div>
            </div>
          ))}
        </div>

        {/* FPYC Teams */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>FPYC Teams This Season</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {FPYC_TEAMS.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${t.playoff ? 'rgba(255,199,44,0.3)' : 'rgba(255,255,255,0.08)'}`, borderLeft: `4px solid ${t.color}`, borderRadius: '0 12px 12px 0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{t.division}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.record}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: t.playoff ? 'rgba(255,199,44,0.18)' : 'rgba(255,255,255,0.08)', color: t.playoff ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {t.playoff ? `#${t.rank} · Playoffs` : `#${t.rank}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>Season Awards</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {AWARDS.map(a => (
              <div key={a.award} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AwardIcon name={a.icon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{a.award}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.team}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 28 }}>
          <a href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 8, background: 'var(--varsity-gold)', color: 'var(--court-navy)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 14 }}>
            Register for 2026–27
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#standings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14 }}>
            Final standings
          </a>
        </div>
      </div>
    </section>
  );
}

function AwardIcon({ name }) {
  const paths = {
    trophy:  <><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v5a6 6 0 0 1-12 0z"/></>,
    star:    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    award:   <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    heart:   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--varsity-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

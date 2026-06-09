import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

const PILLARS = [
  {
    icon: 'users',
    title: 'Community First',
    desc: '100% volunteer-run since 1962. Every coach, scorekeeper, and board member is a Fairfax parent giving time so kids can play.',
  },
  {
    icon: 'trending-up',
    title: 'Skill Development',
    desc: 'Fundamentals-forward coaching at every level — from dribbling basics in Skills Clinic to competitive FCYBL play in Select Travel.',
  },
  {
    icon: 'shield-check',
    title: 'Safe & Inclusive',
    desc: 'Background-checked coaches, waiver-verified rosters, and a zero-tolerance sportsmanship policy at every game.',
  },
  {
    icon: 'award',
    title: 'Scholarships',
    desc: 'No child sits out for financial reasons. Need-based scholarships are available — just check the box at registration.',
  },
  {
    icon: 'calendar',
    title: 'Balanced Schedule',
    desc: 'Saturday games, weekday practices at neighborhood schools. Teams are balanced so every player gets meaningful minutes.',
  },
  {
    icon: 'heart',
    title: 'It\'s Just Fun',
    desc: 'Lifelong friendships, post-game handshakes, and a gym full of kids who love the game. That\'s the whole point.',
  },
];

const STATS = [
  { value: '62', label: 'Years in Fairfax' },
  { value: '500+', label: 'Kids this season' },
  { value: '40+', label: 'Teams across divisions' },
  { value: '$0', label: 'If you need a scholarship' },
];

export default function WhyFPYC() {
  return (
    <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      {/* Stats strip */}
      <style>{`@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}.stats-grid>div{border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.10)}.pillars-grid{grid-template-columns:1fr!important}}`}</style>
      <div style={{ background: 'var(--court-navy)', backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,199,44,0.10), transparent 60%)' }}>
        <div className="stats-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--varsity-gold)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <SectionHead
          eyebrow="Why FPYC Basketball"
          title="Built for every kid"
          sub="FPYC Basketball is Fairfax County's largest youth basketball program — from first-time players to competitive travel teams."
        />
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 44 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '24px 26px',
              boxShadow: 'var(--shadow-1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(10,31,61,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={p.icon} size={22} color="var(--court-navy)" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1.1 }}>{p.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-soft)', margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

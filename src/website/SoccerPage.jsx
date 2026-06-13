import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';
import SoccerSubNav from './SoccerSubNav.jsx';

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

const PROGRAMS = [
  {
    tag: 'U4 – U5',
    title: 'Mini & Mighty Academy',
    desc: 'Saturday academy-style training and small-sided games. U6 transitions to one practice or training session per week, with small-sided games on Saturdays.',
  },
  {
    tag: 'U7 – U10',
    title: 'PowerRec Youth',
    desc: '1–2 practices per week (depending on coach), 1 hour each. Saturday small-sided games for U6–U8, and 8v8 games for U9–U10.',
    featured: true,
  },
  {
    tag: 'U11 – U19',
    title: 'NCSL Rec',
    desc: 'Minimum 2 practices per week (depending on coach), 1.5 hours each. Games scheduled by NCSL, played on Saturday with some Sunday games possible.',
  },
];

const FAQS = [
  {
    q: 'When will practices and games begin?',
    a: 'Practice times, days, and locations are determined by each coach. Most teams begin practicing March 15, and practice schedules are usually sent by your coach between March 15 and March 27.',
  },
  {
    q: "How will I know who my player's coach is?",
    a: 'Coaches will contact players after the Coaches Meeting in late August (Fall) or March (Spring).',
  },
  {
    q: "What do I do if I haven't heard from my player's coach by that time?",
    a: "If you haven't been contacted by a coach, please contact the League Director for your child's age group.",
  },
  {
    q: "When will I know my player's game schedule?",
    a: 'Game schedules will be available in late August (Fall) or March (Spring).',
  },
];

export default function SoccerPage() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <SoccerSubNav active="" />
      <main>
        {/* Hero */}
        <section style={{ background: 'var(--court-navy)', color: '#fff', padding: '96px 24px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>FPYC Soccer</div>
            <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1, marginTop: 8 }}>
              Be True, Be Bold —<br />Be Blue and Gold
            </div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', marginTop: 16, maxWidth: 680, lineHeight: 1.6 }}>
              Welcome to Spring 2026 FPYC Soccer families! The Spring player database is open for registration —
              we welcome both new and returning players. For our community, by our community.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', marginTop: 16, maxWidth: 680, lineHeight: 1.7 }}>
              FPYC Soccer celebrates over 65 years serving our community of Fairfax, Virginia and surrounding areas.
              Our focus is to create a safe and enjoyable soccer experience for our children. From ages 3 to 19,
              FPYC has helped our kids develop positive traits such as teamwork and leadership, all while playing
              the greatest sport on the planet!
            </p>
            <a href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28,
              background: 'var(--varsity-gold)', color: 'var(--court-navy)', padding: '12px 22px', borderRadius: 8,
              textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            }}>Register for Spring 2026 <Icon name="arrow-right" size={14} /></a>
          </div>
        </section>

        {/* One Club */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 24px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', boxShadow: 'var(--shadow-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon name="heart-handshake" size={20} color="var(--basketball-orange)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>FPYC is One Club</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--fg-soft)' }}>
              We're proud to share the field, court, and community with our sibling programs — Basketball, Football,
              Field Hockey, Lacrosse, Running, and Volleyball. FPYC Soccer shares the same values as the rest of our
              community: we're run 100% by volunteers. Thank you to everyone who has supported FPYC Soccer in the
              past, today, and into the future — and a special welcome to new volunteers and families joining us.
              Together, we are all FPYC!
            </p>
          </div>
        </section>

        {/* Season format */}
        <section id="programs" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 24px' }}>
          <SectionHead
            eyebrow="Recreational Soccer"
            title="Season format"
            sub="10 weeks, 7–8 game weekends. The Spring 2026 season runs Saturday, April 11 through Saturday, June 6. Each team plays an 8-game season, with games on Saturdays — mornings for U5–U10, and mornings & afternoons for U11 and up."
          />
          <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {PROGRAMS.map(p => (
              <div key={p.title} style={{
                background: p.featured ? 'var(--court-navy)' : '#fff',
                color: p.featured ? '#fff' : 'var(--fg)',
                border: p.featured ? '1px solid var(--court-navy)' : '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: p.featured ? 'var(--shadow-3)' : 'var(--shadow-1)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ height: 6, background: p.featured ? 'var(--varsity-gold)' : 'var(--border-strong)' }} />
                <div style={{ padding: '22px 24px 24px' }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: p.featured ? 'var(--varsity-gold)' : 'var(--fg-muted)',
                  }}>{p.tag}</span>
                  <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 28, lineHeight: 1.15, margin: '10px 0 12px', color: p.featured ? '#fff' : 'var(--court-navy)' }}>{p.title}</div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: p.featured ? 'rgba(255,255,255,0.82)' : 'var(--fg-soft)' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginTop: 24, boxShadow: 'var(--shadow-1)' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)', marginBottom: 10 }}>How teams & practices work</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--fg-soft)' }}>
              All our coaches are volunteers — each coach picks their own practice nights and location, generally
              within or just outside the City of Fairfax. All fields are listed on the soccer page of our website.
              We usually don't have practice night info when teams are formed, so things may get adjusted once we
              know each team's schedule. Teams are generally formed based on special requests, neighborhood, closest
              school, or school attended — we do our best to accommodate requests made on registration forms.
            </p>
          </div>
        </section>

        {/* News / partnerships */}
        <section id="news" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 24px' }}>
          <SectionHead eyebrow="News & partnerships" title="What's happening" />
          <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 32 }}>
            <NewsCard icon="shopping-bag" title="Gear up at Dick's Sporting Goods">
              Take 20% off your entire purchase at the Fairfax store, March 13–16. Year-long coupons are also
              available in-store (cannot be combined with the 20% off offer).
            </NewsCard>
            <NewsCard icon="shirt" title="Burke Sports — FPYC logo gear">
              We've partnered with Burke Sports to offer an FPYC Soccer e-store for parents who want to show their
              support. Orders are processed and fulfilled by Burke Sports — let us know if you'd like to see
              something added to the store.
            </NewsCard>
            <NewsCard icon="snowflake" title="Pickup Soccer — Winter">
              An unstructured program for players to have fun and work on skills in a noncompetitive, no-stress
              environment, run by our partner Golden Boot Soccer. Over 80 players are already registered. Questions?
              Contact Rich Crowder, FPYC Soccer Director of Operations, at fpycsoccerrc@gmail.com.
            </NewsCard>
            <NewsCard icon="sun" title="Pickup Soccer — Summer">
              Coming soon!
            </NewsCard>
            <NewsCard icon="award" title="Golden Boot Soccer training" wide>
              We're once again partnering with Golden Boot Soccer for professional enrichment training from U4
              through U19 — including specialized sessions for keepers/goalies and strikers in our older age
              groups. More details to come as we get closer to the start of the season.
            </NewsCard>
          </div>
        </section>

        {/* Respect referees */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 24px' }}>
          <div style={{ background: 'rgba(232,119,34,0.08)', border: '1px solid rgba(232,119,34,0.25)', borderRadius: 14, padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon name="shield-alert" size={20} color="var(--basketball-orange)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>Respect and protect our referees</div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--fg-soft)' }}>
              Referee abuse is a growing concern nationwide, and it's leading experienced referees to leave the game
              while discouraging new ones from starting. Without referees, the match cannot be played. Soccer is a
              passionate sport, but referees are there to keep the game safe and fair — not to be the opposition.
              Sometimes they make mistakes; that's all it is, a mistake. Many of our referees are young and new to
              officiating, and many are someone's child too. Please treat them with the same respect you'd want
              shown to your own family.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 96px' }}>
          <SectionHead eyebrow="Pre-season" title="Frequently asked questions" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32, maxWidth: 800 }}>
            {FAQS.map(f => (
              <div key={f.q} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-1)' }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--court-navy)', marginBottom: 6 }}>{f.q}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-soft)' }}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function NewsCard({ icon, title, children, wide }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px',
      boxShadow: 'var(--shadow-1)', gridColumn: wide ? '1 / -1' : 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(10,31,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={18} color="var(--court-navy)" />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)' }}>{title}</div>
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-soft)', margin: 0 }}>{children}</p>
    </div>
  );
}

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import SoccerSubNav from './SoccerSubNav.jsx';
import { SectionHead } from './Programs.jsx';

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

const RULES = [
  'Only registered coaches or assistant coaches who have been assigned an FPYC house or FPYC travel team may request a practice field.',
  'Coaches will send their requests directly to the field coordinator assigned to the field they would like to practice on.',
  'Coaches will be allowed up to 2 practice times per season — not necessarily on the same field. Only after all registered coaches have received their two practices will a third practice be considered. In the Fall, only one practice will be allowed on a turf field; the second should be on grass.',
  'Practice times for the Spring season will be 5–6pm, 6–7pm, and 7–8pm. (Fall: 5–6pm and 6–7pm.) Extensions are only considered after all registered coaches have received their two practices. Times on artificial turf may vary due to FCPS schedules — Stafford and Draper 1 & 2 will begin at 5:45.',
  'Field requests are taken on a first-come, first-served basis. Field coordinators will do everything they can to keep the process fair.',
  'When requesting fields, coaches who play games on City fields should make every attempt to practice on City fields, and those who play on County fields should practice on County fields. Exceptions are possible under special circumstances.',
  'Practice on turf fields is restricted to U11–U19. U11/U12 teams will be allowed 1 practice on turf and 1 on grass.',
  'Field assignments are not official until posted on the fields page — posting begins within a week of the request date.',
  'Coaches should check the field page periodically for blackout dates on their field.',
];

const CITY_FIELDS = [
  { name: 'Daniels Run', detail: 'Practice Field — M-F 5-dark', coordinator: 'Tony DeFlumeri', email: 'soccer@fpycsports.com' },
  { name: 'Draper Park (T1)', detail: 'Football M-W-F 6-8 (Fall); Soccer M-F 5:15-8 (Spring); Soccer T-TR 5:30-8 (Fall); Soccer Sa Games; U11-U19 B&G and Travel', coordinator: 'Mike Anderson', email: 'fpycsoops@fpycsports.com' },
  { name: 'Draper Park (T2)', detail: 'Soccer M-F 5:15-8pm; Soccer Sa Games; U11-U19 B&G and Travel', coordinator: 'Mike Anderson', email: 'fpycsoops@fpycsports.com' },
  { name: 'Fairfax High School (T1)', detail: 'Game Field Only — Sat Football (Fall); Game Field Only — Sat Soccer (House); Sun — Travel (Spring & Fall); Field Hockey (Spring) & Running (Spring & Fall)', coordinator: 'Mike Anderson', email: '' },
];

const COUNTY_FIELDS = [
  { name: 'Eagle View ES', detail: 'RF1 (Upper) — M-T-TR-F 5pm-7pm; Sat 8am-7pm', coordinator: 'Tony DeFlumeri', email: 'soccer@fpycsports.com' },
  { name: 'Fairfax Villa ES', detail: 'Mon–Fri 5pm to dark; Sat/Sun 8am-7pm; Game Field — U8 Boys', coordinator: 'Tony DeFlumeri', email: 'soccer@fpycsports.com' },
  { name: 'Fairhill ES', detail: 'Game Field — U7 Boys; Mon–Fri 5pm to dark; Sat/Sun 8am-7pm', coordinator: 'Tony DeFlumeri', email: 'soccer@fpycsports.com' },
  { name: 'Frost MS', detail: 'Mon–Fri 5pm to dark; Sat 8am-7pm', coordinator: 'Tony DeFlumeri', email: 'soccer@fpycsports.com' },
];

export default function SoccerFields() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <SoccerSubNav active="fields" />
      <main>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 24px' }}>
          <SectionHead eyebrow="FPYC Soccer" title="Soccer fields & field requests" sub="Field requests will be accepted beginning Noon (not 12:01am) on March 6, 2026." />

          <ol style={{ marginTop: 28, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 800 }}>
            {RULES.map((r, i) => (
              <li key={i} style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--fg-soft)' }}>{r}</li>
            ))}
          </ol>
        </section>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 96px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon name="map-pin" size={18} color="var(--basketball-orange)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>Field calendars</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24 }}>Updated for Spring 2026. Contact the field coordinator listed for availability.</p>

          <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <FieldGroup title="City of Fairfax fields" fields={CITY_FIELDS} />
            <FieldGroup title="Fairfax County fields" fields={COUNTY_FIELDS} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FieldGroup({ title, fields }) {
  return (
    <div>
      <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{title}</div>
      <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
        {fields.map((f, i) => (
          <div key={f.name} style={{ padding: '14px 16px', borderBottom: i < fields.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--court-navy)' }}>{f.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-soft)', marginTop: 4, lineHeight: 1.5 }}>{f.detail}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>
              Coordinator — {f.coordinator}{f.email && <> · <a href={`mailto:${f.email}`} style={{ color: 'var(--court-navy)' }}>{f.email}</a></>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

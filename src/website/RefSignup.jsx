import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { supabase } from '../shared/supabase.js';

const PERKS = [
  { icon: 'dollar-sign',   title: 'Paid per game',        desc: 'Officials are paid for every game they work. Rates are confirmed when you are onboarded.' },
  { icon: 'graduation-cap',title: 'Training provided',    desc: 'New to officiating? We run training before the season — no prior experience needed to start.' },
  { icon: 'calendar',      title: 'You pick your games',  desc: 'Take the slots that fit your schedule. Most games are weeknights and Saturdays.' },
  { icon: 'map-pin',       title: 'Close to home',        desc: 'Games are at Providence ES, Daniels Run ES, and Johnson Middle School.' },
];

const EXPERIENCE = [
  { id: 'none',      label: 'New to officiating' },
  { id: 'some',      label: 'Some experience, not certified' },
  { id: 'certified', label: 'Certified official (VBOS or equivalent)' },
];

export default function RefSignup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', availability: '', note: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.experience) {
      setError('Name, email, and experience level are required.');
      return;
    }
    setSending(true);
    const { error: err } = await supabase.from('ref_signups').insert({
      id: 'ref-' + Math.random().toString(36).slice(2, 10),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      experience: form.experience,
      availability: form.availability.trim(),
      note: form.note.trim(),
    });
    setSending(false);
    if (err) { setError('Could not submit — please email fpycreferee@gmail.com instead.'); return; }
    setSent(true);
  }

  return (
    <section id="referee" style={{ background: 'var(--court-navy)', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 8 }}>
            Officiating
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.5vw, 48px)', textTransform: 'uppercase', lineHeight: 1, color: '#fff' }}>
            Become a referee
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 12, maxWidth: 640, lineHeight: 1.55 }}>
            FPYC needs officials for the winter season. High schoolers, parents, and former players all
            ref for us — it is a paid role, training is provided, and you choose the games you work.
          </p>
        </div>

        <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Perks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' }}>
            {PERKS.map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '18px 18px 16px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon name={p.icon} size={17} color="var(--varsity-gold)" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 5 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 26 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(5,150,105,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Icon name="check" size={24} color="#059669" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1, marginBottom: 8 }}>
                  You're on the list
                </div>
                <div style={{ fontSize: 14, color: 'var(--fg-soft)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                  We'll be in touch before the season starts with training dates and how to pick up games.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>Sign up to officiate</div>

                <Field label="Full name" required>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" style={inp} />
                </Field>
                <Field label="Email" required>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" style={inp} />
                </Field>
                <Field label="Phone">
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(703) 555-0100" style={inp} />
                </Field>
                <Field label="Experience" required>
                  <select value={form.experience} onChange={e => set('experience', e.target.value)} style={inp}>
                    <option value="">Select…</option>
                    {EXPERIENCE.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                  </select>
                </Field>
                <Field label="Availability">
                  <input value={form.availability} onChange={e => set('availability', e.target.value)} placeholder="e.g. weeknights after 6, Saturday mornings" style={inp} />
                </Field>
                <Field label="Anything else?">
                  <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={2} placeholder="Age if under 18, playing background, questions…" style={{ ...inp, resize: 'vertical' }} />
                </Field>

                {error && <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{error}</div>}

                <button type="submit" disabled={sending} style={{
                  marginTop: 2, padding: '13px', borderRadius: 8, border: 'none',
                  background: sending ? '#9CA3AF' : 'var(--varsity-gold)', color: 'var(--court-navy)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon name="send" size={15} color="var(--court-navy)" />
                  {sending ? 'Sending…' : 'Sign me up'}
                </button>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  Questions? Email{' '}
                  <a href="mailto:fpycreferee@gmail.com" style={{ color: 'var(--court-navy)', fontWeight: 700 }}>fpycreferee@gmail.com</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inp = {
  width: '100%', boxSizing: 'border-box', padding: '10px 13px',
  borderRadius: 8, border: '1.5px solid #E2E5EA',
  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111827',
  outline: 'none', background: '#fff',
};

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

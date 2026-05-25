import Icon from '../shared/Icon.jsx';

const PROGRAMS = [
  {
    id: 'house',
    tag: 'Most popular',
    title: 'House League',
    price: 195,
    grades: 'Kindergarten – 8th grade',
    icon: 'home',
    color: 'var(--court-navy)',
    desc: 'Our flagship recreational program. Balanced teams, guaranteed playing time, and a focus on fundamentals, teamwork, and fun.',
    details: [
      { icon: 'calendar', text: 'Games run December – February' },
      { icon: 'clock', text: 'Saturday games, weekday practices' },
      { icon: 'map-pin', text: 'Local Fairfax County school gyms' },
      { icon: 'users', text: 'No tryouts — every kid gets placed' },
    ],
    featured: true,
  },
  {
    id: 'clinic',
    tag: 'Best for beginners',
    title: 'Skills Clinic',
    price: 95,
    grades: 'Kindergarten – 4th grade',
    icon: 'zap',
    color: 'var(--basketball-orange)',
    desc: 'Saturday-morning skill sessions for younger players not quite ready for a full league. Coach-led drills, no games, no pressure.',
    details: [
      { icon: 'calendar', text: '6 Saturday sessions, 9–10:30 AM' },
      { icon: 'map-pin', text: 'Robinson Secondary School' },
      { icon: 'package', text: 'Equipment provided' },
      { icon: 'smile', text: 'Supportive, low-pressure environment' },
    ],
  },
  {
    id: 'travel',
    tag: 'Competitive',
    title: 'Travel Select',
    price: 425,
    grades: '3rd – 8th grade',
    icon: 'trophy',
    color: 'var(--varsity-gold)',
    colorText: 'var(--court-navy)',
    desc: 'Tryout-based competitive teams in the Fairfax County Youth Basketball League (FCYBL). Two practices per week, games across Northern Virginia.',
    details: [
      { icon: 'target', text: 'FCYBL games across NoVa' },
      { icon: 'clipboard-list', text: 'Tryouts in early September' },
      { icon: 'dumbbell', text: 'Two practices per week' },
      { icon: 'award', text: 'Boys and girls divisions' },
    ],
  },
];

export default function StepProgram({ data, update, next }) {
  const selected = data.program;

  return (
    <div>
      <StepHeader
        eyebrow="Step 1 of 6"
        title="Choose your program"
        sub="All three programs are run by volunteer coaches and follow FPYC's sportsmanship values."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {PROGRAMS.map(p => {
          const isSelected = selected?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => update('program', p)}
              style={{
                all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                background: isSelected ? 'var(--court-navy)' : '#fff',
                border: isSelected ? '2px solid var(--court-navy)' : '2px solid #E2E5EA',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: isSelected ? '0 8px 32px rgba(10,31,61,0.18)' : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 160ms ease',
                transform: isSelected ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* Color bar + tag */}
              <div style={{ height: 6, background: isSelected ? 'var(--varsity-gold)' : p.color }} />
              <div style={{ padding: '20px 20px 0' }}>
                {p.tag && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: isSelected ? 'var(--varsity-gold)' : p.color,
                    marginBottom: 10,
                  }}>
                    <Icon name="star" size={10} /> {p.tag}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase',
                    lineHeight: 1, color: isSelected ? '#fff' : 'var(--court-navy)',
                  }}>{p.title}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 28,
                    color: isSelected ? 'var(--varsity-gold)' : p.color,
                    lineHeight: 1,
                  }}>${p.price}</div>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: isSelected ? 'rgba(255,255,255,0.6)' : '#6B7280',
                  marginTop: 4, marginBottom: 14,
                }}>{p.grades}</div>
                <p style={{
                  fontSize: 13, lineHeight: 1.6,
                  color: isSelected ? 'rgba(255,255,255,0.82)' : '#4B5563',
                  margin: '0 0 16px',
                }}>{p.desc}</p>
              </div>

              <div style={{ padding: '0 20px 20px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.details.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Icon name={d.icon} size={13} color={isSelected ? 'rgba(255,255,255,0.55)' : '#9CA3AF'} />
                      <span style={{ fontSize: 13, color: isSelected ? 'rgba(255,255,255,0.82)' : '#374151' }}>{d.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                margin: '0 20px 20px',
                padding: '10px 16px',
                borderRadius: 8,
                background: isSelected ? 'rgba(255,199,44,0.15)' : '#F4F5F7',
                border: isSelected ? '1px solid rgba(255,199,44,0.30)' : '1px solid #E2E5EA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 13, fontWeight: 700,
                color: isSelected ? 'var(--varsity-gold)' : 'var(--court-navy)',
              }}>
                {isSelected
                  ? <><Icon name="check-circle" size={15} color="var(--varsity-gold)" /> Selected</>
                  : <>Select {p.title}</>
                }
              </div>
            </button>
          );
        })}
      </div>

      {/* Scholarship callout */}
      <div style={{
        background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12,
        padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 32,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="hand-heart" size={18} color="var(--basketball-orange)" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)', marginBottom: 3 }}>Need a scholarship?</div>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
            FPYC offers need-based scholarships for any family — no separate application. You'll see the option in the next step.
            Sibling discount (10% off) also applies automatically.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ContinueBtn disabled={!selected} onClick={next} label="Continue to player info" />
      </div>
    </div>
  );
}

export function StepHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)', marginBottom: 6 }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1, marginBottom: 10 }}>{title}</div>
      {sub && <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.55, margin: 0 }}>{sub}</p>}
    </div>
  );
}

export function ContinueBtn({ onClick, disabled, label = 'Continue', loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: disabled ? '#E2E5EA' : 'var(--court-navy)',
        color: disabled ? '#9CA3AF' : '#fff',
        border: 'none', borderRadius: 10,
        padding: '14px 28px',
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'all 160ms',
      }}
    >
      {label} <Icon name="arrow-right" size={16} />
    </button>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent', color: '#6B7280',
        border: '1px solid #E2E5EA', borderRadius: 10,
        padding: '14px 20px',
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      }}
    >
      <Icon name="arrow-left" size={16} /> Back
    </button>
  );
}

export function FormCard({ children, title }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
      {title && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E5EA', fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>
          {title}
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

export function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', gap: 4 }}>
        {label}
        {required && <span style={{ color: 'var(--foul-red)' }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12, color: '#9CA3AF' }}>{hint}</div>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '10px 14px', borderRadius: 8,
        border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)',
        color: '#111827', background: '#fff', outline: 'none',
        transition: 'border-color 160ms',
        width: '100%', boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
      onBlur={e => e.target.style.borderColor = '#E2E5EA'}
      {...rest}
    />
  );
}

export function Select({ value, onChange, children, ...rest }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '10px 14px', borderRadius: 8,
        border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)',
        color: '#111827', background: '#fff', outline: 'none', cursor: 'pointer',
        width: '100%', boxSizing: 'border-box',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 36,
      }}
      {...rest}
    >
      {children}
    </select>
  );
}

import { useState, useEffect } from 'react';
import { Card, Pill, Button, Icon, Display, Eyebrow } from '../shared/index.js';

const PRACTICES = [
  { id: 'pr1', date: 'Mon, Dec 2',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Regular',      rsvp: 10, notes: 'Focus: ball handling and pick-and-roll defense' },
  { id: 'pr2', date: 'Wed, Dec 4',  time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 11, notes: '' },
  { id: 'pr3', date: 'Mon, Dec 9',  time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Scrimmage',    rsvp: 12, notes: 'Scrimmage vs. Hawks 7–8 team' },
  { id: 'pr4', date: 'Wed, Dec 11', time: '6:00–7:30 PM', gym: 'Providence ES · Main',  type: 'Regular',      rsvp: 9,  notes: '' },
  { id: 'pr5', date: 'Mon, Dec 16', time: '6:00–7:30 PM', gym: 'Daniels Run ES · Gym', type: 'Conditioning', rsvp: 8,  notes: 'Film review first 20 min' },
  { id: 'pr6', date: 'Wed, Dec 18', time: '6:00–7:30 PM', gym: 'TBD',                  type: 'Regular',      rsvp: 0,  notes: 'Gym TBD — check back Dec 10' },
];

const PRACTICE_TYPE_COLOR = {
  Regular:      { bg: 'rgba(10,31,61,0.08)',       text: 'var(--court-navy)' },
  Scrimmage:    { bg: 'rgba(255,199,44,0.15)',      text: 'var(--court-navy)' },
  Conditioning: { bg: 'rgba(232,119,34,0.12)',     text: 'var(--basketball-orange)' },
};

export default function ScheduleView({ games, onGo, initialTab = 'games', openNewGame = false, onNewGameClose }) {
  const [tab, setTab] = useState(initialTab);
  const [showNewPractice, setShowNewPractice] = useState(false);
  const [showNewGame, setShowNewGame] = useState(false);
  const [scoreGame, setScoreGame] = useState(null);
  const [newPractice, setNewPractice] = useState({ date: '', time: '', gym: '', type: 'Regular', notes: '' });
  const [newGame, setNewGame] = useState({ date: '', time: '', opponent: '', location: '', home: true, notes: '' });

  useEffect(() => {
    if (openNewGame) {
      setShowNewGame(true);
      onNewGameClose?.();
    }
  }, [openNewGame]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'games',     label: 'Games',     count: games.length },
          { id: 'practices', label: 'Practices', count: PRACTICES.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 18px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            color: tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {t.label}
            <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: tab === t.id ? 'var(--court-navy)' : 'var(--border)', color: tab === t.id ? '#fff' : 'var(--fg-muted)' }}>
              {t.count}
            </span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
          <Button kind="ghost" icon="filter" size="sm">Filter</Button>
          <Button kind="ghost" icon="calendar-plus" size="sm">Subscribe (.ics)</Button>
          {tab === 'practices' && <Button kind="gold" icon="plus" size="sm" onClick={() => setShowNewPractice(true)}>New practice</Button>}
        </div>
      </div>

      {/* GAMES TAB */}
      {tab === 'games' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {games.map(g => {
            const isFinal = g.status === 'final';
            const win = isFinal && g.us > g.them;
            return (
              <Card key={g.id} padding={0} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto auto', gap: 18, alignItems: 'center', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{g.month}</div>
                    <Display size={32}>{g.date}</Display>
                    <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>{g.weekday} · {g.time}</div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {isFinal
                        ? <Pill kind={win ? 'win' : 'loss'}>{win ? 'Win' : 'Loss'}</Pill>
                        : <Pill kind="neutral">{g.home ? 'Home' : 'Away'}</Pill>
                      }
                    </div>
                    <Display size={22}>{g.opponent}</Display>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, fontSize: 12, color: 'var(--fg-soft)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} />{g.location}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="user-check" size={12} />{g.refs || 'Refs TBD'}</span>
                      {!isFinal && g.confirmed && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check-circle" size={12} color="var(--status-win)" />{g.confirmed} confirmed</span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: 100 }}>
                    {isFinal ? (
                      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                        <Display size={40} color={!win ? 'var(--fg-muted)' : 'var(--court-navy)'}>{g.us}</Display>
                        <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>–</span>
                        <Display size={40} color={win ? 'var(--fg-muted)' : 'var(--court-navy)'}>{g.them}</Display>
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg-muted)', textTransform: 'uppercase' }}>vs.</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {isFinal ? (
                      <Button kind="ghost" size="sm" icon="edit-3" onClick={() => setScoreGame(g)}>Edit score</Button>
                    ) : (
                      <>
                        <Button kind="ghost" size="sm" icon="check-square">RSVP</Button>
                        <Button kind="primary" size="sm" icon="clipboard-list" onClick={() => onGo && onGo('lineup')}>Lineup</Button>
                      </>
                    )}
                  </div>
                </div>
                {g.note && (
                  <div style={{ padding: '10px 20px', background: 'var(--bone)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Icon name="info" size={14} color="var(--fg-muted)" />{g.note}
                  </div>
                )}
              </Card>
            );
          })}

          {/* Add result for upcoming */}
          <button
            onClick={() => setScoreGame({ id: 'new', opponent: '', status: 'final', us: '', them: '', month: '', date: '', weekday: '', time: '', location: '', home: true })}
            style={{ all: 'unset', cursor: 'pointer', border: '2px dashed var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-muted)', fontSize: 14, fontWeight: 600, transition: 'border-color 160ms' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--court-navy)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Icon name="plus-circle" size={18} /> Log game result
          </button>
        </div>
      )}

      {/* PRACTICES TAB */}
      {tab === 'practices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRACTICES.map((p, i) => {
            const colors = PRACTICE_TYPE_COLOR[p.type] || PRACTICE_TYPE_COLOR.Regular;
            const isPast = i < 2;
            return (
              <Card key={p.id} padding={0} style={{ overflow: 'hidden', opacity: isPast ? 0.6 : 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto auto', gap: 18, alignItems: 'center', padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {p.date.split(',')[0]}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--court-navy)', textTransform: 'uppercase', lineHeight: 1.1, textAlign: 'center', marginTop: 2 }}>
                      {p.date.split(', ')[1]}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500, marginTop: 2 }}>{p.time.split('–')[0]}</div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: colors.bg, color: colors.text }}>
                        {p.type}
                      </span>
                      {isPast && <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>Completed</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--court-navy)', textTransform: 'uppercase' }}>
                      {p.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 5, fontSize: 12, color: 'var(--fg-soft)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12} />{p.gym}</span>
                      {p.notes && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="info" size={12} />{p.notes}</span>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {isPast ? (
                      <div>
                        <Display size={28}>{p.rsvp}</Display>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>attended</div>
                      </div>
                    ) : p.rsvp > 0 ? (
                      <div>
                        <Display size={28} color="var(--status-win)">{p.rsvp}</Display>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>confirmed</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>No RSVPs</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {isPast
                      ? <Button kind="ghost" size="sm" icon="check-square" onClick={() => onGo && onGo('attendance')}>Attendance</Button>
                      : <>
                          <Button kind="ghost" size="sm" icon="send">Notify</Button>
                          <Button kind="ghost" size="sm" icon="edit-2">Edit</Button>
                        </>
                    }
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Practice Modal */}
      {showNewPractice && (
        <ModalOverlay onClose={() => setShowNewPractice(false)}>
          <Display size={24} style={{ marginBottom: 20 }}>New practice</Display>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Date', key: 'date', type: 'date' },
              { label: 'Start time', key: 'time', type: 'time' },
            ].map(f => (
              <FormField key={f.key} label={f.label}>
                <input type={f.type} value={newPractice[f.key]} onChange={e => setNewPractice(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle} />
              </FormField>
            ))}
            <FormField label="Gym / Location">
              <input placeholder="e.g. Daniels Run ES · Gym" value={newPractice.gym} onChange={e => setNewPractice(p => ({ ...p, gym: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Practice type">
              <select value={newPractice.type} onChange={e => setNewPractice(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                <option>Regular</option>
                <option>Scrimmage</option>
                <option>Conditioning</option>
                <option>Film review</option>
              </select>
            </FormField>
            <FormField label="Notes" style={{ gridColumn: '1 / -1' }}>
              <input placeholder="Optional practice notes" value={newPractice.notes} onChange={e => setNewPractice(p => ({ ...p, notes: e.target.value }))} style={inputStyle} />
            </FormField>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button kind="ghost" onClick={() => setShowNewPractice(false)}>Cancel</Button>
            <Button kind="gold" icon="check" onClick={() => setShowNewPractice(false)}>Add practice</Button>
          </div>
        </ModalOverlay>
      )}

      {/* New Game Modal */}
      {showNewGame && (
        <ModalOverlay onClose={() => setShowNewGame(false)}>
          <Display size={24} style={{ marginBottom: 20 }}>Add game</Display>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Date">
              <input type="date" value={newGame.date} onChange={e => setNewGame(g => ({ ...g, date: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Tip-off time">
              <input type="time" value={newGame.time} onChange={e => setNewGame(g => ({ ...g, time: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Opponent" style={{ gridColumn: '1 / -1' }}>
              <input placeholder="e.g. Vienna Storm" value={newGame.opponent} onChange={e => setNewGame(g => ({ ...g, opponent: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Location" style={{ gridColumn: '1 / -1' }}>
              <input placeholder="e.g. Robinson Secondary · Gym B" value={newGame.location} onChange={e => setNewGame(g => ({ ...g, location: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Home or away">
              <select value={newGame.home ? 'home' : 'away'} onChange={e => setNewGame(g => ({ ...g, home: e.target.value === 'home' }))} style={inputStyle}>
                <option value="home">Home</option>
                <option value="away">Away</option>
              </select>
            </FormField>
            <FormField label="Notes (optional)">
              <input placeholder="Carpool, jersey color, etc." value={newGame.notes} onChange={e => setNewGame(g => ({ ...g, notes: e.target.value }))} style={inputStyle} />
            </FormField>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button kind="ghost" onClick={() => setShowNewGame(false)}>Cancel</Button>
            <Button kind="gold" icon="check" onClick={() => setShowNewGame(false)}>Add game</Button>
          </div>
        </ModalOverlay>
      )}

      {/* Score Entry Modal */}
      {scoreGame && (
        <ModalOverlay onClose={() => setScoreGame(null)}>
          <Display size={24} style={{ marginBottom: 6 }}>Log game result</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 20 }}>
            {scoreGame.opponent ? `vs. ${scoreGame.opponent} · ${scoreGame.weekday}, ${scoreGame.month} ${scoreGame.date}` : 'Enter game details'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Eyebrow style={{ marginBottom: 8 }}>Fairfax Hawks</Eyebrow>
              <input type="number" defaultValue={scoreGame.us} placeholder="0"
                style={{ ...inputStyle, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 48, padding: '12px', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--fg-muted)', textAlign: 'center' }}>–</div>
            <div style={{ textAlign: 'center' }}>
              <Eyebrow style={{ marginBottom: 8 }}>{scoreGame.opponent || 'Opponent'}</Eyebrow>
              <input type="number" defaultValue={scoreGame.them} placeholder="0"
                style={{ ...inputStyle, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 48, padding: '12px', width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
          <FormField label="Game notes (optional)">
            <textarea rows={2} placeholder="e.g. Great defensive effort in the 4th quarter…" style={{ ...inputStyle, resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button kind="ghost" onClick={() => setScoreGame(null)}>Cancel</Button>
            <Button kind="gold" icon="check" onClick={() => setScoreGame(null)}>Save result</Button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function ModalOverlay({ onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, boxShadow: 'var(--shadow-3)', position: 'relative' }}>
        <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 16, right: 16 }}>
          <Icon name="x" size={20} color="var(--fg-muted)" />
        </button>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { padding: '9px 12px', borderRadius: 7, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box', color: 'var(--fg)' };

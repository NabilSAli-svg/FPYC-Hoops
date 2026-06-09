import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';
import { useBrackets, TEAMS_INFO } from '../shared/store.js';

const DIVISIONS = Object.keys(TEAMS_INFO).map(k => TEAMS_INFO[k].division).filter((v, i, a) => a.indexOf(v) === i);

export default function PlayoffsView() {
  const isMobile = useIsMobile();
  const [brackets, setBrackets] = useBrackets();
  const [activeDivision, setActiveDivision] = useState(DIVISIONS[0]);
  const [toast, setToast] = useState('');
  const [scoreModal, setScoreModal] = useState(null); // { round: 'semi'|'final', matchId, bracket }
  const [scoreForm, setScoreForm] = useState({ top: '', bottom: '' });

  const bracket = brackets[activeDivision];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function updateBracket(div, updater) {
    setBrackets(prev => ({ ...prev, [div]: updater(prev[div]) }));
  }

  function publishBracket() {
    updateBracket(activeDivision, b => ({ ...b, status: 'active' }));
    showToast(`${activeDivision} bracket published — families can see it now`);
  }

  function resetBracket() {
    updateBracket(activeDivision, b => ({
      ...b,
      status: 'setup',
      semis: b.semis.map(s => ({ ...s, scoreTop: null, scoreBottom: null, winner: null })),
      final: { ...b.final, top: null, bottom: null, scoreTop: null, scoreBottom: null, winner: null },
      champion: null,
    }));
    showToast(`${activeDivision} bracket reset to setup`);
  }

  function openScoreModal(round, matchId) {
    const match = round === 'final' ? bracket.final : bracket.semis.find(s => s.id === matchId);
    setScoreForm({
      top: match.scoreTop != null ? String(match.scoreTop) : '',
      bottom: match.scoreBottom != null ? String(match.scoreBottom) : '',
    });
    setScoreModal({ round, matchId });
  }

  function saveScore() {
    const t = parseInt(scoreForm.top);
    const b = parseInt(scoreForm.bottom);
    if (isNaN(t) || isNaN(b) || t === b) return;
    const winner = t > b ? 0 : 1; // 0 = top team wins, 1 = bottom team wins

    if (scoreModal.round === 'semi') {
      updateBracket(activeDivision, br => {
        const semis = br.semis.map(s => {
          if (s.id !== scoreModal.matchId) return s;
          const winnerIdx = winner === 0 ? s.top : s.bottom;
          return { ...s, scoreTop: t, scoreBottom: b, winner: winnerIdx };
        });
        // After both semis are done, populate the final
        const newBr = { ...br, semis };
        const s1 = newBr.semis[0];
        const s2 = newBr.semis[1];
        if (s1.winner != null && s2.winner != null) {
          newBr.final = { ...newBr.final, top: s1.winner, bottom: s2.winner };
        }
        return newBr;
      });
      showToast('Semifinal result saved');
    } else {
      updateBracket(activeDivision, br => {
        const winnerIdx = winner === 0 ? br.final.top : br.final.bottom;
        return {
          ...br,
          final: { ...br.final, scoreTop: t, scoreBottom: b, winner: winnerIdx },
          champion: winnerIdx,
          status: 'complete',
        };
      });
      showToast('Champion crowned! Bracket complete.');
    }
    setScoreModal(null);
  }

  function clearResult(round, matchId) {
    if (round === 'semi') {
      updateBracket(activeDivision, br => {
        const semis = br.semis.map(s =>
          s.id === matchId ? { ...s, scoreTop: null, scoreBottom: null, winner: null } : s
        );
        // Clear final if semis are reset
        return { ...br, semis, final: { ...br.final, top: null, bottom: null, scoreTop: null, scoreBottom: null, winner: null }, champion: null, status: 'active' };
      });
    } else {
      updateBracket(activeDivision, br => ({
        ...br,
        final: { ...br.final, scoreTop: null, scoreBottom: null, winner: null },
        champion: null,
        status: 'active',
      }));
    }
    showToast('Result cleared');
  }

  if (!bracket) return null;

  const { status, seeds, semis, final, champion } = bracket;
  const champTeam = champion != null ? seeds[champion] : null;

  return (
    <div style={{ maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Division tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {DIVISIONS.map(div => (
          <button key={div} onClick={() => setActiveDivision(div)} style={{
            padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            color: activeDivision === div ? 'var(--court-navy)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${activeDivision === div ? 'var(--varsity-gold)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 160ms',
          }}>
            {div}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={status} />
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            {status === 'setup' && 'Bracket is hidden from families until published'}
            {status === 'active' && 'Bracket is live — enter scores to advance teams'}
            {status === 'complete' && `Season complete · ${champTeam?.name ?? ''} are champions`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {status === 'setup' && (
            <Button kind="gold" icon="send" onClick={publishBracket}>Publish bracket</Button>
          )}
          {(status === 'active' || status === 'complete') && (
            <Button kind="ghost" icon="rotate-ccw" onClick={resetBracket}>Reset to setup</Button>
          )}
        </div>
      </div>

      {/* Champion banner */}
      {champTeam && (
        <div style={{
          background: 'var(--court-navy)',
          backgroundImage: 'radial-gradient(circle at 85% 30%, rgba(255,199,44,0.18), transparent 55%)',
          borderRadius: 14, border: '2px solid var(--varsity-gold)',
          padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="trophy" size={22} color="var(--court-navy)" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 3 }}>
              {bracket.season} Champion · {bracket.division}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>
              {champTeam.name}
            </div>
          </div>
          {champTeam.fpyc && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)' }}>
              FPYC
            </span>
          )}
        </div>
      )}

      {/* Seedings */}
      <div>
        <Eyebrow style={{ marginBottom: 12 }}>Playoff Seeds</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 10 }}>
          {seeds.map((s, i) => (
            <Card key={i} padding={14} style={{ display: 'flex', alignItems: 'center', gap: 10, border: s.fpyc ? '1.5px solid var(--varsity-gold)' : undefined }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.fpyc ? 'var(--varsity-gold)' : 'rgba(10,31,61,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--court-navy)', flexShrink: 0 }}>
                {s.seed}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.record}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Semis */}
      <div>
        <Eyebrow style={{ marginBottom: 12 }}>Semifinals</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {semis.map((s, i) => (
            <MatchupEditor
              key={s.id}
              title={`Semifinal ${i + 1}`}
              subtitle={`${s.date} · ${s.time}`}
              seeds={seeds}
              topIdx={s.top}
              bottomIdx={s.bottom}
              scoreTop={s.scoreTop}
              scoreBottom={s.scoreBottom}
              winner={s.winner}
              bracketStatus={status}
              onEnterScore={() => openScoreModal('semi', s.id)}
              onClear={() => clearResult('semi', s.id)}
            />
          ))}
        </div>
      </div>

      {/* Final */}
      <div>
        <Eyebrow style={{ marginBottom: 12 }}>Championship</Eyebrow>
        <MatchupEditor
          title="Championship Final"
          subtitle={`${final.date} · ${final.time}`}
          seeds={seeds}
          topIdx={final.top}
          bottomIdx={final.bottom}
          scoreTop={final.scoreTop}
          scoreBottom={final.scoreBottom}
          winner={final.winner}
          bracketStatus={status}
          topLabel="Winner SF1"
          bottomLabel="Winner SF2"
          onEnterScore={final.top != null ? () => openScoreModal('final', 'final') : null}
          onClear={final.winner != null ? () => clearResult('final', 'final') : null}
        />
      </div>

      {/* Score entry modal */}
      {scoreModal && (() => {
        const match = scoreModal.round === 'final' ? bracket.final : bracket.semis.find(s => s.id === scoreModal.matchId);
        const topTeam  = match.top  != null ? seeds[match.top]  : null;
        const botTeam  = match.bottom != null ? seeds[match.bottom] : null;
        const topLabel  = topTeam?.name  ?? 'Winner SF1';
        const botLabel  = botTeam?.name  ?? 'Winner SF2';
        const valid = scoreForm.top !== '' && scoreForm.bottom !== '' && !isNaN(+scoreForm.top) && !isNaN(+scoreForm.bottom) && +scoreForm.top !== +scoreForm.bottom;
        return (
          <div onClick={e => e.target === e.currentTarget && setScoreModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Display size={20}>{scoreModal.round === 'final' ? 'Championship' : 'Semifinal'} result</Display>
                <button onClick={() => setScoreModal(null)} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <ScoreField label={topLabel} value={scoreForm.top} onChange={v => setScoreForm(f => ({ ...f, top: v }))} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--fg-muted)', flexShrink: 0 }}>–</div>
                <ScoreField label={botLabel} value={scoreForm.bottom} onChange={v => setScoreForm(f => ({ ...f, bottom: v }))} />
              </div>
              {scoreForm.top !== '' && scoreForm.bottom !== '' && +scoreForm.top === +scoreForm.bottom && (
                <div style={{ fontSize: 12, color: 'var(--foul-red)', marginBottom: 12, fontWeight: 600 }}>Tied scores not allowed in playoffs — enter a valid final score.</div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button kind="ghost" onClick={() => setScoreModal(null)}>Cancel</Button>
                <Button kind="gold" icon="check" onClick={saveScore} disabled={!valid}>Save result</Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> {toast}
        </div>
      )}
    </div>
  );
}

function MatchupEditor({ title, subtitle, seeds, topIdx, bottomIdx, scoreTop, scoreBottom, winner, bracketStatus, topLabel, bottomLabel, onEnterScore, onClear }) {
  const topTeam  = topIdx  != null ? seeds[topIdx]  : null;
  const botTeam  = bottomIdx != null ? seeds[bottomIdx] : null;
  const hasResult = winner != null;
  const canEnter  = bracketStatus !== 'setup' && onEnterScore;

  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--court-navy)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {subtitle && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{subtitle}</span>}
          {hasResult && onClear && (
            <button onClick={onClear} title="Clear result" style={{ all: 'unset', cursor: 'pointer', padding: '2px 6px', borderRadius: 6, fontSize: 11, color: 'var(--fg-muted)', background: 'var(--border)', fontWeight: 600 }}>
              Clear
            </button>
          )}
          {canEnter && (
            <Button kind={hasResult ? 'ghost' : 'gold'} size="sm" icon={hasResult ? 'edit-2' : 'plus'} onClick={onEnterScore}>
              {hasResult ? 'Edit' : 'Enter score'}
            </Button>
          )}
        </div>
      </div>
      {/* Teams */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AdminTeamRow team={topTeam} score={scoreTop} isWinner={winner === topIdx && hasResult} isLoser={hasResult && winner !== topIdx} fallback={topLabel || 'TBD'} />
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em' }}>VS</div>
        <AdminTeamRow team={botTeam} score={scoreBottom} isWinner={winner === bottomIdx && hasResult} isLoser={hasResult && winner !== bottomIdx} fallback={bottomLabel || 'TBD'} />
      </div>
    </Card>
  );
}

function AdminTeamRow({ team, score, isWinner, isLoser, fallback }) {
  if (!team) {
    return (
      <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F9FAFB', border: '1.5px dashed #E2E5EA' }}>
        <span style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>{fallback}</span>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 8,
      background: isWinner ? 'rgba(255,199,44,0.10)' : isLoser ? 'rgba(0,0,0,0.02)' : '#fff',
      border: `1.5px solid ${isWinner ? 'var(--varsity-gold)' : '#E2E5EA'}`,
      opacity: isLoser ? 0.45 : 1,
      transition: 'all 200ms',
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', width: 18, flexShrink: 0 }}>#{team.seed}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {team.fpyc && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
          <span style={{ fontWeight: 700, fontSize: 14, color: isLoser ? '#9CA3AF' : 'var(--court-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{team.record}</div>
      </div>
      {score != null && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, color: isWinner ? 'var(--court-navy)' : '#9CA3AF', flexShrink: 0 }}>{score}</span>
      )}
      {isWinner && (
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', flexShrink: 0 }}>ADV</span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    setup:    { label: 'Not published', color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
    active:   { label: 'Live',          color: '#059669', bg: 'rgba(5,150,105,0.10)'   },
    complete: { label: 'Complete',      color: 'var(--varsity-gold)', bg: 'rgba(255,199,44,0.12)' },
  };
  const m = map[status] || map.setup;
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

function ScoreField({ label, value, onChange }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        style={{
          width: '100%', boxSizing: 'border-box', textAlign: 'center',
          padding: '12px 8px', borderRadius: 10,
          border: '1.5px solid var(--border)',
          fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--court-navy)',
          background: '#FAFAFA', outline: 'none',
        }}
      />
    </div>
  );
}

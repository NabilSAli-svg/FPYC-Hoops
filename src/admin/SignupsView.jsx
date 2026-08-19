import { useState } from 'react';
import { Card, Pill, Icon, Display, Eyebrow } from '../shared/index.js';
import { csvDownload } from '../shared/csvDownload.js';
import { useRefSignups, useVolunteerSignups } from '../shared/store.js';
import { useIsMobile } from '../shared/useIsMobile.js';

const STATUSES = ['new', 'contacted', 'onboarded', 'declined'];
const STATUS_KIND = { new: 'gold', contacted: 'navy', onboarded: 'win', declined: 'neutral' };

const EXPERIENCE_LABEL = {
  none:      'New to officiating',
  some:      'Some experience',
  certified: 'Certified official',
};

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Review inbox for the public sign-up forms.
 * `tabs` limits which lists a role can see — Ref Director sees referees,
 * Community Director sees volunteers, Admin and Ops see both.
 */
export default function SignupsView({ tabs = ['refs', 'volunteers'] }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState(tabs[0]);
  const [refs, setRefs]           = useRefSignups();
  const [volunteers, setVols]     = useVolunteerSignups();
  const [filter, setFilter]       = useState('all');

  const rows = tab === 'refs' ? refs : volunteers;
  const setRows = tab === 'refs' ? setRefs : setVols;

  const sorted = [...rows].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  const shown = filter === 'all' ? sorted : sorted.filter(r => (r.status || 'new') === filter);
  const newCount = rows.filter(r => (r.status || 'new') === 'new').length;

  function setStatus(id, status) {
    setRows(list => list.map(r => (r.id === id ? { ...r, status } : r)));
  }

  function exportCsv() {
    const headers = tab === 'refs'
      ? ['Name', 'Email', 'Phone', 'Experience', 'Availability', 'Note', 'Status', 'Received']
      : ['Name', 'Email', 'Role', 'Note', 'Status', 'Received'];
    const body = shown.map(r => tab === 'refs'
      ? [r.name, r.email, r.phone || '', EXPERIENCE_LABEL[r.experience] || r.experience || '', r.availability || '', r.note || '', r.status || 'new', fmtDate(r.created_at)]
      : [r.name, r.email, r.role || '', r.note || '', r.status || 'new', fmtDate(r.created_at)]);
    csvDownload(`fpyc-${tab}-signups.csv`, [headers, ...body]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tabs + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {tabs.length > 1 && (
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => { setTab(t); setFilter('all'); }} style={{
                padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                borderBottom: `2px solid ${tab === t ? 'var(--court-navy)' : 'transparent'}`,
                color: tab === t ? 'var(--court-navy)' : 'var(--fg-muted)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, marginBottom: -1,
              }}>
                {t === 'refs' ? 'Referees' : 'Volunteers'}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginLeft: tabs.length > 1 ? 'auto' : 0, flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${filter === f ? 'var(--court-navy)' : 'var(--border)'}`,
              background: filter === f ? 'var(--court-navy)' : '#fff',
              color: filter === f ? '#fff' : 'var(--fg-muted)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
          <button onClick={exportCsv} disabled={shown.length === 0} style={{
            padding: '5px 12px', borderRadius: 999, cursor: shown.length ? 'pointer' : 'not-allowed',
            border: '1px solid var(--border)', background: '#fff', color: 'var(--fg-muted)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
            display: 'inline-flex', alignItems: 'center', gap: 5, opacity: shown.length ? 1 : 0.5,
          }}>
            <Icon name="download" size={12} /> CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
        <Stat label="Total" value={rows.length} color="var(--court-navy)" />
        <Stat label="New"       value={newCount} color={newCount > 0 ? 'var(--basketball-orange)' : 'var(--fg-muted)'} />
        <Stat label="Contacted" value={rows.filter(r => r.status === 'contacted').length} color="var(--court-navy)" />
        <Stat label="Onboarded" value={rows.filter(r => r.status === 'onboarded').length} color="var(--status-win)" />
      </div>

      {shown.length === 0 ? (
        <Card padding="40px 24px">
          <div style={{ textAlign: 'center' }}>
            <Icon name="inbox" size={30} color="var(--border-strong)" />
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginTop: 12 }}>
              {rows.length === 0
                ? `No ${tab === 'refs' ? 'referee' : 'volunteer'} sign-ups yet`
                : `Nothing marked "${filter}"`}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              {rows.length === 0
                ? 'Submissions from the website appear here as they come in.'
                : 'Try a different filter.'}
            </div>
          </div>
        </Card>
      ) : (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {shown.map((r, i) => (
            <div key={r.id} style={{
              padding: '14px 18px',
              borderBottom: i < shown.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1.6fr auto',
              gap: 12, alignItems: 'start',
            }}>
              {/* Who */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{r.name}</div>
                <a href={`mailto:${r.email}`} style={{ fontSize: 12, color: 'var(--court-navy)', textDecoration: 'none' }}>{r.email}</a>
                {r.phone && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{r.phone}</div>}
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Received {fmtDate(r.created_at)}</div>
              </div>

              {/* Detail */}
              <div style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.55 }}>
                {tab === 'refs' ? (
                  <>
                    <div><strong style={{ color: 'var(--fg)' }}>{EXPERIENCE_LABEL[r.experience] || r.experience || '—'}</strong></div>
                    {r.availability && <div style={{ marginTop: 2 }}>Available: {r.availability}</div>}
                  </>
                ) : (
                  <div><strong style={{ color: 'var(--fg)' }}>{r.role || '—'}</strong></div>
                )}
                {r.note && <div style={{ marginTop: 4, fontStyle: 'italic' }}>“{r.note}”</div>}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isMobile ? 'start' : 'end' }}>
                <Pill kind={STATUS_KIND[r.status || 'new']}>{r.status || 'new'}</Pill>
                <select
                  value={r.status || 'new'}
                  onChange={e => setStatus(r.id, e.target.value)}
                  style={{
                    fontSize: 12, padding: '5px 8px', borderRadius: 6,
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--fg)', fontFamily: 'var(--font-body)', cursor: 'pointer',
                  }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <Card padding="14px 16px">
      <Eyebrow>{label}</Eyebrow>
      <Display size={28} color={color} style={{ marginTop: 4 }}>{value}</Display>
    </Card>
  );
}

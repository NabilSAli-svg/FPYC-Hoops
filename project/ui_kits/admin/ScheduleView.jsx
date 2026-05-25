/* global React */
window.ScheduleView = function ScheduleView({ games }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill kind="navy">Season 2025–26</Pill>
          <Pill kind="neutral">10 games · 2 played</Pill>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" icon="filter" size="sm">Filter</Button>
          <Button kind="ghost" icon="calendar-plus" size="sm">Subscribe (.ics)</Button>
        </div>
      </div>

      {games.map(g => {
        const isFinal = g.status === 'final';
        const isLive = g.status === 'live';
        const win = isFinal && g.us > g.them;
        return (
          <Card key={g.id} padding={0} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto auto', gap: 18, alignItems: 'center', padding: '16px 20px' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{g.month}</div>
                <Display size={32}>{g.date}</Display>
                <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>{g.weekday} · {g.time}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {isLive ? <Pill kind="live" pulse>Live · Q3 4:21</Pill> : isFinal ? <Pill kind={win ? 'win' : 'loss'}>{win ? 'Win' : 'Loss'}</Pill> : <Pill kind="neutral">{g.home ? 'Home' : 'Away'}</Pill>}
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{g.home ? 'vs.' : '@'} {g.opponent}</span>
                </div>
                <Display size={22}>{g.opponent}</Display>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, fontSize: 12, color: 'var(--fg-soft)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={12}/>{g.location}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="user-check" size={12}/>{g.refs || 'Refs TBD'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                {isFinal || isLive ? (
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                    <Display size={40} color={isFinal && !win ? 'var(--fg-muted)' : 'var(--court-navy)'}>{g.us}</Display>
                    <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>–</span>
                    <Display size={40} color={isFinal && win ? 'var(--fg-muted)' : 'var(--court-navy)'}>{g.them}</Display>
                  </div>
                ) : (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg-muted)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>vs.</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {isLive ? <Button kind="primary" icon="play">Watch</Button>
                  : isFinal ? <Button kind="ghost" size="sm" icon="file-text">Box score</Button>
                  : <>
                      <Button kind="ghost" size="sm" icon="check-square">RSVP</Button>
                      <Button kind="primary" size="sm" icon="clipboard-list">Lineup</Button>
                    </>}
              </div>
            </div>
            {g.note ? (
              <div style={{ padding: '10px 20px', background: 'var(--bone)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon name="info" size={14} color="var(--fg-muted)" />
                {g.note}
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
};

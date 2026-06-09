import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    // Reset when the user navigates to a different view
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '48px 24px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏀</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 6 }}>Something went wrong on this page</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>The rest of the app is still working — try another page or reload.</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'var(--font-mono)', marginTop: 12, wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 18, padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--court-navy)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

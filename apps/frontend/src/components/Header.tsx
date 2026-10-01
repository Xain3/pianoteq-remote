import { Icon } from './Icon.js';

interface Props {
  connected: boolean;
  loading: boolean;
  demo: boolean;
  onRefresh: () => void;
}

export function Header({ connected, loading, demo, onRefresh }: Props) {
  return (
    <header className="app-header">
      <a href="/" className="brand" aria-label="Pianoteq Remote home">
        <img src="/icon.svg" alt="" />
        <span>
          Pianoteq <strong>Remote</strong>
          <small>Your piano, within reach.</small>
        </span>
      </a>
      <div className="header-actions">
        <span className={`connection-pill ${connected ? 'connected' : ''}`} role="status">
          <span className="status-dot" />
          {demo ? 'Demo mode' : connected ? 'Connected' : loading ? 'Connecting' : 'Disconnected'}
        </span>
        <button
          className="icon-button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh connection"
        >
          <Icon name="refresh" />
        </button>
      </div>
    </header>
  );
}

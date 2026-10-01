interface Props {
  error: string | null;
  demo: boolean;
  onReconnect: () => void;
}

export function ConnectionBanner({ error, demo, onReconnect }: Props) {
  if (error)
    return (
      <div className="banner error-banner" role="alert">
        <div>
          <strong>Connection needs attention</strong>
          <p>{error}</p>
        </div>
        <button className="button" onClick={onReconnect}>
          Reconnect
        </button>
      </div>
    );
  if (demo)
    return (
      <div className="banner demo-banner">
        <span>
          <strong>A little room to experiment.</strong> Demo mode simulates changes. No Pianoteq
          instance is connected.
        </span>
      </div>
    );
  return null;
}

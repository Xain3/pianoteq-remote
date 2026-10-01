import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdateNotice({ busy }: { busy: boolean }) {
  const {
    needRefresh: [needsUpdate],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needsUpdate) return null;
  return (
    <div className="update-notice" role="status">
      <span>An interface update is ready.</span>
      <button
        className="button"
        disabled={busy}
        onClick={() => {
          void updateServiceWorker(true);
        }}
      >
        Update
      </button>
    </div>
  );
}

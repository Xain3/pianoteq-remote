import { PianoteqApi } from './api/PianoteqApi.js';
import { Header } from './components/Header.js';
import { ConnectionBanner } from './components/ConnectionBanner.js';
import { UpdateNotice } from './components/UpdateNotice.js';
import { PresetPanel } from './features/presets/PresetPanel.js';
import { NowPlaying } from './features/instrument/NowPlaying.js';
import { VolumePanel } from './features/volume/VolumePanel.js';
import { IoPanel } from './features/devices/IoPanel.js';
import { useAsyncAction } from './hooks/useAsyncAction.js';
import { useRemoteResource } from './hooks/useRemoteResource.js';
import { ThemeControls } from './features/themes/ThemeControls.js';

export function App() {
  const action = useAsyncAction();
  const snapshot = useRemoteResource(PianoteqApi.getSnapshot, {
    pollMs: 5000,
    paused: action.busy,
  });
  const presets = useRemoteResource(PianoteqApi.getPresets);
  const devices = useRemoteResource(PianoteqApi.getIoSettings);
  const connected = !!snapshot.data && !snapshot.error;
  const disabled = !connected || action.busy;
  const reconnect = () => {
    action.clearError();
    void snapshot.refresh();
    void presets.refresh();
    void devices.refresh();
  };

  return (
    <div className="app-shell">
      <Header
        connected={connected}
        loading={snapshot.loading}
        demo={snapshot.data?.mode === 'demo'}
        onRefresh={reconnect}
      />
      <ConnectionBanner
        error={snapshot.error ?? action.error}
        demo={snapshot.data?.mode === 'demo'}
        onReconnect={reconnect}
      />
      {presets.error && connected && (
        <p className="inline-error" role="alert">
          Preset library: {presets.error}
        </p>
      )}
      <main className="workspace">
        <NowPlaying snapshot={snapshot.data} />
        <PresetPanel
          presets={presets.data ?? []}
          currentId={snapshot.data?.currentPreset?.id}
          disabled={disabled}
          onSelect={(preset) => {
            void action.run(() => PianoteqApi.loadPreset(preset), snapshot.accept);
          }}
        />
        <VolumePanel
          volume={snapshot.data?.volume ?? null}
          disabled={disabled}
          onCommit={(value) => action.run(() => PianoteqApi.setVolume(value), snapshot.accept)}
        />
        <IoPanel
          settings={devices.data}
          error={devices.error}
          loading={devices.loading}
          onRefresh={() => {
            void devices.refresh();
          }}
        />
      </main>
      <footer className="app-footer">
        <span>A little less screen. A little more music.</span>
        <span>
          {snapshot.data
            ? `${snapshot.data.product} · ${snapshot.data.version}`
            : 'Pianoteq Remote · MVP'}
        </span>
        <ThemeControls />
      </footer>
      <UpdateNotice busy={action.busy} />
    </div>
  );
}

import React from 'react';
import { TIDE_BG_PRESETS, TideThemeCtx, DirectionTide } from './components/Tide.jsx';
import { DirectionTidePulse } from './components/Pulse.jsx';
import { DirectionTideDrops } from './components/Drops.jsx';
import { DirectionTideMe } from './components/Me.jsx';
import { TideEditSheet } from './components/EditDropSheet.jsx';
import { TideImportSheet } from './components/ImportSheet.jsx';

// app-demo.jsx — interactive TIDE app prototype.
// Single phone frame; tap nav to switch screens, tap the FAB to trigger the
// import flow (auto-advances scan → results), tap any drop to open the edit
// sheet. Locked to the user's chosen config (Steel · Dusty · Snow · Stack ·
// Compact · Streams range · Card pulse · Half icon).

const REFLOW_CONFIG = {
  bgPreset: 'snow',
  accent: ['#3E6E8E', '#A6C4D6'],
  catTones: ['#E0958A','#84A8CC','#8AB29C','#C99CB5','#A99CC0','#C8A982'],
  fabVariant: 'stack',
  heroSize: 'compact',
  rangeStyle: 'streams',
  pulseStyle: 'card',
};

// Wrap a subtree so the TIDE theme context is set up — used for overlay
// sheets that need theme tokens but render outside the active direction.
function TideThemeWrap({ config, children }) {
  const base = TIDE_BG_PRESETS[config.bgPreset];
  const th = {
    ...base,
    water: config.accent[0],
    waterLite: config.accent[1],
    catTones: config.catTones,
  };
  return <TideThemeCtx.Provider value={th}>{children}</TideThemeCtx.Provider>;
}

function ReflowApp() {
  const [screen, setScreen] = React.useState('home');
  const [overlay, setOverlay] = React.useState(null);  // null | 'edit' | 'import-scan' | 'import-results'
  const [editTx, setEditTx] = React.useState(null);
  const config = REFLOW_CONFIG;

  const openImport = React.useCallback(() => {
    setOverlay('import-scan');
    // Auto-advance from scan → results to demo the full flow.
    setTimeout(() => setOverlay((cur) => cur === 'import-scan' ? 'import-results' : cur), 2400);
  }, []);

  const openEdit = (tx) => {
    setEditTx(tx);
    setOverlay('edit');
  };
  const closeOverlay = () => { setOverlay(null); setEditTx(null); };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {screen === 'home' && (
        <DirectionTide
          bgPreset={config.bgPreset} accent={config.accent} catTones={config.catTones}
          fabVariant={config.fabVariant} heroSize={config.heroSize}
          onNavigate={setScreen} onImport={openImport}
        />
      )}
      {screen === 'stat' && (
        <DirectionTidePulse
          bgPreset={config.bgPreset} accent={config.accent} catTones={config.catTones}
          heroSize={config.heroSize} pulseStyle={config.pulseStyle}
          onNavigate={setScreen}
        />
      )}
      {screen === 'rec' && (
        <DirectionTideDrops
          bgPreset={config.bgPreset} accent={config.accent} catTones={config.catTones}
          fabVariant={config.fabVariant} rangeStyle={config.rangeStyle}
          onNavigate={setScreen} onImport={openImport} onDropClick={openEdit}
        />
      )}
      {screen === 'me' && (
        <DirectionTideMe
          bgPreset={config.bgPreset} accent={config.accent} catTones={config.catTones}
          onNavigate={setScreen}
        />
      )}

      {overlay === 'edit' && editTx && (
        <TideThemeWrap config={config}>
          <TideEditSheet tx={editTx} onClose={closeOverlay} />
        </TideThemeWrap>
      )}
      {(overlay === 'import-scan' || overlay === 'import-results') && (
        <TideThemeWrap config={config}>
          <TideImportSheet
            phase={overlay === 'import-scan' ? 'scan' : 'results'}
            onClose={closeOverlay}
          />
        </TideThemeWrap>
      )}
    </div>
  );
}


export default ReflowApp;

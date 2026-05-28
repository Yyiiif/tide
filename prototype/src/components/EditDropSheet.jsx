import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TIDE_BG_PRESETS, TIDE_CAT_TONES, TideThemeCtx, useTideTheme } from './Tide.jsx';
import { DirectionTideDrops } from './Drops.jsx';


function TideEditSheet({ tx, onClose }) {
  const th = useTideTheme();
  const D = REFLOW_DATA;
  const tones = th.catTones || TIDE_CAT_TONES;
  const [selectedCat, setSelectedCat] = React.useState(tx.cat);
  const [pay, setPay] = React.useState('Manual');

  return (
    <>
      {/* Scrim */}
      <div style={{
        position:'absolute', inset: 0, background:'rgba(8,12,18,0.42)',
        zIndex: 20, backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)',
      }} onClick={onClose} />

      {/* Sheet */}
      <div style={{
        position:'absolute', left: 0, right: 0, bottom: 0,
        background: th.background.includes('gradient') ? th.surf : th.surf,
        borderRadius:'22px 22px 0 0',
        boxShadow:'0 -8px 28px -10px rgba(14,15,18,0.25)',
        zIndex: 30,
        padding:'10px 22px 28px',
        animation:'tideSheetUp 0.32s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <style>{`@keyframes tideSheetUp { from { transform: translateY(110%); opacity: 0.6 } to { transform: translateY(0); opacity: 1 } }`}</style>

        {/* drag handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'4px 0 12px' }}>
          <span style={{ width: 38, height: 4, borderRadius: 2, background: th.hair }} />
        </div>

        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>EDIT DROP</div>
            <div style={{ fontSize: 17, color: th.ink, fontWeight: 600, letterSpacing: -0.4, marginTop: 2 }}>{tx.name}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16, border:'none', background: th.chip,
            color: th.ink, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Name */}
        <label style={{ display:'block' }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ash, fontWeight: 600, marginBottom: 6 }}>NAME</div>
          <div style={{
            padding:'10px 12px', borderRadius: 10,
            background: th.chip, color: th.ink, fontSize: 14, fontWeight: 500,
            border: `1px solid transparent`,
          }}>{tx.name}</div>
        </label>

        {/* Amount + Date row */}
        <div style={{ display:'flex', gap: 10, marginTop: 12 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ash, fontWeight: 600, marginBottom: 6 }}>AMOUNT</div>
            <div style={{
              padding:'10px 12px', borderRadius: 10,
              background: th.chip, color: th.ink, fontSize: 16, fontWeight: 500,
              fontVariantNumeric:'tabular-nums', letterSpacing: -0.2,
              border: `1px solid ${th.water}`,
            }}>{D.fmt(tx.amt)}</div>
          </label>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ash, fontWeight: 600, marginBottom: 6 }}>DATE</div>
            <div style={{
              padding:'10px 12px', borderRadius: 10,
              background: th.chip, color: th.ink, fontSize: 14, fontWeight: 500,
            }}>{tx.date}<span style={{ color: th.ash, marginLeft: 6, fontSize: 12 }}>{tx.time}</span></div>
          </label>
        </div>

        {/* Category chips */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ash, fontWeight: 600, marginBottom: 6 }}>STREAM</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
            {D.cats.map((c, i) => {
              const on = c.id === selectedCat;
              return (
                <button key={c.id} onClick={() => setSelectedCat(c.id)} style={{
                  display:'inline-flex', alignItems:'center', gap: 6,
                  padding:'6px 11px', borderRadius: 999,
                  background: on ? tones[i % tones.length] : th.chip,
                  color: on ? '#fff' : th.ink,
                  border:'none', cursor:'pointer',
                  fontFamily:'inherit', fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 3,
                    background: on ? 'rgba(255,255,255,0.85)' : tones[i % tones.length],
                  }} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Capture method */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ash, fontWeight: 600, marginBottom: 6 }}>CAPTURED VIA</div>
          <div style={{ display:'inline-flex', background: th.chip, padding: 3, borderRadius: 999 }}>
            {['Manual', 'Bill', 'Screenshot'].map((m) => {
              const on = m === pay;
              return (
                <button key={m} onClick={() => setPay(m)} style={{
                  border:'none', background: on ? th.surf : 'transparent',
                  padding:'6px 12px', borderRadius: 999,
                  fontFamily:'inherit', fontSize: 11, fontWeight: 600,
                  letterSpacing: 0.2, color: on ? th.ink : th.ash,
                  cursor:'pointer', boxShadow: on ? '0 1px 2px rgba(14,15,18,0.10)' : 'none',
                }}>{m}</button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 18, display:'flex', flexDirection:'column', gap: 8 }}>
          <button style={{
            padding:'13px', borderRadius: 12, border:'none',
            background: th.water, color:'#fff',
            fontFamily:'inherit', fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
            cursor:'pointer',
          }}>Save changes</button>
          <button style={{
            padding:'12px', borderRadius: 12, border:`1px solid ${th.hair}`,
            background:'transparent', color:'#C4554D',
            fontFamily:'inherit', fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
            cursor:'pointer',
          }}>Delete drop</button>
        </div>
      </div>
    </>
  );
}

// Wrapper that shows Drops with the edit sheet open on top of it.
function DirectionTideEdit({ bgPreset = 'snow', accent, catTones }) {
  const D = REFLOW_DATA;
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.snow;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };
  // Pick the second recent transaction (Eslite Books) so the user sees a non-trivial amount
  const tx = D.recent.find((t) => t.name === 'Eslite Books') || D.recent[0];

  return (
    <TideThemeCtx.Provider value={th}>
      <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>
        {/* The Drops page underneath */}
        <DirectionTideDrops bgPreset={bgPreset} accent={accent} catTones={catTones} />
        {/* Edit sheet on top */}
        <TideEditSheet tx={tx} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export { DirectionTideEdit, TideEditSheet };

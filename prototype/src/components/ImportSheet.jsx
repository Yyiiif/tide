import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TIDE_BG_PRESETS, TIDE_CAT_TONES, TideThemeCtx, useTideTheme } from './Tide.jsx';
import { DirectionTide } from './Tide.jsx';


function TideScanCircle({ size = 140 }) {
  const th = useTideTheme();
  // Two drifting wave layers inside a circle clip — same idea as TideWave but
  // in a fixed circle and always at ~70% fill so it reads as "active".
  const w = size, h = size;
  const surfaceY = h * 0.32;
  const wavePath = (amp, freq, phase) => {
    const pts = [];
    for (let x = 0; x <= w * 2 + 8; x += 6) {
      const y = surfaceY + Math.sin((x / w) * freq * Math.PI * 2 + phase) * amp;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M -8 ${h + 8} L -8 ${surfaceY} L ` + pts.join(' L ') + ` L ${w * 2 + 8} ${h + 8} Z`;
  };
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <style>{`
        @keyframes tideScanA { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes tideScanB { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes tidePulse { 0%,100% { transform: scale(1); opacity:0.45 } 50% { transform: scale(1.06); opacity:0.18 } }
      `}</style>
      {/* Outer pulsing ring */}
      <div style={{
        position:'absolute', inset:'-8px', borderRadius:'50%',
        border: `1px solid ${th.waterLite}`,
        animation:'tidePulse 2.4s ease-in-out infinite',
      }} />
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display:'block', borderRadius:'50%' }}>
        <defs>
          <radialGradient id="scan-bg" cx="50%" cy="35%" r="65%">
            <stop offset="0" stopColor={th.waterLite} stopOpacity="0.35" />
            <stop offset="1" stopColor={th.water} stopOpacity="0.10" />
          </radialGradient>
          <linearGradient id="scan-front" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={th.waterLite} stopOpacity="0.7" />
            <stop offset="1" stopColor={th.water} stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="scan-clip"><circle cx={w/2} cy={h/2} r={w/2 - 1} /></clipPath>
        </defs>
        <g clipPath="url(#scan-clip)">
          <rect x="0" y="0" width={w} height={h} fill="url(#scan-bg)" />
          <g style={{ animation:'tideScanA 4.5s linear infinite' }}>
            <path d={wavePath(7, 2, 0)} fill={th.waterLite} opacity="0.55" />
          </g>
          <g style={{ animation:'tideScanB 3.2s linear infinite' }}>
            <path d={wavePath(5, 3, Math.PI/2)} fill="url(#scan-front)" />
          </g>
          {/* horizontal scan line */}
          <g style={{ animation:'tideScanLine 1.8s ease-in-out infinite alternate' }}>
            <line x1="0" x2={w} y1={h/2} y2={h/2} stroke={th.water} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.45" />
          </g>
        </g>
        <circle cx={w/2} cy={h/2} r={w/2 - 0.5} fill="none" stroke={th.water} strokeOpacity="0.18" />
      </svg>
    </div>
  );
}

function TideImportSheet({ phase = 'scan', items, onClose }) {
  const th = useTideTheme();
  const D = REFLOW_DATA;
  const tones = th.catTones || TIDE_CAT_TONES;
  const guess = items || [
    { id:1, name:'Family Mart',  amt: 84,  cat:0, picked: true,  type:'food' },
    { id:2, name:'MRT · Daan',   amt: 35,  cat:1, picked: true,  type:'transit' },
    { id:3, name:'Top-up · LinePay', amt: 1000, cat:5, picked: false, type:'transfer' },
    { id:4, name:'Louisa Coffee',amt: 95,  cat:0, picked: true,  type:'food' },
    { id:5, name:'Eslite Books', amt: 580, cat:2, picked: true,  type:'shop' },
  ];

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position:'absolute', inset: 0, background:'rgba(8,12,18,0.35)',
        zIndex: 20, backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)',
      }} />

      {/* Sheet */}
      <div style={{
        position:'absolute', left: 0, right: 0, bottom: 0,
        background: th.surf, borderRadius:'22px 22px 0 0',
        boxShadow:'0 -8px 28px -10px rgba(14,15,18,0.25)',
        zIndex: 30, padding:'10px 22px 28px',
        maxHeight:'88%',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'4px 0 12px' }}>
          <span style={{ width: 38, height: 4, borderRadius: 2, background: th.hair }} />
        </div>

        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>SMART IMPORT</div>
            <div style={{ fontSize: 17, color: th.ink, fontWeight: 600, letterSpacing: -0.4, marginTop: 2 }}>
              {phase === 'scan' ? 'Reading your screenshot' : `Found ${guess.length} items`}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16, border:'none', background: th.chip,
            color: th.ink, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        {phase === 'scan' ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0 8px' }}>
            <TideScanCircle size={140} />
            <div style={{ marginTop: 22, fontSize: 14, color: th.ink, fontWeight: 500, letterSpacing: -0.1 }}>
              Parsing transactions…
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: th.ash }}>
              5 entries detected · classifying streams
            </div>
            {/* shimmering progress dots */}
            <div style={{ display:'flex', gap: 5, marginTop: 16 }}>
              {[0,1,2].map((i) => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: 3, background: th.water,
                  opacity: 0.35, animation: `tideDotPulse 1.4s ease-in-out ${i*0.2}s infinite`,
                }} />
              ))}
              <style>{`@keyframes tideDotPulse { 0%,100% { opacity:0.35; transform:scale(0.85) } 50% { opacity:1; transform:scale(1.1) } }`}</style>
            </div>
          </div>
        ) : (
          <>
            {/* Select-all */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'6px 4px 12px',
            }}>
              <span style={{ fontSize: 11, color: th.ash, letterSpacing: 1.4, fontWeight: 600 }}>SELECT TO SAVE</span>
              <button style={{
                border:'none', background:'transparent', color: th.water,
                fontFamily:'inherit', fontSize: 11, fontWeight: 600, letterSpacing: 0.3, cursor:'pointer',
              }}>SELECT ALL</button>
            </div>
            <div style={{ maxHeight: 280, overflow:'auto', margin:'0 -4px' }}>
              {guess.map((it) => {
                const isTransfer = it.type === 'transfer';
                const tone = tones[it.cat % tones.length];
                return (
                  <div key={it.id} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    padding:'12px 4px', borderBottom:`0.5px solid ${th.hair}`,
                    opacity: it.picked ? 1 : 0.55,
                  }}>
                    {/* checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 5,
                      background: it.picked ? th.water : 'transparent',
                      border: it.picked ? 'none' : `1.5px solid ${th.ash}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink: 0,
                    }}>
                      {it.picked && (
                        <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </div>
                    {/* drop dot */}
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: isTransfer ? th.ash : tone, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: th.ink, fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.name}</div>
                      <div style={{ fontSize: 10, color: th.ash, marginTop: 2 }}>
                        {isTransfer ? 'Looks like a transfer — skip?' : D.cats[it.cat]?.name || 'Misc'}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: th.ink, fontVariantNumeric:'tabular-nums' }}>{D.fmt(it.amt)}</div>
                  </div>
                );
              })}
            </div>
            {/* Actions */}
            <div style={{ marginTop: 14, display:'flex', flexDirection:'column', gap: 8 }}>
              <button style={{
                padding:'13px', borderRadius: 12, border:'none',
                background: th.water, color:'#fff',
                fontFamily:'inherit', fontSize: 14, fontWeight: 600, letterSpacing: -0.1, cursor:'pointer',
              }}>Save 4 drops</button>
              <button style={{
                padding:'12px', borderRadius: 12, border:`1px solid ${th.hair}`,
                background:'transparent', color: th.ash,
                fontFamily:'inherit', fontSize: 13, fontWeight: 500, cursor:'pointer',
              }}>Discard</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function DirectionTideImport({ bgPreset = 'snow', accent, catTones, phase = 'scan' }) {
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.snow;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };

  return (
    <TideThemeCtx.Provider value={th}>
      <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>
        <DirectionTide bgPreset={bgPreset} accent={accent} catTones={catTones} />
        <TideImportSheet phase={phase} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export { DirectionTideImport, TideImportSheet, TideScanCircle };

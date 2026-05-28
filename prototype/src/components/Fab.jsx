import React from 'react';
import { useTideTheme } from './Tide.jsx';

// TIDE · FAB — the floating import stack, with 4 variants.
// Sits inside the phone frame (parent must be position:relative).

function TideFab({ variant = 'stack', onManual, onImport }) {
  const th = useTideTheme();
  const wash = th.water;
  const lite = th.waterLite;

  const PencilSvg = ({ size = 20, color = th.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M16.862 4.487a2.06 2.06 0 0 1 2.913 2.913L7.5 19.687 3 21l1.313-4.5L16.862 4.487Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const CamSvg = ({ size = 22, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 7a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.6" />
      <path d="M19 4v3M17.5 5.5h3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );

  const wrap = {
    position: 'absolute', right: 16, bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
    display: 'flex', alignItems: 'flex-end',
    zIndex: 12,
  };

  // ── Variant: STACK (two separate circles) ──────────────────────
  if (variant === 'stack') {
    const subStyle = {
      width: 48, height: 48, borderRadius: 24,
      background: th.surf, border: `0.5px solid ${th.hair}`,
      boxShadow: '0 1px 0 rgba(255,255,255,0.7), 0 10px 24px -10px rgba(14,15,18,0.20)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0,
    };
    return (
      <div style={{ ...wrap, flexDirection: 'column', gap: 10 }}>
        <button onClick={onManual} style={subStyle} aria-label="Manual entry"><PencilSvg /></button>
        <button onClick={onImport} aria-label="AI smart import" style={{
          ...subStyle, width: 56, height: 56, borderRadius: 28,
          background: `linear-gradient(135deg, ${lite}, ${wash})`,
          border: 'none',
          boxShadow: `0 1px 0 rgba(255,255,255,0.7), 0 12px 28px -10px ${wash}88`,
        }}><CamSvg /></button>
      </div>
    );
  }

  // ── Variant: SINGLE (one primary FAB, camera) ──────────────────
  if (variant === 'single') {
    return (
      <div style={wrap}>
        <button onClick={onImport} aria-label="AI smart import" style={{
          width: 60, height: 60, borderRadius: 30,
          background: `linear-gradient(135deg, ${lite}, ${wash})`,
          border: 'none',
          boxShadow: `0 1px 0 rgba(255,255,255,0.7), 0 14px 32px -10px ${wash}99`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}><CamSvg size={24} /></button>
      </div>
    );
  }

  // ── Variant: PILL (capsule with both icons) ────────────────────
  if (variant === 'pill') {
    return (
      <div style={wrap}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          padding: 4, borderRadius: 999,
          background: th.surf,
          boxShadow: '0 1px 0 rgba(255,255,255,0.7), 0 14px 28px -12px rgba(14,15,18,0.20)',
          border: `0.5px solid ${th.hair}`,
        }}>
          <button onClick={onManual} aria-label="Manual entry" style={{
            width: 44, height: 44, borderRadius: 22, border:'none',
            background:'transparent', cursor:'pointer', padding: 0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}><PencilSvg color={th.ink} /></button>
          <div style={{ width: 0.5, height: 22, background: th.hair }} />
          <button onClick={onImport} aria-label="AI smart import" style={{
            width: 48, height: 48, borderRadius: 24, border:'none',
            background: `linear-gradient(135deg, ${lite}, ${wash})`,
            cursor:'pointer', padding: 0,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: `0 6px 14px -6px ${wash}88`,
          }}><CamSvg size={20} /></button>
        </div>
      </div>
    );
  }

  // ── Variant: DROPLET (custom teardrop shape) ───────────────────
  if (variant === 'drop') {
    return (
      <div style={{ ...wrap, flexDirection: 'column', alignItems:'flex-end', gap: 10 }}>
        <button onClick={onManual} aria-label="Manual entry" style={{
          width: 40, height: 40, borderRadius: 20,
          background: th.surf, border: `0.5px solid ${th.hair}`,
          boxShadow: '0 1px 0 rgba(255,255,255,0.7), 0 8px 18px -8px rgba(14,15,18,0.18)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', padding: 0,
        }}><PencilSvg size={16} color={th.ink} /></button>
        <button onClick={onImport} aria-label="AI smart import" style={{
          width: 60, height: 68, padding: 0, border:'none',
          background:'transparent', cursor:'pointer',
          position:'relative',
        }}>
          <svg width="60" height="68" viewBox="0 0 60 68" style={{ display:'block', overflow:'visible' }}>
            <defs>
              <linearGradient id={'drop-grad-' + (wash.replace('#','')).slice(0,6)} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={lite} />
                <stop offset="1" stopColor={wash} />
              </linearGradient>
              <filter id="drop-shadow" x="-30%" y="-10%" width="160%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor={wash} floodOpacity="0.45" />
              </filter>
            </defs>
            {/* teardrop path: point at top, round at bottom */}
            <path
              d="M30 2 C 32 14, 56 24, 56 42 C 56 56, 44 66, 30 66 C 16 66, 4 56, 4 42 C 4 24, 28 14, 30 2 Z"
              fill={`url(#drop-grad-${wash.replace('#','').slice(0,6)})`}
              filter="url(#drop-shadow)"
            />
          </svg>
          <span style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', paddingTop: 6 }}>
            <CamSvg size={22} />
          </span>
        </button>
      </div>
    );
  }

  return null;
}


export { TideFab };

import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TIDE_BG_PRESETS, TIDE_CAT_TONES, TideThemeCtx, useTideTheme, TideNav, TideMonthNav } from './Tide.jsx';
import { TideFab } from './Fab.jsx';


function TideStatCard({ label, value, sub, accent }) {
  const th = useTideTheme();
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: th.surf, borderRadius: 14, padding:'12px 14px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.12)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: accent || th.water }} />
        <span style={{ fontSize: 9, letterSpacing: 1.3, color: th.ash, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.6, marginTop: 6, fontVariantNumeric:'tabular-nums', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: th.ash, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>{sub}</div>
    </div>
  );
}

// ── Range layout variants ──────────────────────────────────────────────
// All take the same `items` shape: { label, value, sub, fill (0..1) }.
// User can pick which one feels right via the tweaks panel.

// A · Gauge: one continuous rising wave under three columns of text.
function TideRangeFlow({ items }) {
  const th = useTideTheme();
  const W = 320, H = 110;
  const baseLow = H * 0.78;
  const baseHigh = H * 0.42;
  const pts = [];
  for (let x = 0; x <= W + 4; x += 5) {
    const t = x / W;
    const baseY = baseLow + (baseHigh - baseLow) * t;
    const wobble = Math.sin(t * Math.PI * 4.2) * 3.5 + Math.sin(t * Math.PI * 7.3 + 1.1) * 1.6;
    pts.push([x, baseY + wobble]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx} ${y1} ${x2} ${y2}`;
  }
  const area = d + ` L ${W} ${H} L 0 ${H} Z`;
  const flowId = 'tide-flow-' + (th.water.replace('#','')).slice(0, 6);
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: th.surf, borderRadius: 16,
      boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.12)',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none"
           style={{ position:'absolute', inset: 0, display:'block' }} aria-hidden="true">
        <defs>
          <linearGradient id={flowId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={th.waterLite} stopOpacity="0.55" />
            <stop offset="1" stopColor={th.water} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${flowId})`} />
        <path d={d} stroke={th.water} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
      </svg>
      <div style={{ position:'relative', display:'flex', padding:'14px 0 14px', zIndex: 1 }}>
        {items.map((it, i) => (
          <div key={it.label} style={{
            flex: 1, textAlign:'center',
            borderRight: i < items.length - 1 ? `0.5px solid ${th.hair}` : 'none',
            padding: '0 8px',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 1.6, color: th.ash, fontWeight: 600 }}>{it.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.5, color: th.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{it.value}</div>
            <div style={{ fontSize: 10, color: th.ash, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tiny static wave — used inside the Streams / Lanes variants.
function TideMiniWave({ fill = 0.4, w = 80, h = 22, color, lite, phase = 0 }) {
  const th = useTideTheme();
  color = color || th.water;
  lite = lite || th.waterLite;
  const surfaceY = h - h * fill;
  const pts = [];
  for (let x = 0; x <= w; x += 4) {
    const y = surfaceY + Math.sin((x / w) * Math.PI * 3 + phase) * 1.6;
    pts.push([x, y]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx} ${y1} ${x2} ${y2}`;
  }
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display:'block' }}>
      <defs>
        <linearGradient id={`mw-${color.replace('#','')}-${phase}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={lite} stopOpacity="0.6" />
          <stop offset="1" stopColor={color} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#mw-${color.replace('#','')}-${phase})`} />
      <path d={d} stroke={color} strokeWidth="1" fill="none" opacity="0.95" />
    </svg>
  );
}

// B · Streams: three side-by-side mini gauges, each a tiny wave filling to fill%.
function TideRangeStreams({ items }) {
  const th = useTideTheme();
  return (
    <div style={{ display:'flex', gap: 8 }}>
      {items.map((it, i) => (
        <div key={it.label} style={{
          flex: 1, position:'relative', overflow:'hidden',
          background: th.surf, borderRadius: 14,
          padding:'12px 10px 0',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.12)',
          minHeight: 96,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1.4, color: th.ash, fontWeight: 600 }}>{it.label}</div>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.3, color: th.ink, marginTop: 4, fontVariantNumeric:'tabular-nums', lineHeight: 1 }}>{it.value}</div>
          <div style={{ fontSize: 10, color: th.ash, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>{it.sub}</div>
          <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, height: 26 }}>
            <TideMiniWave fill={Math.max(0.1, it.fill || 0.3)} w={100} h={26} phase={i * 0.8} />
          </div>
        </div>
      ))}
    </div>
  );
}

// C · Lanes: three stacked rows, each a long wave-filled progress bar.
function TideRangeLanes({ items }) {
  const th = useTideTheme();
  return (
    <div style={{
      background: th.surf, borderRadius: 16,
      padding:'14px 16px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.12)',
    }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ padding:'8px 0', borderBottom: i < items.length - 1 ? `0.5px solid ${th.hair}` : 'none' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 6 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.4, color: th.ash, fontWeight: 600, minWidth: 42 }}>{it.label}</span>
              <span style={{ fontSize: 11, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{it.sub}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: th.ink, fontVariantNumeric:'tabular-nums', letterSpacing: -0.2 }}>{it.value}</span>
          </div>
          <div style={{
            position:'relative', height: 10, borderRadius: 5,
            background: th.hair, overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, width: ((it.fill || 0) * 100) + '%', overflow:'hidden' }}>
              <TideMiniWave fill={1} w={260} h={10} phase={i * 0.6} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TideSeg({ value, options, onChange }) {
  const th = useTideTheme();
  return (
    <div style={{
      display:'inline-flex', background: th.chip, padding: 3, borderRadius: 999,
    }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange && onChange(o.value)} style={{
            border:'none', background: on ? th.surf : 'transparent',
            padding:'6px 14px', borderRadius: 999,
            fontFamily:'inherit', fontSize: 11, fontWeight: 600,
            letterSpacing: 0.3, color: on ? th.ink : th.ash,
            cursor:'pointer', boxShadow: on ? '0 1px 2px rgba(14,15,18,0.10)' : 'none',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function TideDropRow({ tx, cat, accent }) {
  const th = useTideTheme();
  const D = REFLOW_DATA;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 12,
      padding:'12px 4px', borderBottom: `0.5px solid ${th.hair}`,
    }}>
      {/* drop glyph: circle with ripple */}
      <div style={{ position:'relative', width: 24, height: 24, flexShrink: 0 }}>
        <div style={{
          position:'absolute', inset: 7,
          borderRadius:'50%', background: accent || th.water,
        }} />
        <div style={{
          position:'absolute', inset: 3,
          borderRadius:'50%', border: `1px solid ${accent || th.water}`, opacity: 0.45,
        }} />
        <div style={{
          position:'absolute', inset: 0,
          borderRadius:'50%', border: `1px solid ${accent || th.water}`, opacity: 0.18,
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: th.ink, fontWeight: 500, letterSpacing: -0.1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{tx.name}</div>
        <div style={{ fontSize: 10, color: th.ash, marginTop: 2, display:'flex', gap: 8, alignItems:'center' }}>
          <span>{cat ? cat.name : '—'}</span>
          <span style={{ width: 2, height: 2, borderRadius: 1, background: th.ash, opacity: 0.6 }} />
          <span style={{ fontVariantNumeric:'tabular-nums' }}>{tx.time}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: th.ink, fontVariantNumeric:'tabular-nums', letterSpacing: -0.2 }}>{D.fmt(tx.amt)}</div>
    </div>
  );
}

function DirectionTideDrops({ bgPreset = 'mist', accent, catTones, fabVariant = 'stack', rangeStyle = 'gauge', onNavigate, onImport, onManual, onDropClick }) {
  const D = REFLOW_DATA;
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.mist;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };
  const [mode, setMode] = React.useState('date');

  // Bright per-category palette (shared across all TIDE screens).
  const tones = th.catTones || TIDE_CAT_TONES;
  const accentFor = (catId) => {
    const idx = D.cats.findIndex((c) => c.id === catId);
    return tones[Math.max(0, idx) % tones.length];
  };

  // Group recent by date label
  const groups = (() => {
    if (mode === 'date') {
      const map = {};
      D.recent.forEach((tx) => {
        (map[tx.date] = map[tx.date] || []).push(tx);
      });
      return Object.entries(map).map(([key, items]) => ({ key, items }));
    } else {
      const map = {};
      D.recent.forEach((tx) => {
        const c = D.catById[tx.cat];
        const k = c ? c.name : 'Other';
        (map[k] = map[k] || []).push(tx);
      });
      return Object.entries(map).map(([key, items]) => ({ key, items }));
    }
  })();

  // Today / week / month totals
  const todayTotal = 84 + 35;            // from data: Nov 18 entries
  const weekTotal  = todayTotal + 580 + 95 + 149 + 62 + 240; // last 7 days
  const monthTotal = D.monthSpent;

  return (
    <TideThemeCtx.Provider value={th}>
      <div style={{
        width:'100%', height:'100%',
        background: th.background,
        color: th.ink,
        fontFamily:'"Inter", -apple-system, system-ui, sans-serif',
        display:'flex', flexDirection:'column',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        position:'relative',
      }}>
        {/* Eyebrow */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 18px 4px' }}>
          <span style={{ fontSize: 10, letterSpacing: 2.2, color: th.ash, fontWeight: 600 }}>DROPS</span>
          <TideMonthNav label={D.monthLabel} />
        </div>

        {/* Flowing tide-gauge row — three layout variants */}
        <div style={{ padding:'8px 22px 0' }}>
          {(() => {
            const items = [
              { label: 'TODAY', value: D.fmt(todayTotal), sub: 'of ~$568/d', fill: Math.min(1, todayTotal / 568) },
              { label: 'WEEK',  value: D.fmt(weekTotal),  sub: 'of ~$4.0k/w', fill: Math.min(1, weekTotal / 4000) },
              { label: 'MONTH', value: D.fmt(monthTotal), sub: `of ${D.fmt(D.monthBudget)}`, fill: Math.min(1, monthTotal / D.monthBudget) },
            ];
            if (rangeStyle === 'streams') return <TideRangeStreams items={items} />;
            if (rangeStyle === 'lanes')   return <TideRangeLanes items={items} />;
            return <TideRangeFlow items={items} />;
          })()}
        </div>

        {/* Seg + count */}
        <div style={{ padding:'18px 22px 8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <TideSeg value={mode} onChange={setMode} options={[
            { value:'date', label:'By date' },
            { value:'cat',  label:'By stream' },
          ]} />
          <span style={{ fontSize: 10, color: th.ash, letterSpacing: 1.2, fontVariantNumeric:'tabular-nums' }}>54 ENTRIES</span>
        </div>

        {/* List */}
        <div style={{ flex: 1, minHeight: 0, overflow:'hidden', padding:'0 22px' }}>
          {groups.map((g) => {
            const sum = g.items.reduce((s, t) => s + t.amt, 0);
            return (
              <div key={g.key} style={{ marginBottom: 6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'10px 4px 4px' }}>
                  <span style={{ fontSize: 10, letterSpacing: 1.6, color: th.ash, fontWeight: 600 }}>
                    {g.key.toUpperCase()}{mode === 'date' && g.key === 'Nov 18' ? ' · TODAY' : ''}
                  </span>
                  <span style={{ fontSize: 10, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{D.fmt(sum)}</span>
                </div>
                <div>
                  {g.items.map((tx) => (
                    <div key={tx.id} onClick={() => onDropClick && onDropClick(tx)} style={{ cursor: onDropClick ? 'pointer' : 'default' }}>
                      <TideDropRow tx={tx} cat={D.catById[tx.cat]} accent={accentFor(tx.cat)} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <TideFab variant={fabVariant} onImport={onImport} onManual={onManual} />
        <TideNav active="rec" onNavigate={onNavigate} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export { DirectionTideDrops };

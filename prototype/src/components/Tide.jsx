import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TideFab } from './Fab.jsx';

// TIDE — money as a living water level.
// Cool modern palette with selectable bg presets (mist / snow / aurora / slate).
// Theme threaded via context so every subcomponent inherits the active mood.

const TIDE_BG_PRESETS = {
  mist: {
    background: 'radial-gradient(120% 80% at 50% 0%, #FFFFFF 0%, #F2F4F7 55%, #ECEFF3 100%)',
    ink: '#0E0F12', ash: '#8C909A', surf: '#FFFFFF', hair: 'rgba(14,15,18,0.08)',
    water: '#1E7A7E', waterLite: '#7FC2C4',
    navBg: 'rgba(255,255,255,0.6)',
    chip: 'rgba(14,15,18,0.04)',
  },
  snow: {
    background: '#FAFAFB',
    ink: '#101113', ash: '#9CA0A8', surf: '#FFFFFF', hair: 'rgba(14,15,18,0.06)',
    water: '#1E7A7E', waterLite: '#A6D5D6',
    navBg: '#FAFAFB',
    chip: 'rgba(14,15,18,0.04)',
  },
  aurora: {
    background: 'radial-gradient(80% 60% at 50% 30%, #C7E7E8 0%, #E8EEF2 45%, #F2F3F6 100%)',
    ink: '#0B2A2C', ash: '#6E8889', surf: '#FFFFFF', hair: 'rgba(11,42,44,0.10)',
    water: '#0E5E63', waterLite: '#6CB6B8',
    navBg: 'rgba(255,255,255,0.55)',
    chip: 'rgba(11,42,44,0.05)',
  },
  slate: {
    background: 'radial-gradient(120% 80% at 50% 0%, #1A1D22 0%, #0F1115 60%, #0A0C0F 100%)',
    ink: '#F2F3F6', ash: '#7B8088', surf: '#181B20', hair: 'rgba(255,255,255,0.08)',
    water: '#3DBFBF', waterLite: '#1B6E6F',
    navBg: 'rgba(15,17,21,0.7)',
    chip: 'rgba(255,255,255,0.05)',
  },
};

const TideThemeCtx = React.createContext(TIDE_BG_PRESETS.mist);
const useTideTheme = () => React.useContext(TideThemeCtx);

// Bright, harmonious category palette (constant — independent of accent).
// All sit around the same lightness/chroma so they read as a family.
// Order matches REFLOW_DATA.cats: Food, Transit, Shopping, Leisure, Home, Misc.
const TIDE_CAT_TONES = [
  '#FF7A5C', // Food · coral
  '#3D8AE0', // Transit · azure
  '#3DC07A', // Shopping · jade
  '#E0539E', // Leisure · magenta
  '#8A6BF0', // Home · violet
  '#F2A93A', // Misc · amber
];
const TIDE_CAT_TONES_LITE = [
  '#FFC9BB', // coral light
  '#B7D6F2', // azure light
  '#B7E5CD', // jade light
  '#F2BFDB', // magenta light
  '#CBC0F7', // violet light
  '#FADDA8', // amber light
];

// Mix a hex toward white — used to build the "lite" variant for gradients.
function tideLiteOf(hex, amt = 0.55) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mr = Math.round(r + (255 - r) * amt);
  const mg = Math.round(g + (255 - g) * amt);
  const mb = Math.round(b + (255 - b) * amt);
  return '#' + [mr, mg, mb].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Palette options the user can switch between. All are six colors, ordered for
// Food / Transit / Shopping / Leisure / Home / Misc. The "gray-shaded" sets keep
// the same hue mapping as Bright but pull chroma down so they read calmer.
const TIDE_CAT_PALETTES = {
  bright: TIDE_CAT_TONES,
  dusty:  ['#E0958A','#84A8CC','#8AB29C','#C99CB5','#A99CC0','#C8A982'],
  powder: ['#F0B5AA','#B5CCE0','#B5D5BE','#DDB8CC','#C2B5DC','#E2CCA0'],
  stone:  ['#B57969','#6E94B5','#779E89','#B58399','#8C82B0','#B5965C'],
  frost:  ['#D89A8E','#8FAAC8','#91B49C','#C8A0B5','#A99FC8','#C7AC8E'],
};

// SVG wave that "fills" up to a given level (0..1). Two wave layers, offset.
function TideWave({ level = 0.5, w = 280, h = 360 }) {
  const th = useTideTheme();
  const surfaceY = h - (h * level);
  const wavePath = (amp, freq, phase) => {
    const pts = [];
    for (let x = 0; x <= w * 2 + 8; x += 8) {
      const y = surfaceY + Math.sin((x / w) * freq * Math.PI * 2 + phase) * amp;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M -8 ${h + 8} L -8 ${surfaceY} L ` + pts.join(' L ') + ` L ${w * 2 + 8} ${h + 8} Z`;
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display:'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="tide-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={th.waterLite} stopOpacity="0.55" />
          <stop offset="1" stopColor={th.water} stopOpacity="0.95" />
        </linearGradient>
        <clipPath id="tide-clip"><rect x="0" y="0" width={w} height={h} rx="22" ry="22" /></clipPath>
      </defs>
      <g clipPath="url(#tide-clip)">
        {/* back wave */}
        <g style={{ animation: 'tideDriftA 7s linear infinite' }}>
          <path d={wavePath(6, 2, 0)} fill={th.waterLite} opacity="0.55" />
        </g>
        {/* front wave */}
        <g style={{ animation: 'tideDriftB 5.2s linear infinite' }}>
          <path d={wavePath(4, 3, Math.PI / 2)} fill="url(#tide-grad)" />
        </g>
        {/* level ticks on side */}
        {[0.25, 0.5, 0.75].map((p) => (
          <g key={p}>
            <line x1="8" x2="16" y1={h * (1 - p)} y2={h * (1 - p)} stroke={th.ink} strokeOpacity="0.35" strokeWidth="0.5" />
            <line x1={w - 16} x2={w - 8} y1={h * (1 - p)} y2={h * (1 - p)} stroke={th.ink} strokeOpacity="0.35" strokeWidth="0.5" />
          </g>
        ))}
      </g>
      {/* tank outline */}
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} rx="22" ry="22" fill="none" stroke={th.ink} strokeOpacity="0.16" strokeWidth="1" />
    </svg>
  );
}

// Horizontal "tide chart" of daily spend — softly curved area chart.
function TideDailyChart({ data, today, w = 308, h = 64 }) {
  const th = useTideTheme();
  const max = Math.max(1, ...data);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - 4 - (v / max) * (h - 12)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx} ${y1} ${x2} ${y2}`;
  }
  const fill = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display:'block' }}>
      <defs>
        <linearGradient id="tide-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={th.water} stopOpacity="0.3" />
          <stop offset="1" stopColor={th.water} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#tide-area)" />
      <path d={d} stroke={th.water} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1={today * step} x2={today * step} y1="0" y2={h} stroke={th.ink} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.45" />
      <circle cx={pts[today][0]} cy={pts[today][1]} r="3" fill={th.ink} />
      <circle cx={pts[today][0]} cy={pts[today][1]} r="6" fill="none" stroke={th.ink} strokeOpacity="0.25" />
    </svg>
  );
}

function TideBars({ data, today }) {
  const th = useTideTheme();
  const max = Math.max(1, ...data);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap: 2, height: 60 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: '100%', display:'flex', alignItems:'flex-end' }}>
          <div style={{
            width:'100%',
            height: ((v / max) * 92 + (v > 0 ? 4 : 1.5)) + '%',
            background: i === today ? th.ink : th.water,
            opacity: i > today ? 0.18 : (i === today ? 1 : 0.65),
            borderRadius: 1.5,
          }} />
        </div>
      ))}
    </div>
  );
}

function TideCatRow({ c, D, idx }) {
  const th = useTideTheme();
  const tones = th.catTones || TIDE_CAT_TONES;
  const pct = Math.min(1, c.spent / c.budget);
  const tone = tones[idx % tones.length];
  const toneLite = tideLiteOf(tone, 0.55);
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'10px 0', borderBottom:`0.5px solid ${th.hair}` }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: tone, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: th.ink, fontWeight: 500, letterSpacing: -0.1 }}>{c.name}</div>
        <div style={{ position:'relative', height: 3, background: th.hair, borderRadius: 2, marginTop: 6, overflow:'hidden' }}>
          <div style={{
            position:'absolute', inset: 0, width: (pct * 100) + '%',
            background: `linear-gradient(90deg, ${toneLite}, ${tone})`,
            borderRadius: 2,
          }} />
        </div>
      </div>
      <div style={{ textAlign:'right', minWidth: 78 }}>
        <div style={{ fontSize: 12, color: th.ink, fontFamily:'"Inter", system-ui', fontWeight: 500, fontVariantNumeric:'tabular-nums' }}>{D.fmt(c.spent)}</div>
        <div style={{ fontSize: 9.5, color: th.ash, fontFamily:'"Inter", system-ui', fontVariantNumeric:'tabular-nums', marginTop: 1 }}>of {D.fmt(c.budget)}</div>
      </div>
    </div>
  );
}

function TideNav({ active = 'home', onNavigate }) {
  const th = useTideTheme();
  const items = [
    { k:'home', label:'Tide' },
    { k:'stat', label:'Pulse' },
    { k:'rec',  label:'Drops' },
    { k:'me',   label:'Me' },
  ];
  return (
    <div style={{
      borderTop: `0.5px solid ${th.hair}`,
      background: th.navBg,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      padding:'10px 22px max(16px, env(safe-area-inset-bottom))',
      display:'flex', justifyContent:'space-between',
    }}>
      {items.map((it) => {
        const on = it.k === active;
        return (
          <button key={it.k} onClick={() => onNavigate && onNavigate(it.k)} style={{
            border:'none', background:'transparent', padding: 0, cursor: onNavigate ? 'pointer' : 'default',
            display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            opacity: on ? 1 : 0.42,
            WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: on ? th.water : 'transparent',
              border: on ? 'none' : `1px solid ${th.ash}`,
            }} />
            <span style={{ fontSize: 9, letterSpacing: 1.4, fontWeight: 600, color: th.ink, fontFamily:'inherit' }}>{it.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

// Compact month nav: ‹ NOV 2026 ›. Lives inside the eyebrow row.
function TideMonthNav({ label }) {
  const th = useTideTheme();
  const ChevBtn = ({ dir }) => (
    <button aria-label={dir === -1 ? 'Previous month' : 'Next month'} style={{
      width: 22, height: 22, borderRadius: 11,
      border: 'none', background: 'transparent', color: th.ash,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0, margin: 0,
      transition: 'background 0.15s, color 0.15s',
    }}
    onMouseOver={(e) => { e.currentTarget.style.background = th.chip; e.currentTarget.style.color = th.ink; }}
    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = th.ash; }}
    >
      <svg width="8" height="12" viewBox="0 0 8 12">
        <path d={dir === -1 ? 'M6 1L1.5 6 6 11' : 'M2 1l4.5 5L2 11'} stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap: 2 }}>
      <ChevBtn dir={-1} />
      <span style={{ fontSize: 10, letterSpacing: 2.2, color: th.ash, fontWeight: 600, minWidth: 64, textAlign:'center' }}>{label}</span>
      <ChevBtn dir={1} />
    </div>
  );
}

function DirectionTide({ chartStyle = 'wave', bgPreset = 'mist', accent, catTones, fabVariant = 'stack', heroSize = 'compact', onNavigate, onImport, onManual }) {
  const D = REFLOW_DATA;
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.mist;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };
  const level = D.remaining / D.monthBudget;
  // Sizing tokens — keep the hero scalable so user can pick what feels right.
  const heroAR     = heroSize === 'regular' ? '1 / 1.05' : heroSize === 'tall' ? '1 / 1.18' : '1 / 0.78';
  const heroBig    = heroSize === 'regular' ? 44 : heroSize === 'tall' ? 52 : 32;
  const heroEyebrowGap = heroSize === 'regular' ? 4 : 2;
  const heroSubSize = heroSize === 'tall' ? 12 : 10.5;
  const heroFootSize = heroSize === 'regular' ? 18 : heroSize === 'tall' ? 20 : 15;
  const heroPad     = heroSize === 'compact' ? 16 : 20;

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
        <style>{`
          @keyframes tideDriftA { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes tideDriftB { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        `}</style>

        {/* Top eyebrow */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 18px 4px' }}>
          <span style={{ fontSize: 10, letterSpacing: 2.2, color: th.ash, fontWeight: 600 }}>REFLOW</span>
          <TideMonthNav label={D.monthLabel} />
        </div>

        {/* HERO: tank */}
        <div style={{ padding:'8px 22px 0', position:'relative' }}>
          <div style={{
            position:'relative', width:'100%', aspectRatio: heroAR,
            borderRadius: 22, overflow:'hidden', background: th.surf,
            boxShadow: bgPreset === 'slate' ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : '0 1px 0 rgba(255,255,255,0.7), 0 12px 32px -16px rgba(14,15,18,0.18)',
          }}>
            <TideWave level={level} w={300} h={320} />
            <div style={{ position:'absolute', inset: 0, padding: heroPad, display:'flex', flexDirection:'column', justifyContent:'space-between', pointerEvents:'none' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ink, opacity: 0.55, fontWeight: 600 }}>REMAINING</div>
                <div style={{ fontSize: heroBig, fontWeight: 500, letterSpacing: -1.6, marginTop: heroEyebrowGap, fontFamily:'"Inter", system-ui', fontVariantNumeric:'tabular-nums', lineHeight: 1 }}>
                  {D.fmt(D.remaining)}
                </div>
                <div style={{ fontSize: heroSubSize, color: th.ink, opacity: 0.6, marginTop: 6, fontVariantNumeric:'tabular-nums' }}>
                  of {D.fmt(D.monthBudget)} · {Math.round(level * 100)}% left
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.4, color: th.ink, opacity: 0.55, fontWeight: 600 }}>DAILY PACE</div>
                  <div style={{ fontSize: heroFootSize, fontWeight: 500, marginTop: 2, fontVariantNumeric:'tabular-nums', letterSpacing: -0.4 }}>{D.fmt(D.dailyAllow)}<span style={{ fontSize: 11, color: th.ash, marginLeft: 4 }}>/day</span></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.4, color: th.ink, opacity: 0.55, fontWeight: 600 }}>DAYS</div>
                  <div style={{ fontSize: heroFootSize, fontWeight: 500, marginTop: 2, fontVariantNumeric:'tabular-nums', letterSpacing: -0.4 }}>{D.daysLeft}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div style={{ padding:'22px 22px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 2 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>STREAMS</span>
            <span style={{ fontSize: 10, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{D.fmt(D.monthSpent)} spent</span>
          </div>
          <div>
            {D.cats.map((c, i) => <TideCatRow key={c.id} c={c} D={D} idx={i} />)}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <TideFab variant={fabVariant} onImport={onImport} onManual={onManual} />
        <TideNav active="home" onNavigate={onNavigate} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export {
  TIDE_BG_PRESETS, TIDE_CAT_TONES, TIDE_CAT_TONES_LITE, TIDE_CAT_PALETTES,
  tideLiteOf, TideThemeCtx, useTideTheme, TideNav, TideMonthNav, DirectionTide,
};

import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TIDE_BG_PRESETS, TIDE_CAT_TONES, TideThemeCtx, useTideTheme, TideNav, TideMonthNav } from './Tide.jsx';


function TideCumulativeWave({ data, today, daysInMonth, w = 308, h = 130, fillRatio = 0.6, showTodayMarker = true }) {
  const th = useTideTheme();
  // Cumulative series: only count up to today, future days are flat.
  const cum = [];
  let s = 0;
  for (let i = 0; i < daysInMonth; i++) {
    if (i <= today) s += data[i] || 0;
    cum.push(s);
  }
  const max = Math.max(1, cum[cum.length - 1]);
  const step = w / (daysInMonth - 1);
  const pts = cum.map((v, i) => [i * step, h - 6 - (v / max) * (h * fillRatio)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx} ${y1} ${x2} ${y2}`;
  }
  // Area + wavy surface line at the "today" point
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  // Future area (dashed line continuing flat — visual cue for "not yet")
  const todayX = today * step;
  const todayY = pts[today][1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display:'block' }}>
      <defs>
        <linearGradient id="pulse-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={th.water} stopOpacity="0.32" />
          <stop offset="1" stopColor={th.water} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pulse-area)" />
      <path d={d} stroke={th.water} strokeWidth="1.75" fill="none" strokeLinecap="round" />
      {/* future hint */}
      <line x1={todayX} x2={w} y1={todayY} y2={todayY} stroke={th.ash} strokeWidth="1" strokeDasharray="2 4" opacity="0.55" />
      {/* today marker */}
      {showTodayMarker && (<>
        <line x1={todayX} x2={todayX} y1="0" y2={h} stroke={th.ink} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        <circle cx={todayX} cy={todayY} r="3.5" fill={th.water} />
        <circle cx={todayX} cy={todayY} r="7" fill="none" stroke={th.water} strokeOpacity="0.3" />
      </>)}
      {/* axis baseline */}
      <line x1="0" x2={w} y1={h - 0.5} y2={h - 0.5} stroke={th.hair} strokeWidth="0.5" />
    </svg>
  );
}

function TideStreamBar({ cats, total }) {
  const th = useTideTheme();
  const tones = th.catTones || TIDE_CAT_TONES;
  return (
    <div>
      <div style={{ display:'flex', height: 10, borderRadius: 5, overflow:'hidden', background: th.hair }}>
        {cats.map((c, i) => {
          const w = (c.spent / total) * 100;
          return <div key={c.id} style={{ width: w + '%', background: tones[i % tones.length] }} />;
        })}
      </div>
      <div style={{ display:'flex', flexDirection:'column', marginTop: 12, gap: 6 }}>
        {cats.map((c, i) => {
          const pct = (c.spent / total) * 100;
          return (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: tones[i % tones.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: th.ink, fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 11, color: th.ash, fontVariantNumeric:'tabular-nums', minWidth: 32, textAlign:'right' }}>{pct.toFixed(1)}%</span>
              <span style={{ fontSize: 12, color: th.ink, fontVariantNumeric:'tabular-nums', minWidth: 56, textAlign:'right', fontWeight: 500 }}>{REFLOW_DATA.fmt(c.spent)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TideHeatmap({ data, today, daysInMonth }) {
  const th = useTideTheme();
  const max = Math.max(1, ...data);
  // Render as a 5×7 grid (35 cells covers up to ~5 weeks), align to Mon-start.
  // For simplicity we just show daysInMonth cells starting from cell 0.
  const rows = 5;
  const cols = 7;
  const cells = [];
  for (let i = 0; i < rows * cols; i++) {
    const v = i < daysInMonth ? (data[i] || 0) : null;
    const isFuture = i > today;
    const intensity = v != null ? Math.min(1, v / max) : 0;
    cells.push({ i, v, isFuture, intensity, isToday: i === today });
  }
  // Color mix between hair (low) and water (high).
  const cellColor = (intensity, isFuture) => {
    if (intensity === 0) return th.hair;
    if (isFuture) return th.hair;
    const a = 0.18 + intensity * 0.72;
    return `color-mix(in srgb, ${th.water} ${Math.round(a * 100)}%, transparent)`;
  };
  return (
    <div>
      <div style={{
        display:'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 5,
      }}>
        {cells.map(({ i, v, isFuture, intensity, isToday }) => {
          const inRange = i < daysInMonth;
          return (
            <div key={i} style={{
              aspectRatio:'1', borderRadius: 4,
              background: inRange ? cellColor(intensity, isFuture) : 'transparent',
              border: isToday ? `1.5px solid ${th.ink}` : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 9, color: intensity > 0.5 ? '#fff' : th.ash,
              fontVariantNumeric:'tabular-nums',
              opacity: isFuture && !isToday ? 0.5 : 1,
            }}>
              {inRange ? (i + 1) : ''}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 10, fontSize: 9, color: th.ash, letterSpacing: 1.2 }}>
        <span>LESS</span>
        {[0.1, 0.3, 0.55, 0.8, 1].map((t) => (
          <span key={t} style={{
            width: 12, height: 12, borderRadius: 3,
            background: `color-mix(in srgb, ${th.water} ${Math.round((0.18 + t * 0.72) * 100)}%, transparent)`,
          }} />
        ))}
        <span>MORE</span>
      </div>
    </div>
  );
}

// Three hero variants for Pulse — user picks via tweaks.
// All share the same data, just composed differently to feel less stiff.
function TidePulseHero({ variant = 'crest', heroBig = 28, heroWaveH = 88, heroPad = 16, bgPreset, isSlate }) {
  const th = useTideTheme();
  const D = REFLOW_DATA;
  const avgPerDay = D.monthSpent / (D.today + 1);
  const shadow = isSlate
    ? 'inset 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 0 rgba(255,255,255,0.7), 0 12px 32px -16px rgba(14,15,18,0.18)';

  // ·· Variant: CARD (current, structured) ·····························
  if (variant === 'card') {
    return (
      <div style={{ position:'relative', borderRadius: 22, background: th.surf, padding: heroPad, boxShadow: shadow }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ink, opacity: 0.55, fontWeight: 600 }}>SPENT SO FAR</div>
            <div style={{ fontSize: heroBig, fontWeight: 500, letterSpacing: -1.4, marginTop: 4, fontVariantNumeric:'tabular-nums', lineHeight: 1 }}>
              {D.fmt(D.monthSpent)}
            </div>
            <div style={{ fontSize: 11, color: th.ink, opacity: 0.6, marginTop: 6, fontVariantNumeric:'tabular-nums' }}>
              {D.fmt(avgPerDay)}<span style={{ color: th.ash }}> avg / day</span>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap: 4, fontSize: 10, color: th.water, background: th.chip, padding:'3px 8px', borderRadius: 999, fontWeight: 600, letterSpacing: 0.2 }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: th.water }} />
              ON PACE
            </div>
            <div style={{ fontSize: 9, color: th.ash, marginTop: 6, letterSpacing: 1.3, fontWeight: 600 }}>VS LAST MONTH</div>
            <div style={{ fontSize: 13, color: th.ink, marginTop: 1, fontVariantNumeric:'tabular-nums', fontWeight: 500 }}>−8.4%</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <TideCumulativeWave data={D.daily} today={D.today} daysInMonth={D.daysInMonth} w={300} h={heroWaveH} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 9, color: th.ash, fontVariantNumeric:'tabular-nums', marginTop: 4 }}>
          <span>NOV 1</span><span>D{D.today + 1}</span><span>NOV 30</span>
        </div>
      </div>
    );
  }

  // ·· Variant: CREST (number floats at today's wave peak) ···················
  if (variant === 'crest') {
    const H = Math.max(170, heroWaveH + 70);
    const todayPct = D.today / (D.daysInMonth - 1);
    return (
      <div style={{ position:'relative', borderRadius: 22, background: th.surf, overflow:'hidden', height: H, boxShadow: shadow }}>
        {/* corner labels */}
        <div style={{ position:'absolute', top: 14, left: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ink, opacity: 0.55, fontWeight: 600 }}>SPENT SO FAR</div>
        </div>
        <div style={{ position:'absolute', top: 12, right: 14 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap: 4, fontSize: 10, color: th.water, background: th.chip, padding:'3px 8px', borderRadius: 999, fontWeight: 600, letterSpacing: 0.2 }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: th.water }} />
            ON PACE · −8.4%
          </div>
        </div>

        {/* full-bleed wave */}
        <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, top: 36 }}>
          <TideCumulativeWave data={D.daily} today={D.today} daysInMonth={D.daysInMonth} w={320} h={H - 36} fillRatio={0.78} showTodayMarker={false} />
        </div>

        {/* big number floating where the wave hits today */}
        <div style={{
          position:'absolute',
          left: `calc(${todayPct * 100}% - 0px)`,
          transform: `translateX(${todayPct > 0.7 ? '-100%' : todayPct > 0.3 ? '-50%' : '0'})`,
          bottom: 14,
          textAlign: todayPct > 0.7 ? 'right' : todayPct > 0.3 ? 'center' : 'left',
          padding:'0 16px',
          pointerEvents:'none',
        }}>
          <div style={{ fontSize: heroBig + 4, fontWeight: 500, letterSpacing: -1.6, lineHeight: 1, fontVariantNumeric:'tabular-nums', color: th.ink }}>
            {D.fmt(D.monthSpent)}
          </div>
          <div style={{ fontSize: 10, color: th.ash, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>
            {D.fmt(avgPerDay)} avg / day
          </div>
        </div>

        {/* axis */}
        <div style={{ position:'absolute', left: 0, right: 0, bottom: -2, padding:'0 14px', display:'flex', justifyContent:'space-between', fontSize: 8, color: th.ash, fontVariantNumeric:'tabular-nums', pointerEvents:'none' }}>
          <span>NOV 1</span><span>NOV 30</span>
        </div>
      </div>
    );
  }

  // ·· Variant: POOL (number sits inside the water) ·························
  if (variant === 'pool') {
    // Card with a wavy-topped pool of water filling bottom half.
    // The number is set into the water in white.
    const H = 180;
    const fillPct = D.monthSpent / D.monthBudget; // pool fills proportional to spent
    const surfaceY = H * (1 - fillPct * 0.75) - 6;
    const W = 320;
    const wavePath = (() => {
      const pts = [];
      for (let x = 0; x <= W + 8; x += 6) {
        const y = surfaceY + Math.sin((x / W) * Math.PI * 3.2) * 4 + Math.sin((x / W) * Math.PI * 5.4 + 1) * 2;
        pts.push(`${x},${y.toFixed(1)}`);
      }
      return `M 0 ${H} L 0 ${surfaceY} L ` + pts.join(' L ') + ` L ${W} ${H} Z`;
    })();
    const gradId = 'pool-grad-' + (th.water.replace('#','')).slice(0,6);
    return (
      <div style={{ position:'relative', borderRadius: 22, background: th.surf, overflow:'hidden', height: H, boxShadow: shadow }}>
        {/* meta header */}
        <div style={{ position:'absolute', top: 14, left: 18, right: 14, display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: th.ink, opacity: 0.55, fontWeight: 600 }}>SPENT SO FAR</div>
            <div style={{ fontSize: 11, color: th.ash, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>
              {D.fmt(avgPerDay)} avg / day
            </div>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap: 4, fontSize: 10, color: th.water, background: th.chip, padding:'3px 8px', borderRadius: 999, fontWeight: 600, letterSpacing: 0.2 }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: th.water }} />
            ON PACE · −8.4%
          </div>
        </div>

        {/* pool */}
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ position:'absolute', inset: 0, display:'block' }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={th.waterLite} stopOpacity="0.95" />
              <stop offset="1" stopColor={th.water} stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path d={wavePath} fill={`url(#${gradId})`} />
        </svg>

        {/* big number sits in the water */}
        <div style={{
          position:'absolute', left: 0, right: 0, bottom: 14,
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          padding:'0 18px', zIndex: 2, pointerEvents:'none',
        }}>
          <div style={{ fontSize: heroBig + 6, fontWeight: 500, letterSpacing: -1.6, lineHeight: 0.95, fontVariantNumeric:'tabular-nums', color: '#fff' }}>
            {D.fmt(D.monthSpent)}
          </div>
          <div style={{ textAlign:'right', color:'rgba(255,255,255,0.85)' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.4, fontWeight: 600 }}>OF</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{D.fmt(D.monthBudget)}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function DirectionTidePulse({ bgPreset = 'mist', accent, catTones, heroSize = 'compact', pulseStyle = 'crest', onNavigate }) {
  const D = REFLOW_DATA;
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.mist;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };
  const heroBig    = heroSize === 'regular' ? 36 : heroSize === 'tall' ? 44 : 28;
  const heroWaveH  = heroSize === 'regular' ? 120 : heroSize === 'tall' ? 140 : 88;
  const heroPad    = heroSize === 'compact' ? 16 : 20;
  const avgPerDay = D.monthSpent / (D.today + 1);
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
          <span style={{ fontSize: 10, letterSpacing: 2.2, color: th.ash, fontWeight: 600 }}>PULSE</span>
          <TideMonthNav label={D.monthLabel} />
        </div>

        {/* HERO: cumulative wave */}
        <div style={{ padding:'8px 22px 0' }}>
          <TidePulseHero variant={pulseStyle} heroBig={heroBig} heroWaveH={heroWaveH} heroPad={heroPad} bgPreset={bgPreset} isSlate={bgPreset === 'slate'} />
        </div>

        {/* STREAMS */}
        <div style={{ padding:'22px 22px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>BY STREAM</span>
            <span style={{ fontSize: 10, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{D.cats.length} categories</span>
          </div>
          <TideStreamBar cats={D.cats} total={D.monthSpent} />
        </div>

        {/* HEATMAP */}
        <div style={{ padding:'22px 22px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>DAILY PULSE</span>
            <span style={{ fontSize: 10, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{D.daysInMonth} days</span>
          </div>
          <TideHeatmap data={D.daily} today={D.today} daysInMonth={D.daysInMonth} />
        </div>

        <div style={{ flex: 1 }} />
        <TideNav active="stat" onNavigate={onNavigate} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export { DirectionTidePulse };

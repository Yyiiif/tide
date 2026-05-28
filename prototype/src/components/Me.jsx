import React from 'react';
import { REFLOW_DATA } from '../data/mockData.js';
import { TIDE_BG_PRESETS, TIDE_CAT_TONES, TideThemeCtx, useTideTheme, TideNav, TideMonthNav } from './Tide.jsx';


function TideMeCard({ children, label, count }) {
  const th = useTideTheme();
  return (
    <div style={{ padding:'0 22px 4px' }}>
      {label && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'4px 4px 8px' }}>
          <span style={{ fontSize: 10, letterSpacing: 2, color: th.ash, fontWeight: 600 }}>{label}</span>
          {count != null && <span style={{ fontSize: 10, color: th.ash, fontVariantNumeric:'tabular-nums' }}>{count}</span>}
        </div>
      )}
      <div style={{
        background: th.surf, borderRadius: 16, overflow:'hidden',
        boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.10)',
      }}>{children}</div>
    </div>
  );
}

function TideMeRow({ icon, label, value, sub, accent, chevron = true, divider = true, onClick }) {
  const th = useTideTheme();
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap: 12,
      padding:'13px 14px',
      borderBottom: divider ? `0.5px solid ${th.hair}` : 'none',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon != null && (
        <div style={{
          width: 8, height: 8, borderRadius: 4, background: accent || th.ash, flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: th.ink, fontWeight: 500, letterSpacing: -0.1 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: th.ash, marginTop: 2 }}>{sub}</div>}
      </div>
      {value != null && (
        <div style={{ fontSize: 13, color: th.ink, fontWeight: 500, fontVariantNumeric:'tabular-nums' }}>{value}</div>
      )}
      {chevron && (
        <svg width="6" height="10" viewBox="0 0 6 10" style={{ flexShrink: 0 }}>
          <path d="M1 1l4 4-4 4" stroke={th.ash} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function TideMeToggle({ on }) {
  const th = useTideTheme();
  return (
    <div style={{
      width: 36, height: 22, borderRadius: 11, position:'relative',
      background: on ? th.water : th.hair, transition:'background 0.2s ease',
    }}>
      <div style={{
        position:'absolute', top: 2, left: on ? 16 : 2,
        width: 18, height: 18, borderRadius: 9, background: '#fff',
        boxShadow:'0 1px 2px rgba(0,0,0,0.25)', transition:'left 0.2s ease',
      }} />
    </div>
  );
}

function DirectionTideMe({ bgPreset = 'snow', accent, catTones, onNavigate }) {
  const D = REFLOW_DATA;
  const base = TIDE_BG_PRESETS[bgPreset] || TIDE_BG_PRESETS.snow;
  const th = {
    ...base,
    ...(accent ? { water: accent[0], waterLite: accent[1] } : {}),
    catTones: catTones || TIDE_CAT_TONES,
  };
  const tones = th.catTones;

  return (
    <TideThemeCtx.Provider value={th}>
      <div style={{
        width:'100%', height:'100%',
        background: th.background,
        color: th.ink,
        fontFamily:'"Inter", -apple-system, system-ui, sans-serif',
        display:'flex', flexDirection:'column',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        overflow:'auto',
        position:'relative',
      }}>
        {/* Eyebrow */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 18px 4px' }}>
          <span style={{ fontSize: 10, letterSpacing: 2.2, color: th.ash, fontWeight: 600 }}>ME</span>
          <TideMonthNav label={D.monthLabel} />
        </div>

        {/* Profile */}
        <div style={{ padding:'8px 22px 4px' }}>
          <div style={{
            background: th.surf, borderRadius: 16, padding:'14px 16px',
            display:'flex', alignItems:'center', gap: 12,
            boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.10)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20,
              background: `linear-gradient(135deg, ${th.waterLite}, ${th.water})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight: 600, fontSize: 15, letterSpacing: -0.2,
            }}>YL</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: th.ink, fontWeight: 600, letterSpacing: -0.1 }}>Reflow user</div>
              <div style={{ fontSize: 11, color: th.ash, marginTop: 2 }}>54 drops tracked this month</div>
            </div>
            <svg width="6" height="10" viewBox="0 0 6 10">
              <path d="M1 1l4 4-4 4" stroke={th.ash} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* BUDGET */}
        <div style={{ marginTop: 14 }}>
          <TideMeCard label="BUDGET">
            <TideMeRow label="Monthly cap" value={D.fmt(D.monthBudget)} />
            <TideMeRow label="Daily pace" sub="Remaining ÷ days left" value={D.fmt(D.dailyAllow) + ' / day'} divider={false} />
          </TideMeCard>
        </div>

        {/* STREAMS */}
        <div style={{ marginTop: 14 }}>
          <TideMeCard label="STREAMS" count={D.cats.length}>
            {D.cats.map((c, i) => (
              <TideMeRow
                key={c.id}
                icon
                accent={tones[i % tones.length]}
                label={c.name}
                sub={`${Math.round((c.spent / c.budget) * 100)}% used · ${D.fmt(c.spent)} of ${D.fmt(c.budget)}`}
                value={D.fmt(c.budget)}
                divider={i < D.cats.length - 1}
              />
            ))}
          </TideMeCard>
        </div>

        {/* EVENTS */}
        <div style={{ marginTop: 14 }}>
          <TideMeCard label="EVENTS">
            <div style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderBottom: `0.5px solid ${th.hair}` }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#8E6BC0', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: th.ink, fontWeight: 500 }}>Event buffer</div>
                <div style={{ fontSize: 11, color: th.ash, marginTop: 2 }}>Auto-buffer trips & one-offs</div>
              </div>
              <TideMeToggle on={true} />
            </div>
            <TideMeRow label="Active events" value="2" sub="Japan trip · Apartment move" divider={false} />
          </TideMeCard>
        </div>

        {/* BALANCE */}
        <div style={{ marginTop: 14 }}>
          <TideMeCard label="BALANCE">
            <TideMeRow
              icon accent={th.water}
              label="Latest snapshot"
              sub="Recorded Nov 14"
              value={D.fmt(42180)}
              divider={false}
            />
          </TideMeCard>
        </div>

        {/* DATA */}
        <div style={{ marginTop: 14, padding:'0 22px 4px' }}>
          <div style={{ display:'flex', gap: 8 }}>
            <button style={{
              flex: 1, padding:'13px 14px', borderRadius: 12,
              background: th.surf, color: th.ink, border:'none',
              fontFamily:'inherit', fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
              boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.10)',
              cursor:'pointer',
            }}>Export CSV</button>
            <button style={{
              flex: 1, padding:'13px 14px', borderRadius: 12,
              background: th.surf, color: th.ink, border:'none',
              fontFamily:'inherit', fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
              boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 6px 18px -12px rgba(14,15,18,0.10)',
              cursor:'pointer',
            }}>Import CSV</button>
          </div>
        </div>

        <div style={{ height: 24, flexShrink: 0 }} />
        <TideNav active="me" onNavigate={onNavigate} />
      </div>
    </TideThemeCtx.Provider>
  );
}


export { DirectionTideMe };

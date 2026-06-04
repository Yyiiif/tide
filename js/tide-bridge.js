/**
 * TIDE visual bridge — all screens + overlays, English labels (Tide / Pulse / Drops / Me).
 */
(function () {
  const NAV_LABELS = { home: 'Tide', stat: 'Flow', rec: 'Drops', set: 'Base' };

  const MIST_COLORS = {
    'Food': '#C4A09A',
    'Shopping': '#8AAF9C',
    'Transit': '#8AAABF',
    'Entertain': '#A898C4',
    'Health': '#C49AB0',
    'Other': '#A4A8A8',
    'Spare1': '#B4A898',
    'Spare2': '#BF8C6E',
    'Spare3': '#D4C47A'
  };

  const MIST_FALLBACK = ['#B4A898','#BF8C6E','#D4C47A'];

  const MIST_PALETTE = [
    MIST_COLORS['Food'],
    MIST_COLORS['Shopping'],
    MIST_COLORS['Transit'],
    MIST_COLORS['Entertain'],
    MIST_COLORS['Health'],
    MIST_COLORS['Other'],
    MIST_COLORS['Spare1'],
    MIST_COLORS['Spare2'],
    MIST_COLORS['Spare3'],
  ];

  const TIDE_CAT_MAP = Object.assign({}, MIST_COLORS, { Home: MIST_COLORS['Health'] });

  function rebuildTideCatMap() {
    if (typeof cats === 'undefined' || !Array.isArray(cats)) return;
    Object.keys(TIDE_CAT_MAP).forEach(function (k) {
      delete TIDE_CAT_MAP[k];
    });
    cats.forEach(function (c) {
      if (!c || !c.name) return;
      const n = normalizeCatKey(c.name);
      let mid;
      if (typeof getCatMistIdx === 'function') {
        const idx = getCatMistIdx(c);
        mid = MIST_PALETTE[idx] || MIST_FALLBACK[idx % MIST_FALLBACK.length] || MIST_PALETTE[MIST_PALETTE.length - 1];
      } else {
        mid = MIST_COLORS[n] || MIST_COLORS['Other'];
      }
      TIDE_CAT_MAP[n] = mid;
    });
    TIDE_CAT_MAP['Home'] = TIDE_CAT_MAP['Health'] || MIST_COLORS['Health'];
  }

  const STREAM_SVG_H = 110;
  const STREAM_SVG_W = 320;
  const STREAM_WAVE_PAD_TOP = 18;
  const STREAM_MIN_BAND = 6;
  const STREAM_BAND_SCALE = 0.9;
  const STREAM_BAND_GAP = 4;

  function flowMotionDurationMs() {
    try {
      var el = document.getElementById('s-stat') || document.documentElement;
      var v = getComputedStyle(el).getPropertyValue('--flow-motion-duration').trim();
      if (!v) v = getComputedStyle(el).getPropertyValue('--reflow-duration').trim();
      if (v.indexOf('ms') >= 0) return parseFloat(v) || 900;
      if (v.indexOf('s') >= 0) return (parseFloat(v) || 0.9) * 1000;
    } catch (_) {}
    return 900;
  }

  function reflowDurationMs() {
    return flowMotionDurationMs();
  }

  function fadeOutByStreamChart(barEl, legEl, done) {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !barEl.querySelector('svg')) {
      done();
      return;
    }
    barEl.classList.remove('tide-stream-chart--enter', 'tide-stream-chart--ready');
    barEl.classList.add('tide-stream-chart--exit');
    legEl.classList.remove('tide-stream-legend--enter', 'tide-stream-legend--ready');
    legEl.classList.add('tide-stream-legend--exit');
    setTimeout(done, Math.round(flowMotionDurationMs() * 0.5));
  }

  function fadeInByStreamChart(barEl, legEl) {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    barEl.classList.remove('tide-stream-chart--ready');
    barEl.classList.add('tide-stream-chart--enter');
    legEl.classList.remove('tide-stream-legend--ready');
    legEl.classList.add('tide-stream-legend--enter');

    if (reduced) {
      barEl.classList.remove('tide-stream-chart--enter');
      barEl.classList.add('tide-stream-chart--ready');
      legEl.classList.remove('tide-stream-legend--enter');
      legEl.classList.add('tide-stream-legend--ready');
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        barEl.classList.remove('tide-stream-chart--enter');
        barEl.classList.add('tide-stream-chart--ready');
        legEl.classList.remove('tide-stream-legend--enter');
        legEl.classList.add('tide-stream-legend--ready');
      });
    });
  }

  function normalizeCatKey(name) {
    if (window.ReflowCalc && typeof ReflowCalc.normalizeCat === 'function') {
      return ReflowCalc.normalizeCat(name);
    }
    const n = name == null || name === '' ? 'Other' : String(name).trim();
    if (n === 'Home') return 'Health';
    return n;
  }

  function payDisplay(name) {
    const n = String(name || '').trim();
    if (window.TideI18n && TideI18n.getLocale() === 'en') {
      const payMap = { 手動輸入: 'Manual', 每月帳單: 'Monthly bill', 'App截圖': 'App screenshot' };
      return payMap[n] || n;
    }
    return n;
  }

  function translateString(s) {
    return window.TideI18n ? TideI18n.translate(s) : s;
  }

  function applyEnglishIn(root) {
    if (window.TideI18n) TideI18n.applyIn(root);
  }

  function applyEnglishGlobally() {
    if (window.TideI18n) TideI18n.applyGlobally();
  }

  function scheduleEnglishPass() {
    if (window.TideI18n) TideI18n.scheduleApply();
  }

  function fmt(n) {
    if (typeof window.fmt === 'function') return window.fmt(n);
    return '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
  }

  function wavePaths(w, h, level) {
    const surfaceY = h - h * level;
    const wavePath = (amp, freq, phase) => {
      const tileW = w;
      const endX = tileW * 2;
      const pts = [];
      for (let x = 0; x <= endX; x += 4) {
        const y = surfaceY + Math.sin((x / tileW) * freq * Math.PI * 2 + phase) * amp;
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      return 'M 0 ' + (h + 8) + ' L 0 ' + surfaceY + ' L ' + pts.join(' L ') + ' L ' + endX + ' ' + (h + 8) + ' Z';
    };
    const loopW = w * 2;
    const loopSizer =
      '<rect class="tide-hero-wave-loop" x="0" y="0" width="' +
      loopW +
      '" height="1" fill="none" aria-hidden="true"/>';
    return {
      back: wavePath(14, 2, 0),
      front: wavePath(10, 3, Math.PI / 2),
      loopSizer: loopSizer,
    };
  }

  function heroSvg(level, gradId) {
    const w = 300;
    const h = 200;
    const raw = Math.max(0, Math.min(1, Number(level) || 0));
    const lv =
      window.ReflowCalc && typeof ReflowCalc.clampHeroWaterLevelForMode === 'function'
        ? ReflowCalc.clampHeroWaterLevelForMode(raw, 'remaining')
        : raw > 0
          ? Math.max(0.03, Math.min(0.4, raw))
          : 0;
    const showWaves = lv > 0;
    const gid = gradId || 'tideHeroGrad';
    const HERO_WAVE_TILES = 8;
    const surfaceY = h - h * lv;
    function waveDriftAnimate(shift, dur, reverse) {
      if (reverse) {
        return (
          '<animateTransform attributeName="transform" type="translate" dur="' +
          dur +
          's" repeatCount="indefinite" calcMode="linear" from="' +
          shift +
          ' 0" to="0 0"/>'
        );
      }
      return (
        '<animateTransform attributeName="transform" type="translate" dur="' +
        dur +
        's" repeatCount="indefinite" calcMode="linear" from="0 0" to="' +
        shift +
        ' 0"/>'
      );
    }
    const loop =
      '<rect class="tide-hero-wave-loop" x="0" y="0" width="' +
      w * 2 +
      '" height="1" fill="none" aria-hidden="true"/>';
    function wavePath(surface, amp, freq, phase) {
      const tileW = w;
      const endX = tileW * HERO_WAVE_TILES;
      const pts = [];
      for (let x = 0; x <= endX; x += 4) {
        const y = surface + Math.sin((x / tileW) * freq * Math.PI * 2 + phase) * amp;
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      return (
        'M 0 ' +
        (h + 8) +
        ' L 0 ' +
        surface +
        ' L ' +
        pts.join(' L ') +
        ' L ' +
        endX +
        ' ' +
        (h + 8) +
        ' Z'
      );
    }
    function waveLayer(className, surface, amp, freq, phase, fill, dur, reverse) {
      const shift = -(w / freq);
      return (
        '<g class="' +
        className +
        '">' +
        waveDriftAnimate(shift, dur, reverse) +
        loop +
        '<path d="' +
        wavePath(surface, amp, freq, phase) +
        '" fill="' +
        fill +
        '"/></g>'
      );
    }
    const waveGradDefs = showWaves
      ? '<linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#6E8CA4" stop-opacity="0.5"/>' +
        '<stop offset="100%" stop-color="#6E8CA4" stop-opacity="0.12"/>' +
        '</linearGradient>' +
        '<linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#485E74" stop-opacity="0.45"/>' +
        '<stop offset="100%" stop-color="#485E74" stop-opacity="0.1"/>' +
        '</linearGradient>' +
        '<linearGradient id="wg3" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#2C404E" stop-opacity="0.4"/>' +
        '<stop offset="100%" stop-color="#2C404E" stop-opacity="0.08"/>' +
        '</linearGradient>'
      : '';
    const wavePaths = showWaves
      ? waveLayer('tide-hero-wave-a', surfaceY, 14, 2, 0, 'url(#wg1)', 7, false) +
        waveLayer('tide-hero-wave-b', surfaceY + 8, 10, 3, Math.PI / 2, 'url(#wg2)', 5.2, true) +
        waveLayer('tide-hero-wave-c', surfaceY + 14, 8, 2, Math.PI, 'url(#wg3)', 8.5, false)
      : '';
    return (
      '<svg class="tide-hero-tank-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs>' +
      waveGradDefs +
      '<clipPath id="' + gid + 'Clip"><rect width="' + w + '" height="' + h + '" rx="22"/></clipPath></defs>' +
      '<g clip-path="url(#' + gid + 'Clip)">' +
      wavePaths +
      '</g></svg>'
    );
  }

  function heroMetrics() {
    if (window.ReflowCalc && typeof ReflowCalc.homeHeroMetrics === 'function') {
      return ReflowCalc.homeHeroMetrics(curMonth);
    }
    return {
      remaining: 0,
      budgetTotal: 0,
      level: 0,
      days: 0,
      spent: 0,
      emptyMonth: true,
      heroMode: 'remaining',
      heroAmount: 0,
      phase: 'current',
    };
  }

  function dropsTotals() {
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    let todayTotal = 0;
    let weekTotal = 0;
    if (typeof getWeekBounds === 'function') {
      const { mon, sun } = getWeekBounds(td);
      const vE = (expenses || []).filter((e) => e.date === td);
      const wE = (expenses || []).filter((e) => e.date && e.date >= mon && e.date <= sun);
      todayTotal = vE.reduce((s, e) => s + (Number(e.amt) || 0), 0);
      weekTotal = wE.reduce((s, e) => s + (Number(e.amt) || 0), 0);
    }
    const monthTotal =
      window.ReflowCalc && typeof ReflowCalc.monthSpentTotal === 'function'
        ? ReflowCalc.monthSpentTotal(curMonth)
        : 0;
    const budgetTotal =
      window.ReflowCalc && typeof ReflowCalc.monthBudgetTotal === 'function'
        ? ReflowCalc.monthBudgetTotal(curMonth)
        : typeof getTargetBudget === 'function'
          ? getTargetBudget(curMonth)
          : Number(budget) || 0;
    return { todayTotal, weekTotal, monthTotal, budgetTotal };
  }

  const ACTION_BUTTON_RESTORE = {
    'stat-cal-open':
      '<button type="button" class="mn-btn" id="stat-cal-open" onclick="openLongTermTrend()" aria-label="Trend">' +
      '<i class="ti ti-chart-line"></i></button>',
    'rec-input-hub-open':
      '<button type="button" class="mn-btn" id="rec-input-hub-open" onclick="openInputHub()" aria-label="Input hub">' +
      '<i class="ti ti-archive"></i></button>',
  };

  function restoreActionButton(id) {
    if (document.getElementById(id)) return document.getElementById(id);
    const html = ACTION_BUTTON_RESTORE[id];
    if (!html) return null;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.firstElementChild;
  }

  function ensureEyebrow(screen, label, actionId) {
    if (!screen) return;
    const nav = screen.querySelector('.page-month-nav');
    if (!nav) return;
    let row = screen.querySelector('.tide-screen-eyebrow');
    if (!row) {
      row = document.createElement('div');
      row.className = 'tide-screen-eyebrow';
      nav.parentNode.insertBefore(row, nav);
    }
    let tag = row.querySelector('.tide-eyebrow-tag');
    if (!tag) {
      tag = document.createElement('span');
      tag.className = 'tide-eyebrow-tag';
      row.insertBefore(tag, row.firstChild);
    }
    tag.textContent = label;
    if (nav) nav.classList.add('tide-month-nav');
    if (!actionId) {
      Array.from(row.children).forEach(function (el) {
        if (!el.classList.contains('tide-eyebrow-tag')) el.remove();
      });
      return;
    }
    let btn = document.getElementById(actionId);
    if (!btn) {
      btn = restoreActionButton(actionId);
      if (btn) row.appendChild(btn);
    }
    if (btn && btn.parentNode !== row) {
      btn.classList.add('tide-eyebrow-action');
      row.appendChild(btn);
    }
  }

  const NAV_ARIA = { home: 'Tide', stat: 'Flow', rec: 'Drops', set: 'Base' };

  /** Keep original SVG tab icons (homeIcons / navIcons); only sync active state. */
  function renderTideNav(activeKey) {
    Object.keys(NAV_LABELS).forEach(function (k) {
      const btn = document.getElementById('n-' + k);
      if (!btn) return;
      const on = activeKey ? k === activeKey : btn.classList.contains('on');
      btn.classList.toggle('on', on);
      if (NAV_ARIA[k]) btn.setAttribute('aria-label', NAV_ARIA[k]);
    });
    const iconTab = activeKey === 'home' ? '' : activeKey;
    if (typeof window.__reflowSyncNavIcons === 'function') {
      window.__reflowSyncNavIcons(iconTab);
    }
  }

  function activeNavKey() {
    if (typeof activePage !== 'undefined') {
      return { home: 'home', analysis: 'stat', detail: 'rec', personal: 'set' }[activePage] || 'home';
    }
    return ['home', 'stat', 'rec', 'set'].find(function (k) {
      const b = document.getElementById('n-' + k);
      return b && b.classList.contains('on');
    }) || 'home';
  }

  function renderTideHome() {
    const home = document.getElementById('s-home');
    if (!home) return;
    if (window.TideUI && window.TideUI.layoutHomeHeader) window.TideUI.layoutHomeHeader();
    applyEnglishIn(home);

    const m = heroMetrics();
    const mask = typeof isAmtHidden !== 'undefined' && isAmtHidden;
    const zeroTxt = typeof fmt === 'function' ? fmt(0) : '$0';
    const heroAmt = m.spent || 0;
    const remTxt = mask ? '$＊＊＊' : m.emptyMonth ? zeroTxt : fmt(heroAmt);
    const budgetTxt = mask ? '—' : fmt(m.budgetTotal);
    const pct =
      m.emptyMonth || !(m.budgetTotal > 0)
        ? 0
        : Math.round(Math.max(0, Math.min(100, (m.spent / m.budgetTotal) * 100)));
    const eyebrow = 'SPENT';
    const heroSubBudgetText = budgetTxt;
    const remainingAmt = Number.isFinite(Number(m.remaining))
      ? Math.max(0, Number(m.remaining))
      : Math.max(0, (Number(m.budgetTotal) || 0) - (Number(m.spent) || 0));
    const leftFootValue = mask ? '$＊＊＊' : fmt(remainingAmt);
    const heroLevel = m.emptyMonth ? 0 : Number(m.spent) || 0;

    const summary = home.querySelector('.home-summary');
    if (summary) summary.classList.toggle('tide-home--empty-month', !!m.emptyMonth);

    let wrap = document.getElementById('tide-hero-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'tide-hero-wrap';
      wrap.className = 'tide-hero-wrap';
      const summary = home.querySelector('.home-summary');
      const header = home.querySelector('.tide-screen-header');
      const anchor =
        header || (summary && summary.querySelector('.tide-screen-header-month .page-month-nav'));
      if (anchor) anchor.insertAdjacentElement('afterend', wrap);
      else if (summary) summary.appendChild(wrap);
    }

    if (window.TideUI && window.TideUI.homeHeroMarkup) {
      wrap.innerHTML = window.TideUI.homeHeroMarkup({
        remainingText: remTxt,
        budgetText: heroSubBudgetText,
        pct: pct,
        days: m.days,
        level: heroLevel,
        heroMode: 'spent',
        eyebrow: eyebrow,
        hideSubLine: true,
        leftFootLabel: 'REMAINING',
        leftFootValue: leftFootValue,
      });
    } else {
      wrap.innerHTML =
        '<div class="tide-hero-card' +
        (heroLevel <= 0 ? ' tide-hero-card--dry' : '') +
        '">' +
        heroSvg(heroLevel, 'tideHeroGrad') +
        '<div class="tide-hero-overlay">' +
        '<div><div class="tide-hero-eyebrow">' +
        eyebrow +
        '</div>' +
        '<div class="tide-hero-amt">' +
        remTxt +
        '</div>' +
        '</div>' +
        '<div class="tide-hero-foot"><div class="tide-hero-foot-left"><div class="tide-hero-foot-lbl">REMAINING</div><div class="tide-hero-foot-val">' +
        leftFootValue +
        '</div></div><div class="tide-hero-foot-right"><div class="tide-hero-foot-lbl">DAYS LEFT</div>' +
        '<div class="tide-hero-foot-val" title="Days left in this month">' +
        m.days +
        '</div></div></div></div></div>';
    }

    const snapWrap = document.getElementById('home-balance-snapshot-wrap');
    if (snapWrap) {
      snapWrap.style.display = 'none';
    }

    if (window.TideUI && window.TideUI.styleHomeStreams) {
      window.TideUI.styleHomeStreams({ emptyMonth: !!m.emptyMonth });
    }
    scheduleEnglishPass();
  }

  function getStreamCategoryRows() {
    const month =
      typeof curMonth !== 'undefined' && curMonth ? curMonth : '';
    const rows =
      window.ReflowCalc && typeof ReflowCalc.monthRows === 'function'
        ? ReflowCalc.monthRows(month)
        : typeof expenses !== 'undefined'
          ? expenses.filter(function (e) {
              return e.date && e.date.startsWith(month);
            })
          : [];
    const cm =
      window.ReflowCalc && typeof ReflowCalc.categorySpendMap === 'function'
        ? ReflowCalc.categorySpendMap(rows)
        : (function () {
            const m = {};
            rows.forEach(function (e) {
              const c =
                typeof normalizeCoreCatName === 'function'
                  ? normalizeCoreCatName(e.cat || 'Other')
                  : normalizeCatKey(e.cat || 'Other');
              m[c] = (m[c] || 0) + (Number(e.amt) || 0);
            });
            return m;
          })();
    const active = Object.entries(cm)
      .filter(function (entry) {
        return (entry[1] || 0) > 0;
      })
      .sort(function (a, b) {
        return b[1] - a[1];
      })
      .map(function (entry) {
        const cat = entry[0];
        return {
          cat: cat,
          amt: entry[1],
          color:
            typeof catColors === 'function'
              ? catColors(cat).mid
              : MIST_COLORS[cat] || MIST_COLORS['Other'],
        };
      });
    const monthTotal = active.reduce(function (s, r) {
      return s + r.amt;
    }, 0);
    return { active: active, monthTotal: monthTotal };
  }

  function streamBandHeights(active, monthTotal) {
    const gapTotal = Math.max(0, active.length - 1) * STREAM_BAND_GAP;
    let heights = active.map(function (row) {
      const pctFrac = row.amt / monthTotal;
      return Math.max(STREAM_MIN_BAND, pctFrac * STREAM_BAND_SCALE * STREAM_SVG_H);
    });
    let bandTotal = heights.reduce(function (s, h) {
      return s + h;
    }, 0);
    if (bandTotal + gapTotal > STREAM_SVG_H) {
      const avail = STREAM_SVG_H - gapTotal;
      const scale = avail / bandTotal;
      heights = heights.map(function (h) {
        return Math.max(STREAM_MIN_BAND, h * scale);
      });
    }
    return heights;
  }

  function streamBandWavePath(topY, bottomY, amp, seed) {
    const w = STREAM_SVG_W;
    const cycles = 1.28 + 0.1 * Math.sin(seed * 0.75);
    const phase = seed * 0.95;
    const k = (cycles * Math.PI * 2) / w;

    function yAt(x) {
      return topY + amp * Math.sin(k * x + phase);
    }
    function dyAt(x) {
      return amp * k * Math.cos(k * x + phase);
    }

    const segs = Math.max(8, Math.round(cycles * 4));
    const segW = w / segs;
    const cp = segW / 3;
    let d = 'M0,' + yAt(0).toFixed(2);
    for (let i = 0; i < segs; i++) {
      const x0 = i * segW;
      const x1 = i === segs - 1 ? w : (i + 1) * segW;
      const y0 = yAt(x0);
      const y1 = yAt(x1);
      d +=
        ' C' +
        (x0 + cp).toFixed(2) +
        ',' +
        (y0 + dyAt(x0) * cp).toFixed(2) +
        ' ' +
        (x1 - cp).toFixed(2) +
        ',' +
        (y1 - dyAt(x1) * cp).toFixed(2) +
        ' ' +
        x1.toFixed(2) +
        ',' +
        y1.toFixed(2);
    }
    return d + ' L' + w + ',' + bottomY.toFixed(2) + ' L0,' + bottomY.toFixed(2) + ' Z';
  }

  function paintByStreamWaveChart(barEl, legEl, active, monthTotal) {
    const heights = streamBandHeights(active, monthTotal);
    let defs = '';
    let paths = '';
    let cursorY = 0;

    active.forEach(function (row, i) {
      const pctFrac = row.amt / monthTotal;
      const pctDisplay = Math.round(pctFrac * 100);
      const bandH = heights[i];
      const topY = cursorY;
      const bottomY = cursorY + bandH;
      const amp = Math.max(2.5, Math.min(7, bandH * 0.24));
      const seed = i * 1.37 + pctFrac * 4.2;
      const color = row.color;
      const gradKey = String(normalizeCatKey(row.cat)).replace(/[^a-zA-Z0-9]/g, '_');
      const gradA = 'grad_' + gradKey + '_a';
      const gradB = 'grad_' + gradKey + '_b';
      const safe = String(row.cat).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

      defs +=
        '<linearGradient id="' +
        gradA +
        '" gradientUnits="userSpaceOnUse" x1="0" y1="' +
        topY.toFixed(2) +
        '" x2="0" y2="' +
        bottomY.toFixed(2) +
        '">' +
        '<stop offset="0%" stop-color="' +
        color +
        '" stop-opacity="0.65"/>' +
        '<stop offset="100%" stop-color="' +
        color +
        '" stop-opacity="0"/></linearGradient>';
      defs +=
        '<linearGradient id="' +
        gradB +
        '" gradientUnits="userSpaceOnUse" x1="0" y1="' +
        (topY + 4).toFixed(2) +
        '" x2="0" y2="' +
        bottomY.toFixed(2) +
        '">' +
        '<stop offset="0%" stop-color="' +
        color +
        '" stop-opacity="0.28"/>' +
        '<stop offset="100%" stop-color="' +
        color +
        '" stop-opacity="0"/></linearGradient>';

      let bandPaths =
        '<path fill="url(#' +
        gradA +
        ')" d="' +
        streamBandWavePath(topY, bottomY, amp, seed) +
        '"/>';

      if (pctFrac * 100 > 20) {
        bandPaths +=
          '<path fill="url(#' +
          gradB +
          ')" d="' +
          streamBandWavePath(topY + 4, bottomY, amp * 0.72, seed + 0.4) +
          '"/>';
      }

      paths +=
        '<g class="tide-stream-band-hit" style="cursor:pointer" onclick="openCatOv(\'' +
        safe +
        '\')">' +
        bandPaths +
        '<rect x="0" y="' +
        (topY - amp * 1.3).toFixed(2) +
        '" width="' +
        STREAM_SVG_W +
        '" height="' +
        (bandH + amp * 1.3).toFixed(2) +
        '" fill="transparent" pointer-events="all"/>' +
        '</g>';

      cursorY = bottomY + (i < active.length - 1 ? STREAM_BAND_GAP : 0);
      row.pctDisplay = pctDisplay;
    });

    barEl.style.height = 'auto';
    barEl.style.borderRadius = '0';
    barEl.style.overflow = 'visible';
    barEl.style.margin = '8px 0 8px';
    barEl.style.paddingTop = '0';
    barEl.style.display = 'block';
    barEl.innerHTML =
      '<svg viewBox="0 -' +
      STREAM_WAVE_PAD_TOP +
      ' ' +
      STREAM_SVG_W +
      ' ' +
      (STREAM_SVG_H + STREAM_WAVE_PAD_TOP) +
      '" width="100%" aria-hidden="true" style="display:block;overflow:visible">' +
      '<defs>' +
      defs +
      '</defs>' +
      paths +
      '</svg>';

    legEl.innerHTML = active
      .map(function (row) {
        const safe = String(row.cat).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const label =
          typeof catLabel === 'function' ? catLabel(row.cat) : row.cat;
        const name =
          typeof escapePhText === 'function' ? escapePhText(label) : label;
        return (
          '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#787774;white-space:nowrap;flex-shrink:0;cursor:pointer" onclick="openCatOv(\'' +
          safe +
          '\')">' +
          '<span style="width:8px;height:8px;border-radius:50%;background:' +
          row.color +
          ';flex-shrink:0"></span>' +
          '<span>' +
          name +
          '</span>' +
          '<span style="color:#9CA0A8;font-variant-numeric:tabular-nums">' +
          row.pctDisplay +
          '%</span></span>'
        );
      })
      .join('');

    fadeInByStreamChart(barEl, legEl);
  }

  function renderByStreamWaveChart() {
    const barEl = document.getElementById('analysis-cat-bar');
    const legEl = document.getElementById('analysis-cat-legend');
    if (!barEl || !legEl) return;

    const built = getStreamCategoryRows();
    const active = built.active;
    const monthTotal = built.monthTotal;

    if (!(monthTotal > 0) || !active.length) {
      barEl.innerHTML = '';
      barEl.style.height = '';
      barEl.style.borderRadius = '';
      barEl.style.overflow = '';
      barEl.style.margin = '';
      barEl.style.paddingTop = '';
      barEl.style.display = '';
      legEl.innerHTML = '';
      legEl.classList.remove('tide-stream-legend--enter', 'tide-stream-legend--ready', 'tide-stream-legend--exit');
      barEl.classList.remove('tide-stream-chart--enter', 'tide-stream-chart--ready', 'tide-stream-chart--exit');
      return;
    }

    function paint() {
      paintByStreamWaveChart(barEl, legEl, active, monthTotal);
    }

    if (barEl.classList.contains('tide-stream-chart--ready') && barEl.querySelector('svg')) {
      fadeOutByStreamChart(barEl, legEl, function () {
        barEl.classList.remove('tide-stream-chart--exit');
        legEl.classList.remove('tide-stream-legend--exit');
        paint();
      });
      return;
    }

    paint();
  }

  function flowSurgeMonthMeta() {
    const parts = String(typeof curMonth !== 'undefined' ? curMonth : '').split('-').map(Number);
    if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
      return { y: 2026, mo: 11, lastDay: 30 };
    }
    const y = parts[0];
    const mo = parts[1];
    return { y: y, mo: mo, lastDay: new Date(y, mo, 0).getDate() };
  }

  function flowSurgeDailySeries(meta) {
    const byDay = {};
    const rows =
      window.ReflowCalc && typeof ReflowCalc.monthRows === 'function'
        ? ReflowCalc.monthRows(curMonth)
        : typeof expenses !== 'undefined'
          ? expenses.filter(function (e) {
              return e.date && e.date.startsWith(curMonth);
            })
          : [];
    rows.forEach(function (e) {
      const d = parseInt(String(e.date).slice(8, 10), 10);
      if (!Number.isFinite(d) || d < 1 || d > meta.lastDay) return;
      byDay[d] = (byDay[d] || 0) + (Number(e.amt) || 0);
    });
    const daily = [];
    for (let d = 1; d <= meta.lastDay; d++) daily.push(byDay[d] || 0);
    return daily;
  }

  function detectFlowSurges(daily, lastDay) {
    const total = daily.reduce(function (s, v) {
      return s + v;
    }, 0);
    const dailyAvg = lastDay > 0 ? total / lastDay : 0;
    if (dailyAvg <= 0) return { periods: [], dailyAvg: 0 };

    const surgeIdx = [];
    for (let i = 0; i < lastDay; i++) {
      if (daily[i] > dailyAvg * 1.5) surgeIdx.push(i);
    }

    const periods = [];
    let i = 0;
    while (i < surgeIdx.length) {
      let start = surgeIdx[i];
      let end = start;
      while (i + 1 < surgeIdx.length && surgeIdx[i + 1] === end + 1) {
        i++;
        end = surgeIdx[i];
      }
      const numDays = end - start + 1;
      let surgeTotal = 0;
      for (let d = start; d <= end; d++) surgeTotal += daily[d];
      const normalAvg = Math.round(dailyAvg * numDays);
      const multiplier = normalAvg > 0 ? Math.round((surgeTotal / normalAvg) * 10) / 10 : 0;
      periods.push({
        startDay: start + 1,
        endDay: end + 1,
        surgeTotal: surgeTotal,
        normalAvg: normalAvg,
        multiplier: multiplier,
        numDays: numDays,
      });
      i++;
    }

    periods.sort(function (a, b) {
      return b.multiplier - a.multiplier;
    });
    return { periods: periods, dailyAvg: dailyAvg };
  }

  function flowSurgeDateRangeLabel(meta, startDay, endDay) {
    const months =
      typeof shortMonths !== 'undefined'
        ? shortMonths
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[meta.mo - 1] || '';
    if (startDay === endDay) return month + ' ' + startDay;
    return month + ' ' + startDay + ' – ' + endDay;
  }

  function flowSurgeCardMarkup(period, meta) {
    const dateRange = flowSurgeDateRangeLabel(meta, period.startDay, period.endDay);
    const dayLbl = period.numDays === 1 ? 'day' : 'days';
    return (
      '<div class="tide-flow-surge-card" role="button" tabindex="0" onclick="openFlowSurgeOv(' +
      period.startDay +
      ',' +
      period.endDay +
      ')">' +
      '<div class="tide-flow-surge-card-bar"></div>' +
      '<div class="tide-flow-surge-card-main">' +
      '<div class="tide-flow-surge-card-date">' +
      dateRange +
      '</div>' +
      '<div class="tide-flow-surge-card-detail">Surge ' +
      fmt(period.surgeTotal) +
      ' · usual ' +
      fmt(period.normalAvg) +
      '</div>' +
      '</div>' +
      '<div class="tide-flow-surge-card-stat">' +
      '<div class="tide-flow-surge-card-amt">' +
      fmt(period.surgeTotal) +
      '</div>' +
      '<div class="tide-flow-surge-card-days">' +
      period.numDays +
      ' ' +
      dayLbl +
      '</div>' +
      '</div></div>'
    );
  }

  function renderFlowSurgeSection(stat) {
    const pad = stat.querySelector('.scr-pad');
    if (!pad) return;
    const strip = document.getElementById('analysis-heatmap-strip');
    const heatCard = strip && strip.closest('.donut-card');
    if (!heatCard) return;

    let section = document.getElementById('tide-flow-surge-section');
    if (!section) {
      section = document.createElement('div');
      section.id = 'tide-flow-surge-section';
      section.className = 'donut-card tide-pulse-section tide-flow-surge-section';
      heatCard.insertAdjacentElement('afterend', section);
    } else if (section.previousElementSibling !== heatCard) {
      heatCard.insertAdjacentElement('afterend', section);
    }
    section.className = 'donut-card tide-pulse-section tide-flow-surge-section';

    const meta = flowSurgeMonthMeta();
    const daily = flowSurgeDailySeries(meta);
    const result = detectFlowSurges(daily, meta.lastDay);
    const periods = result.periods;
    const n = periods.length;

    let cardsHtml = '';
    if (!n) {
      cardsHtml = '<div class="tide-flow-surge-empty">No surges this month</div>';
    } else {
      cardsHtml = periods
        .map(function (p) {
          return flowSurgeCardMarkup(p, meta);
        })
        .join('');
    }

    section.innerHTML =
      '<div class="donut-title">' +
      '<span class="tide-pulse-sec-lbl">FLOW SURGE</span>' +
      '<span class="tide-pulse-sec-meta">' +
      n +
      ' detected</span>' +
      '</div>' +
      '<div class="tide-flow-surge-cards">' +
      cardsHtml +
      '</div>';
  }

  function renderTidePulse() {
    const stat = document.getElementById('s-stat');
    if (!stat) return;
    ensureEyebrow(stat, 'FLOW');
    if (window.TideUI && window.TideUI.layoutScreenHeader) window.TideUI.layoutScreenHeader(stat);
    if (window.TideUI && window.TideUI.applyPulseDropsMonthNav) window.TideUI.applyPulseDropsMonthNav(stat);
    if (window.TideUI && window.TideUI.syncViewSegFloat) window.TideUI.syncViewSegFloat(stat);
    applyEnglishIn(stat);
    if (window.TideUI && window.TideUI.stylePulsePage) {
      window.TideUI.stylePulsePage();
    }
    renderFlowSurgeSection(stat);
    scheduleEnglishPass();
  }

  function renderTideDropsRange() {
    const monthly = document.getElementById('rec-monthly');
    if (!monthly) return;

    const row = document.getElementById('tide-drops-range');
    if (row) row.remove();

    monthly.querySelectorAll('.tide-drops-entries-meta').forEach(function (el) {
      el.remove();
    });

    const dateBtn = document.getElementById('rec-list-view-date');
    const catBtn = document.getElementById('rec-list-view-cat');
    if (dateBtn) dateBtn.textContent = 'By date';
    if (catBtn) catBtn.textContent = 'By stream';

    if (window.TideUI && window.TideUI.styleDropsList) window.TideUI.styleDropsList();
  }

  function renderTideDrops() {
    const rec = document.getElementById('s-rec');
    if (!rec) return;
    ensureEyebrow(rec, 'DROPS', 'rec-input-hub-open');
    if (window.TideUI && window.TideUI.layoutScreenHeader) window.TideUI.layoutScreenHeader(rec);
    if (window.TideUI && window.TideUI.applyPulseDropsMonthNav) window.TideUI.applyPulseDropsMonthNav(rec);
    if (window.TideUI && window.TideUI.syncViewSegFloat) window.TideUI.syncViewSegFloat(rec);
    applyEnglishIn(rec);
    renderTideDropsRange();

    const sec = document.getElementById('rec-sec-lbl');
    if (sec) sec.textContent = 'ENTRIES';
    const hub = document.getElementById('rec-input-hub-open');
    if (hub) hub.setAttribute('aria-label', 'Input hub');
    scheduleEnglishPass();
  }

  function renderTideMeProfile() {
    const set = document.getElementById('s-set');
    if (!set) return;
    const pad = set.querySelector('.scr-pad');
    if (!pad) return;

    let profile = document.getElementById('tide-me-profile');
    if (!profile) {
      profile = document.createElement('div');
      profile.id = 'tide-me-profile';
      profile.className = 'tide-me-profile-wrap';
      pad.insertBefore(profile, pad.firstChild);
    }

    const drops = (expenses || []).filter((e) => e.date && e.date.startsWith(curMonth)).length;
    profile.innerHTML =
      '<div class="tide-me-profile-card">' +
      '<div class="tide-me-avatar">RF</div>' +
      '<div class="tide-me-profile-text"><div class="tide-me-name">Reflow user</div>' +
      '<div class="tide-me-sub">' +
      drops +
      ' drops tracked this month</div></div>' +
      '<svg class="tide-me-chevron" width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">' +
      '<path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></div>';
  }

  function renderTideMe() {
    const set = document.getElementById('s-set');
    if (!set) return;
    applyEnglishIn(set);
    if (window.TideUI && window.TideUI.styleMePage) {
      window.TideUI.styleMePage();
    } else {
      renderTideMeProfile();
    }
    if (set.classList.contains('active')) {
      const content = document.querySelector('.content');
      if (content) content.scrollTop = 0;
    }
    scheduleEnglishPass();
  }

  function refreshActiveScreen() {
    const key = activeNavKey();
    renderTideNav(key);
    if (key === 'home') renderTideHome();
    if (key === 'stat') renderTidePulse();
    if (key === 'rec') renderTideDrops();
    if (key === 'set') renderTideMe();
    if (window.TideUI && window.TideUI.applyTideMonthNavClass) {
      window.TideUI.applyTideMonthNavClass();
    }
    scheduleEnglishPass();
  }

  function patchCatColors() {
    if (typeof catColors !== 'function') return;
    const orig = catColors;
    window.catColors = function (name) {
      const n = normalizeCatKey(name);
      if (TIDE_CAT_MAP[n]) {
        const mid = TIDE_CAT_MAP[n];
        return { bg: mid + '33', text: mid, mid: mid };
      }
      return orig(name);
    };
  }

  function patchEmptyState() {
    if (typeof getEmptyStateHTML !== 'function') return;
    const orig = getEmptyStateHTML;
    window.getEmptyStateHTML = function (title, subtitle, iconKey) {
      const t = title != null ? translateString(title) : title;
      const s = subtitle != null ? translateString(subtitle) : subtitle;
      return orig(t, s, iconKey);
    };
  }

  function patchCycleLabel() {
    if (typeof getCycleLabel === 'function') {
      window.getCycleLabel = function () {
        return window.TideI18n ? TideI18n.t('30 天預算') : '30-day budget';
      };
    }
  }

  function mistDotSVG(cat, size) {
    const sz = size == null ? 10 : Number(size) || 10;
    const r = sz / 2;
    const n = normalizeCatKey(cat);
    let color = MIST_COLORS[n] || MIST_COLORS['Other'];
    if (typeof catColors === 'function') {
      try {
        color = catColors(n).mid || color;
      } catch (e) {}
    }
    const id = 'drop_' + n + '_' + Math.random().toString(36).slice(2, 6);
    return (
      '<svg class="tide-mist-drop" width="' +
      sz +
      '" height="' +
      sz +
      '" viewBox="0 0 ' +
      sz +
      ' ' +
      sz +
      '" style="flex-shrink:0">' +
      '<defs>' +
      '<linearGradient id="' +
      id +
      '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' +
      color +
      '" stop-opacity="1"/>' +
      '<stop offset="100%" stop-color="' +
      color +
      '" stop-opacity="0.25"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<circle cx="' +
      r +
      '" cy="' +
      r +
      '" r="' +
      r +
      '" fill="url(#' +
      id +
      ')"/>' +
      '</svg>'
    );
  }

  function mistDropSVG(cat) {
    return mistDotSVG(cat, 10);
  }

  function patchExpenseListItemDots(fnName) {
    const orig = window[fnName];
    if (typeof orig !== 'function') return;
    window[fnName] = function () {
      const html = orig.apply(this, arguments);
      const e = arguments[0];
      const cat = e && e.cat != null && e.cat !== '' ? e.cat : 'Other';
      return html.replace(
        /<div class="li-dot" style="background:[^"]*"><\/div>/,
        mistDropSVG(cat)
      );
    };
  }

  function cleanupLegacyExpenseIcons(root) {
    let scope = root;
    if (root && root.querySelectorAll && root.id !== 'rec-list' && root.id !== 'input-hub-recent-list') {
      scope = root;
    } else if (root && (root.id === 'rec-list' || root.id === 'input-hub-recent-list')) {
      scope = root;
    } else {
      scope = document;
    }
    scope.querySelectorAll('.rec-item, .li').forEach(function (row) {
      row.querySelectorAll('.tide-drop-glyph, .li-dot').forEach(function (el) {
        el.remove();
      });
    });
  }

  function patchStyleDropsList() {
    if (!window.TideUI || typeof window.TideUI.styleDropsList !== 'function') return;
    const orig = window.TideUI.styleDropsList;
    window.TideUI.styleDropsList = function (root) {
      orig.call(this, root);
      cleanupLegacyExpenseIcons(root);
    };
  }

  function patchExpenseItemDots() {
    patchExpenseListItemDots('recMonthlyListItemHTML');
    patchExpenseListItemDots('recItemHTML');
    patchExpenseListItemDots('recCatViewItemHTML');
    patchExpenseListItemDots('liHTML');
  }

  function wrapFn(name, after) {
    const orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function () {
      const r = orig.apply(this, arguments);
      try {
        after.apply(this, arguments);
        scheduleEnglishPass();
      } catch (e) {
        console.error('tide-bridge', name, e);
      }
      return r;
    };
  }

  function watchDom() {
    if (!window.MutationObserver) return;
    const obs = new MutationObserver(function () {
      scheduleEnglishPass();
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    if (window.TideI18n) TideI18n.init();
    document.body.classList.add('tide-ui');
    document.documentElement.lang = window.TideI18n && TideI18n.getLocale() === 'zh-TW' ? 'zh-TW' : 'en';
    document.documentElement.style.setProperty('theme-color', '#FAFAFB');
    document.title = 'Tide';
    patchCatColors();
    patchEmptyState();
    patchCycleLabel();
    patchExpenseItemDots();
    patchStyleDropsList();
    rebuildTideCatMap();
    window.rebuildTideCatMap = rebuildTideCatMap;
    window.TIDE_MIST_PALETTE = MIST_PALETTE;
    window.mistDotSVG = mistDotSVG;

    wrapFn('renderHome', renderTideHome);
    wrapFn('renderStat', renderTidePulse);
    wrapFn('renderRec', renderTideDrops);
    wrapFn('renderSet', function () {
      renderTideMe();
      if (window.TideI18n) TideI18n.syncLocaleSwitcher();
    });
    wrapFn('toggleCatMgrPanel', function () {
      if (document.getElementById('s-set')?.classList.contains('active')) {
        renderTideMe();
      }
    });
    wrapFn('setCatMistSwatch', function () {
      rebuildTideCatMap();
    });
    wrapFn('renameCat', function () {
      rebuildTideCatMap();
    });
    wrapFn('renderRecList', function () {
      if (document.getElementById('s-rec')?.classList.contains('active')) {
        renderTideDrops();
        if (window.TideUI && window.TideUI.styleDropsList) window.TideUI.styleDropsList();
      }
    });
    wrapFn('renderHomeCatList', function () {
      if (document.getElementById('s-home')?.classList.contains('active')) {
        if (window.TideUI && window.TideUI.styleHomeStreams) window.TideUI.styleHomeStreams();
        else if (window.TideUI && window.TideUI.animateStreamBars) {
          window.TideUI.animateStreamBars(document.getElementById('home-cat-list'));
        }
      }
    });
    wrapFn('applyGlobalMonthChange', function () {
      if (document.getElementById('s-home')?.classList.contains('active')) {
        renderTideHome();
      }
    });
    wrapFn('renderAnalysisCatBreakdown', function () {
      renderByStreamWaveChart();
      if (document.getElementById('s-stat')?.classList.contains('active')) renderTidePulse();
    });
    wrapFn('renderRecDaily', function () {
      applyEnglishIn(document.getElementById('rec-daily'));
    });
    wrapFn('renderTodayOv', function () {
      applyEnglishIn(document.getElementById('ov-today'));
    });
    wrapFn('renderWeekOv', function () {
      applyEnglishIn(document.getElementById('ov-week'));
    });
    wrapFn('renderInputHubList', function () {
      applyEnglishIn(document.getElementById('ov-input-hub'));
      if (window.TideUI && window.TideUI.styleDropsList) {
        window.TideUI.styleDropsList(document.getElementById('ov-input-hub'));
      }
    });
    wrapFn('renderHomeBalanceSnapshot', function () {
      if (document.getElementById('s-home')?.classList.contains('active')) renderTideHome();
    });
    wrapFn('renderUnalloc', function () {
      if (document.getElementById('s-set')?.classList.contains('active')) renderTideMe();
    });
    wrapFn('renderCatMgrList', function () {
      if (window.TideI18n) TideI18n.applyCategoryLabels(document.getElementById('cat-mgr-list'));
    });
    wrapFn('openModal', function () {
      applyEnglishIn(document.getElementById('modal'));
    });
    wrapFn('openImportOverlay', function () {
      if (window.TideUI && window.TideUI.tideifyImportSheet) window.TideUI.tideifyImportSheet();
      applyEnglishIn(document.getElementById('import-sheet'));
    });
    wrapFn('showImportContextSelector', function () {
      if (window.TideUI && window.TideUI.tideifyImportSheet) window.TideUI.tideifyImportSheet();
    });
    wrapFn('openCsvDataOverlay', function () {
      applyEnglishIn(document.getElementById('csv-overlay'));
    });
    wrapFn('openLongTermTrend', function () {
      applyEnglishIn(document.getElementById('ov-long-term-trend'));
    });
    wrapFn('openCatOv', function (catName) {
      if (window.TideUI && window.TideUI.applyCatOvBar) window.TideUI.applyCatOvBar(catName);
      applyEnglishIn(document.getElementById('cat-ov'));
    });
    wrapFn('showEditExpenseOverlay', function () {
      if (window.TideUI && window.TideUI.tideifyEditDropSheet) {
        requestAnimationFrame(function () {
          window.TideUI.tideifyEditDropSheet();
        });
      }
    });
    wrapFn('renderChips', function () {
      if (window.TideUI && window.TideUI.tideifyEditDropChips) window.TideUI.tideifyEditDropChips();
    });
    wrapFn('pickCat', function () {
      if (window.TideUI && window.TideUI.tideifyEditDropChips) window.TideUI.tideifyEditDropChips();
    });
    wrapFn('openHeatmapDayOv', function () {
      applyEnglishIn(document.getElementById('heatmap-day-ov'));
    });
    wrapFn('openFlowSurgeOv', function () {
      applyEnglishIn(document.getElementById('heatmap-day-ov'));
    });
    function applyEventBalanceI18n() {
      if (window.TideI18n) TideI18n.applyEventBalanceOverlays();
    }
    wrapFn('openEventList', applyEventBalanceI18n);
    wrapFn('openBalanceList', applyEventBalanceI18n);
    wrapFn('openAddBalanceRecord', applyEventBalanceI18n);
    wrapFn('openEditBalanceRecord', applyEventBalanceI18n);
    wrapFn('openProjectRecordModal', applyEventBalanceI18n);
    wrapFn('openEditEventModal', applyEventBalanceI18n);
    wrapFn('renderEventList', applyEventBalanceI18n);
    wrapFn('renderBalanceList', applyEventBalanceI18n);
    wrapFn('updateHomeCategoryTotalBudgetLabel', function () {
      const el = document.getElementById('home-cat-total-budget-lbl');
      if (el) el.textContent = translateString(el.textContent);
    });

    wrapFn('navTo', refreshActiveScreen);
    wrapFn('expenseTrackerWindowLoad', function () {
      renderTideNav('home');
      refreshActiveScreen();
    });
    if (typeof syncNavIcons === 'function' && !window.__reflowSyncNavIcons) {
      window.__reflowSyncNavIcons = syncNavIcons;
    }
    wrapFn('applyGlobalMonthChange', refreshActiveScreen);
    wrapFn('toggleGlobalAmt', refreshActiveScreen);
    wrapFn('saveBudget', refreshActiveScreen);

    if (typeof ensureRecMonthlyMode === 'function') {
      try {
        ensureRecMonthlyMode();
      } catch (e) {}
    }

    watchDom();
    if (window.TideUI && window.TideUI.tideifyImportSheet) window.TideUI.tideifyImportSheet();

    setTimeout(refreshActiveScreen, 0);
    setTimeout(applyEnglishGlobally, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

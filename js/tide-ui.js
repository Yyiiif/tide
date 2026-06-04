/**
 * TIDE UI widgets — shared markup for Drops range flow & import scan (matches React prototype).
 */
window.TideUI = (function () {
  const WATER = '#3E6E8E';
  const WATER_LITE = '#A6C4D6';
  /* Monochrome wave fills (hero tank, import scan, pulse area) */
  const WAVE_BACK = '#ECEEF2';
  const WAVE_LITE = '#D4D6DA';
  const WAVE_DEEP = '#101113';
  /* Import scan — hero gray-blue family, lower neutral gray than WAVE_* */
  const SCAN_BG_TOP = '#F6F9FB';
  const SCAN_BG_MID = '#E8F1F6';
  const SCAN_WAVE_BACK = '#B8CCD8';
  const SCAN_WAVE_TOP = '#6E8CA4';
  const SCAN_WAVE_BOTTOM = WATER;

  const CORE_CAT_NAMES = ['Food', 'Transit', 'Shopping', 'Entertain', 'Health', 'Other'];

  function normalizeCatKey(name) {
    if (window.ReflowCalc && typeof ReflowCalc.normalizeCat === 'function') {
      return ReflowCalc.normalizeCat(name);
    }
    const n = String(name == null ? '' : name).trim();
    if (!n || n === 'Other') return 'Other';
    if (n === 'Home') return 'Health';
    return n;
  }

  function catLabel(name) {
    if (window.TideI18n && typeof TideI18n.displayCat === 'function') {
      return TideI18n.displayCat(name);
    }
    const k = normalizeCatKey(name);
    return k || String(name == null ? '' : name).trim() || 'Other';
  }

  function liteOf(hex, amt) {
    const h = String(hex || WATER).replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = amt == null ? 0.55 : amt;
    const mr = Math.round(r + (255 - r) * a);
    const mg = Math.round(g + (255 - g) * a);
    const mb = Math.round(b + (255 - b) * a);
    return (
      '#' +
      [mr, mg, mb]
        .map(function (x) {
          return x.toString(16).padStart(2, '0');
        })
        .join('')
    );
  }

  /** Seamless 2-tile sine waves for translateX(-50%) loop (integer freq only). */
  function seamlessWavePaths(w, h, surfaceY, backAmp, frontAmp) {
    const tileW = w;
    const endX = tileW * 2;
    function wavePath(amp, freq, phase) {
      const pts = [];
      for (let x = 0; x <= endX; x += 4) {
        const y = surfaceY + Math.sin((x / tileW) * freq * Math.PI * 2 + phase) * amp;
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      return 'M 0 ' + (h + 8) + ' L 0 ' + surfaceY + ' L ' + pts.join(' L ') + ' L ' + endX + ' ' + (h + 8) + ' Z';
    }
    const loopW = w * 2;
    return {
      back: wavePath(backAmp, 2, 0),
      front: wavePath(frontAmp, 3, Math.PI / 2),
      loopSizer:
        '<rect class="tide-hero-wave-loop" x="0" y="0" width="' +
        loopW +
        '" height="1" fill="none" aria-hidden="true"/>',
    };
  }

  function seamlessWaveMarkup(waves, backFill, frontFill, backFillOpacity, frontFillOpacity) {
    const backOp =
      backFillOpacity != null ? ' fill-opacity="' + backFillOpacity + '"' : '';
    const frontOp =
      frontFillOpacity != null ? ' fill-opacity="' + frontFillOpacity + '"' : '';
    return (
      '<g class="tide-hero-wave-a">' +
      waves.loopSizer +
      '<path d="' +
      waves.back +
      '" fill="' +
      backFill +
      '"' +
      backOp +
      '/></g>' +
      '<g class="tide-hero-wave-b">' +
      waves.loopSizer +
      '<path d="' +
      waves.front +
      '" fill="' +
      frontFill +
      '"' +
      frontOp +
      '/></g>'
    );
  }

  function heroTankVisualLevel(level, mode) {
    if (mode === 'spent') {
      const amt = Number(level) || 0;
      if (window.ReflowCalc && typeof ReflowCalc.spentHeroWaterLevel === 'function') {
        return ReflowCalc.spentHeroWaterLevel(amt);
      }
    }
    const raw = Math.max(0, Math.min(1, Number(level) || 0));
    if (window.ReflowCalc && typeof ReflowCalc.clampHeroWaterLevelForMode === 'function') {
      return ReflowCalc.clampHeroWaterLevelForMode(raw, mode);
    }
    if (raw <= 0) return mode === 'spent' ? 0.32 : 0;
    if (mode === 'spent') return Math.max(0.32, Math.min(0.8, raw));
    return Math.max(0.03, Math.min(0.4, raw));
  }

  const HERO_WAVE_TILES = 8;

  function tideHeroSeamlessWavePath(w, h, surfaceY, amp, freq, phase) {
    const tileW = w;
    const endX = tileW * HERO_WAVE_TILES;
    const pts = [];
    for (let x = 0; x <= endX; x += 4) {
      const y = surfaceY + Math.sin((x / tileW) * freq * Math.PI * 2 + phase) * amp;
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    return (
      'M 0 ' +
      (h + 8) +
      ' L 0 ' +
      surfaceY +
      ' L ' +
      pts.join(' L ') +
      ' L ' +
      endX +
      ' ' +
      (h + 8) +
      ' Z'
    );
  }

  function tideHeroWaveDriftAnimate(shift, dur, reverse) {
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

  function tideHeroWaveLoopSizer(w) {
    return (
      '<rect class="tide-hero-wave-loop" x="0" y="0" width="' +
      w * 2 +
      '" height="1" fill="none" aria-hidden="true"/>'
    );
  }

  function tideHeroWaveLayer(className, w, h, surfaceY, amp, freq, phase, fill, dur, reverse) {
    const shift = -(w / freq);
    return (
      '<g class="' +
      className +
      '">' +
      tideHeroWaveDriftAnimate(shift, dur, reverse) +
      tideHeroWaveLoopSizer(w) +
      '<path d="' +
      tideHeroSeamlessWavePath(w, h, surfaceY, amp, freq, phase) +
      '" fill="' +
      fill +
      '"/></g>'
    );
  }

  function tideHeroWaveGradDefs() {
    return (
      '<linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">' +
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
    );
  }

  function tideHeroLayeredWavePaths(w, h, lv) {
    const surfaceY = h - h * lv;
    return (
      tideHeroWaveLayer('tide-hero-wave-a', w, h, surfaceY, 14, 2, 0, 'url(#wg1)', 7, false) +
      tideHeroWaveLayer('tide-hero-wave-b', w, h, surfaceY + 10, 10, 3, Math.PI / 2, 'url(#wg2)', 5.2, true) +
      tideHeroWaveLayer('tide-hero-wave-c', w, h, surfaceY + 18, 8, 2, Math.PI, 'url(#wg3)', 8.5, false)
    );
  }

  function tideHeroTankMarkup(level, mode) {
    const w = 300;
    const h = 320;
    const lv = heroTankVisualLevel(level, mode);
    const showWaves = lv > 0;
    const ticks = [0.25, 0.5, 0.75]
      .map(function (p) {
        const y = h * (1 - p);
        return (
          '<line x1="8" x2="16" y1="' +
          y +
          '" y2="' +
          y +
          '" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.5"/>' +
          '<line x1="' +
          (w - 16) +
          '" x2="' +
          (w - 8) +
          '" y1="' +
          y +
          '" y2="' +
          y +
          '" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.5"/>'
        );
      })
      .join('');
    return (
      '<svg class="tide-hero-tank-svg" viewBox="0 0 ' +
      w +
      ' ' +
      h +
      '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs>' +
      (showWaves ? tideHeroWaveGradDefs() : '') +
      '<clipPath id="tideHeroGradClip"><rect width="' +
      w +
      '" height="' +
      h +
      '" rx="22"/></clipPath>' +
      '</defs>' +
      '<g clip-path="url(#tideHeroGradClip)" color="var(--tide-ink,#101113)">' +
      (showWaves ? tideHeroLayeredWavePaths(w, h, lv) : '') +
      ticks +
      '</g></svg>'
    );
  }

  function homeHeroMarkup(opts) {
    const o = opts || {};
    const remTxt = o.remainingText || '$0';
    const budgetTxt = o.budgetText || '$0';
    const pct = o.pct != null ? o.pct : 0;
    const days = o.days != null ? o.days : 0;
    const level = o.level != null ? o.level : 0.5;
    const heroMode = o.heroMode === 'spent' ? 'spent' : 'remaining';
    const eyebrow = o.eyebrow || 'SPENT';
    const subPct = o.subPctSuffix != null ? o.subPctSuffix : '% left';
    const hideSubPct = !!o.hideSubPct;
    const hideSubLine = !!o.hideSubLine;
    const subLine = hideSubPct
      ? 'of ' + budgetTxt + subPct
      : 'of ' + budgetTxt + ' · ' + pct + subPct;
    const subLineMarkup = hideSubLine
      ? ''
      : '<div class="tide-hero-sub">' + subLine + '</div>';
    const leftFootLabel = o.leftFootLabel || '';
    const leftFootValue = o.leftFootValue || '';
    const leftFootMarkup = leftFootLabel
      ? '<div class="tide-hero-foot-left"><div class="tide-hero-foot-lbl">' +
        leftFootLabel +
        '</div><div class="tide-hero-foot-val">' +
        leftFootValue +
        '</div></div>'
      : '';
    const dry = level <= 0 && heroMode !== 'spent';
    return (
      '<div class="tide-hero-card' +
      (dry ? ' tide-hero-card--dry' : '') +
      '">' +
      '<div class="tide-hero-wave-layer">' +
      tideHeroTankMarkup(level, heroMode) +
      '</div>' +
      '<div class="tide-hero-overlay">' +
      '<div class="tide-hero-top">' +
      '<div class="tide-hero-eyebrow">' +
      eyebrow +
      '</div>' +
      '<div class="tide-hero-amt">' +
      remTxt +
      '</div>' +
      subLineMarkup +
      '</div>' +
      '<div class="tide-hero-foot">' +
      leftFootMarkup +
      '<div class="tide-hero-foot-right">' +
      '<div class="tide-hero-foot-lbl">DAYS LEFT</div>' +
      '<div class="tide-hero-foot-val" title="Days left in this month">' +
      days +
      '</div></div></div></div></div>'
    );
  }

  function applyTideMonthNavClass(scope) {
    const root = scope || document;
    root.querySelectorAll('#s-home .page-month-nav, #s-stat .page-month-nav, #s-rec .page-month-nav').forEach(
      function (nav) {
        nav.classList.add('tide-month-nav', 'sticky-month-navigator');
        if (nav.closest('#s-home')) nav.classList.add('homepage-sticky-navigator');
      }
    );
  }

  function layoutScreenHeader(screenEl) {
    if (!screenEl || !document.body.classList.contains('tide-ui')) return;
    const isHome = screenEl.id === 's-home';
    const isRec = screenEl.id === 's-rec';
    const pad = isHome
      ? screenEl.querySelector('.home-summary')
      : isRec
        ? screenEl.querySelector('#rec-monthly') || screenEl.querySelector('.scr-pad')
        : screenEl.querySelector('.scr-pad');
    if (!pad) return;

    const nav = pad.querySelector('.page-month-nav');
    if (!nav) return;

    let header = pad.querySelector(':scope > .tide-screen-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'tide-screen-header tide-screen-header--stacked';
      pad.insertBefore(header, pad.firstChild);
    } else if (header.parentNode === pad && pad.firstChild !== header) {
      pad.insertBefore(header, pad.firstChild);
    }

    let top = header.querySelector('.tide-screen-header-top');
    if (!top) {
      top = document.createElement('div');
      top.className = 'tide-screen-header-top';
      header.insertBefore(top, header.firstChild);
    }

    let monthWrap = header.querySelector('.tide-screen-header-month');
    if (!monthWrap) {
      monthWrap = document.createElement('div');
      monthWrap.className = 'tide-screen-header-month';
      header.appendChild(monthWrap);
    }

    if (isHome) {
      let eyebrow = top.querySelector('.tide-screen-eyebrow.tide-home-eyebrow');
      if (!eyebrow) {
        eyebrow = document.createElement('div');
        eyebrow.className = 'tide-screen-eyebrow tide-home-eyebrow';
        top.appendChild(eyebrow);
      }
      if (eyebrow.parentNode !== top) top.appendChild(eyebrow);
      top.querySelectorAll(':scope > .tide-eyebrow-tag').forEach(function (el) {
        el.remove();
      });
      let tag = eyebrow.querySelector('.tide-eyebrow-tag');
      if (!tag) {
        tag = document.createElement('span');
        tag.className = 'tide-eyebrow-tag';
        eyebrow.appendChild(tag);
      }
      tag.textContent = 'TIDE';
      pad.querySelectorAll('.tide-home-eyebrow').forEach(function (row) {
        if (row !== eyebrow && !row.querySelector('.page-month-nav') && row.parentNode) row.remove();
      });
    } else {
      const eyebrow = pad.querySelector('.tide-screen-eyebrow:not(.tide-me-eyebrow)');
      if (eyebrow && eyebrow.parentNode !== top) top.appendChild(eyebrow);
    }

    nav.classList.add('tide-month-nav');
    if (isHome) nav.classList.add('tide-home-month-nav');
    if (nav.parentNode !== monthWrap) monthWrap.appendChild(nav);

    applyTideMonthNavChevrons(nav);
    applyTideMonthNavClass(screenEl);
  }

  function applyTideMonthNavChevrons(nav) {
    if (!nav) return;
    const paths = ['M6 1L1.5 6 6 11', 'M2 1l4.5 5L2 11'];
    nav.querySelectorAll('.home-header-nav-btn').forEach(function (btn, i) {
      if (btn.querySelector('svg')) return;
      const d = paths[i] || paths[1];
      btn.innerHTML =
        '<svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true">' +
        '<path d="' +
        d +
        '" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
    });
  }

  function layoutHomeHeader() {
    const home = document.getElementById('s-home');
    if (home) layoutScreenHeader(home);
  }

  /** Pulse / Drops only — match Tide home month control (does not touch #s-home). */
  function applyPulseDropsMonthNav(screenEl) {
    if (!screenEl || !document.body.classList.contains('tide-ui')) return;
    const id = screenEl.id;
    if (id !== 's-stat' && id !== 's-rec') return;

    const pad =
      id === 's-rec'
        ? screenEl.querySelector('#rec-monthly') || screenEl.querySelector('.scr-pad')
        : screenEl.querySelector('.scr-pad');
    if (!pad) return;

    const nav =
      pad.querySelector('.tide-screen-header-month .page-month-nav') || pad.querySelector('.page-month-nav');
    if (!nav) return;

    nav.classList.add('tide-month-nav', 'tide-month-nav--pulse-drops', 'sticky-month-navigator');

    const row = nav.querySelector('.home-header-month-row');
    if (row) row.classList.add('tide-month-nav-row');

    nav.querySelectorAll('.home-header-nav-btn').forEach(function (btn) {
      btn.classList.add('tide-month-nav-btn');
      btn.setAttribute('type', 'button');
    });

    const lbl = nav.querySelector('.home-header-month-label, .home-summary-month, .month-display-label');
    if (lbl) lbl.classList.add('tide-month-nav-label');

    applyTideMonthNavChevrons(nav);
  }

  function streamBarPercent(catZh, spent, maxSpent) {
    if (window.ReflowCalc && typeof ReflowCalc.catBarPercent === 'function') {
      return ReflowCalc.catBarPercent(catZh, spent, maxSpent);
    }
    const spentN = Number(spent) || 0;
    const budget =
      typeof getDynamicCategoryBudget === 'function' ? getDynamicCategoryBudget(catZh) : 0;
    if (budget > 0) return Math.min(100, Math.round((spentN / budget) * 100));
    return spentN > 0 ? 8 : 0;
  }

  function monthSpentForCat(catZh) {
    if (window.ReflowCalc && typeof ReflowCalc.catSpent === 'function') {
      return ReflowCalc.catSpent(catZh, curMonth);
    }
    return null;
  }

  function streamBarMarkup(catZh, spent, budget) {
    const spentN = Number(spent) || 0;
    const budgetN = Number(budget) || 0;
    if (budgetN <= 0 && spentN <= 0) return '';

    const barPct = streamBarPercent(catZh, spentN);
    let col = { mid: WATER, text: WATER };
    if (typeof catColors === 'function') {
      try {
        col = catColors(normalizeCatKey(catZh));
      } catch (e) {}
    }
    const tone = col.mid || col.text || WATER;
    const toneLite = liteOf(tone, 0.55);

    return (
      '<div class="tide-stream-bar-track tide-cat-ov-bar-track">' +
      '<div class="tide-stream-bar-fill" data-target-pct="' +
      barPct +
      '" style="width:0%;background:linear-gradient(90deg,' +
      toneLite +
      ',' +
      tone +
      ')"></div></div>'
    );
  }

  function applyCatOvBar(catName) {
    const barEl = document.getElementById('cat-ov-bar');
    if (!barEl) return;

    const catZh = normalizeCatKey(catName);
    let spent = 0;
    if (window.ReflowCalc && typeof ReflowCalc.catSpent === 'function') {
      spent = ReflowCalc.catSpent(catZh, curMonth);
    }
    const budget =
      window.ReflowCalc && typeof ReflowCalc.catBudgetAmount === 'function'
        ? ReflowCalc.catBudgetAmount(catZh)
        : typeof getCatBudgetNum === 'function'
          ? getCatBudgetNum(catZh)
          : typeof getDynamicCategoryBudget === 'function'
            ? getDynamicCategoryBudget(catZh)
            : 0;

    barEl.innerHTML = streamBarMarkup(catZh, spent, budget);
    if (barEl.innerHTML) animateStreamBars(barEl);
  }

  function animateStreamBars(container) {
    if (!container) return;
    container.querySelectorAll('.tide-stream-bar-fill[data-target-pct]').forEach(function (el, i) {
      const target = el.getAttribute('data-target-pct');
      if (target == null || target === '') return;
      el.style.width = '0%';
      el.classList.remove('tide-stream-bar-fill--done');
      requestAnimationFrame(function () {
        setTimeout(
          function () {
            el.style.width = target + '%';
            el.classList.add('tide-stream-bar-fill--done');
          },
          60 + i * 70
        );
      });
    });
  }

  function tideMonthIsEmpty() {
    if (window.ReflowCalc && typeof ReflowCalc.monthIsEmpty === 'function') {
      return ReflowCalc.monthIsEmpty(curMonth);
    }
    if (typeof expensesInCalendarMonth !== 'function' || typeof curMonth === 'undefined') return false;
    return expensesInCalendarMonth(curMonth).length === 0;
  }

  function styleHomeStreams(opts) {
    layoutHomeHeader();
    const o = opts || {};
    const emptyMonth = o.emptyMonth != null ? o.emptyMonth : tideMonthIsEmpty();

    const card = document.getElementById('home-cat-donut-card');
    if (card) card.classList.add('tide-streams-card');

    const monthRows =
      window.ReflowCalc && typeof ReflowCalc.monthRows === 'function'
        ? ReflowCalc.monthRows(curMonth)
        : [];
    const maxSpent =
      window.ReflowCalc && typeof ReflowCalc.maxCategorySpend === 'function'
        ? ReflowCalc.maxCategorySpend(monthRows)
        : 0;

    const hdr = card && card.querySelector('.category-section-header-container');
    if (hdr) {
      hdr.innerHTML = '<span class="tide-streams-lbl">STREAMS</span>';
    }

    function catZhFromRow(row) {
      const onclick = row.getAttribute('onclick') || '';
      let catZh = '';
      const m = onclick.match(/openCatOv\((.+)\)/);
      if (m) {
        try {
          catZh = JSON.parse(m[1]);
        } catch (e) {
          catZh = m[1].replace(/^['"]|['"]$/g, '');
        }
      }
      if (!catZh) {
        const nm =
          row.querySelector('.home-cat-name') || row.querySelector('.tide-stream-name');
        if (nm) catZh = nm.getAttribute('data-cat-zh') || nm.textContent;
      }
      return catZh;
    }

    function streamRowData(row) {
      const catZh = catZhFromRow(row);
      const nameEl = row.querySelector('.home-cat-name');
      const amtEl = row.querySelector('.home-cat-amt') || row.querySelector('.tide-stream-amt');
      let spentNum = monthSpentForCat(catZh);
      if (spentNum == null) {
        const rawAmt = amtEl ? String(amtEl.textContent).replace(/[^0-9.-]/g, '') : '0';
        spentNum = Number(rawAmt) || 0;
      }
      if (emptyMonth) spentNum = 0;
      const barPct = emptyMonth ? 0 : streamBarPercent(catZh, spentNum, maxSpent);
      const spentTxt = emptyMonth
        ? typeof fmt === 'function'
          ? fmt(0)
          : '$0'
        : amtEl && amtEl.textContent
          ? amtEl.textContent
          : typeof fmt === 'function'
            ? fmt(spentNum)
            : '$0';
      const displayName = catLabel(catZh || (nameEl ? nameEl.getAttribute('data-cat-zh') || nameEl.textContent : ''));
      return { catZh: catZh, barPct: barPct, spentTxt: spentTxt, displayName: displayName };
    }

    document.querySelectorAll('#home-cat-list .home-cat-row:not(.tide-stream-row)').forEach(function (row) {
      const onclick = row.getAttribute('onclick') || '';
      const catZh = catZhFromRow(row);
      let col = { mid: WATER, text: WATER };
      if (typeof catColors === 'function') {
        try {
          col = catColors(normalizeCatKey(catZh));
        } catch (e) {}
      }
      const tone = col.mid || col.text || WATER;
      const toneLite = liteOf(tone, 0.55);
      const d = streamRowData(row);
      row.className = 'home-cat-row tide-stream-row';
      row.setAttribute('onclick', onclick);
      row.innerHTML =
        '<span class="tide-stream-dot" style="background:' +
        tone +
        '"></span>' +
        '<div class="tide-stream-main">' +
        '<div class="tide-stream-name" data-cat-zh="' +
        escapeAttr(d.catZh) +
        '">' +
        d.displayName +
        '</div>' +
        '<div class="tide-stream-bar-track"><div class="tide-stream-bar-fill" data-target-pct="' +
        d.barPct +
        '" style="width:0%;background:linear-gradient(90deg,' +
        toneLite +
        ',' +
        tone +
        ')"></div></div></div>' +
        '<div class="tide-stream-amt-col">' +
        '<div class="tide-stream-amt">' +
        d.spentTxt +
        '</div></div>';
    });

    document.querySelectorAll('#home-cat-list .tide-stream-row').forEach(function (row) {
      const d = streamRowData(row);
      const fill = row.querySelector('.tide-stream-bar-fill');
      if (fill) {
        fill.setAttribute('data-target-pct', d.barPct);
        if (!fill.style.background || fill.style.background.indexOf('gradient') < 0) {
          let col = { mid: WATER, text: WATER };
          if (typeof catColors === 'function') {
            try {
              col = catColors(normalizeCatKey(d.catZh));
            } catch (e) {}
          }
          const tone = col.mid || col.text || WATER;
          fill.style.background =
            'linear-gradient(90deg,' + liteOf(tone, 0.55) + ',' + tone + ')';
        }
      }
      const amt = row.querySelector('.tide-stream-amt');
      if (amt) amt.textContent = d.spentTxt;
      const bdg = row.querySelector('.tide-stream-budget');
      if (bdg) bdg.remove();
    });

    const listEl = document.getElementById('home-cat-list');
    animateStreamBars(listEl);
  }

  function rangeFlowMarkup(items) {
    const W = 320;
    const H = 110;
    const baseLow = H * 0.78;
    const baseHigh = H * 0.42;
    const pts = [];
    for (let x = 0; x <= W + 4; x += 5) {
      const t = x / W;
      const baseY = baseLow + (baseHigh - baseLow) * t;
      const wobble = Math.sin(t * Math.PI * 4.2) * 3.5 + Math.sin(t * Math.PI * 7.3 + 1.1) * 1.6;
      pts.push([x, baseY + wobble]);
    }
    let d = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const x1 = pts[i - 1][0];
      const y1 = pts[i - 1][1];
      const x2 = pts[i][0];
      const y2 = pts[i][1];
      const cx = (x1 + x2) / 2;
      d += ' Q ' + cx + ' ' + y1 + ' ' + x2 + ' ' + y2;
    }
    const area = d + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z';
    const flowId = 'tideFlowGrad';

    const cols = (items || [])
      .map(function (it, i) {
        return (
          '<div class="tide-flow-col"' +
          (i < items.length - 1 ? '' : ' style="border-right:none"') +
          '>' +
          '<div class="tide-flow-lbl">' +
          it.label +
          '</div>' +
          '<div class="tide-flow-val">' +
          it.value +
          '</div>' +
          '<div class="tide-flow-sub">' +
          it.sub +
          '</div></div>'
        );
      })
      .join('');

    return (
      '<div class="tide-range-flow">' +
      '<svg class="tide-range-flow-svg" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' +
      flowId +
      '" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="' +
      WAVE_LITE +
      '" stop-opacity="0.5"/>' +
      '<stop offset="1" stop-color="' +
      WAVE_DEEP +
      '" stop-opacity="0.12"/></linearGradient></defs>' +
      '<path d="' +
      area +
      '" fill="url(#' +
      flowId +
      ')"/>' +
      '<path d="' +
      d +
      '" fill="none" stroke="' +
      WAVE_DEEP +
      '" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>' +
      '</svg>' +
      '<div class="tide-range-flow-cols">' +
      cols +
      '</div></div>'
    );
  }

  function scanCircleMarkup(size) {
    const w = size;
    const h = size;
    const surfaceY = h * 0.32;
    const waves = seamlessWavePaths(w, h, surfaceY, 7, 5);
    return (
      '<div class="tide-scan-wrap" style="width:' +
      size +
      'px;height:' +
      size +
      'px">' +
      '<svg class="tide-scan-svg" viewBox="0 0 ' +
      w +
      ' ' +
      h +
      '" width="' +
      size +
      '" height="' +
      size +
      '" aria-hidden="true">' +
      '<defs>' +
      '<radialGradient id="tideScanBg" cx="50%" cy="35%" r="65%">' +
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.96"/>' +
      '<stop offset="0.45" stop-color="' +
      SCAN_BG_TOP +
      '" stop-opacity="0.9"/>' +
      '<stop offset="1" stop-color="' +
      SCAN_BG_MID +
      '" stop-opacity="0.78"/>' +
      '</radialGradient>' +
      '<linearGradient id="tideScanFront" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="' +
      SCAN_WAVE_TOP +
      '" stop-opacity="0.7"/>' +
      '<stop offset="0.55" stop-color="' +
      WATER_LITE +
      '" stop-opacity="0.85"/>' +
      '<stop offset="1" stop-color="' +
      SCAN_WAVE_BOTTOM +
      '" stop-opacity="0.92"/>' +
      '</linearGradient>' +
      '<clipPath id="tideScanClip"><circle cx="' +
      w / 2 +
      '" cy="' +
      h / 2 +
      '" r="' +
      (w / 2 - 1) +
      '"/></clipPath>' +
      '</defs>' +
      '<g clip-path="url(#tideScanClip)">' +
      '<rect width="' +
      w +
      '" height="' +
      h +
      '" fill="url(#tideScanBg)"/>' +
      seamlessWaveMarkup(waves, SCAN_WAVE_BACK, 'url(#tideScanFront)', '0.7') +
      '<line class="tide-scan-line" x1="0" x2="' +
      w +
      '" y1="' +
      h / 2 +
      '" y2="' +
      h / 2 +
      '"/>' +
      '</g>' +
      '</svg></div>'
    );
  }

  function importScanStageMarkup() {
    return (
      '<div class="import-parse-stage tide-import-scan">' +
      '<div id="tide-scan-circle-host" class="tide-scan-circle-host"></div>' +
      '<div class="tide-import-scan-eyebrow">SMART IMPORT</div>' +
      '<div class="tide-import-scan-title">Reading your screenshot</div>' +
      '<div class="tide-import-scan-sub">Parsing transactions…</div>' +
      '<div class="tide-import-dots" aria-hidden="true">' +
      '<span></span><span></span><span></span>' +
      '</div></div>'
    );
  }

  function mountScanCircle(host) {
    if (!host) return;
    host.innerHTML = scanCircleMarkup(140);
  }

  function dropGlyphHtml(color) {
    const c = color || WATER;
    return (
      '<span class="tide-drop-glyph" style="--tide-accent:' +
      c +
      '">' +
      '<span class="tide-drop-core"></span>' +
      '<span class="tide-drop-ring tide-drop-ring--mid"></span>' +
      '<span class="tide-drop-ring tide-drop-ring--outer"></span></span>'
    );
  }

  function styleDropsList(root) {
    let listEl = null;
    if (root) {
      if (root.id === 'rec-list' || root.id === 'input-hub-recent-list') listEl = root;
      else {
        listEl = root.querySelector('#rec-list') || root.querySelector('#input-hub-recent-list');
      }
    } else {
      listEl = document.getElementById('rec-list') || document.getElementById('input-hub-recent-list');
    }
    const scope = listEl || root || document;
    if (listEl) listEl.classList.add('tide-drops-list');

    const todayStr = typeof today === 'function' ? today() : '';

    scope.querySelectorAll('.rec-day-group').forEach(function (group) {
      const hdr = group.querySelector('.rec-day-hdr');
      if (hdr) hdr.classList.add('tide-drop-group-hdr');
      const dateEl = group.querySelector('.rec-day-date');
      if (dateEl) {
        const txt = dateEl.textContent || '';
        const parts = String(txt).trim().split(/\s+/);
        const datePart = parts[0] || txt;
        let label = datePart.toUpperCase();
        const grpDate = group.querySelector('[data-group-date]');
        const ds = grpDate && grpDate.getAttribute('data-group-date');
        if (ds && ds === todayStr) label += ' · TODAY';
        dateEl.textContent = label;
      }
    });

    scope.querySelectorAll('.rec-item').forEach(function (row) {
      row.classList.add('tide-drop-row');
      row.querySelectorAll('.tide-drop-glyph, .li-dot').forEach(function (el) {
        el.remove();
      });
      const meta = row.querySelector('.li-meta');
      if (meta) {
        const tags = meta.querySelectorAll('.tag');
        tags.forEach(function (tag, i) {
          if (i === 0 && !tag.classList.contains('tag-rec-pay')) {
            tag.classList.add('tide-drop-cat');
          }
          if (tag.classList.contains('tag-rec-pay')) {
            tag.classList.add('tide-drop-pay');
          }
        });
        const dateSpan = meta.querySelector('.rec-item-date');
        if (dateSpan && !meta.querySelector('.tide-drop-sep')) {
          const sep = document.createElement('span');
          sep.className = 'tide-drop-sep';
          sep.setAttribute('aria-hidden', 'true');
          dateSpan.parentNode.insertBefore(sep, dateSpan);
        }
      }
    });
  }

  const MONTH_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  function pulseMonthMeta() {
    const parts = String(typeof curMonth !== 'undefined' ? curMonth : '').split('-').map(Number);
    if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
      return { y: 2026, mo: 11, lastDay: 30, todayIdx: 0, isCurrent: false };
    }
    const y = parts[0];
    const mo = parts[1];
    const lastDay = new Date(y, mo, 0).getDate();
    const td = typeof today === 'function' ? today() : '';
    const isCurrent = td.slice(0, 7) === curMonth;
    let todayIdx = lastDay - 1;
    if (isCurrent) {
      const d = parseInt(td.slice(8, 10), 10);
      if (Number.isFinite(d) && d >= 1) todayIdx = Math.min(lastDay - 1, d - 1);
    }
    return { y: y, mo: mo, lastDay: lastDay, todayIdx: todayIdx, isCurrent: isCurrent };
  }

  function pulseDailySeries(meta) {
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

  function pulsePrevMonthSpent() {
    if (window.ReflowCalc && typeof ReflowCalc.prevCalendarMonth === 'function') {
      const prev = ReflowCalc.prevCalendarMonth(curMonth);
      return prev && typeof ReflowCalc.monthSpentTotal === 'function' ? ReflowCalc.monthSpentTotal(prev) : 0;
    }
    return 0;
  }

  function pulseHeroMarkup(opts) {
    const mask = opts.mask;
    const spentTxt = mask ? '$＊＊＊' : opts.spentTxt;
    const avgTxt = mask ? '$＊＊＊' : opts.avgTxt;
    return (
      '<div class="donut-title tide-pulse-hero-title">' +
      '<span class="tide-pulse-sec-lbl">SPENT SO FAR</span>' +
      '</div>' +
      '<div class="tide-pulse-hero-card tide-pulse-hero-card--card">' +
      '<div class="tide-pulse-hero-top">' +
      '<div class="tide-pulse-hero-copy">' +
      '<div class="tide-pulse-hero-amt">' +
      spentTxt +
      '</div>' +
      '<div class="tide-pulse-hero-avg">' +
      avgTxt +
      '<span> avg / day</span></div>' +
      '</div></div>' +
      '<div class="tide-pulse-chart-wrap stat-trend-chart-wrap">' +
      '<canvas id="analysis-cumulative-chart" aria-label="Cumulative spend"></canvas>' +
      '<div id="cumulative-popup"></div>' +
      '</div></div>'
    );
  }

  function pulseStreamSectionMarkup(catRows, monthTotal) {
    const mask = typeof isAmtHidden !== 'undefined' && isAmtHidden;
    const total = monthTotal > 0 ? monthTotal : 1;
    const barSegs = catRows
      .map(function (row, i) {
        const tone = row.tone;
        const w = ((row.spent || 0) / total) * 100;
        if (w <= 0) return '';
        const safe = String(row.catZh).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return (
          '<div class="tide-pulse-stack-seg" style="width:' +
          w +
          '%;background:' +
          tone +
          '" onclick="openCatOv(\'' +
          safe +
          '\')"></div>'
        );
      })
      .join('');
    const legendItems = catRows
      .filter(function (row) {
        return (row.spent || 0) > 0;
      })
      .map(function (row) {
        const safe = String(row.catZh).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return (
          '<button type="button" class="tide-pulse-legend-item" onclick="openCatOv(\'' +
          safe +
          '\')">' +
          '<span class="tide-pulse-legend-dot" style="background:' +
          row.tone +
          '"></span>' +
          '<span class="tide-pulse-legend-name">' +
          catLabel(row.catZh) +
          '</span></button>'
        );
      })
      .join('');
    return (
      '<div class="tide-pulse-stack-bar">' +
      (barSegs || '<div class="tide-pulse-stack-seg tide-pulse-stack-seg--empty"></div>') +
      '</div>' +
      (legendItems
        ? '<div class="tide-pulse-stream-legend">' + legendItems + '</div>'
        : '')
    );
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  const PULSE_COLORS = [
    '#E4E8EC', // level 0 — no spending
    '#C8D0D8', // level 1 — low
    '#A8B4BF', // level 2 — medium
    '#8898A8', // level 3 — high
    '#445060', // level 4 — very high
  ];

  function pulseHeatLevel(amt, maxDaily) {
    if (!amt || amt <= 0) return 0;
    const ratio = maxDaily > 0 ? amt / maxDaily : 0;
    if (ratio <= 0.3) return 1;
    if (ratio <= 0.55) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function pulseHeatBarBg(amt, maxDaily, isFuture) {
    if (isFuture && (!amt || amt <= 0)) return PULSE_COLORS[0];
    return PULSE_COLORS[pulseHeatLevel(amt, maxDaily)];
  }

  function pulseHeatmapMarkup(daily, todayIdx, meta) {
    meta = meta || pulseMonthMeta();
    const heads = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const y = meta.y;
    const mo = meta.mo;
    const ym =
      typeof curMonth !== 'undefined'
        ? curMonth
        : y + '-' + String(mo).padStart(2, '0');
    const maxDaily = Math.max(0, ...(daily || []));
    const first = new Date(y, mo - 1, 1);
    const offset = (first.getDay() + 6) % 7;
    const cells = [];
    let i;
    for (i = 0; i < offset; i++) cells.push(null);
    for (i = 0; i < daily.length; i++) {
      cells.push({ day: i + 1, amt: Number(daily[i]) || 0 });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    const rows = [];
    for (i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    let colsHtml = '';
    for (let c = 0; c < 7; c++) {
      let bars = '';
      for (let r = 0; r < rows.length; r++) {
        const cell = rows[r][c];
        if (!cell) {
          bars += '<div class="tide-pulse-heat-bar tide-pulse-heat-bar--pad" aria-hidden="true"></div>';
          continue;
        }
        const dayIdx = cell.day - 1;
        const isFuture = dayIdx > todayIdx;
        const ds = ym + '-' + String(cell.day).padStart(2, '0');
        let barH = 4;
        if (cell.amt > 0 && maxDaily > 0) {
          barH = Math.max(4, Math.min(40, Math.round((cell.amt / maxDaily) * 40)));
        }
        const bg = pulseHeatBarBg(cell.amt, maxDaily, isFuture);
        const cls = 'tide-pulse-heat-bar' + (isFuture ? ' tide-pulse-heat-bar--future' : '');
        const click =
          cell.amt > 0 && !isFuture
            ? ' onclick="openHeatmapDayOv(\'' + ds + '\')" role="button" tabindex="0"'
            : '';
        bars +=
          '<div class="' +
          cls +
          '"' +
          click +
          ' style="height:' +
          barH +
          'px;background:' +
          bg +
          '" title="' +
          (cell.amt > 0 ? String(Math.round(cell.amt)) : '') +
          '"></div>';
      }
      colsHtml +=
        '<div class="tide-pulse-heat-col">' +
        '<div class="tide-pulse-heat-col-lbl">' +
        heads[c] +
        '</div>' +
        '<div class="tide-pulse-heat-col-stack">' +
        bars +
        '</div></div>';
    }

    const legend = PULSE_COLORS.map(function (color) {
      return (
        '<span class="tide-pulse-heat-leg-swatch" style="background:' + color + '"></span>'
      );
    }).join('');
    return (
      '<div class="tide-pulse-heat-bars">' +
      colsHtml +
      '</div>' +
      '<div class="tide-pulse-heat-legend"><span>LESS</span>' +
      legend +
      '<span>MORE</span></div>'
    );
  }

  function pulseCategoryRows(monthRows) {
    const cm = {};
    monthRows.forEach(function (e) {
      const c = normalizeCatKey(e.cat);
      cm[c] = (cm[c] || 0) + (Number(e.amt) || 0);
    });
    const order =
      typeof getCoreCatsOrdered === 'function'
        ? getCoreCatsOrdered()
        : CORE_CAT_NAMES.map(function (k) {
            return { name: k };
          });
    return order.map(function (catObj, idx) {
      const catZh = catObj.name;
      let col = { mid: WATER };
      if (typeof catColors === 'function') {
        try {
          col = catColors(catZh);
        } catch (e) {}
      }
      return {
        catZh: catZh,
        nameZh: catLabel(catZh),
        spent: Number(cm[catZh]) || 0,
        tone: col.mid || col.text || WATER,
        idx: idx,
      };
    });
  }

  function stylePulsePage() {
    const stat = document.getElementById('s-stat');
    if (!stat) return;

    const meta = pulseMonthMeta();
    const daily = pulseDailySeries(meta);
    const monthRows =
      window.ReflowCalc && typeof ReflowCalc.monthRows === 'function'
        ? ReflowCalc.monthRows(curMonth)
        : [];
    const monthTotal =
      window.ReflowCalc && typeof ReflowCalc.monthSpentTotal === 'function'
        ? ReflowCalc.monthSpentTotal(curMonth)
        : monthRows.reduce(function (s, e) {
            return s + (Number(e.amt) || 0);
          }, 0);
    const mask = typeof isAmtHidden !== 'undefined' && isAmtHidden;
    const dayCount = meta.isCurrent ? meta.todayIdx + 1 : meta.lastDay;
    const avg = dayCount > 0 ? monthTotal / dayCount : 0;
    const budgetTotal =
      window.ReflowCalc && typeof ReflowCalc.monthBudgetTotal === 'function'
        ? ReflowCalc.monthBudgetTotal(curMonth)
        : typeof getTargetBudget === 'function'
          ? getTargetBudget(curMonth)
          : 0;
    const expected = budgetTotal > 0 ? budgetTotal * ((meta.todayIdx + 1) / meta.lastDay) : 0;
    const onPace = !expected || monthTotal <= expected * 1.03;
    const prev = pulsePrevMonthSpent();
    let vsPct = 0;
    if (prev > 0) vsPct = ((monthTotal - prev) / prev) * 100;
    const vsTxt =
      (vsPct > 0 ? '+' : vsPct < 0 ? '−' : '') +
      Math.abs(vsPct).toFixed(1) +
      '%';
    let heroWrap = document.getElementById('tide-pulse-hero');
    if (!heroWrap) {
      heroWrap = document.createElement('div');
      heroWrap.id = 'tide-pulse-hero';
      heroWrap.className = 'tide-pulse-hero-wrap donut-card tide-pulse-section';
    } else {
      heroWrap.className = 'tide-pulse-hero-wrap donut-card tide-pulse-section';
    }
    heroWrap.classList.remove('tide-pulse-hidden');
    heroWrap.innerHTML = pulseHeroMarkup({
      mask: mask,
      spentTxt: typeof fmt === 'function' ? fmt(monthTotal) : '$0',
      avgTxt: typeof fmt === 'function' ? fmt(avg) : '$0',
      vsTxt: vsTxt,
      onPace: onPace,
    });

    const pad = stat.querySelector('.scr-pad');
    const cards = stat.querySelectorAll('.scr-pad > .donut-card:not(#tide-pulse-hero)');
    const streamCard = cards[0];
    const cumCard = cards[1];
    const heatCard = cards[2];
    if (pad && streamCard) pad.insertBefore(heroWrap, streamCard.nextElementSibling);

    if (cumCard && cumCard.id !== 'tide-pulse-hero') {
      cumCard.classList.add('tide-pulse-hidden');
      cumCard.querySelectorAll('#analysis-cumulative-chart, #cumulative-popup').forEach(function (el) {
        el.remove();
      });
    }

    if (typeof renderAnalysisCumulativeChart === 'function') {
      renderAnalysisCumulativeChart();
    }

    if (streamCard) {
      streamCard.classList.add('tide-pulse-section');
      const title = document.getElementById('analysis-cat-breakdown-title');
      if (title) {
        const n =
          typeof getCoreCatsOrdered === 'function' ? getCoreCatsOrdered().length : 6;
        title.innerHTML =
          '<span class="tide-pulse-sec-lbl">BY STREAM</span>' +
          '<span class="tide-pulse-sec-meta">' +
          n +
          ' categories</span>';
      }
    }

    if (heatCard) {
      heatCard.classList.add('tide-pulse-section');
      const heatTitle = heatCard.querySelector('.donut-title');
      if (heatTitle) {
        heatTitle.innerHTML =
          '<span class="tide-pulse-sec-lbl">DAILY PULSE</span>' +
          '<span class="tide-pulse-sec-meta">' +
          meta.lastDay +
          ' days</span>';
      }
      const strip = document.getElementById('analysis-heatmap-strip');
      if (strip) {
        strip.className = 'tide-pulse-heat-host';
        strip.innerHTML = pulseHeatmapMarkup(daily, meta.todayIdx, meta);
      }
    }
  }

  const PAY_CAPTURE_EN = { 手動輸入: 'Manual', 每月帳單: 'Bill', App截圖: 'Screenshot' };
  const PAY_CAPTURE_ORDER = ['手動輸入', '每月帳單', 'App截圖'];

  function tideifyEditDropChips() {
    const wrap = document.getElementById('chips');
    if (!wrap || !document.body.classList.contains('tide-ui')) return;
    if (typeof cats === 'undefined' || typeof selCat === 'undefined') return;
    wrap.className = 'chip-row tide-edit-stream-chips';
    wrap.innerHTML = cats
      .map(function (c) {
        const col =
          typeof catColors === 'function' ? catColors(normalizeCatKey(c.name)) : { mid: WATER };
        const tone = col.mid || col.text || WATER;
        const isOn = String(c.id) === String(selCat);
        const nameZh = catLabel(c.name);
        return (
          '<button type="button" class="tide-stream-chip' +
          (isOn ? ' on' : '') +
          '" data-cat-id="' +
          escapeAttr(String(c.id)) +
          '" style="--tide-chip-tone:' +
          tone +
          '" onclick="pickCat(\'' +
          String(c.id).replace(/'/g, "\\'") +
          '\')">' +
          '<span class="tide-stream-chip-dot"></span>' +
          nameZh +
          '</button>'
        );
      })
      .join('');
  }

  function tideifyEditDropSheet() {
    if (!document.body.classList.contains('tide-ui')) return;
    const overlay = document.getElementById('ov-edit-expense');
    if (!overlay) return;
    const modal = overlay.querySelector('.modal');
    if (!modal) return;

    overlay.classList.add('tide-edit-drop-overlay');
    modal.classList.add('tide-edit-drop-panel');

    if (!modal.querySelector('.tide-sheet-handle-row')) {
      const hr = document.createElement('div');
      hr.className = 'tide-sheet-handle-row';
      hr.innerHTML = '<span class="tide-sheet-handle" aria-hidden="true"></span>';
      modal.insertBefore(hr, modal.firstChild);
    }

    const delBtn = document.getElementById('del-btn');
    const isEdit = delBtn && delBtn.style.display !== 'none';
    const nameInp = document.getElementById('f-name');
    const titleText = document.getElementById('modal-title-text');
    const oldLabel = document.getElementById('modal-title-label');
    if (oldLabel) oldLabel.style.display = 'none';

    if (titleText && !titleText.dataset.tideHdr) {
      const closeBtn = titleText.querySelector('.mn-btn');
      const block = document.createElement('div');
      block.className = 'tide-edit-drop-title-block';
      block.innerHTML =
        '<div class="tide-edit-drop-eyebrow" id="tide-edit-drop-eyebrow"></div>' +
        '<div class="tide-edit-drop-name" id="tide-edit-drop-name"></div>';
      titleText.classList.add('tide-edit-drop-hdr');
      titleText.insertBefore(block, titleText.firstChild);
      if (closeBtn) closeBtn.classList.add('tide-edit-drop-close');
      titleText.dataset.tideHdr = '1';
    }

    const eyebrow = document.getElementById('tide-edit-drop-eyebrow');
    if (eyebrow) eyebrow.textContent = isEdit ? 'EDIT DROP' : 'ADD DROP';

    const nameEl = document.getElementById('tide-edit-drop-name');
    function syncName() {
      if (!nameEl) return;
      const t = nameInp ? nameInp.value.trim() : '';
      const editing = delBtn && delBtn.style.display !== 'none';
      nameEl.textContent = t || (editing ? 'Drop' : 'New drop');
    }
    syncName();
    if (nameInp && !nameInp.dataset.tideNameSync) {
      nameInp.dataset.tideNameSync = '1';
      nameInp.addEventListener('input', syncName);
    }

    const nameGrp = nameInp && nameInp.closest('.form-grp');
    if (nameGrp) {
      const lbl = nameGrp.querySelector('.form-lbl');
      if (lbl) lbl.textContent = 'NAME';
    }
    const formRow = modal.querySelector('.form-row');
    if (formRow) {
      formRow.classList.add('tide-edit-amt-date-row');
      const lbls = formRow.querySelectorAll('.form-lbl');
      if (lbls[0]) lbls[0].textContent = 'AMOUNT';
      if (lbls[1]) lbls[1].textContent = 'DATE';
    }
    const chipsWrap = document.getElementById('chips');
    if (chipsWrap) {
      const chipsGrp = chipsWrap.closest('.form-grp');
      if (chipsGrp) {
        const lbl = chipsGrp.querySelector('.form-lbl');
        if (lbl) lbl.textContent = 'STREAM';
        chipsGrp.classList.add('tide-edit-stream-grp');
      }
    }
    const payRow = modal.querySelector('.pay-method-row');
    if (payRow) {
      payRow.classList.add('tide-capture-seg');
      const payGrp = payRow.closest('.form-grp');
      if (payGrp) {
        const lbl = payGrp.querySelector('.form-lbl');
        if (lbl) lbl.textContent = 'CAPTURED VIA';
        payGrp.classList.add('tide-edit-capture-grp');
      }
      PAY_CAPTURE_ORDER.forEach(function (p) {
        const btn = payRow.querySelector('[data-pay="' + p + '"]');
        if (btn) {
          btn.textContent = PAY_CAPTURE_EN[p] || p;
          btn.classList.add('tide-capture-pill');
          payRow.appendChild(btn);
        }
      });
    }

    const saveBtn = modal.querySelector('.save-btn');
    if (saveBtn) saveBtn.textContent = 'Save changes';
    if (delBtn) delBtn.textContent = 'Delete drop';

    tideifyEditDropChips();
  }

  function meRowHtml(opts) {
    const chev =
      opts.chevron !== false
        ? '<svg class="tide-me-row-chev" width="6" height="10" viewBox="0 0 6 10" aria-hidden="true"><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '';
    const dot =
      opts.icon !== false
        ? opts.mistCat && typeof window.mistDotSVG === 'function'
          ? window.mistDotSVG(opts.mistCat, opts.dotSize == null ? 8 : opts.dotSize)
          : '<span class="tide-me-row-dot" style="background:' +
            (opts.accent || 'var(--tide-ash)') +
            '"></span>'
        : '';
    const sub = opts.sub ? '<div class="tide-me-row-sub">' + opts.sub + '</div>' : '';
    const val =
      opts.value != null && opts.value !== ''
        ? '<div class="tide-me-row-val">' + opts.value + '</div>'
        : '';
    const last = opts.divider === false ? ' tide-me-row--last' : '';
    const click = opts.onclick ? ' onclick="' + opts.onclick + '"' : '';
    const role = opts.onclick ? ' role="button" tabindex="0"' : '';
    return (
      '<div class="tide-me-row' +
      last +
      '"' +
      click +
      role +
      '>' +
      dot +
      '<div class="tide-me-row-main"><div class="tide-me-row-lbl">' +
      opts.label +
      '</div>' +
      sub +
      '</div>' +
      val +
      chev +
      '</div>'
    );
  }

  function meSecHdr(label, meta) {
    const zhMap = {
      BUDGET: '總預算',
      STREAMS: '類別管理',
      EVENTS: '事件',
      BALANCE: '帳戶餘額',
      DATA: '資料',
      LANGUAGE: '語言',
    };
    const loc = window.TideI18n ? TideI18n.getLocale() : 'en';
    const text = loc === 'zh-TW' ? zhMap[label] || label : label;
    return (
      '<div class="tide-me-sec-hdr"><span class="tide-me-sec-lbl">' +
      text +
      '</span>' +
      (meta != null ? '<span class="tide-me-sec-meta">' + meta + '</span>' : '') +
      '</div>'
    );
  }

  function meMonthSpentForCat(catZh) {
    if (window.ReflowCalc && typeof ReflowCalc.catSpent === 'function') {
      return ReflowCalc.catSpent(catZh, curMonth);
    }
    return 0;
  }

  function meFormatBalanceDate(ds) {
    if (!ds) return '—';
    const p = String(ds).split('-').map(Number);
    if (p.length < 3) return ds;
    const mo = MONTH_SHORT[p[1] - 1] || 'MON';
    return 'Recorded ' + mo + ' ' + p[2];
  }

  function layoutMeHeader(pad) {
    let header = pad.querySelector(':scope > .tide-screen-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'tide-screen-header';
      pad.insertBefore(header, pad.firstChild);
    }
    let top = header.querySelector('.tide-screen-header-top');
    if (!top) {
      top = document.createElement('div');
      top.className = 'tide-screen-header-top';
      header.appendChild(top);
    }
    const old = document.getElementById('tide-me-eyebrow');
    if (old && old.parentNode !== top) {
      const tag = old.querySelector('.tide-eyebrow-tag');
      if (tag) top.appendChild(tag);
      old.remove();
    }
    let tag = top.querySelector('.tide-eyebrow-tag');
    if (!tag) {
      tag = document.createElement('span');
      tag.className = 'tide-eyebrow-tag';
      top.insertBefore(tag, top.firstChild);
    }
    tag.textContent = 'BASE';
    let monthLbl = top.querySelector('.tide-me-month-lbl');
    if (!monthLbl) {
      monthLbl = document.createElement('span');
      monthLbl.className = 'tide-me-month-lbl';
      top.appendChild(monthLbl);
    }
    if (typeof mlbl === 'function' && typeof curMonth !== 'undefined') {
      monthLbl.textContent = mlbl(curMonth);
    }
  }

  function ensureMeProfile(pad) {
    let profile = document.getElementById('tide-me-profile');
    if (!profile) {
      profile = document.createElement('div');
      profile.id = 'tide-me-profile';
      profile.className = 'tide-me-profile-wrap';
    }
    return profile;
  }

  function resolveMeBlock(blockId, findFn) {
    let el = document.getElementById(blockId);
    if (el) return el;
    el = findFn();
    if (el) {
      el.id = blockId;
      el.className = 'tide-me-block';
    }
    return el;
  }

  function bindMeStreamEditors(streamsSec) {
    if (!streamsSec || streamsSec.dataset.streamsEditorBound === '1') return;
    streamsSec.dataset.streamsEditorBound = '1';
    streamsSec.addEventListener('click', function (e) {
      if (
        e.target.closest(
          '.tide-me-cat-panel, .tide-me-mist-swatch, .tide-me-cat-name-inp, .tide-me-stream-drag, input, button, label'
        )
      ) {
        return;
      }
      const row = e.target.closest('.tide-me-row--stream');
      if (!row) return;
      const item = row.closest('.tide-me-cat-item');
      const card = streamsSec.querySelector('#cat-mgr-list');
      if (!card || !item) return;
      const items = card.querySelectorAll('.tide-me-cat-item');
      let idx = -1;
      for (let i = 0; i < items.length; i++) {
        if (items[i] === item) idx = i;
      }
      if (idx >= 0 && typeof window.toggleCatMgrPanel === 'function') {
        window.toggleCatMgrPanel(idx);
      }
    });
  }

  function styleMePage() {
    const set = document.getElementById('s-set');
    if (!set || !document.body.classList.contains('tide-ui')) return;
    const pad = set.querySelector('.scr-pad');
    if (!pad) return;

    layoutMeHeader(pad);
    const profile = ensureMeProfile(pad);

    const budgetSec = resolveMeBlock('tide-me-budget-block', function () {
      return document.getElementById('budget-cycle-section');
    });
    const streamsSec = resolveMeBlock('tide-me-streams-block', function () {
      const list = document.getElementById('cat-mgr-list');
      if (!list) return null;
      return list.closest('.tide-me-block') || list.closest('.set-section');
    });
    const eventsSec = resolveMeBlock('tide-me-events-block', function () {
      return document.getElementById('event-buffer-section');
    });
    const balanceSec = resolveMeBlock('tide-me-balance-block', function () {
      return document.getElementById('balance-snapshot-section');
    });
    const localeSec = document.getElementById('locale-section');
    let exportWrap = pad.querySelector('.set-export-wrap');

    if (exportWrap && !pad.querySelector('.tide-me-data-block')) {
      const dataBlock = document.createElement('div');
      dataBlock.className = 'tide-me-data-block';
      exportWrap.parentNode.insertBefore(dataBlock, exportWrap);
      dataBlock.appendChild(exportWrap);
    }
    const dataBlock = pad.querySelector('.tide-me-data-block');

    const order = [
      document.getElementById('tide-me-eyebrow'),
      profile,
      budgetSec,
      streamsSec,
      eventsSec,
      balanceSec,
      localeSec,
      dataBlock,
    ].filter(Boolean);
    order.forEach(function (el) {
      pad.appendChild(el);
    });

    if (profile) {
      const drops = (expenses || []).filter(function (e) {
        return e.date && e.date.startsWith(curMonth);
      }).length;
      const loc = window.TideI18n ? TideI18n.getLocale() : 'en';
      const subTxt =
        loc === 'zh-TW'
          ? '本月追蹤 ' + drops + ' 筆支出'
          : drops + ' drops tracked this month';
      profile.innerHTML =
        '<div class="tide-me-profile-card">' +
        '<div class="tide-me-avatar">RF</div>' +
        '<div class="tide-me-profile-text"><div class="tide-me-name">Reflow user</div>' +
        '<div class="tide-me-sub">' +
        subTxt +
        '</div></div>' +
        '<svg class="tide-me-chevron" width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">' +
        '<path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></div>';
    }

    const mask = typeof isAmtHidden !== 'undefined' && isAmtHidden;
    const fmtFn = typeof fmt === 'function' ? fmt : function (n) {
      return '$' + Math.round(n);
    };
    if (budgetSec) {
      budgetSec.className = 'tide-me-block';
      const viewedCycle =
        typeof getViewedBudgetCycle === 'function' ? getViewedBudgetCycle(curMonth) : null;
      const monthBudgetVal =
        viewedCycle && viewedCycle.amount != null
          ? Number(viewedCycle.amount) || 0
          : window.ReflowCalc && typeof ReflowCalc.monthBudgetTotal === 'function'
            ? ReflowCalc.monthBudgetTotal(curMonth)
            : typeof getTargetBudget === 'function'
              ? getTargetBudget(curMonth)
              : typeof budget !== 'undefined'
                ? Number(budget) || 0
                : 0;
      const budgetPeriod =
        typeof getBudgetPeriodForDate === 'function' &&
        typeof budgetCycleReferenceDate === 'function'
          ? getBudgetPeriodForDate(budgetCycleReferenceDate(curMonth))
          : null;
      const tl = function (zh) {
        return window.TideI18n ? TideI18n.t(zh) : zh;
      };
      budgetSec.innerHTML =
        meSecHdr('BUDGET') +
        '<div class="tide-me-card">' +
        meRowHtml({
          icon: false,
          accent: '#487CA5',
          label: tl('本期預算'),
          sub: budgetPeriod ? budgetPeriod.label : '—',
          value: mask ? '$＊＊＊' : fmtFn(monthBudgetVal),
          onclick: 'openBudgetCycleList()',
          divider: false,
        }) +
        '</div>' +
        '<input type="number" id="budget-val" tabindex="-1" aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none" value="' +
        (monthBudgetVal === '' ? '' : String(monthBudgetVal)) +
        '">' +
        '<input type="date" id="budget-cycle-start" tabindex="-1" aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none" value="' +
        (viewedCycle && viewedCycle.start ? viewedCycle.start : '') +
        '">';
    }

    if (streamsSec) {
      streamsSec.className = 'tide-me-block';
      const coreCats = typeof getCoreCatsOrdered === 'function' ? getCoreCatsOrdered() : [];
      const openIdx =
        window.openCatIdx != null && Number.isFinite(Number(window.openCatIdx))
          ? Number(window.openCatIdx)
          : null;
      const palette =
        window.TIDE_MIST_PALETTE ||
        ['#C4A09A', '#8AAF9C', '#8AAABF', '#A898C4', '#C49AB0', '#A4A8A8', '#B4A898', '#BF8C6E', '#D4C47A'];
      const rows = coreCats
        .map(function (c, i) {
          const catZh = c.name;
          const spent = meMonthSpentForCat(catZh);
          const isOpen = openIdx === i;
          const mistIdx =
            typeof getCatMistIdx === 'function' ? getCatMistIdx(c) : i % palette.length;
          const safeId = escapeAttr(String(c.id)).replace(/'/g, "\\'");
          const dot =
            typeof window.mistDotSVG === 'function'
              ? window.mistDotSVG(catZh, 8)
              : '<span class="tide-me-row-dot"></span>';
          const swatches = palette
            .map(function (hex, si) {
              return (
                '<button type="button" class="tide-me-mist-swatch' +
                (si === mistIdx ? ' on' : '') +
                '" style="background:linear-gradient(180deg,' +
                hex +
                ' 0%,' +
                hex +
                '66 100%)" aria-label="Color ' +
                (si + 1) +
                '" onclick="event.stopPropagation();setCatMistSwatch(\'' +
                safeId +
                '\',' +
                si +
                ')"></button>'
              );
            })
            .join('');
          const rowBorder = i < coreCats.length - 1 && !isOpen ? '' : ' tide-me-row--last';
          return (
            '<div class="tide-me-cat-item' +
            (isOpen ? ' tide-me-cat-item--open' : '') +
            '" data-index="' +
            i +
            '" ondragover="catMgrDragOver(event)" ondragleave="catMgrDragLeave(event)" ondrop="catMgrDrop(event)">' +
            '<div class="tide-me-row tide-me-row--stream' +
            rowBorder +
            '" role="button" tabindex="0" data-stream-idx="' +
            i +
            '">' +
            '<button type="button" class="tide-me-stream-drag" draggable="true" data-index="' +
            i +
            '" aria-label="Drag to reorder" onclick="event.stopPropagation()" ondragstart="catMgrDragStart(event)" ondragend="catMgrDragEnd(event)">' +
            '<i class="ti ti-grip-vertical" aria-hidden="true"></i></button>' +
            dot +
            '<div class="tide-me-row-main"><div class="tide-me-row-lbl">' +
            catLabel(catZh) +
            '</div></div>' +
            '<div class="tide-me-row-val">' +
            (mask ? '$＊＊＊' : fmtFn(spent)) +
            '</div>' +
            '<svg class="tide-me-stream-chev" width="6" height="10" viewBox="0 0 6 10" aria-hidden="true"' +
            (isOpen ? ' style="transform:rotate(90deg)"' : '') +
            '><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
            '</div>' +
            (isOpen
              ? '<div class="tide-me-cat-panel">' +
                '<label class="tide-me-cat-field-lbl">' +
                (window.TideI18n ? TideI18n.t('名稱') : 'Name') +
                '</label>' +
                '<input type="text" class="tide-me-cat-name-inp" value="' +
                escapeAttr(catZh) +
                '" onclick="event.stopPropagation()" onchange="renameCat(\'' +
                safeId +
                '\',this.value)">' +
                '<label class="tide-me-cat-field-lbl">' +
                (window.TideI18n ? TideI18n.t('Color') : 'Color') +
                '</label>' +
                '<div class="tide-me-mist-swatches">' +
                swatches +
                '</div></div>'
              : '') +
            '</div>'
          );
        })
        .join('');
      streamsSec.innerHTML =
        meSecHdr('STREAMS', coreCats.length) + '<div class="tide-me-card" id="cat-mgr-list">' + rows + '</div>';
      bindMeStreamEditors(streamsSec);
      const unalloc = document.getElementById('cb-unalloc');
      if (unalloc) unalloc.style.display = 'none';
    }

    if (eventsSec) {
      eventsSec.className = 'tide-me-block';
      let activeEvents = [];
      if (typeof specialEvents !== 'undefined') {
        activeEvents = specialEvents.filter(function (p) {
          return !p.archived;
        });
      }
      const eventNames = activeEvents
        .slice(0, 2)
        .map(function (p) {
          const n = p.name || '';
          if (!n || n === '事件') {
            return window.TideI18n ? TideI18n.defaultEventLabel() : '事件';
          }
          return n;
        })
        .join(' · ');
      const tl = function (zh) {
        return window.TideI18n ? TideI18n.t(zh) : zh;
      };
      const subNames = eventNames || tl('尚無進行中事件');
      eventsSec.innerHTML =
        meSecHdr('EVENTS') +
        '<div class="tide-me-card">' +
        '<div class="tide-me-row tide-me-row--toggle">' +
        '<span class="tide-me-row-dot" style="background:#8E6BC0"></span>' +
        '<div class="tide-me-row-main"><div class="tide-me-row-lbl">' +
        tl('啟用緩衝') +
        '</div>' +
        '<div class="tide-me-row-sub">' +
        tl('自動緩衝行程與一次性支出') +
        '</div></div>' +
        '<label class="tide-me-toggle-wrap" onclick="event.stopPropagation()">' +
        '<input type="checkbox" id="event-buffer-enabled" disabled>' +
        '<span class="tide-me-toggle"></span></label></div>' +
        meRowHtml({
          icon: false,
          accent: '#8E6BC0',
          label: tl('進行中事件'),
          sub: subNames,
          value: String(activeEvents.length),
          onclick: 'openEventList()',
          divider: false,
        }) +
        '</div>';
    }

    if (balanceSec) {
      balanceSec.className = 'tide-me-block';
      let latest = null;
      if (typeof balanceSnapshots !== 'undefined' && balanceSnapshots.length) {
        latest = balanceSnapshots
          .slice()
          .sort(function (a, b) {
            return String(b.date || '').localeCompare(String(a.date || ''));
          })[0];
      }
      const balVal = latest ? fmtFn(Number(latest.amount) || 0) : '—';
      const tl = function (zh) {
        return window.TideI18n ? TideI18n.t(zh) : zh;
      };
      const balSub = latest ? meFormatBalanceDate(latest.date) : tl('尚無快照');
      balanceSec.innerHTML =
        meSecHdr('BALANCE') +
        '<div class="tide-me-card">' +
        meRowHtml({
          icon: true,
          accent: 'var(--tide-water)',
          label: tl('最新快照'),
          sub: balSub,
          value: mask ? '$＊＊＊' : balVal,
          onclick: 'openBalanceList()',
          divider: false,
        }) +
        '</div>';
    }

    if (localeSec) {
      localeSec.className = 'tide-me-block tide-me-locale-block';
      localeSec.innerHTML =
        meSecHdr('LANGUAGE') +
        '<div class="locale-seg" role="group" aria-label="' +
        (window.TideI18n ? TideI18n.t('語言') : 'Language') +
        '">' +
        '<button type="button" class="locale-seg-btn" data-locale="zh-TW" data-locale-fixed="1">中文</button>' +
        '<button type="button" class="locale-seg-btn" data-locale="en" data-locale-fixed="1">English</button>' +
        '</div>';
      if (window.TideI18n) TideI18n.syncLocaleSwitcher();
    }

    if (dataBlock) {
      dataBlock.className = 'tide-me-data-block';
      if (!dataBlock.querySelector('.tide-me-sec-hdr')) {
        dataBlock.insertAdjacentHTML('afterbegin', meSecHdr('DATA'));
      }
      dataBlock.innerHTML =
        meSecHdr('DATA') +
        '<div class="tide-me-data-btns">' +
        '<button type="button" class="tide-me-data-btn" onclick="openCsvDataOverlay()">Export CSV</button>' +
        '<button type="button" class="tide-me-data-btn" onclick="pickCsvImportFile()">Import CSV</button>' +
        '</div>';
    }

    if (typeof syncAutoEventBuffer === 'function') syncAutoEventBuffer();
    const bufChk = document.getElementById('event-buffer-enabled');
    if (bufChk && typeof cycleConfig !== 'undefined') {
      bufChk.checked = !!cycleConfig.eventBufferEnabled;
    }
  }

  function tideifyImportSheet() {
    const sheet = document.getElementById('import-sheet');
    if (!sheet) return;
    sheet.classList.add('tide-import-sheet');
    const title = sheet.querySelector('.import-sheet-title');
    if (title) title.textContent = 'SMART IMPORT';
    const panel = sheet.querySelector('.import-sheet-panel');
    if (panel && !panel.querySelector('.tide-sheet-handle')) {
      const handle = document.createElement('div');
      handle.className = 'tide-sheet-handle';
      handle.setAttribute('aria-hidden', 'true');
      panel.insertBefore(handle, panel.firstChild);
    }
  }

  return {
    rangeFlowMarkup: rangeFlowMarkup,
    scanCircleMarkup: scanCircleMarkup,
    importScanStageMarkup: importScanStageMarkup,
    mountScanCircle: mountScanCircle,
    styleDropsList: styleDropsList,
    tideifyImportSheet: tideifyImportSheet,
    homeHeroMarkup: homeHeroMarkup,
    layoutHomeHeader: layoutHomeHeader,
    layoutScreenHeader: layoutScreenHeader,
    applyPulseDropsMonthNav: applyPulseDropsMonthNav,
    applyTideMonthNavClass: applyTideMonthNavClass,
    styleHomeStreams: styleHomeStreams,
    animateStreamBars: animateStreamBars,
    streamBarMarkup: streamBarMarkup,
    applyCatOvBar: applyCatOvBar,
    stylePulsePage: stylePulsePage,
    tideifyEditDropSheet: tideifyEditDropSheet,
    tideifyEditDropChips: tideifyEditDropChips,
    styleMePage: styleMePage,
  };
})();

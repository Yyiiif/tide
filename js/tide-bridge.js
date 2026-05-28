/**
 * TIDE visual bridge — all screens + overlays, English labels (Tide / Pulse / Drops / Me).
 */
(function () {
  const NAV_LABELS = { home: 'Tide', stat: 'Flow', rec: 'Drops', set: 'Base' };

  const TIDE_CAT_MAP = {
    餐飲: '#E0958A',
    交通: '#84A8CC',
    購物: '#8AB29C',
    娛樂: '#C99CB5',
    醫療: '#A99CC0',
    其他: '#9CA0A8',
    居家: '#A99CC0',
  };

  const CAT_EN_TO_ZH = {
    Food: '餐飲',
    Transit: '交通',
    Shopping: '購物',
    Leisure: '娛樂',
    Medical: '醫療',
    Others: '其他',
    Home: '醫療',
    Misc: '其他',
  };

  function normalizeCatKey(name) {
    if (window.ReflowCalc && typeof ReflowCalc.normalizeCat === 'function') {
      return ReflowCalc.normalizeCat(name);
    }
    const n = name == null || name === '' ? '其他' : String(name).trim();
    if (n === '居家') return '醫療';
    return n;
  }

  const PAY_EN = {
    手動輸入: 'Manual',
    每月帳單: 'Monthly bill',
    'App截圖': 'App screenshot',
  };

  const TEXT_EN = {
    首頁: 'Tide',
    分析: 'Flow',
    明細: 'Drops',
    個人: 'Base',
    分類支出: 'STREAMS',
    本月分類: 'BY STREAM',
    當月累積消費: 'CUMULATIVE',
    消費密度: 'DAILY PULSE',
    支出明細: 'ENTRIES',
    消費明細: 'ENTRIES',
    日期: 'By date',
    分類: 'By stream',
    類別管理: 'STREAMS',
    總預算: 'MONTHLY CAP',
    每月預算: 'Monthly cap',
    'Spent this month': 'Spent this month',
    ' spent': ' spent',
    啟用緩衝: 'Event buffer',
    帳戶餘額: 'BALANCE',
    Event: 'EVENTS',
    未分配: 'Unallocated',
    'CSV資料': 'DATA',
    匯出資料: 'Export CSV',
    匯入資料: 'Import CSV',
    總計: 'TOTAL',
    今日支出: "TODAY'S SPEND",
    本週累計: 'WEEK TOTAL',
    本週統計: 'WEEK SUMMARY',
    今日花費: "TODAY'S DROPS",
    長期趨勢: 'Trend',
    輸入中心: 'Input hub',
    週曆: 'Week view',
    每日: 'Day',
    月份: 'Month',
    類別趨勢: 'Stream trend',
    每月趨勢: 'Monthly trend',
    全部: 'All',
    總支出: 'Total spend',
    分類比例: 'BY STREAM',
    每日支出: 'Daily spend',
    本週消費明細: 'THIS WEEK',
    今日: 'Today',
    本週: 'Week',
    最近紀錄: 'Recent',
    過往紀錄: 'Past',
    智慧匯入: 'Smart import',
    新增支出: 'Add drop',
    編輯支出: 'Edit drop',
    說明: 'Note',
    '金額 (NT$)': 'Amount (NTD)',
    類別: 'Category',
    輸入方式: 'Source',
    儲存: 'Save',
    刪除這筆紀錄: 'Delete drop',
    選擇顏色: 'Pick color',
    確認: 'Confirm',
    編輯標籤: 'Edit tag',
    標籤名稱: 'Tag name',
    儲存修改: 'Save changes',
    刪除標籤: 'Delete tag',
    選擇日期: 'Pick date',
    取消: 'Cancel',
    返回: 'Back',
    關閉: 'Close',
    確認匯出: 'Export',
    確認匯入: 'Import',
    選擇檔案: 'Choose file',
    預算: 'Budget',
    尚無標籤: 'No tags yet',
    尚無事件: 'No events yet',
    尚無餘額紀錄: 'No balance records',
    尚無消費紀錄: 'No entries yet',
    今天還沒有消費紀錄: 'No drops today',
    本週無消費紀錄: 'No drops this week',
    這個月還沒有消費紀錄: 'No drops this month',
    無消費紀錄: 'No entries',
    '用 AI 截圖快速匯入': 'Import from a screenshot with AI',
    新增餘額: 'Add balance',
    編輯餘額: 'Edit balance',
    專案: 'Project',
    事件: 'Event',
    匯入前設定: 'Before import',
    快速選擇: 'Quick pick',
    開始辨識: 'Start scan',
    '正在辨識...': 'Scanning...',
    解析完成: 'Scan complete',
    確認儲存: 'Save selected',
    '記住我的選擇，之後不再詢問': 'Remember my choices',
    全選: 'Select all',
    '（未指定）': '(unspecified)',
    目前沒有可匯出的資料: 'Nothing to export',
    '將匯出消費紀錄為 CSV 檔案': 'Export transactions as CSV',
    '選擇 CSV 檔案以匯入消費紀錄': 'Choose a CSV file to import transactions',
    '選擇 CSV 檔案以匯入消費紀錄與帳戶餘額': 'Choose a CSV to import transactions and balances',
    '正在匯入資料...': 'Importing...',
    '正在準備資料...': 'Preparing export...',
    檔案中沒有可匯入的紀錄: 'No rows to import in this file',
    '無法讀取 CSV 檔案，請確認格式後再試': 'Could not read CSV — check the format',
    '6月': '6M',
    '12月': '12M',
    上個月: 'Previous month',
    下個月: 'Next month',
    上一週: 'Previous week',
    下一週: 'Next week',
    隱藏金額: 'Hide amounts',
    顯示金額: 'Show amounts',
    '手動輸入': 'Manual entry',
    'AI 智慧辨識': 'AI scan',
    '啟用特殊事件緩衝（依專案日期自動）': 'Enable event buffer (auto by project dates)',
    支出明細顯示方式: 'Entry list layout',
    趨勢時間範圍: 'Trend range',
    類別趨勢時間範圍: 'Stream trend range',
    趨勢分類篩選: 'Trend stream filter',
    每月支出趨勢: 'Monthly spend trend',
    點擊編輯: 'Tap to edit',
    '未辨識到可匯入的列。': 'No importable rows found.',
    '未辨識到交易列，請換一張截圖或確認畫面清晰。':
      'No transactions found — try another screenshot.',
    '此檢視已依偏好隱藏可能為轉帳／儲值的列。':
      'Rows that may be transfers are hidden per your preference.',
  };

  const ARIA_EN = {
    首頁: 'Tide',
    分析: 'Flow',
    明細: 'Drops',
    個人: 'Base',
    上個月: 'Previous month',
    下個月: 'Next month',
    上一週: 'Previous week',
    下一週: 'Next week',
    返回: 'Back',
    關閉: 'Close',
    隱藏金額: 'Hide amounts',
    顯示金額: 'Show amounts',
    長期趨勢: 'Trend',
    輸入中心: 'Input hub',
    '手動輸入': 'Manual entry',
    'AI 智慧辨識': 'AI scan',
  };

  const TEXT_SELECTORS =
    '.sec-lbl, .donut-title, .category-section-title, .set-section-title, .page-title, ' +
    '.rec-type-seg-btn, .event-buffer-title-txt, .budget-label, .import-sheet-title, ' +
    '.ov-title, .modal-title span, .modal-title, .form-lbl, .sc-label, .rec-hdr-pill, ' +
    '.stat-trend-pill, .csv-menu-action-btn, .save-btn, .del-btn, .import-done-btn, ' +
    '.import-done-save-primary, .import-done-close-muted, .import-ctx-start, .cal-foot-btn, ' +
    '.cal-pick-top-title, .export-csv-btn span, .ph-proj-list-empty, .ai-ctx-mgr-hint, ' +
    '.import-sheet-title, .import-ctx-lbl, .import-remember-lbl, .import-done-title, ' +
    '.import-parse-msg, .cat-ov-title, .home-balance-snapshot-lbl, .cb-unalloc, ' +
    '.budget-row-info, .rec-list-view-hdr-updated, .event-list-item-name, .balance-list-item-lbl';

  let translateScheduled = false;

  function fmt(n) {
    if (typeof window.fmt === 'function') return window.fmt(n);
    return '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
  }

  function payDisplay(name) {
    const n = String(name || '').trim();
    return PAY_EN[n] || n;
  }

  function translateString(s) {
    if (s == null || s === '') return s;
    let t = String(s).trim();
    if (TEXT_EN[t]) return TEXT_EN[t];
    if (PAY_EN[t]) return PAY_EN[t];

    const rules = [
      [/^共\s*(\d+)\s*筆$/, '$1 entries'],
      [/^(\d+)\s*筆$/, '$1 entries'],
      [/^上次更新\s*/, 'Last updated '],
      [/^未分配\s+(.+)$/, 'Unallocated $1'],
      [/^超出預算\s+(.+)$/, 'Over budget $1'],
      [/^總預算\s+(.+)$/, 'Monthly cap $1'],
      [/^目前期間：(.+)$/, 'Period: $1'],
      [/^當日合計：(.+)$/, 'Day total: $1'],
      [/^目前支出\s+(.+)\s*\/\s*預算\s+(.+)$/, 'Spent $1 / budget $2'],
      [/^已超出\s+(.+)$/, 'Over by $1'],
      [/^(.+)\s+這個月比預算多花了一些$/, '$1 is over budget this month'],
      [/^這個月沒有(.+)的消費$/, 'No $1 spend this month'],
      [/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*\|\s*共\s*(\d+)\s*筆$/, '$2/$3/$1 | $4 entries'],
      [/^(.+)\s*\|\s*共\s*(\d+)\s*筆$/, '$1 | $2 entries'],
      [/^將匯出\s+(\d+)\s*筆消費紀錄與\s*(\d+)\s*筆帳戶餘額為 CSV 檔案$/, 'Export $1 transactions and $2 balances as CSV'],
      [/^將匯出\s+(\d+)\s*筆帳戶餘額為 CSV 檔案$/, 'Export $1 balances as CSV'],
      [/^將匯出\s+(\d+)\s*筆消費紀錄為 CSV 檔案$/, 'Export $1 transactions as CSV'],
      [
        /^已選擇檔案，將匯入\s+(\d+)\s*筆消費紀錄與\s*(\d+)\s*筆帳戶餘額$/,
        'File selected — import $1 transactions and $2 balances',
      ],
      [/^已選擇檔案，將匯入\s+(\d+)\s*筆帳戶餘額$/, 'File selected — import $1 balances'],
      [/^已選擇檔案，將匯入\s+(\d+)\s*筆消費紀錄$/, 'File selected — import $1 transactions'],
      [/^(\d{1,2})\/(\d{1,2})\s*的花費$/, 'Spend on $1/$2'],
      [/^(\d+)月(\d+)日\s+(.+)$/, '$1/$2 $3'],
      [/^帳戶餘額\s*/, 'Balance '],
    ];
    for (let i = 0; i < rules.length; i++) {
      const m = t.match(rules[i][0]);
      if (m) {
        t = t.replace(rules[i][0], function () {
          let out = rules[i][1];
          for (let j = 1; j < arguments.length - 2; j++) {
            out = out.replace('$' + j, arguments[j]);
          }
          return out;
        });
        break;
      }
    }

    if (t.startsWith('未分配')) {
      const m = t.match(/未分配\s*(.+)/);
      if (m) return 'Unallocated ' + m[1];
    }
    if (/^週[一二三四五六日]$/.test(t)) {
      const wd = { 週日: 'Sun', 週一: 'Mon', 週二: 'Tue', 週三: 'Wed', 週四: 'Thu', 週五: 'Fri', 週六: 'Sat' };
      return wd[t] || t;
    }
    if (t === '今天') return 'Today';

    return t;
  }

  function translateTextNode(el) {
    if (!el) return;
    if (el.children.length > 0) return;
    const next = translateString(el.textContent);
    if (next !== el.textContent) el.textContent = next;
  }

  function translateAttributes(root) {
    if (!root) return;
    root.querySelectorAll('[aria-label]').forEach(function (el) {
      const raw = (el.getAttribute('aria-label') || '').trim();
      if (ARIA_EN[raw]) el.setAttribute('aria-label', ARIA_EN[raw]);
      else if (TEXT_EN[raw]) el.setAttribute('aria-label', TEXT_EN[raw]);
    });
    root.querySelectorAll('[placeholder]').forEach(function (el) {
      const raw = (el.getAttribute('placeholder') || '').trim();
      if (TEXT_EN[raw]) el.setAttribute('placeholder', TEXT_EN[raw]);
    });
    root.querySelectorAll('button.pay-method-pill').forEach(function (btn) {
      const pay = btn.getAttribute('data-pay');
      if (pay && PAY_EN[pay]) btn.textContent = PAY_EN[pay];
    });
  }

  function restoreCategoryLabels(root) {
    if (!root) return;
    const sel =
      '.home-cat-name, .cat-mgr-name, .tide-stream-name, .tide-pulse-legend-name, ' +
      '.tide-pulse-stream-name, .tide-stream-chip, .tag:not(.tag-rec-pay), .analysis-trend-cat-pill';
    root.querySelectorAll(sel).forEach(function (el) {
      const stored = el.getAttribute('data-cat-zh');
      if (stored) {
        el.textContent = stored;
        return;
      }
      const raw = (el.textContent || '').trim();
      if (CAT_EN_TO_ZH[raw]) {
        const zh = CAT_EN_TO_ZH[raw];
        el.setAttribute('data-cat-zh', zh);
        el.textContent = zh;
      }
    });
  }

  function applyEnglishIn(root) {
    if (!root) return;
    root.querySelectorAll(TEXT_SELECTORS).forEach(translateTextNode);
    const donutLbl = root.querySelector('.home-donut-label-row span');
    if (donutLbl) translateTextNode(donutLbl);
    restoreCategoryLabels(root);
    translateAttributes(root);
  }

  function applyEnglishGlobally() {
    applyEnglishIn(document.body);
    const csvTitle = document.getElementById('csv-overlay-title-text');
    if (csvTitle) translateTextNode(csvTitle);
    const modalLbl = document.getElementById('modal-title-label');
    if (modalLbl) translateTextNode(modalLbl);
    const hubTitle = document.getElementById('input-hub-ov-title');
    if (hubTitle) hubTitle.textContent = translateString(hubTitle.textContent);
    const eb = document.querySelector('#event-buffer-section .event-buffer-title-txt');
    if (eb && eb.textContent.trim() === 'Event') eb.textContent = 'Events';
    const balTap = document.querySelector('.balance-buffer-card .event-buffer-title-txt');
    if (balTap) balTap.textContent = 'Balance snapshot';
    const expSub = document.getElementById('export-csv-confirm-sub');
    if (expSub) expSub.textContent = translateString(expSub.textContent);
    const impSub = document.getElementById('import-csv-confirm-sub');
    if (impSub) impSub.textContent = translateString(impSub.textContent);
    const balSnap = document.querySelector('.home-balance-snapshot-lbl');
    if (balSnap) {
      const raw = balSnap.textContent || '';
      if (raw.indexOf('帳戶餘額') >= 0) {
        balSnap.textContent = raw.replace('帳戶餘額', 'Balance');
      }
    }
    document.querySelectorAll('.cb-unalloc, .budget-row-info').forEach(function (el) {
      el.textContent = translateString(el.textContent);
    });
  }

  function scheduleEnglishPass() {
    if (translateScheduled) return;
    translateScheduled = true;
    requestAnimationFrame(function () {
      translateScheduled = false;
      try {
        applyEnglishGlobally();
      } catch (e) {
        console.error('tide-bridge translate', e);
      }
    });
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
    const p = lv > 0 ? wavePaths(w, h, lv) : null;
    const gid = gradId || 'tideHeroGrad';
    const waveLayers =
      p != null
        ? '<g class="tide-hero-wave-a">' +
          p.loopSizer +
          '<path d="' +
          p.back +
          '" fill="#ECEEF2" opacity="0.85"/></g>' +
          '<g class="tide-hero-wave-b">' +
          p.loopSizer +
          '<path d="' +
          p.front +
          '" fill="url(#' +
          gid +
          ')"/></g>'
        : '';
    return (
      '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="#D4D6DA" stop-opacity="0.65"/>' +
      '<stop offset="1" stop-color="#101113" stop-opacity="0.88"/></linearGradient>' +
      '<clipPath id="' + gid + 'Clip"><rect width="' + w + '" height="' + h + '" rx="22"/></clipPath></defs>' +
      '<g clip-path="url(#' + gid + 'Clip)">' +
      waveLayers +
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
    if (!actionId) return;
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
    const heroLevel =
      m.emptyMonth || !(m.budgetTotal > 0)
        ? 0
        : Math.max(0, Math.min(1, (m.spent || 0) / m.budgetTotal));

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

  function renderTidePulse() {
    const stat = document.getElementById('s-stat');
    if (!stat) return;
    ensureEyebrow(stat, 'FLOW', 'stat-cal-open');
    if (window.TideUI && window.TideUI.layoutScreenHeader) window.TideUI.layoutScreenHeader(stat);
    if (window.TideUI && window.TideUI.applyPulseDropsMonthNav) window.TideUI.applyPulseDropsMonthNav(stat);
    applyEnglishIn(stat);
    if (window.TideUI && window.TideUI.stylePulsePage) {
      window.TideUI.stylePulsePage();
    }
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
        return 'Monthly cap';
      };
    }
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
    document.body.classList.add('tide-ui');
    document.documentElement.lang = 'en';
    document.documentElement.style.setProperty('theme-color', '#FAFAFB');
    document.title = 'Tide';
    patchCatColors();
    patchEmptyState();
    patchCycleLabel();

    wrapFn('renderHome', renderTideHome);
    wrapFn('renderStat', renderTidePulse);
    wrapFn('renderRec', renderTideDrops);
    wrapFn('renderSet', function () {
      renderTideMe();
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
      restoreCategoryLabels(document.getElementById('cat-mgr-list'));
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

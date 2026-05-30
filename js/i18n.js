/**
 * Tide locale — zh-TW (source HTML) ↔ en. Persisted in localStorage.
 */
window.TideI18n = (function () {
  const STORAGE_KEY = 'tide_locale_v1';
  const DEFAULT_LOCALE = 'en';

  const STRINGS = {
    首頁: 'Tide',
    分析: 'Flow',
    明細: 'Drops',
    個人: 'Base',
    語言: 'Language',
    分類支出: 'STREAMS',
    花多少: 'Spend',
    分類花多少: 'By stream',
    今日花多少: "Today's spend",
    當月累積花多少: 'Monthly total',
    花多少明細: 'Entries',
    本週花多少明細: 'This week',
    每日花多少: 'Daily spend',
    分類比例: 'By stream',
    無花費紀錄: 'No entries',
    本月分類: 'BY STREAM',
    花多少明細顯示方式: 'Entry list layout',
    當月累積消費: 'CUMULATIVE',
    消費密度: 'DAILY PULSE',
    支出明細: 'ENTRIES',
    消費明細: 'ENTRIES',
    日期: 'By date',
    分類: 'By stream',
    類別管理: 'STREAMS',
    總預算: 'MONTHLY CAP',
    每月預算: 'Monthly cap',
    啟用緩衝: 'Event buffer',
    帳戶餘額: 'Balance',
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
    類別趨勢: 'Category Trend',
    每月趨勢: 'Monthly Trend',
    全部: 'All',
    總支出: 'Total spend',
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
    事件列表: 'Events',
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
    '未辨識到交易列，請換一張截圖或確認畫面清晰。': 'No transactions found — try another screenshot.',
    '此檢視已依偏好隱藏可能為轉帳／儲值的列。': 'Rows that may be transfers are hidden per your preference.',
    名稱: 'Name',
    確定要刪除此餘額紀錄嗎: 'Delete this balance record?',
    '確定要刪除此餘額紀錄嗎？': 'Delete this balance record?',
    確定要刪除此事件嗎: 'Delete this event?',
    '確定要刪除此事件嗎？': 'Delete this event?',
    確定要刪除這筆紀錄嗎: 'Delete this drop?',
    '餘額 (NT$)': 'Balance (NTD)',
    記錄日期: 'Record date',
    刪除紀錄: 'Delete record',
    新增事件: 'Add event',
    編輯事件: 'Edit event',
    事件名稱: 'Event name',
    '緩衝額度 NT$（選填）': 'Buffer amount NTD (optional)',
    開始日期: 'Start date',
    結束日期: 'End date',
    儲存事件: 'Save event',
    刪除事件: 'Delete event',
    '例：旅遊、搬家': 'e.g. trip, moving',
    新增餘額紀錄: 'Add balance record',
    Events: 'Events',
    'Event buffer': 'Event buffer',
    'Auto-buffer trips & one-offs': 'Auto-buffer trips & one-offs',
    'Active events': 'Active events',
    'No active events': 'No active events',
    'Latest snapshot': 'Latest snapshot',
    'No snapshot yet': 'No snapshot yet',
    'Balance snapshot': 'Balance snapshot',
    自動緩衝行程與一次性支出: 'Auto-buffer trips & one-offs',
    進行中事件: 'Active events',
    尚無進行中事件: 'No active events',
    最新快照: 'Latest snapshot',
    尚無快照: 'No snapshot yet',
    Color: 'Color',
    本月支出: 'Spent this month',
    資料: 'DATA',
    All: 'All',
    'Total spend': 'Total spend',
    'Category Trend': 'Category Trend',
    'Monthly Trend': 'Monthly Trend',
  };

  const PAY = {
    手動輸入: 'Manual',
    每月帳單: 'Monthly bill',
    'App截圖': 'App screenshot',
  };

  const ARIA = {
    首頁: 'Tide',
    分析: 'Flow',
    明細: 'Drops',
    個人: 'Base',
    語言: 'Language',
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

  const CAT_ZH = {
    Food: '餐飲',
    Shopping: '購物',
    Transit: '交通',
    Entertain: '娛樂',
    Health: '醫療',
    Other: '其他',
    Transport: '交通',
    Entertainment: '娛樂',
    餐飲: '餐飲',
    購物: '購物',
    交通: '交通',
    娛樂: '娛樂',
    醫療: '醫療',
    其他: '其他',
  };

  const CAT_CANONICAL = {
    Food: 'Food',
    Shopping: 'Shopping',
    Transit: 'Transit',
    Entertain: 'Entertain',
    Health: 'Health',
    Other: 'Other',
    Transport: 'Transit',
    Entertainment: 'Entertain',
    餐飲: 'Food',
    購物: 'Shopping',
    交通: 'Transit',
    娛樂: 'Entertain',
    醫療: 'Health',
    其他: 'Other',
    Home: 'Health',
    居家: 'Health',
  };

  const EN_RULES = [
    [/^共\s*(\d+)\s*筆$/, '$1 entries'],
    [/^(\d+)\s*筆$/, '$1 entries'],
    [/^上次更新\s*/, 'Last updated '],
    [/^未分配\s+(.+)$/, 'Unallocated $1'],
    [/^超出預算\s+(.+)$/, 'Over budget $1'],
    [/^總預算\s+(.+)$/, 'Monthly cap $1'],
    [/^目前期間：(.+)$/, 'Period: $1'],
    [/^當日合計：(.+)$/, 'Day total: $1'],
    [/^目前花多少\s+(.+)\s*\/\s*預算\s+(.+)$/, 'Spent $1 / budget $2'],
    [/^目前支出\s+(.+)\s*\/\s*預算\s+(.+)$/, 'Spent $1 / budget $2'],
    [/^已超出\s+(.+)$/, 'Over by $1'],
    [/^(.+)\s+這個月比預算多花了一些$/, '$1 is over budget this month'],
    [/^這個月沒有(.+)的消費$/, 'No $1 spend this month'],
    [/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*\|\s*共\s*(\d+)\s*筆$/, '$2/$3/$1 | $4 entries'],
    [/^(.+)\s*\|\s*共\s*(\d+)\s*筆$/, '$1 | $2 entries'],
    [
      /^將匯出\s+(\d+)\s*筆消費紀錄與\s*(\d+)\s*筆帳戶餘額為 CSV 檔案$/,
      'Export $1 transactions and $2 balances as CSV',
    ],
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
    [/^(\d+)\s+drops tracked this month$/, '本月追蹤 $1 筆支出'],
    [/^Spent this month$/, 'Spent this month'],
  ];

  const ZH_RULES = [
    [/^(\d+)\s+entries$/, '共 $1 筆'],
    [/^Last updated\s*/, '上次更新'],
    [/^Unallocated\s+(.+)$/, '未分配 $1'],
    [/^Over budget\s+(.+)$/, '超出預算 $1'],
    [/^Monthly cap\s+(.+)$/, '總預算 $1'],
    [/^Period:\s*(.+)$/, '目前期間：$1'],
    [/^Day total:\s*(.+)$/, '當日合計：$1'],
    [/^Spent\s+(.+)\s*\/\s*budget\s+(.+)$/, '目前花多少 $1 / 預算 $2'],
    [/^Over by\s+(.+)$/, '已超出 $1'],
    [/^(.+)\s+is over budget this month$/, '$1 這個月比預算多花了一些'],
    [/^No\s+(.+)\s+spend this month$/, '這個月沒有$1的消費'],
    [/^(.+)\s*\|\s*(\d+)\s+entries$/, '$1 | 共 $2 筆'],
    [/^Balance\s*/, '帳戶餘額 '],
    [/^本月追蹤\s+(\d+)\s+筆支出$/, '$1 drops tracked this month'],
  ];

  const EN_TO_ZH = {};
  Object.keys(STRINGS).forEach(function (zh) {
    EN_TO_ZH[STRINGS[zh]] = zh;
  });
  Object.keys(PAY).forEach(function (zh) {
    EN_TO_ZH[PAY[zh]] = zh;
  });
  Object.keys(ARIA).forEach(function (zh) {
    EN_TO_ZH[ARIA[zh]] = zh;
  });

  const TEXT_SELECTORS =
    '.sec-lbl, .donut-title, .category-section-title, .set-section-title, .page-title, ' +
    '.rec-type-seg-btn, .event-buffer-title-txt, .budget-label, .import-sheet-title, ' +
    '.ov-title, .modal-title span, .modal-title, .form-lbl, .sc-label, .rec-hdr-pill, ' +
    '.stat-trend-pill, .csv-menu-action-btn, .save-btn, .del-btn, .import-done-btn, ' +
    '.import-done-save-primary, .import-done-close-muted, .import-ctx-start, .cal-foot-btn, ' +
    '.cal-pick-top-title, .export-csv-btn span, .ph-proj-list-empty, .ai-ctx-mgr-hint, ' +
    '.import-sheet-title, .import-ctx-lbl, .import-remember-lbl, .import-done-title, ' +
    '.import-parse-msg, .cat-ov-title, .home-balance-snapshot-lbl, .cb-unalloc, ' +
    '.budget-row-info, .rec-list-view-hdr-updated, .event-list-item-name, .balance-list-item-lbl, ' +
    '.analysis-trend-cat-pill, .locale-seg-btn:not([data-locale-fixed]), .tide-me-row-label, .tide-me-sec-hdr, ' +
    '.tide-me-row-lbl, .tide-me-row-sub, .balance-snapshot-save-btn, #balance-record-modal-title';

  const CAT_SELECTORS =
    '.home-cat-name, .cat-mgr-name, .tide-stream-name, .tide-pulse-legend-name, ' +
    '.tide-pulse-stream-name, .tide-stream-chip, .tag:not(.tag-rec-pay), .analysis-trend-cat-pill:not(.all), ' +
    '.stat-trend-leg-item span:last-child';

  let locale = DEFAULT_LOCALE;
  let applyScheduled = false;

  function loadLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh-TW') return saved;
    } catch (_) {}
    return DEFAULT_LOCALE;
  }

  function canonicalCat(name) {
    const n = String(name == null ? '' : name).trim();
    if (window.ReflowCalc && typeof ReflowCalc.normalizeCat === 'function') {
      return ReflowCalc.normalizeCat(n);
    }
    if (typeof normalizeCoreCatName === 'function') return normalizeCoreCatName(n);
    return CAT_CANONICAL[n] || n || 'Other';
  }

  function applyRules(text, rules) {
    let t = text;
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
    return t;
  }

  function toEnglish(text) {
    if (text == null || text === '') return text;
    let t = String(text).trim();
    if (STRINGS[t]) return STRINGS[t];
    if (PAY[t]) return PAY[t];
    t = applyRules(t, EN_RULES);
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

  function toChinese(text) {
    if (text == null || text === '') return text;
    let t = String(text).trim();
    if (EN_TO_ZH[t]) return EN_TO_ZH[t];
    t = applyRules(t, ZH_RULES);
    if (t.startsWith('Unallocated ')) {
      return '未分配 ' + t.slice('Unallocated '.length);
    }
    const wd = { Sun: '週日', Mon: '週一', Tue: '週二', Wed: '週三', Thu: '週四', Fri: '週五', Sat: '週六' };
    if (wd[t]) return wd[t];
    if (t === 'Today') return '今天';
    return t;
  }

  function translate(text) {
    if (locale === 'en') return toEnglish(text);
    return toChinese(text);
  }

  function t(key) {
    return translate(key);
  }

  function displayCat(name) {
    const key = canonicalCat(name);
    if (locale === 'zh-TW') return CAT_ZH[key] || key;
    return key;
  }

  function rememberSrc(el, value) {
    if (!el || value == null) return;
    if (!el.hasAttribute('data-i18n-src')) {
      el.setAttribute('data-i18n-src', String(value).trim());
    }
  }

  function applyTextNode(el) {
    if (!el || el.children.length > 0) return;
    const current = (el.textContent || '').trim();
    if (locale === 'zh-TW') {
      const src = el.getAttribute('data-i18n-src');
      if (src) {
        el.textContent = src;
        return;
      }
      const zh = toChinese(current);
      if (zh !== current) {
        rememberSrc(el, zh);
        el.textContent = zh;
      } else if (current) {
        rememberSrc(el, current);
      }
      return;
    }
    rememberSrc(el, el.getAttribute('data-i18n-src') || current);
    const source = el.getAttribute('data-i18n-src') || current;
    const next = toEnglish(source);
    if (next !== el.textContent) el.textContent = next;
  }

  function applyAttributes(root) {
    if (!root) return;
    root.querySelectorAll('[aria-label]').forEach(function (el) {
      const raw = (el.getAttribute('data-i18n-aria-src') || el.getAttribute('aria-label') || '').trim();
      if (!el.hasAttribute('data-i18n-aria-src') && raw) el.setAttribute('data-i18n-aria-src', raw);
      const source = el.getAttribute('data-i18n-aria-src') || raw;
      const next = locale === 'en' ? (ARIA[source] || STRINGS[source] || toEnglish(source)) : source;
      el.setAttribute('aria-label', next);
    });
    root.querySelectorAll('[placeholder]').forEach(function (el) {
      const raw = (el.getAttribute('data-i18n-ph-src') || el.getAttribute('placeholder') || '').trim();
      if (!el.hasAttribute('data-i18n-ph-src') && raw) el.setAttribute('data-i18n-ph-src', raw);
      const source = el.getAttribute('data-i18n-ph-src') || raw;
      const next = locale === 'en' ? (STRINGS[source] || toEnglish(source)) : source;
      el.setAttribute('placeholder', next);
    });
    root.querySelectorAll('button.pay-method-pill').forEach(function (btn) {
      const pay = btn.getAttribute('data-pay');
      if (!pay) return;
      if (locale === 'en') {
        if (PAY[pay]) btn.textContent = PAY[pay];
      } else {
        btn.textContent = pay;
      }
    });
  }

  function applyCategoryLabels(root) {
    if (!root) return;
    root.querySelectorAll(CAT_SELECTORS).forEach(function (el) {
      if (el.classList.contains('all')) return;
      const raw = el.getAttribute('data-cat-key') || el.getAttribute('data-cat-zh') || (el.textContent || '').trim();
      const key = canonicalCat(raw);
      el.setAttribute('data-cat-key', key);
      el.textContent = displayCat(key);
    });
  }

  function applyModalTitles(root) {
    if (!root) return;
    root.querySelectorAll('.modal-title').forEach(function (el) {
      el.childNodes.forEach(function (node) {
        if (node.nodeType !== 3) return;
        const raw = node.textContent.trim();
        if (!raw) return;
        if (!el.getAttribute('data-i18n-modal-src')) el.setAttribute('data-i18n-modal-src', raw);
        const source = el.getAttribute('data-i18n-modal-src') || raw;
        if (locale === 'zh-TW') {
          node.textContent = source;
        } else {
          node.textContent = toEnglish(source);
        }
      });
    });
  }

  function applyEventBalanceOverlays() {
    [
      'ov-event-list',
      'ov-balance-list',
      'balance-record-overlay',
      'add-event-overlay',
      'ov-edit-event',
      'event-buffer-section',
      'balance-snapshot-section',
    ].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) applyIn(el);
    });
    applyModalTitles(document);
  }

  function applyIn(root) {
    if (!root) return;
    root.querySelectorAll(TEXT_SELECTORS).forEach(applyTextNode);
    const donutLbl = root.querySelector('.home-donut-label-row span');
    if (donutLbl) applyTextNode(donutLbl);
    applyModalTitles(root);
    applyCategoryLabels(root);
    applyAttributes(root);
  }

  function applyGlobally() {
    applyIn(document.body);
    const csvTitle = document.getElementById('csv-overlay-title-text');
    if (csvTitle) applyTextNode(csvTitle);
    const modalLbl = document.getElementById('modal-title-label');
    if (modalLbl) applyTextNode(modalLbl);
    const hubTitle = document.getElementById('input-hub-ov-title');
    if (hubTitle) hubTitle.textContent = translate(hubTitle.getAttribute('data-i18n-src') || hubTitle.textContent);
    const eb = document.querySelector('#event-buffer-section .event-buffer-title-txt');
    if (eb) eb.textContent = translate(eb.getAttribute('data-i18n-src') || eb.textContent || '事件列表');
    const balTap = document.querySelector('.balance-buffer-card .event-buffer-title-txt');
    if (balTap) balTap.textContent = locale === 'en' ? 'Balance snapshot' : '帳戶餘額';
    const expSub = document.getElementById('export-csv-confirm-sub');
    if (expSub) expSub.textContent = translate(expSub.getAttribute('data-i18n-src') || expSub.textContent);
    const impSub = document.getElementById('import-csv-confirm-sub');
    if (impSub) impSub.textContent = translate(impSub.getAttribute('data-i18n-src') || impSub.textContent);
    const balSnap = document.querySelector('.home-balance-snapshot-lbl');
    if (balSnap) {
      const src = balSnap.getAttribute('data-i18n-src') || balSnap.textContent;
      if (!balSnap.hasAttribute('data-i18n-src')) balSnap.setAttribute('data-i18n-src', src.trim());
      balSnap.textContent = locale === 'en' ? String(src).replace('帳戶餘額', 'Balance') : balSnap.getAttribute('data-i18n-src');
    }
    document.querySelectorAll('.cb-unalloc, .budget-row-info').forEach(function (el) {
      const src = el.getAttribute('data-i18n-src') || el.textContent;
      if (!el.hasAttribute('data-i18n-src')) el.setAttribute('data-i18n-src', src.trim());
      el.textContent = translate(el.getAttribute('data-i18n-src'));
    });
    syncLocaleSwitcher();
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-TW';
  }

  function scheduleApply() {
    if (applyScheduled) return;
    applyScheduled = true;
    requestAnimationFrame(function () {
      applyScheduled = false;
      try {
        applyGlobally();
      } catch (e) {
        console.error('TideI18n.apply', e);
      }
    });
  }

  function syncLocaleSwitcher() {
    document.querySelectorAll('.locale-seg-btn[data-locale]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-locale') === locale);
    });
    const title = document.querySelector('#locale-section .set-section-title');
    if (title) applyTextNode(title);
  }

  function bindLocaleSwitcher() {
    if (document.body.getAttribute('data-locale-bound') === '1') return;
    document.body.setAttribute('data-locale-bound', '1');
    document.body.addEventListener('click', function (ev) {
      const btn = ev.target.closest('.locale-seg-btn[data-locale]');
      if (!btn) return;
      setLocale(btn.getAttribute('data-locale'));
    });
  }

  function refreshScreens() {
    if (typeof renderHome === 'function') renderHome();
    if (typeof renderStat === 'function') renderStat();
    if (typeof renderRec === 'function') renderRec();
    if (typeof renderSet === 'function') renderSet();
    const trendOv = document.getElementById('ov-long-term-trend');
    if (trendOv && trendOv.classList.contains('open') && typeof refreshLongTermTrendCharts === 'function') {
      refreshLongTermTrendCharts();
    }
  }

  function setLocale(next) {
    const loc = next === 'zh-TW' ? 'zh-TW' : 'en';
    if (locale === loc) return;
    locale = loc;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (_) {}
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-TW';
    document.title = 'Tide';
    refreshScreens();
    applyGlobally();
  }

  function getLocale() {
    return locale;
  }

  function init() {
    locale = loadLocale();
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-TW';
    bindLocaleSwitcher();
  }

  function defaultEventLabel() {
    return t('事件');
  }

  function confirmMsg(key) {
    return translate(key);
  }

  return {
    init: init,
    getLocale: getLocale,
    setLocale: setLocale,
    t: t,
    translate: translate,
    confirmMsg: confirmMsg,
    defaultEventLabel: defaultEventLabel,
    displayCat: displayCat,
    canonicalCat: canonicalCat,
    applyIn: applyIn,
    applyGlobally: applyGlobally,
    applyEventBalanceOverlays: applyEventBalanceOverlays,
    scheduleApply: scheduleApply,
    applyCategoryLabels: applyCategoryLabels,
    syncLocaleSwitcher: syncLocaleSwitcher,
    TEXT_SELECTORS: TEXT_SELECTORS,
  };
})();

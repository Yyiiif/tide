/**
 * Shared budget / spend math for Reflow (index.html + TIDE layer).
 * Depends on globals from index.html: expenses, curMonth, catBudgets, budget, today, etc.
 */
(function () {
  function normalizeCat(name) {
    if (typeof normalizeCoreCatName === 'function') return normalizeCoreCatName(name);
    const n = String(name == null ? '' : name).trim();
    if (!n || n === '其他') return '其他';
    if (n === '居家') return '醫療';
    return n;
  }

  function resolveMonth(ym) {
    if (ym != null && ym !== '') return String(ym);
    if (typeof curMonth !== 'undefined' && curMonth) return String(curMonth);
    if (typeof today === 'function') return today().slice(0, 7);
    return '';
  }

  function monthRows(ym) {
    const key = resolveMonth(ym);
    if (!key || typeof expensesInCalendarMonth !== 'function') return [];
    return expensesInCalendarMonth(key);
  }

  function monthIsEmpty(ym) {
    return monthRows(ym).length === 0;
  }

  function monthSpentTotal(ym) {
    return monthRows(ym).reduce(function (s, e) {
      return s + (Number(e.amt) || 0);
    }, 0);
  }

  function catSpent(catName, ym) {
    const key = normalizeCat(catName);
    return monthRows(ym)
      .filter(function (e) {
        return normalizeCat(e.cat) === key;
      })
      .reduce(function (s, e) {
        return s + (Number(e.amt) || 0);
      }, 0);
  }

  function categorySpendMap(rows) {
    const map = {};
    (rows || []).forEach(function (e) {
      const c = normalizeCat(e.cat);
      map[c] = (map[c] || 0) + (Number(e.amt) || 0);
    });
    return map;
  }

  function maxCategorySpend(rows) {
    const vals = Object.values(categorySpendMap(rows));
    return vals.length ? Math.max.apply(null, vals) : 0;
  }

  function monthBudgetTotal(ym) {
    if (typeof getTargetBudget === 'function') return getTargetBudget(resolveMonth(ym));
    return Number(typeof budget !== 'undefined' ? budget : 0) || 0;
  }

  /** Inclusive day count from ISO date a through b (same month expected). */
  function daysInclusive(fromIso, toIso) {
    const a = new Date(String(fromIso).slice(0, 10) + 'T12:00:00');
    const b = new Date(String(toIso).slice(0, 10) + 'T12:00:00');
    if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return 0;
    return Math.round((b - a) / 86400000) + 1;
  }

  /** 這個月還剩幾天要過（依畫面上檢視的月份 curMonth / ym）。 */
  function daysLeftForMonth(ym) {
    const monthKey = resolveMonth(ym);
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const todayIso = String(td).trim().slice(0, 10);
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey) || !/^\d{4}-\d{2}-\d{2}$/.test(todayIso)) {
      return 0;
    }
    if (typeof monthDateRange !== 'function') return 0;

    const r = monthDateRange(monthKey);
    const start = String(r.start || '').slice(0, 10);
    const end = String(r.end || '').slice(0, 10);
    if (!start || !end) return 0;

    if (todayIso > end) return 0;
    if (todayIso < start) return daysInclusive(start, end);
    return daysInclusive(todayIso, end);
  }

  function daysLeftInMonth() {
    return daysLeftForMonth(
      typeof curMonth !== 'undefined' ? curMonth : resolveMonth()
    );
  }

  const HERO_REMAINING_WATER_MIN = 0.03;
  const HERO_REMAINING_WATER_MAX = 0.4;
  const HERO_SPENT_WATER_MIN = 0.3;
  const HERO_SPENT_WATER_MAX = 0.8;

  /** REMAINING hero — visual fill between 3% and 40%. */
  function clampHeroWaterLevel(raw) {
    const r = Number(raw);
    if (!Number.isFinite(r) || r <= 0) return 0;
    return Math.max(HERO_REMAINING_WATER_MIN, Math.min(HERO_REMAINING_WATER_MAX, r));
  }

  /** SPENT hero — clamp mapped ratio to 30%–80%. */
  function clampHeroSpentWaterLevel(raw) {
    const r = Number(raw);
    if (!Number.isFinite(r) || r <= 0) return HERO_SPENT_WATER_MIN;
    return Math.max(HERO_SPENT_WATER_MIN, Math.min(HERO_SPENT_WATER_MAX, r));
  }

  function expenseMonthKeys() {
    const keys = {};
    if (typeof expenses === 'undefined' || !Array.isArray(expenses)) return [];
    expenses.forEach(function (e) {
      if (e && e.date && String(e.date).length >= 7) {
        keys[String(e.date).slice(0, 7)] = true;
      }
    });
    return Object.keys(keys);
  }

  /** Highest calendar-month spend in all data (not budget). */
  function maxMonthSpentTotal() {
    let max = 0;
    expenseMonthKeys().forEach(function (k) {
      const t = monthSpentTotal(k);
      if (t > max) max = t;
    });
    return max;
  }

  /** 0–1 ratio from absolute spend vs personal peak month spend. */
  function spentHeroRawRatio(spent) {
    const amt = Number(spent) || 0;
    if (amt <= 0) return 0;
    const cap = maxMonthSpentTotal();
    if (cap <= 0) return 1;
    return Math.min(1, amt / cap);
  }

  function spentHeroWaterLevel(spent) {
    return clampHeroSpentWaterLevel(spentHeroRawRatio(spent));
  }

  function clampHeroWaterLevelForMode(raw, mode) {
    return mode === 'spent' ? clampHeroSpentWaterLevel(raw) : clampHeroWaterLevel(raw);
  }

  /** past = month ended; current = in progress; future = not started */
  function monthPhase(ym) {
    const monthKey = resolveMonth(ym);
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const todayIso = String(td).trim().slice(0, 10);
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey) || typeof monthDateRange !== 'function') {
      return 'current';
    }
    const r = monthDateRange(monthKey);
    const start = String(r.start || '').slice(0, 10);
    const end = String(r.end || '').slice(0, 10);
    if (!start || !end) return 'current';
    if (todayIso > end) return 'past';
    if (todayIso < start) return 'future';
    return 'current';
  }

  function activeBalanceSnapshotForMonth(ym) {
    const monthKey = resolveMonth(ym);
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const liveMonth = monthKey === String(td).slice(0, 7) && monthPhase(monthKey) === 'current';
    if (!liveMonth || typeof getActiveBalanceSnapshot !== 'function') return null;
    return getActiveBalanceSnapshot();
  }

  function snapshotSpentTotal() {
    if (typeof getSnapshotSpentAfter === 'function') return getSnapshotSpentAfter();
    return 0;
  }

  /** Current month with snapshot: only snapshot − post-snapshot spend. */
  function remainingBalance(ym) {
    const monthKey = resolveMonth(ym);
    const snap = activeBalanceSnapshotForMonth(monthKey);
    if (snap && typeof getEstimatedRemaining === 'function') {
      return getEstimatedRemaining();
    }
    const phase = monthPhase(monthKey);
    if (phase === 'future') {
      return monthBudgetTotal(monthKey) - monthSpentTotal(monthKey);
    }
    return 0;
  }

  /** Water level ratio for REMAINING — prefers snapshot balance over budget. */
  function remainingHeroRawRatio(remaining, ym) {
    const snap = activeBalanceSnapshotForMonth(ym);
    const base = snap ? Number(snap.amount) || 0 : 0;
    const rem = Number(remaining) || 0;
    if (base > 0) return Math.max(0, Math.min(1, rem / base));
    const budgetTotal = monthBudgetTotal(ym);
    if (budgetTotal > 0) return Math.max(0, Math.min(1, rem / budgetTotal));
    return 0;
  }

  /** Hero card metrics — one source of truth. */
  function homeHeroMetrics(ym) {
    const monthKey = resolveMonth(ym);
    const budgetTotal = monthBudgetTotal(monthKey);
    const spent = monthSpentTotal(monthKey);
    const emptyMonth = monthIsEmpty(monthKey);
    const phase = monthPhase(monthKey);
    const snap = activeBalanceSnapshotForMonth(monthKey);
    const hasBalanceView = !!(snap && Number(snap.amount) > 0);

    if (emptyMonth && !hasBalanceView) {
      return {
        remaining: 0,
        budgetTotal: budgetTotal,
        level: 0,
        days: daysLeftForMonth(monthKey),
        spent: 0,
        emptyMonth: true,
        phase: phase,
        heroMode: phase === 'past' ? 'spent' : 'remaining',
        heroAmount: 0,
        usesBalanceRemaining: false,
      };
    }

    const remaining = remainingBalance(monthKey);
    const snapshotSpent = hasBalanceView ? snapshotSpentTotal() : 0;
    const showSpent = phase === 'past';
    const heroAmount = showSpent ? spent : remaining;
    const heroSubSpent = showSpent ? spent : hasBalanceView ? snapshotSpent : spent;
    const rawLevel = showSpent
      ? spentHeroRawRatio(spent)
      : remainingHeroRawRatio(remaining, monthKey);
    const level = showSpent
      ? spentHeroWaterLevel(spent)
      : clampHeroWaterLevel(rawLevel);
    const days = daysLeftForMonth(monthKey);
    return {
      remaining: remaining,
      budgetTotal: budgetTotal,
      level: level,
      days: days,
      spent: spent,
      emptyMonth: false,
      phase: phase,
      heroMode: showSpent ? 'spent' : 'remaining',
      heroAmount: heroAmount,
      heroSubSpent: heroSubSpent,
      usesBalanceRemaining: !showSpent && hasBalanceView,
    };
  }

  function prevCalendarMonth(ym) {
    const parts = String(resolveMonth(ym)).split('-').map(Number);
    if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return '';
    let y = parts[0];
    let m = parts[1] - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    return y + '-' + String(m).padStart(2, '0');
  }

  function catBudgetAmount(catName) {
    const key = normalizeCat(catName);
    if (typeof getDynamicCategoryBudget === 'function') {
      return getDynamicCategoryBudget(key);
    }
    if (typeof catBudgets !== 'undefined' && catBudgets) {
      return Number(catBudgets[key]) || 0;
    }
    return 0;
  }

  function catBarPercent(catName, spent, maxSpent) {
    const spentN = Number(spent) || 0;
    const bdg = catBudgetAmount(catName);
    if (bdg > 0) return Math.min(100, Math.round((spentN / bdg) * 100));
    if (typeof getHomeCatBarPct === 'function' && typeof getCatBarBasis === 'function') {
      return getHomeCatBarPct(normalizeCat(catName), spentN, Number(maxSpent) || 0);
    }
    return spentN > 0 ? 8 : 0;
  }

  const api = {
    normalizeCat: normalizeCat,
    resolveMonth: resolveMonth,
    monthRows: monthRows,
    monthIsEmpty: monthIsEmpty,
    monthSpentTotal: monthSpentTotal,
    catSpent: catSpent,
    categorySpendMap: categorySpendMap,
    maxCategorySpend: maxCategorySpend,
    monthBudgetTotal: monthBudgetTotal,
    daysLeftForMonth: daysLeftForMonth,
    daysLeftInMonth: daysLeftInMonth,
    monthPhase: monthPhase,
    activeBalanceSnapshotForMonth: activeBalanceSnapshotForMonth,
    snapshotSpentTotal: snapshotSpentTotal,
    remainingBalance: remainingBalance,
    remainingHeroRawRatio: remainingHeroRawRatio,
    clampHeroWaterLevel: clampHeroWaterLevel,
    clampHeroSpentWaterLevel: clampHeroSpentWaterLevel,
    maxMonthSpentTotal: maxMonthSpentTotal,
    spentHeroWaterLevel: spentHeroWaterLevel,
    clampHeroWaterLevelForMode: clampHeroWaterLevelForMode,
    homeHeroMetrics: homeHeroMetrics,
    prevCalendarMonth: prevCalendarMonth,
    catBudgetAmount: catBudgetAmount,
    catBarPercent: catBarPercent,
  };

  window.ReflowCalc = api;
  window.monthSpent = monthSpentTotal;
  window.daysLeftInMonth = daysLeftInMonth;
})();

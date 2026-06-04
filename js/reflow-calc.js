/**
 * Shared budget / spend math for Reflow (index.html + TIDE layer).
 * Depends on globals from index.html: expenses, curMonth, catBudgets, budget, today, etc.
 */
(function () {
  function normalizeCat(name) {
    if (typeof normalizeCoreCatName === 'function') return normalizeCoreCatName(name);
    const legacy = {
      '餐飲': 'Food', '購物': 'Shopping', '交通': 'Transit', '娛樂': 'Entertain',
      '醫療': 'Health', '其他': 'Other', Transport: 'Transit', Entertainment: 'Entertain',
    };
    const n = String(name == null ? '' : name).trim();
    if (legacy[n]) return legacy[n];
    if (!n || n === 'Other') return 'Other';
    if (n === 'Home' || n === '居家') return 'Health';
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
    if (!key) return [];
    if (typeof expensesInBudgetCycle === 'function') return expensesInBudgetCycle(key);
    if (typeof expensesInCalendarMonth !== 'function') return [];
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

  /** Days left in the budget cycle for the viewed month (30-day rolling or calendar fallback). */
  function daysLeftForMonth(ym) {
    const monthKey = resolveMonth(ym);
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const todayIso = String(td).trim().slice(0, 10);
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey) || !/^\d{4}-\d{2}-\d{2}$/.test(todayIso)) {
      return 0;
    }
    if (
      typeof getBudgetPeriodForDate === 'function' &&
      typeof budgetCycleReferenceDate === 'function'
    ) {
      const r = getBudgetPeriodForDate(budgetCycleReferenceDate(monthKey));
      const start = String(r.start || '').slice(0, 10);
      const end = String(r.end || '').slice(0, 10);
      if (!start || !end) return 0;
      if (todayIso > end) return 0;
      if (todayIso < start) return daysInclusive(start, end);
      return daysInclusive(todayIso, end);
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
  /** At $0 — enough fill so REMAINING foot text sits on dark water. */
  const HERO_SPENT_WATER_ZERO = 0.32;
  const HERO_SPENT_WATER_MAX = 0.8;
  /** Typical monthly spend band (TWD) — maps to 35%–65% water. */
  const HERO_SPENT_NORMAL_LOW = 20000;
  const HERO_SPENT_NORMAL_HIGH = 40000;
  /** Above normal high → ramp toward high water; at/above → full high water. */
  const HERO_SPENT_EXTREME = 60000;
  const HERO_SPENT_WATER_NORMAL_MIN = 0.35;
  const HERO_SPENT_WATER_NORMAL_MAX = 0.65;

  function lerp(a, b, t) {
    const x = Math.max(0, Math.min(1, Number(t) || 0));
    return a + (b - a) * x;
  }

  /** REMAINING hero — visual fill between 3% and 40%. */
  function clampHeroWaterLevel(raw) {
    const r = Number(raw);
    if (!Number.isFinite(r) || r <= 0) return 0;
    return Math.max(HERO_REMAINING_WATER_MIN, Math.min(HERO_REMAINING_WATER_MAX, r));
  }

  /** SPENT hero — linear map for 0–1 ratio; 1 = high water. */
  function clampHeroSpentWaterLevel(raw) {
    const r = Number(raw);
    if (!Number.isFinite(r) || r <= 0) return HERO_SPENT_WATER_ZERO;
    const t = Math.min(1, r);
    if (t >= 1) return HERO_SPENT_WATER_MAX;
    return HERO_SPENT_WATER_ZERO + t * (HERO_SPENT_WATER_MAX - HERO_SPENT_WATER_ZERO);
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

  /** Peak month spend excluding the month being viewed (stable bar for current month). */
  function spentHeroExtremeCap(ym) {
    const viewMonth = resolveMonth(ym);
    let max = 0;
    expenseMonthKeys().forEach(function (k) {
      if (k === viewMonth) return;
      const t = monthSpentTotal(k);
      if (t > max) max = t;
    });
    return max;
  }

  function spentHeroScaleCap(ym) {
    return HERO_SPENT_EXTREME;
  }

  /** 0–1 ratio across full spend scale (extreme = 1). */
  function spentHeroRawRatio(spent, ym) {
    const amt = Number(spent) || 0;
    if (amt <= 0) return 0;
    if (amt >= HERO_SPENT_EXTREME) return 1;
    return amt / HERO_SPENT_EXTREME;
  }

  /**
   * $0 → 32%（襯 REMAINING 文字）；0–2萬 → 32%–35%；2–4萬 → 35%–65%；4–6萬 → 65%–80%；≥6萬 → 80%。
   */
  function spentHeroWaterLevel(spent, ym) {
    const amt = Number(spent) || 0;
    if (amt <= 0) return HERO_SPENT_WATER_ZERO;
    if (amt >= HERO_SPENT_EXTREME) return HERO_SPENT_WATER_MAX;
    if (amt >= HERO_SPENT_NORMAL_HIGH) {
      return lerp(
        HERO_SPENT_WATER_NORMAL_MAX,
        HERO_SPENT_WATER_MAX,
        (amt - HERO_SPENT_NORMAL_HIGH) / (HERO_SPENT_EXTREME - HERO_SPENT_NORMAL_HIGH)
      );
    }
    if (amt >= HERO_SPENT_NORMAL_LOW) {
      return lerp(
        HERO_SPENT_WATER_NORMAL_MIN,
        HERO_SPENT_WATER_NORMAL_MAX,
        (amt - HERO_SPENT_NORMAL_LOW) / (HERO_SPENT_NORMAL_HIGH - HERO_SPENT_NORMAL_LOW)
      );
    }
    return lerp(HERO_SPENT_WATER_ZERO, HERO_SPENT_WATER_NORMAL_MIN, amt / HERO_SPENT_NORMAL_LOW);
  }

  function clampHeroWaterLevelForMode(raw, mode) {
    return mode === 'spent' ? clampHeroSpentWaterLevel(raw) : clampHeroWaterLevel(raw);
  }

  /** past = cycle ended; current = in progress; future = not started */
  function monthPhase(ym) {
    const monthKey = resolveMonth(ym);
    const td = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const todayIso = String(td).trim().slice(0, 10);
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
      return 'current';
    }
    if (
      typeof getBudgetPeriodForDate === 'function' &&
      typeof budgetCycleReferenceDate === 'function'
    ) {
      const r = getBudgetPeriodForDate(budgetCycleReferenceDate(monthKey));
      const start = String(r.start || '').slice(0, 10);
      const end = String(r.end || '').slice(0, 10);
      if (!start || !end) return 'current';
      if (todayIso > end) return 'past';
      if (todayIso < start) return 'future';
      return 'current';
    }
    if (typeof monthDateRange !== 'function') {
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
    let liveMonth = monthKey === String(td).slice(0, 7) && monthPhase(monthKey) === 'current';
    if (
      typeof getBudgetPeriodForDate === 'function' &&
      typeof budgetCycleReferenceDate === 'function' &&
      typeof getCurrentBudgetPeriod === 'function'
    ) {
      const viewP = getBudgetPeriodForDate(budgetCycleReferenceDate(monthKey));
      const todayP = getCurrentBudgetPeriod();
      liveMonth = viewP.start === todayP.start && monthPhase(monthKey) === 'current';
    }
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
      ? spentHeroRawRatio(spent, monthKey)
      : remainingHeroRawRatio(remaining, monthKey);
    const level = showSpent
      ? spentHeroWaterLevel(spent, monthKey)
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
    spentHeroExtremeCap: spentHeroExtremeCap,
    spentHeroScaleCap: spentHeroScaleCap,
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

/**
 * Loads demo dataset from data/demo/*.json when TIDE_DEMO_ENABLED is true.
 */
window.TIDE_DEMO = { ENABLED: false };

window.loadTideDemoModule = async function loadTideDemoModule() {
  var enabled = !!window.TIDE_DEMO_ENABLED;
  if (!enabled) {
    window.TIDE_DEMO = { ENABLED: false };
    return window.TIDE_DEMO;
  }

  var base = 'data/demo/';
  var res = await Promise.all([
    fetch(base + 'config.json'),
    fetch(base + 'expenses.json'),
  ]);
  if (!res[0].ok || !res[1].ok) {
    console.warn('[Reflow demo] Failed to load demo JSON', res[0].status, res[1].status);
    window.TIDE_DEMO = { ENABLED: false };
    return window.TIDE_DEMO;
  }

  var config = await res[0].json();
  var expenses = await res[1].json();
  if (!Array.isArray(expenses)) expenses = [];

  // Force Vercel to redeploy without cache 2026
  // reflowState.totalSpent ≈ 7580 (sum of public/data/demo/expenses.json)
  window.TIDE_DEMO = {
    ENABLED: true,
    month: config.month || '2026-11',
    today: config.today || '2026-11-18',
    budget: Number(config.budget) || 17000,
    catBudgets: config.catBudgets || {},
    expenses: expenses,
  };
  return window.TIDE_DEMO;
};

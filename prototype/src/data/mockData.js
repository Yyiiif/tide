// Shared mock data so all three directions show the same numbers.
// Same shape across boards = fair side-by-side comparison.
export const REFLOW_DATA = (() => {
  const monthLabel = 'NOV 2026';
  const monthBudget = 17000;
  // Force Vercel to redeploy without cache 2026
  const monthSpent  = 7580;
  const remaining   = monthBudget - monthSpent;
  const today       = 18; // day of month
  const daysInMonth = 30;
  const daysLeft    = daysInMonth - today;
  const dailyAllow  = Math.round(remaining / Math.max(1, daysLeft));

  // 30-day spend series (NTD, rounded)
  const daily = [
    320, 0, 145, 480, 210, 90, 1200,    // wk1
    180, 0, 60, 540, 95, 760, 280,      // wk2
    150, 95, 220, 410, 60, 0, 0,        // wk3 (today=18)
    0, 0, 0, 0, 0, 0, 0, 0, 0           // future
  ];

  const cats = [
    { id:'food',  name:'Food',     spent: 2940, budget: 5000, hue: 36 },
    { id:'trans', name:'Transit',  spent: 1180, budget: 2500, hue: 210 },
    { id:'shop',  name:'Shopping', spent: 1620, budget: 3000, hue: 150 },
    { id:'fun',   name:'Leisure',  spent:  830, budget: 2500, hue: 330 },
    { id:'home',  name:'Medical',  spent:  680, budget: 2000, hue: 270 },
    { id:'misc',  name:'Others',   spent:  330, budget: 2000, hue:   0 },
  ];

  const recent = [
    { id:1, name:'Family Mart',       cat:'food',  amt: 84,  date:'Nov 18', time:'08:14' },
    { id:2, name:'MRT · Daan',        cat:'trans', amt: 35,  date:'Nov 18', time:'09:02' },
    { id:3, name:'Eslite Books',      cat:'shop',  amt: 580, date:'Nov 17', time:'19:40' },
    { id:4, name:'Louisa Coffee',     cat:'food',  amt: 95,  date:'Nov 17', time:'14:22' },
    { id:5, name:'Spotify',           cat:'fun',   amt: 149, date:'Nov 16', time:'00:00' },
    { id:6, name:'7-Eleven',          cat:'food',  amt: 62,  date:'Nov 16', time:'21:10' },
    { id:7, name:'Uber',              cat:'trans', amt: 240, date:'Nov 15', time:'23:46' },
    { id:8, name:'Muji',              cat:'shop',  amt: 410, date:'Nov 14', time:'15:33' },
  ];

  return {
    monthLabel, monthBudget, monthSpent, remaining,
    today, daysInMonth, daysLeft, dailyAllow,
    daily, cats, recent,
    catById: Object.fromEntries(cats.map(c => [c.id, c])),
    fmt: (n) => '$' + Math.round(n).toLocaleString('en-US'),
    fmtShort: (n) => n >= 1000 ? '$' + (n/1000).toFixed(1) + 'k' : '$' + n,
  };
})();
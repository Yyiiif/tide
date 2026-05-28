/**
 * Demo mode switch — safe to commit (default off for GitHub / real use).
 * Copy js/demo.config.example.js to js/demo.config.local.js to enable locally
 * without changing this file.
 */
window.TIDE_DEMO_ENABLED = false;

(function () {
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('demo') === '1' || q.get('demo') === 'true') window.TIDE_DEMO_ENABLED = true;
    if (localStorage.getItem('reflow-demo') === '1') window.TIDE_DEMO_ENABLED = true;
  } catch (_) {}
})();

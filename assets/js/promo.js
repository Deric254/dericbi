/* Promo offer config. The offer never ends: the countdown runs to the next cycle end,
   and when it reaches zero a fresh cycle of CYCLE_DAYS starts automatically.
   START anchors the cycles (ISO, with timezone) so every visitor and every page sees the same countdown.
   To change the cycle length, edit CYCLE_DAYS. */
(function () {
  var START = '2026-11-30T23:59:59+03:00';
  var CYCLE_DAYS = 30;
  var CYCLE = CYCLE_DAYS * 864e5;
  var anchor = Date.parse(START);
  function nextEnd() {
    var now = Date.now();
    if (isNaN(anchor)) return NaN;
    if (now < anchor) return anchor;
    return anchor + (Math.floor((now - anchor) / CYCLE) + 1) * CYCLE;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var left = nextEnd() - Date.now();
    var els = document.querySelectorAll('[data-promo]');
    var i;
    if (isNaN(left)) {
      for (i = 0; i < els.length; i++) els[i].style.display = 'none';
      return false;
    }
    var d = Math.floor(left / 864e5), h = Math.floor(left % 864e5 / 36e5),
        m = Math.floor(left % 36e5 / 6e4), s = Math.floor(left % 6e4 / 1e3);
    var txt = d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
    var cds = document.querySelectorAll('[data-promo-countdown]');
    for (i = 0; i < cds.length; i++) cds[i].textContent = txt;
    return true;
  }
  function start() { if (tick()) setInterval(tick, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

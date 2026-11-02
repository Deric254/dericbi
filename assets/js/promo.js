/* Promo offer config: change END to your real offer end date (ISO, with timezone).
   After that moment every [data-promo] element hides itself automatically. */
(function () {
  var END = '2026-11-30T23:59:59+03:00';
  var end = Date.parse(END);
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var left = end - Date.now();
    var els = document.querySelectorAll('[data-promo]');
    var i;
    if (isNaN(end) || left <= 0) {
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

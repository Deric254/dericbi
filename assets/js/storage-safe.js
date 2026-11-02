/* If the browser blocks web storage (private mode, strict settings), fall back to in-memory storage so pages keep working. */
(function () {
  ['localStorage', 'sessionStorage'].forEach(function (name) {
    var ok = true;
    try { var s = window[name]; s.getItem('__t'); } catch (e) { ok = false; }
    if (ok) return;
    var d = {};
    var mem = {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null; },
      setItem: function (k, v) { d[k] = String(v); },
      removeItem: function (k) { delete d[k]; },
      clear: function () { d = {}; },
      key: function (i) { return Object.keys(d)[i] || null; },
      get length() { return Object.keys(d).length; }
    };
    try { Object.defineProperty(window, name, { value: mem, configurable: true }); } catch (e) {}
  });
})();

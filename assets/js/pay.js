/* DericBI "Pay now" modal: one modal for every payment on this site (services, training, licence renewals).
   Customer pays by PayPal to the owner, then emails proof (screenshot + transaction ID) in one click.
   No server, no card data, nothing stored except a "proof already sent" reminder in this browser. */
(function () {
  'use strict';
  if (window.DericBIPay) return;                       // never load twice: one modal, one set of handlers

  var CONFIG = {
    paypalEmail: 'dericmarangu@gmail.com',             // where money goes AND where proof is emailed
    proofEmail: 'dericmarangu@gmail.com',
    paypalUrl: 'https://www.paypal.com/myaccount/transfer/homepage',
    currency: 'USD'
  };
  // The one list of things that can be bought on the website. Pay buttons use data-pay="<id>".
  var CATALOG = {
    excel:    { name: 'Excel Cleanup',           amount: 20 },
    powerbi:  { name: 'PowerBI Dashboards',      amount: 20 },
    python:   { name: 'Custom Python Dashboards', amount: 23 },
    complete: { name: 'Complete Package',        amount: 38 },
    training: { name: 'Custom Training (per session)', amount: 38 }
  };

  var SENT_PREFIX = 'dericbi.pay.sent.', REF_PREFIX = 'dericbi.pay.ref.';
  function store(op, key, val) {
    try { return op === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + (Math.round(n * 100) % 100 ? Number(n).toFixed(2) : Math.round(n)) + ' ' + CONFIG.currency; }

  // A stable reference per item, so clicking Pay twice never makes two different references for the same service.
  function serviceRef(id) {
    var key = REF_PREFIX + id, ref = store('get', key);
    if (!ref) {
      var r = ''; var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (var i = 0; i < 5; i++) r += a.charAt(Math.floor(Math.random() * a.length));
      ref = 'SVC-' + id.toUpperCase() + '-' + r; store('set', key, ref);
    }
    return ref;
  }

  var el = null, lastFocus = null, current = null;

  function build() {
    el = document.createElement('div');
    el.id = 'dpay'; el.className = 'dpay'; el.hidden = true;
    el.innerHTML = '<div class="dpay-back" data-close></div>' +
      '<div class="dpay-box" role="dialog" aria-modal="true" aria-labelledby="dpay-title" tabindex="-1">' +
      '<button class="dpay-x" type="button" data-close aria-label="Close">&times;</button><div id="dpay-body"></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest && t.closest('[data-close]')) { close(); return; }
      var c = t.closest && t.closest('[data-copy]');
      if (c) { copy(c); return; }
      if (t.closest && t.closest('[data-again]')) { render(true); return; }
      if (t.closest && t.closest('[data-mailed]')) { markSent(); }
    });
    document.addEventListener('keydown', function (e) {
      if (el.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {                              // keep focus inside the dialog
        var f = el.querySelectorAll('a[href],button:not([disabled])'); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
  }

  function copy(btn) {
    var text = btn.getAttribute('data-copy'), done = function () {
      var old = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('ok');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1400);
    };
    try { navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); }); }
    catch (e) { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove();
  }

  function mailParts(o) {
    var subject = 'Payment proof - ' + o.name + ' - ' + o.ref;
    var lines = ['Hello Deric,', '', 'I have paid by PayPal. My proof is attached.', '',
      'What I paid for: ' + o.name, 'Amount: ' + money(o.amount), 'Reference: ' + o.ref];
    (o.extra || []).forEach(function (x) { lines.push(x[0] + ': ' + x[1]); });
    lines.push('PayPal transaction ID: ', 'My name: ', '', '(Please attach your PayPal screenshot before sending.)');
    var body = lines.join('\n');
    return { subject: subject, body: body,
      mailto: 'mailto:' + CONFIG.proofEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body),
      gmail: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CONFIG.proofEmail) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) };
  }

  function sentAt() { var v = store('get', SENT_PREFIX + current.ref); return v ? new Date(Number(v)) : null; }
  function markSent() { store('set', SENT_PREFIX + current.ref, String(Date.now())); }

  function render(forceFresh) {
    var o = current, body = el.querySelector('#dpay-body'), sent = forceFresh ? null : sentAt();
    var title = '<h2 id="dpay-title" class="dpay-title">Pay with PayPal</h2><p class="dpay-sub">' + esc(o.name) + '</p>';
    if (sent) {
      body.innerHTML = title +
        '<div class="dpay-done"><strong>Proof already sent</strong><p>You opened the proof email for this payment on ' +
        esc(sent.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })) +
        '. We are checking it. Please do not pay again for the same thing.</p></div>' +
        '<div class="dpay-row"><button type="button" class="dpay-btn dpay-ghost" data-close>Close</button>' +
        '<button type="button" class="dpay-btn dpay-ghost" data-again>I need to pay again</button></div>';
      focusBox(); return;
    }
    var m = mailParts(o);
    body.innerHTML = title +
      '<div class="dpay-amount"><span>' + esc(money(o.amount)) + '</span><button type="button" class="dpay-copy" data-copy="' + esc(o.amount) + '">Copy</button></div>' +
      '<dl class="dpay-facts">' +
        '<dt>Send to (PayPal)</dt><dd><b>' + esc(CONFIG.paypalEmail) + '</b><button type="button" class="dpay-copy" data-copy="' + esc(CONFIG.paypalEmail) + '">Copy</button></dd>' +
        '<dt>Put this in the PayPal note</dt><dd><b>' + esc(o.ref) + '</b><button type="button" class="dpay-copy" data-copy="' + esc(o.ref) + '">Copy</button></dd>' +
      '</dl>' +
      '<ol class="dpay-steps">' +
        '<li><b>Open PayPal</b> and send exactly <b>' + esc(money(o.amount)) + '</b> to the email above.</li>' +
        '<li><b>Take a screenshot</b> of the PayPal confirmation. It must show the amount, the date and the <b>transaction ID</b>.</li>' +
        '<li><b>Click "Email my proof"</b>. The email opens already written. Attach the screenshot and press Send.</li>' +
      '</ol>' +
      '<div class="dpay-row">' +
        '<a class="dpay-btn dpay-paypal" href="' + esc(CONFIG.paypalUrl) + '" target="_blank" rel="noopener noreferrer">Open PayPal</a>' +
        '<a class="dpay-btn dpay-mail" data-mailed href="' + esc(m.mailto) + '">Email my proof</a>' +
      '</div>' +
      '<p class="dpay-small">Email app not opening? <a data-mailed target="_blank" rel="noopener noreferrer" href="' + esc(m.gmail) + '">Write it in Gmail on the web</a> or send the screenshot to <b>' + esc(CONFIG.proofEmail) + '</b> with the reference above.</p>';
    focusBox();
  }
  function focusBox() { var b = el.querySelector('.dpay-box'); if (b) b.focus(); }

  function open(opts) {
    if (!el) build();
    var id = opts && opts.id, item = id && CATALOG[id];
    var o = {
      name: (opts && opts.name) || (item && item.name),
      amount: (opts && opts.amount != null) ? Number(opts.amount) : (item && item.amount),
      ref: (opts && opts.ref) || (id && serviceRef(id)),
      extra: (opts && opts.extra) || []
    };
    if (!o.name || !(o.amount > 0) || !o.ref) { if (window.console) console.warn('DericBIPay: unknown item', opts); return; }
    current = o; lastFocus = document.activeElement;
    render(false);
    el.hidden = false; document.documentElement.classList.add('dpay-lock');
  }
  function close() {
    if (!el || el.hidden) return;
    el.hidden = true; document.documentElement.classList.remove('dpay-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Any element with data-pay="<id>" opens the modal. One listener for the whole page: no per-button duplicates.
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-pay]');
    if (!b) return;
    e.preventDefault(); open({ id: b.getAttribute('data-pay') });
  });

  window.DericBIPay = { open: open, close: close, catalog: CATALOG, config: CONFIG };
})();

/* PayPal "Pay now" modal. Shared by the home page and the DericBI Instructor page.
   Any element with a data-pay attribute opens it:
     data-pay-item="Full Package"      what is being bought
     data-pay-amount="50"              price (per unit)
     data-pay-currency="USD"           defaults to USD
     data-pay-kes="6500"               optional KES equivalent (per unit)
     data-pay-qty="13"                 optional: shows a quantity stepper, 1 up to this number
     data-pay-extra="Activation code"  optional: asks for one extra detail and sends it with the proof
   The learner pays on PayPal, uploads a screenshot here, and /api/payment-proof emails it to the owner
   as a real attachment. Script only, no inline code, so it works under the Instructor page's strict CSP. */
(function () {
  'use strict';

  var PAYPAL_EMAIL = 'dericmarangu@gmail.com';
  var ENDPOINT = '/api/payment-proof';
  var MAX_SIDE = 1600;          // screenshots are shrunk to this many pixels on the longest side
  var MAX_ORIGINAL = 2.5 * 1024 * 1024;

  var overlay, modal, refs, lastFocus, current = null, qty = 1, proof = null, busy = false;

  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  function field(parent, label, note, placeholder, autocomplete, type) {
    var wrap = make('label', 'pp-field');
    var cap = make('span', null, label + ' ');
    if (note) cap.appendChild(make('em', null, '(' + note + ')'));
    var input = make('input', 'pp-input');
    input.type = type || 'text';
    input.placeholder = placeholder || '';
    input.autocomplete = autocomplete || 'off';
    wrap.appendChild(cap);
    wrap.appendChild(input);
    parent.appendChild(wrap);
    return input;
  }

  function build() {
    overlay = make('div', 'pp-overlay');
    overlay.hidden = true;
    modal = make('div', 'pp-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pp-title');
    refs = {};

    refs.close = make('button', 'pp-close', '\u00d7');
    refs.close.type = 'button';
    refs.close.setAttribute('aria-label', 'Close');

    var head = make('div', 'pp-head');
    var badge = make('span', 'pp-badge', 'Pay');
    badge.appendChild(make('span', null, 'Pal'));
    var title = make('h2', 'pp-title', 'Pay with PayPal');
    title.id = 'pp-title';
    head.appendChild(badge);
    head.appendChild(title);

    // everything except the header lives in refs.main so the "sent" screen can replace it
    refs.main = make('div');

    var summary = make('div', 'pp-summary');
    var row = make('div', 'pp-row');
    refs.item = make('span', 'pp-item');
    refs.qtyBox = make('div', 'pp-qty');
    refs.minus = make('button', null, '\u2212');
    refs.minus.type = 'button';
    refs.minus.setAttribute('aria-label', 'Fewer modules');
    refs.qtyOut = make('output', null, '1');
    refs.plus = make('button', null, '+');
    refs.plus.type = 'button';
    refs.plus.setAttribute('aria-label', 'More modules');
    refs.qtyBox.appendChild(make('span', null, 'Modules'));
    refs.qtyBox.appendChild(refs.minus);
    refs.qtyBox.appendChild(refs.qtyOut);
    refs.qtyBox.appendChild(refs.plus);
    row.appendChild(refs.item);
    row.appendChild(refs.qtyBox);
    var total = make('div', 'pp-total');
    refs.totalStrong = make('strong');
    refs.totalSmall = make('small');
    total.appendChild(make('span', null, 'Total to pay: '));
    total.appendChild(refs.totalStrong);
    total.appendChild(refs.totalSmall);
    summary.appendChild(row);
    summary.appendChild(total);

    var steps = make('ol', 'pp-steps');

    // Step 1: pay
    var s1 = make('li', 'pp-step');
    s1.appendChild(make('h3', null, 'Pay on PayPal'));
    refs.payText = make('p');
    s1.appendChild(refs.payText);
    var emailRow = make('div', 'pp-email-row');
    emailRow.appendChild(make('div', 'pp-email', PAYPAL_EMAIL));
    refs.copy = make('button', 'pp-copy', 'Copy');
    refs.copy.type = 'button';
    emailRow.appendChild(refs.copy);
    s1.appendChild(emailRow);
    s1.appendChild(make('p', 'pp-small', 'Put your name in the PayPal note so we can find your payment.'));

    // Step 2: proof
    var s2 = make('li', 'pp-step');
    s2.appendChild(make('h3', null, 'Upload your proof'));
    s2.appendChild(make('p', 'pp-small', 'Take a screenshot of the PayPal confirmation. It should show the amount, the date and the transaction ID.'));

    refs.name = field(s2, 'Your name', null, 'Full name', 'name');
    refs.contact = field(s2, 'Your phone or email', 'so we can reply', '07.. or name@email.com', 'off');
    refs.txn = field(s2, 'PayPal transaction ID', 'optional', 'e.g. 5TY05013RG002845M', 'off');
    refs.extraWrap = make('div');
    s2.appendChild(refs.extraWrap);

    var fileBox = make('div', 'pp-file');
    refs.fileBox = fileBox;
    refs.attach = make('button', 'pp-attach', 'Choose screenshot');
    refs.attach.type = 'button';
    refs.thumb = make('img', 'pp-thumb');
    refs.thumb.alt = 'Your screenshot';
    refs.thumb.hidden = true;
    refs.fileName = make('span', 'pp-file-name', 'No screenshot yet');
    refs.clear = make('button', 'pp-file-clear', 'Remove');
    refs.clear.type = 'button';
    refs.clear.hidden = true;
    refs.fileInput = document.createElement('input');
    refs.fileInput.type = 'file';
    refs.fileInput.accept = 'image/*,application/pdf';
    refs.fileInput.tabIndex = -1;
    refs.fileInput.setAttribute('aria-label', 'Choose your payment screenshot');
    fileBox.appendChild(refs.attach);
    fileBox.appendChild(refs.thumb);
    fileBox.appendChild(refs.fileName);
    fileBox.appendChild(refs.clear);
    fileBox.appendChild(refs.fileInput);
    s2.appendChild(fileBox);

    // hidden trap field: real people never see or fill it
    refs.trap = document.createElement('input');
    refs.trap.type = 'text';
    refs.trap.name = 'website';
    refs.trap.tabIndex = -1;
    refs.trap.autocomplete = 'off';
    refs.trap.className = 'pp-offscreen';
    refs.trap.setAttribute('aria-hidden', 'true');
    s2.appendChild(refs.trap);

    refs.status = make('p', 'pp-status');
    refs.status.setAttribute('role', 'alert');
    s2.appendChild(refs.status);

    refs.send = make('button', 'pp-btn pp-btn-send', 'Send proof');
    refs.send.type = 'button';
    s2.appendChild(refs.send);

    steps.appendChild(s1);
    steps.appendChild(s2);
    refs.main.appendChild(summary);
    refs.main.appendChild(steps);

    // "sent" screen
    refs.done = make('div', 'pp-done-screen');
    refs.done.hidden = true;
    refs.done.appendChild(make('div', 'pp-tick', '\u2713'));
    refs.done.appendChild(make('h3', null, 'Proof sent'));
    refs.doneText = make('p');
    refs.done.appendChild(refs.doneText);
    refs.doneClose = make('button', 'pp-btn pp-btn-send', 'Done');
    refs.doneClose.type = 'button';
    refs.done.appendChild(refs.doneClose);

    modal.appendChild(refs.close);
    modal.appendChild(head);
    modal.appendChild(refs.main);
    modal.appendChild(refs.done);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    wire();
  }

  function amountText() { return fmt(current.amount * qty) + ' ' + current.currency; }

  function itemText() {
    return current.item + (current.hasQty ? ' (' + qty + (qty === 1 ? ' module)' : ' modules)') : '');
  }

  function refresh() {
    refs.item.textContent = current.item;
    refs.qtyOut.textContent = String(qty);
    refs.qtyBox.hidden = !current.hasQty;
    refs.minus.disabled = qty <= 1;
    refs.plus.disabled = qty >= current.maxQty;
    refs.totalStrong.textContent = amountText();
    refs.totalSmall.textContent = current.kes ? '(about ' + fmt(current.kes * qty) + ' KES)' : '';
    refs.payText.textContent = 'Send ' + amountText() + ' to this PayPal email address:';
  }

  function setStatus(msg) { refs.status.textContent = msg || ''; }

  function mark(input, bad) {
    if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  /* ---- screenshot: shrink it in the browser, then keep it as base64 ---- */

  function readBase64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () {
        var s = String(r.result);
        resolve({ type: blob.type, data: s.slice(s.indexOf(',') + 1), url: s });
      };
      r.onerror = function () { reject(new Error('read')); };
      r.readAsDataURL(blob);
    });
  }

  function shrink(f) {
    return createImageBitmap(f).then(function (bmp) {
      var scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * scale));
      c.height = Math.max(1, Math.round(bmp.height * scale));
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(bmp, 0, 0, c.width, c.height);
      if (bmp.close) bmp.close();
      return new Promise(function (resolve, reject) {
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('blob')); }, 'image/jpeg', 0.82);
      });
    });
  }

  function prepare(f) {
    if (f.type === 'application/pdf') {
      return f.size <= MAX_ORIGINAL ? readBase64(f) : Promise.reject(new Error('big'));
    }
    var plain = /^image\/(jpeg|png|webp)$/.test(f.type) && f.size <= MAX_ORIGINAL;
    var tryShrink = typeof createImageBitmap === 'function' ? shrink(f).then(readBase64) : Promise.reject(new Error('nobitmap'));
    return tryShrink.catch(function () {
      return plain ? readBase64(f) : Promise.reject(new Error('type'));
    });
  }

  function showProof() {
    refs.fileBox.classList.toggle('pp-has', !!proof);
    refs.clear.hidden = !proof;
    refs.attach.textContent = proof ? 'Change screenshot' : 'Choose screenshot';
    refs.thumb.hidden = !(proof && /^image\//.test(proof.type));
    if (proof && !refs.thumb.hidden) refs.thumb.src = proof.url; else refs.thumb.removeAttribute('src');
    refs.fileName.textContent = proof ? '\u2713 Screenshot attached' : 'No screenshot yet';
  }

  function clearProof() {
    proof = null;
    refs.fileInput.value = '';
    showProof();
  }

  /* ---- sending ---- */

  function validate() {
    var bad = null;
    mark(refs.name, false);
    mark(refs.contact, false);
    if (!refs.name.value.trim()) { mark(refs.name, true); bad = bad || refs.name; setStatus('Please type your name.'); }
    else if (!refs.contact.value.trim()) { mark(refs.contact, true); bad = refs.contact; setStatus('Please add your phone or email so we can reply.'); }
    else if (!proof) { bad = refs.attach; setStatus('Please choose your payment screenshot.'); }
    if (bad) { bad.focus(); return false; }
    return true;
  }

  function send() {
    if (busy) return;
    setStatus('');
    if (!validate()) return;
    busy = true;
    refs.send.disabled = true;
    refs.send.textContent = 'Sending\u2026';

    var body = {
      item: itemText(),
      amount: current.amount * qty,
      currency: current.currency,
      qty: qty,
      name: refs.name.value.trim(),
      contact: refs.contact.value.trim(),
      txn: refs.txn.value.trim(),
      extraLabel: current.extra,
      extra: refs.extraInput ? refs.extraInput.value.trim() : '',
      website: refs.trap.value,
      file: { type: proof.type, data: proof.data }
    };

    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) {
        if (r.ok) return success(body);
        var msg = 'We could not send your proof. Please try again.';
        if (r.status === 429) msg = 'Too many tries. Please wait a few minutes and try again.';
        else if (r.status === 413) msg = 'That screenshot is too large. Please choose a smaller one.';
        else if (r.status === 503) msg = 'Sending proof is not switched on yet. Please message us on WhatsApp: +254 791 360 805.';
        else if (r.status === 400) msg = 'Something is missing or the file is not an image or PDF. Please check and try again.';
        fail(msg);
      }, function () { fail('No internet connection. Please check it and try again.'); });
  }

  function fail(msg) {
    busy = false;
    refs.send.disabled = false;
    refs.send.textContent = 'Send proof';
    setStatus(msg);
  }

  function success(body) {
    busy = false;
    refs.main.hidden = true;
    refs.done.hidden = false;
    refs.doneText.textContent = 'Thank you, ' + body.name + '. We will check your payment and reply to ' + body.contact + '.';
    refs.doneClose.focus();
  }

  /* ---- wiring ---- */

  function wire() {
    refs.close.addEventListener('click', close);
    refs.doneClose.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    refs.minus.addEventListener('click', function () { if (qty > 1) { qty--; refresh(); } });
    refs.plus.addEventListener('click', function () { if (qty < current.maxQty) { qty++; refresh(); } });

    refs.copy.addEventListener('click', function () {
      var done = function () {
        refs.copy.textContent = 'Copied';
        refs.copy.classList.add('pp-copied');
        setTimeout(function () { refs.copy.textContent = 'Copy'; refs.copy.classList.remove('pp-copied'); }, 1800);
      };
      var fallback = function () {
        var t = document.createElement('textarea');
        t.value = PAYPAL_EMAIL;
        t.setAttribute('readonly', '');
        t.className = 'pp-offscreen';
        document.body.appendChild(t);
        t.select();
        try { if (document.execCommand('copy')) done(); } catch (e) { /* the address is selectable by hand */ }
        document.body.removeChild(t);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(PAYPAL_EMAIL).then(done, fallback);
      else fallback();
    });

    refs.attach.addEventListener('click', function () { refs.fileInput.click(); });
    refs.fileInput.addEventListener('change', function () {
      var f = refs.fileInput.files && refs.fileInput.files[0];
      if (!f) return;
      setStatus('');
      refs.fileName.textContent = 'Preparing\u2026';
      prepare(f).then(function (p) {
        proof = p;
        showProof();
      }, function (err) {
        clearProof();
        setStatus(err && err.message === 'big'
          ? 'That file is too large. Please choose a smaller screenshot.'
          : 'We could not read that file. Please choose a screenshot (JPG or PNG) or a PDF.');
      });
    });
    refs.clear.addEventListener('click', clearProof);

    refs.send.addEventListener('click', send);
  }

  function onKey(e) {
    if (!overlay || overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(
      modal.querySelectorAll('a[href], button, input, textarea'),
      function (n) { return !n.disabled && !n.hidden && n.tabIndex !== -1 && n.offsetParent !== null; }
    );
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open(trigger) {
    if (!overlay) build();
    var amt = parseFloat(trigger.getAttribute('data-pay-amount'));
    var maxQty = parseInt(trigger.getAttribute('data-pay-qty'), 10);
    var kes = parseFloat(trigger.getAttribute('data-pay-kes'));
    var hasQty = !isNaN(maxQty) && maxQty > 1;
    current = {
      item: trigger.getAttribute('data-pay-item') || 'Payment',
      amount: isNaN(amt) ? 0 : amt,
      currency: trigger.getAttribute('data-pay-currency') || 'USD',
      kes: isNaN(kes) ? 0 : kes,
      hasQty: hasQty,
      maxQty: hasQty ? maxQty : 1,
      extra: trigger.getAttribute('data-pay-extra') || ''
    };
    qty = 1;
    busy = false;
    refs.main.hidden = false;
    refs.done.hidden = true;
    refs.send.disabled = false;
    refs.send.textContent = 'Send proof';
    refs.txn.value = '';
    mark(refs.name, false);
    mark(refs.contact, false);
    setStatus('');
    clearProof();
    while (refs.extraWrap.firstChild) refs.extraWrap.removeChild(refs.extraWrap.firstChild);
    refs.extraInput = current.extra ? field(refs.extraWrap, current.extra, 'optional') : null;
    refresh();

    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('pp-lock');
    void overlay.offsetWidth;
    overlay.classList.add('pp-open');
    refs.name.focus({ preventScroll: true });
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('pp-open');
    overlay.hidden = true;
    document.documentElement.classList.remove('pp-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-pay]') : null;
    if (!t) return;
    e.preventDefault();
    open(t);
  });
})();

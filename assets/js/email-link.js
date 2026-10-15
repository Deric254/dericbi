/**
 * Email links. A mailto: link opens the visitor's mail app first (the normal behaviour, so an installed
 * app always wins). If nothing responds within a moment - typical on a computer with no mail app set up -
 * a small panel offers web mail (Gmail, Outlook, Yahoo) or copying the address. Nothing opens by itself,
 * so an app and a browser tab are never opened together.
 */
(function () {
  'use strict';

  var FALLBACK_DELAY_MS = 1600;
  var AUTO_HIDE_MS = 20000;
  var timer = null;
  var hideTimer = null;
  var panel = null;
  var previousFocus = null;

  function parse(href) {
    var match = /^mailto:([^?]+)(?:\?(.*))?$/i.exec(href || '');
    if (!match) return null;
    var params = new URLSearchParams(match[2] || '');
    return {
      to: decodeURIComponent(match[1]),
      subject: params.get('subject') || 'Enquiry from the dericBI website',
      body: params.get('body') || ''
    };
  }

  function close() {
    clearTimeout(timer);
    clearTimeout(hideTimer);
    document.removeEventListener('keydown', onKey);
    if (panel) {
      panel.remove();
      panel = null;
      if (previousFocus && previousFocus.focus) previousFocus.focus();
      previousFocus = null;
    }
  }

  function onKey(event) {
    if (event.key === 'Escape') close();
  }

  function make(tag, text, css) {
    var node = document.createElement(tag);
    if (text) node.textContent = text;
    if (css) node.style.cssText = css;
    return node;
  }

  function webMailLinks(d) {
    var q = encodeURIComponent;
    return [
      ['Open in Gmail', 'https://mail.google.com/mail/?view=cm&fs=1&to=' + q(d.to) + '&su=' + q(d.subject) + '&body=' + q(d.body)],
      ['Open in Outlook', 'https://outlook.live.com/mail/0/deeplink/compose?to=' + q(d.to) + '&subject=' + q(d.subject) + '&body=' + q(d.body)],
      ['Open in Yahoo Mail', 'https://compose.mail.yahoo.com/?to=' + q(d.to) + '&subject=' + q(d.subject) + '&body=' + q(d.body)]
    ];
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    var area = make('textarea', text, 'position:fixed;opacity:0;top:0;left:0;');
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    area.remove();
    done(ok);
  }

  function show(details) {
    close();
    previousFocus = document.activeElement;
    var buttonCss = 'display:block;box-sizing:border-box;width:100%;margin:.4rem 0 0;padding:.65rem .9rem;border-radius:.65rem;' +
      'border:2px solid #49A078;background:#fff;color:#2f6f55;font:600 .9rem system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
      'text-align:center;text-decoration:none;cursor:pointer;';

    panel = make('div', '', 'position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);width:min(92vw,24rem);z-index:2147483000;' +
      'box-sizing:border-box;padding:1rem;border-radius:1rem;background:#fff;color:#1f2937;box-shadow:0 12px 40px rgba(0,0,0,.25);' +
      'font:400 .9rem/1.45 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Send email another way');
    panel.tabIndex = -1;

    var closeButton = make('button', '\u00d7', 'position:absolute;top:.35rem;right:.6rem;border:0;background:none;font-size:1.5rem;line-height:1;color:#6b7280;cursor:pointer;');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', close);
    panel.appendChild(closeButton);

    panel.appendChild(make('strong', 'No email app opened?', 'display:block;font-size:1rem;margin-right:1.5rem;'));
    panel.appendChild(make('span', 'Send your message to ' + details.to + ' with web mail instead:', 'display:block;margin-top:.25rem;'));

    webMailLinks(details).forEach(function (item) {
      var link = make('a', item[0], buttonCss);
      link.href = item[1];
      link.rel = 'noopener noreferrer';
      panel.appendChild(link);
    });

    var copyButton = make('button', 'Copy email address', buttonCss + 'border-color:#d1d5db;color:#374151;');
    copyButton.type = 'button';
    var status = make('span', '', 'display:block;margin-top:.4rem;font-size:.8rem;color:#2f6f55;min-height:1em;');
    status.setAttribute('role', 'status');
    copyButton.addEventListener('click', function () {
      copyText(details.to, function (ok) { status.textContent = ok ? 'Copied ' + details.to : 'Copy failed - select the address above'; });
    });
    panel.appendChild(copyButton);
    panel.appendChild(status);

    document.body.appendChild(panel);
    document.addEventListener('keydown', onKey);
    panel.focus();
    hideTimer = setTimeout(close, AUTO_HIDE_MS);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href^="mailto:"]');
    if (!link) return;
    var details = parse(link.getAttribute('href'));
    if (!details) return;
    close();

    // A mail app taking over makes this page lose focus or become hidden. If that does not happen,
    // there is probably no mail app, so offer web mail. The mailto: itself is never blocked.
    var handled = false;
    var markHandled = function () { handled = true; };
    window.addEventListener('blur', markHandled, { once: true });
    window.addEventListener('pagehide', markHandled, { once: true });
    document.addEventListener('visibilitychange', markHandled, { once: true });
    timer = setTimeout(function () {
      window.removeEventListener('blur', markHandled);
      window.removeEventListener('pagehide', markHandled);
      document.removeEventListener('visibilitychange', markHandled);
      if (!handled && document.visibilityState === 'visible') show(details);
    }, FALLBACK_DELAY_MS);
  }, true);
})();

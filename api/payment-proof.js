'use strict';
/**
 * Payment proof: emails the learner's PayPal screenshot to the owner (through Gmail) as a real attachment.
 *
 *   POST /api/payment-proof   JSON body (see FIELDS below) -> 200 {ok:true}
 *
 * Environment variables (set in Vercel -> Project -> Settings -> Environment Variables):
 *   GMAIL_APP_PASSWORD  required. A Google "app password" for the sending Gmail account (spaces are ignored).
 *   GMAIL_USER          optional. The Gmail account that sends. Default: dericmarangu@gmail.com
 *   PROOF_TO            optional. Where proofs go. Default: the GMAIL_USER address (it emails itself)
 *
 * The browser shrinks screenshots before sending, so the body stays well under Vercel's 4.5 MB limit.
 */

const nodemailer = require('nodemailer');

const DEFAULT_USER = 'dericmarangu@gmail.com';
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MAX_SENDS = 5; // per IP ...
const WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes (best effort, per warm instance)
const MAX_TRACKED_IPS = 2000;

const sendLog = new Map(); // ip -> { count, first }

const FILE_TYPES = {
  'image/jpeg': { ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 },
  'image/png': { ext: 'png', magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  'image/webp': { ext: 'webp', magic: (b) => b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP' },
  'application/pdf': { ext: 'pdf', magic: (b) => b.slice(0, 4).toString() === '%PDF' },
};

/** Sends one email through Gmail's SMTP server. Kept in an object so tests can replace it. */
const mailer = {
  send(auth, message) {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    });
    return transport.sendMail(message);
  },
};

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', (chunk) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        reject(new Error('too_large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch (e) {
    return false;
  }
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function rateLimited(ip, now) {
  if (sendLog.size >= MAX_TRACKED_IPS) {
    for (const [key, entry] of sendLog) if (now - entry.first > WINDOW_MS) sendLog.delete(key);
    if (sendLog.size >= MAX_TRACKED_IPS) sendLog.clear();
  }
  const entry = sendLog.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    sendLog.set(ip, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_SENDS;
}

/** One-line, trimmed, length-limited text (keeps header-like fields free of line breaks). */
function line(value, max) {
  return String(value == null ? '' : value).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

function validate(data) {
  if (!data || typeof data !== 'object') return { error: 'bad_request' };
  const amount = Number(data.amount);
  const qty = Math.floor(Number(data.qty) || 1);
  const clean = {
    item: line(data.item, 120),
    amount,
    currency: line(data.currency, 3).toUpperCase() || 'USD',
    qty,
    name: line(data.name, 100),
    contact: line(data.contact, 120),
    txn: line(data.txn, 60),
    extraLabel: line(data.extraLabel, 40),
    extra: line(data.extra, 80),
  };
  if (!clean.item || !clean.name || !clean.contact) return { error: 'missing_fields' };
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) return { error: 'bad_amount' };
  if (qty < 1 || qty > 100) return { error: 'bad_amount' };

  const f = data.file;
  const type = f && FILE_TYPES[f.type];
  if (!type || typeof f.data !== 'string') return { error: 'bad_file' };
  const bytes = Buffer.from(f.data, 'base64');
  if (!bytes.length || bytes.length > MAX_FILE_BYTES) return { error: 'file_too_large' };
  if (!type.magic(bytes)) return { error: 'bad_file' };
  clean.file = { type: f.type, ext: type.ext, base64: bytes.toString('base64') };
  return { clean };
}

function emailText(c) {
  const lines = [
    'A learner says they have paid by PayPal.',
    '',
    'Item: ' + c.item,
    'Amount: ' + c.amount.toLocaleString('en-US') + ' ' + c.currency,
    'Name: ' + c.name,
    'Phone or email: ' + c.contact,
    'PayPal transaction ID: ' + (c.txn || '(not typed, see screenshot)'),
  ];
  if (c.extra) lines.push((c.extraLabel || 'Extra detail') + ': ' + c.extra);
  lines.push('', 'The payment screenshot is attached. Check it against your PayPal activity before you reply.');
  return lines.join('\n');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'method_not_allowed' });
  }
  if (!sameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  const pass = String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  const user = (process.env.GMAIL_USER || DEFAULT_USER).trim();
  if (!pass) return sendJson(res, 503, { error: 'not_configured' });

  if (rateLimited(clientIp(req), Date.now())) {
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
    return sendJson(res, 429, { error: 'too_many' });
  }

  let data;
  try {
    data = await readJsonBody(req);
  } catch (e) {
    if (e && e.message === 'too_large') {
      res.setHeader('Connection', 'close');
      res.on('finish', () => req.destroy());
      return sendJson(res, 413, { error: 'file_too_large' });
    }
    return sendJson(res, 400, { error: 'bad_request' });
  }

  if (data && data.website) return sendJson(res, 200, { ok: true }); // hidden field filled in: a bot, pretend success

  const { clean, error } = validate(data);
  if (error) return sendJson(res, error === 'file_too_large' ? 413 : 400, { error });

  const message = {
    from: '"DericBI Payments" <' + user + '>',
    to: (process.env.PROOF_TO || user).trim(),
    subject: 'PayPal proof: ' + clean.item + (clean.qty > 1 ? ' x' + clean.qty : '') + ' - ' + clean.amount.toLocaleString('en-US') + ' ' + clean.currency + ' - ' + clean.name,
    text: emailText(clean),
    attachments: [{ filename: 'payment-proof.' + clean.file.ext, content: Buffer.from(clean.file.base64, 'base64'), contentType: clean.file.type }],
  };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.contact)) message.replyTo = clean.contact;

  try {
    await mailer.send({ user, pass }, message);
    return sendJson(res, 200, { ok: true });
  } catch (e) {
    return sendJson(res, 502, { error: 'send_failed' });
  }
};

module.exports._internals = { sendLog, validate, mailer };

'use strict'
// Run with: npm test. The Gmail sender is replaced by a stub, nothing is emailed.
const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')

const handler = require('../api/payment-proof.js')
const { sendLog } = handler._internals

const { _internals } = handler
let sent = []
let sendFails = false
_internals.mailer.send = (auth, message) => {
  if (sendFails) return Promise.reject(new Error('smtp down'))
  sent.push({ auth, message })
  return Promise.resolve({})
}

let server, base
test.before(async () => {
  server = http.createServer((req, res) => handler(req, res))
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  base = 'http://127.0.0.1:' + server.address().port
})
test.after(() => server.close())
test.beforeEach(() => {
  process.env.GMAIL_APP_PASSWORD = 'abcd efgh ijkl mnop'
  delete process.env.GMAIL_USER
  delete process.env.PROOF_TO
  sent = []
  sendFails = false
  sendLog.clear()
})

const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]).toString('base64')
const good = () => ({
  item: 'Full Package (all 13 modules)', amount: 50, currency: 'USD', qty: 1,
  name: 'Jane Doe', contact: 'jane@example.com', txn: '5TY05013RG002845M',
  file: { type: 'image/jpeg', data: jpeg }
})
const post = (body, headers = {}) =>
  fetch(base + '/api/payment-proof', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) })

test('GET is refused', async () => {
  assert.equal((await fetch(base + '/api/payment-proof')).status, 405)
})

test('not configured -> 503 and nothing is sent', async () => {
  delete process.env.GMAIL_APP_PASSWORD
  assert.equal((await post(good())).status, 503)
  assert.equal(sent.length, 0)
})

test('a valid proof is emailed to the owner through Gmail with the screenshot attached', async () => {
  const res = await post(good())
  assert.equal(res.status, 200)
  assert.equal(sent.length, 1)
  const { auth, message: m } = sent[0]
  assert.deepEqual(auth, { user: 'dericmarangu@gmail.com', pass: 'abcdefghijklmnop' }) // spaces in the app password are ignored
  assert.equal(m.to, 'dericmarangu@gmail.com')
  assert.equal(m.replyTo, 'jane@example.com')
  assert.equal(m.attachments.length, 1)
  assert.equal(m.attachments[0].filename, 'payment-proof.jpg')
  assert.equal(m.attachments[0].contentType, 'image/jpeg')
  assert.equal(m.attachments[0].content.toString('base64'), jpeg)
  assert.match(m.text, /Jane Doe/)
  assert.match(m.text, /5TY05013RG002845M/)
})

test('GMAIL_USER and PROOF_TO can be changed', async () => {
  process.env.GMAIL_USER = 'sender@gmail.com'
  process.env.PROOF_TO = 'inbox@example.com'
  assert.equal((await post(good())).status, 200)
  assert.equal(sent[0].auth.user, 'sender@gmail.com')
  assert.equal(sent[0].message.to, 'inbox@example.com')
})

test('a phone number as contact is kept in the email but not used as reply_to', async () => {
  const b = good(); b.contact = '0791360805'
  assert.equal((await post(b)).status, 200)
  assert.equal(sent[0].message.replyTo, undefined)
  assert.match(sent[0].message.text, /0791360805/)
})

test('missing name or contact -> 400', async () => {
  const a = good(); a.name = ''
  const b = good(); b.contact = ''
  assert.equal((await post(a)).status, 400)
  assert.equal((await post(b)).status, 400)
  assert.equal(sent.length, 0)
})

test('a file that is not an image or PDF is refused, even if it claims to be one', async () => {
  const fake = good(); fake.file = { type: 'image/jpeg', data: Buffer.from('<script>alert(1)</script>').toString('base64') }
  const none = good(); delete none.file
  assert.equal((await post(fake)).status, 400)
  assert.equal((await post(none)).status, 400)
  assert.equal(sent.length, 0)
})

test('a file that is too large -> 413', async () => {
  const big = good(); big.file = { type: 'image/jpeg', data: Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(3.2 * 1024 * 1024)]).toString('base64') }
  assert.equal((await post(big)).status, 413)
  assert.equal(sent.length, 0)
})

test('the hidden trap field makes a bot look successful but sends nothing', async () => {
  const b = good(); b.website = 'http://spam.example'
  assert.equal((await post(b)).status, 200)
  assert.equal(sent.length, 0)
})

test('another site cannot post to it', async () => {
  assert.equal((await post(good(), { origin: 'https://evil.example' })).status, 403)
  assert.equal(sent.length, 0)
})

test('a Gmail failure -> 502', async () => {
  sendFails = true
  assert.equal((await post(good())).status, 502)
})

test('too many tries from one address -> 429', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await post(good())).status, 200)
  assert.equal((await post(good())).status, 429)
})

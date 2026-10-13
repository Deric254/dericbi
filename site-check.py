#!/usr/bin/env python3
"""
site-check.py - keep the dericBI site consistent, accurate and fresh before every push.

  python site-check.py               check only (changes nothing). Exit code 1 if a problem is found.
  python site-check.py --stamp       also fix cache versions: every local assets/js and assets/css file
                                     referenced by a page gets ?v=<content hash>, so visitors never keep an
                                     old copy (vercel.json caches those folders for a year).
  python site-check.py --build-css   rebuild assets/css/tailwind.css (do this after adding or changing any
                                     Tailwind class in a page or script; needs Node.js)
  python site-check.py --write-llms  also regenerate llms-full.txt (project index for AI assistants)
                                     from journey-data.json. Run this after adding projects.
  python site-check.py --build-css --stamp --write-llms      (the usual pre-push command)

Checks: project-count claims (all equal, and never more than journey-data.json really holds), one phone
number and one email everywhere, canonical + og:image on every page, JSON-LD parses, no static new-tab
links, no date of birth published, every sitemap URL exists, cache versions up to date.
Run it from the repository root. It only reads/writes .html, llms-full.txt and nothing else.
"""
import glob, hashlib, json, os, re, sys

ROOT = '.'
STAMP = '--stamp' in sys.argv
WRITE_LLMS = '--write-llms' in sys.argv
SITE = 'https://dericbi.vercel.app'
problems, notes = [], []

def read(p):
    with open(p, 'rb') as f:
        return f.read().decode('utf-8', 'ignore')

def text_files():
    out = [f for f in glob.glob('*.html')]
    out += glob.glob('assets/js/*.js') + glob.glob('api/*.js') + [f for f in ('llms.txt', 'llms-full.txt', 'humans.txt') if os.path.exists(f)]
    return sorted(out)

# ---- real data ----------------------------------------------------------------
data = json.load(open('journey-data.json', encoding='utf-8'))
actual = len(data)
notes.append(f'journey-data.json holds {actual} projects ({sum(1 for e in data if e.get("liveLink"))} with a live link).')

# ---- 1. project-count claims --------------------------------------------------
claims = {}
CLAIM = re.compile(r'\b(\d{2,4})\s?\+\s?(?:successful |completed |real[- ]world )?projects\b', re.I)
for f in text_files():
    if f == 'llms-full.txt':
        continue
    for m in CLAIM.finditer(read(f)):
        claims.setdefault(int(m.group(1)), set()).add(f)
if len(claims) > 1:
    problems.append('project-count claims disagree: ' + '; '.join(f'{n}+ in {sorted(fs)}' for n, fs in sorted(claims.items())))
for n, fs in claims.items():
    if n > actual:
        problems.append(f'"{n}+ projects" claimed in {sorted(fs)} but journey-data.json only has {actual}')

# ---- 2. contact details -------------------------------------------------------
phones, emails = {}, {}
for f in text_files():
    t = read(f)
    for m in re.finditer(r'\+?254[\s-]?7[\d\s-]{8,12}', t):
        phones.setdefault(re.sub(r'\D', '', m.group(0))[:12], set()).add(f)
    for m in re.finditer(r'[\w.\-]+@[\w\-]+\.[\w.]+', t):
        if not re.search(r'\.(png|jpg|jpeg|webp|svg|gif|js|css)$', m.group(0), re.I):
            emails.setdefault(m.group(0).lower(), set()).add(f)
if len(phones) > 1: problems.append(f'more than one phone number found: {sorted(phones)}')
if len(emails) > 1: problems.append(f'more than one email found: {sorted(emails)}')

# ---- 3. per-page SEO + safety -------------------------------------------------
for f in sorted(glob.glob('*.html')):
    if f == '404.html': continue   # not indexed, so no canonical/og tags
    t = read(f)
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', t)
    if not canon: problems.append(f'{f}: no canonical tag')
    elif not canon.group(1).startswith(SITE): problems.append(f'{f}: canonical not on {SITE}: {canon.group(1)}')
    og = re.search(r'<meta property="og:image" content="([^"]+)"', t)
    if og and og.group(1).startswith(SITE):
        if not os.path.exists(og.group(1)[len(SITE) + 1:]): problems.append(f'{f}: og:image file missing: {og.group(1)}')
    for i, m in enumerate(re.finditer(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', t, re.S)):
        try: json.loads(m.group(1))
        except Exception as e: problems.append(f'{f}: JSON-LD block {i + 1} is invalid ({str(e)[:50]})')
    if re.search(r'<a\b[^>]*\btarget=["\']_blank', t): problems.append(f'{f}: a link still opens a new tab (run same-tab-links.py)')

for f in text_files():
    if re.search(r'\bBorn\s+(?:on\s+)?\w+\s+\d{1,2},?\s+\d{4}', read(f)):
        problems.append(f'{f}: publishes a date of birth')

# ---- 3b. promises that contradict the Terms or the real data -------------------
BLOCKED = ['3-7 days', '100% satisfaction', 'satisfaction guarantee', 'zero risk', 'money back guarantee', 'guaranteed to save',
           '15+ countries', 'countries worldwide', 'global reach', '5.0 rating', '50+ happy', "kenya's #1 data analytics service", '#1 in nairobi', '98% repeat']
for f in text_files():
    low = read(f).lower()
    for phrase in BLOCKED:
        if phrase in low:
            problems.append(f'{f}: contains "{phrase}" (unsupported or contradicts the Terms/data - reword it)')
if os.path.exists('terms.html'):
    terms = read('terms.html').lower()
    for f in sorted(glob.glob('*.html')):
        if f != 'terms.html' and re.search(r'refund', read(f), re.I) and '48 hours' not in terms:
            problems.append(f'{f} mentions a refund but terms.html does not state the 48-hour refund condition')

# ---- 3c. page structure: H1, og:url, alt text, internal links, stylesheet ------------
SKIP_PREFIX = ('projects/', 'downloads/', 'assets/projects/')   # folders that may be absent from a trimmed copy
for f in sorted(glob.glob('*.html')):
    t = read(f)
    if len(re.findall(r'<h1\b', t)) != 1:
        problems.append(f'{f}: needs exactly one <h1> (found {len(re.findall(r"<h1" + chr(92) + "b", t))})')
    c = re.search(r'rel="canonical" href="([^"]+)"', t); o = re.search(r'property="og:url" content="([^"]+)"', t)
    if c and o and c.group(1) != o.group(1):
        problems.append(f'{f}: og:url ({o.group(1)}) differs from canonical ({c.group(1)})')
    for img in re.findall(r'<img\b[^>]*>', t, re.S):
        if not re.search(r'\balt=', img): problems.append(f'{f}: image without alt text: {img[:60]}')
    for href in set(re.findall(r'<a\b[^>]*\bhref="([^"#?]+\.html)', t)):
        if not href.startswith(('http', '//', 'mailto:', 'tel:')) and not href.startswith(SKIP_PREFIX) and not os.path.exists(href.lstrip('/')):
            problems.append(f'{f}: link to a page that does not exist: {href}')
    if f not in ('seo-tools.html', '404.html') and 'assets/css/tailwind.css' not in t:
        problems.append(f'{f}: does not load assets/css/tailwind.css')
    if 'cdn.tailwindcss.com' in t:
        problems.append(f'{f}: still loads the Tailwind CDN script (slow; use assets/css/tailwind.css)')

# ---- 3d. tailwind.css matches the classes used in the pages -------------------------
import shutil, subprocess, tempfile
BUILD_CSS = '--build-css' in sys.argv
def build_tailwind(out):
    npx = shutil.which('npx')
    if not npx or not os.path.exists('tailwind.config.js'): return None
    r = subprocess.run([npx, '--yes', 'tailwindcss@3.4.19', '-c', 'tailwind.config.js', '-i', 'assets/css/tailwind.input.css', '-o', out, '--minify'],
                       capture_output=True, text=True)
    return r.returncode == 0
if os.path.exists('assets/css/tailwind.css'):
    tmp = os.path.join(tempfile.gettempdir(), 'dericbi-tailwind-check.css')
    ok = build_tailwind('assets/css/tailwind.css' if BUILD_CSS else tmp)
    if ok is None: notes.append('Tailwind freshness check skipped (Node/npx not found).')
    elif not ok: notes.append('Tailwind freshness check skipped (the build could not run - offline?).')
    elif BUILD_CSS: notes.append('rebuilt assets/css/tailwind.css')
    elif open(tmp, 'rb').read().strip() != open('assets/css/tailwind.css', 'rb').read().strip():
        problems.append('assets/css/tailwind.css is out of date with the classes in your pages (run: python site-check.py --build-css)')
else:
    problems.append('assets/css/tailwind.css is missing (run: python site-check.py --build-css)')

# ---- 4. sitemap URLs exist ----------------------------------------------------
if os.path.exists('sitemap.xml'):
    for loc in re.findall(r'<loc>([^<]+)</loc>', read('sitemap.xml')):
        if loc.startswith(SITE):
            path = loc[len(SITE):].lstrip('/') or 'index.html'
            if not os.path.exists(path): problems.append(f'sitemap.xml lists a missing page: {loc}')

# ---- 5. cache versions --------------------------------------------------------
TAG = re.compile(r'<(?:script|link)\b[^>]*>', re.I)
REF = re.compile(r'((?:src|href)=")(assets/(?:js|css)/[^"?#]+)(\?v=[^"#]*)?(")')
stale = []
for f in sorted(glob.glob('*.html')):
    t = read(f)
    def fix(tag):
        def sub(m):
            path = m.group(2)
            if not os.path.exists(path): return m.group(0)
            want = '?v=' + hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]
            if (m.group(3) or '') != want: stale.append(f'{f}: {path}')
            return m.group(1) + path + want + m.group(4)
        return REF.sub(sub, tag.group(0))
    new = TAG.sub(fix, t)
    if STAMP and new != t:
        open(f, 'wb').write(new.encode('utf-8'))
if stale and not STAMP:
    problems.append(f'{len(stale)} script/style reference(s) have an out-of-date cache version (run with --stamp). Example: {stale[0]}')
elif stale:
    notes.append(f'stamped {len(stale)} script/style reference(s) with fresh cache versions.')

# ---- llms-full.txt ------------------------------------------------------------
def clean(s, n):
    s = re.sub(r'<[^>]*>', ' ', str(s or '')); s = re.sub(r'&[a-z#0-9]+;', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()[:n]
def build_llms():
    latest = max((e.get('date') or '' for e in data), default='')
    lines = ['# dericBI - full project index', '',
             '> Projects built by dericBI (Deric Marangu), a Kenyan data analytics business. Generated from the live project list; see https://dericbi.vercel.app/my-projects.html',
             '', f'Projects listed: {actual}. Most recent entry: {latest}.', '', '## Projects', '']
    for e in sorted(data, key=lambda x: x.get('date') or '', reverse=True):
        title = clean(e.get('title'), 120)
        if not title: continue
        live = e.get('liveLink') if isinstance(e.get('liveLink'), str) and e['liveLink'].startswith('https://') else ''
        meta = ', '.join(x for x in [clean(e.get('tools'), 60), (e.get('date') or '')[:4]] if x)
        lines.append(f'- {title}' + (f' ({meta})' if meta else '') + (f' - live: {live}' if live else '') + (f' - {clean(e.get("description"), 200)}' if e.get('description') else ''))
    return '\n'.join(lines) + '\n'
if WRITE_LLMS:
    open('llms-full.txt', 'w', encoding='utf-8', newline='\n').write(build_llms()); notes.append('wrote llms-full.txt')
elif os.path.exists('llms-full.txt') and read('llms-full.txt').replace('\r\n', '\n') != build_llms():
    problems.append('llms-full.txt is out of date with journey-data.json (run with --write-llms)')
elif not os.path.exists('llms-full.txt'):
    problems.append('llms-full.txt is missing (run with --write-llms)')

# ---- report -------------------------------------------------------------------
for n in notes: print('  ' + n)
if problems:
    print(f'\n{len(problems)} problem(s):'); [print('  X ' + p) for p in problems]; sys.exit(1)
print('\nAll checks passed.')

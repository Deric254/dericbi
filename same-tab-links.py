#!/usr/bin/env python3
"""
same-tab-links.py - make links open in the SAME tab instead of a new blank tab.

What it changes (and nothing else):
  * HTML/JS files:  removes   target="_blank"  /  target='_blank'  from tags
  * Same tags:      the now-pointless rel="noopener noreferrer" on those links is dropped
  * JS files:       window.open(URL, '_blank'[, 'noopener'])  ->  window.location.assign(URL)
                    link.target = '_blank'; / link.rel = 'noopener';  -> lines removed

What it never touches: href/src values, .json data files (journey-data.json etc.),
rel attributes, node_modules, .git, or any other file type. Line endings (CRLF/LF)
and file encoding are preserved byte-for-byte outside the edited spots.

Usage (from the repo root):
  python same-tab-links.py            # DRY RUN: shows what would change, writes nothing
  python same-tab-links.py --write    # applies the changes
  python same-tab-links.py path/to/folder --write
Safe to run repeatedly: a second run finds nothing left to change.
"""
import os, re, sys

SKIP_DIRS = {'.git', 'node_modules', '.vercel'}
EXTS = ('.html', '.htm', '.js')

ATTR   = re.compile(r'''[ \t]+target=(["'])_blank\1''')
TAG    = re.compile(r'<a\b[^>]*>', re.S)
RELDEAD = re.compile(r'''\s+rel=(["'])(?:noopener noreferrer|noreferrer noopener|noopener|noreferrer)\1''')
LNKREL = re.compile(r'''^[ \t]*link\.rel\s*=\s*['"]noopener['"];[ \t]*\r?\n''', re.M)
OPEN   = re.compile(r'''window\.open\(\s*(.+?)\s*,\s*['"]_blank['"](?:\s*,\s*['"][^'"]*['"])?\s*\)''')
LNKTGT = re.compile(r'''^[ \t]*link\.target\s*=\s*['"]_blank['"];[ \t]*\r?\n''', re.M)
HREFS  = re.compile(r'''\b(?:href|src)\s*=\s*(["'])(.*?)\1''', re.S)

def process(path):
    raw = open(path, 'rb').read()
    try:
        text = raw.decode('utf-8')
    except UnicodeDecodeError:
        return None
    def strip_tag(m):
        tag = m.group(0)
        if not ATTR.search(tag):
            return tag
        tag = ATTR.sub('', tag)
        return RELDEAD.sub('', tag, count=1)   # rel=noopener/noreferrer only matters with a new tab
    new, n1 = TAG.subn(strip_tag, text)
    n1 = len(ATTR.findall(text)) - len(ATTR.findall(new)) if n1 else 0
    new = ATTR.sub('', new)   # target attributes outside <a> tags (e.g. JS template strings)
    new, n2 = OPEN.subn(r'window.location.assign(\1)', new)
    new, n3 = LNKTGT.subn('', new)
    new = LNKREL.sub('', new)
    if new == text:
        return None
    # safety net: every href/src must be identical before and after
    if [m.group(2) for m in HREFS.finditer(text)] != [m.group(2) for m in HREFS.finditer(new)]:
        raise SystemExit(f'ABORT: href/src changed in {path} - nothing written')
    return text, new, (n1, n2, n3)

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    write = '--write' in sys.argv
    root = args[0] if args else '.'
    total = [0, 0, 0]; files = 0
    for d, dirs, names in os.walk(root):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for name in sorted(names):
            if not name.lower().endswith(EXTS):
                continue
            p = os.path.join(d, name)
            res = process(p)
            if not res:
                continue
            text, new, (a, b, c) = res
            files += 1
            for i, v in enumerate((a, b, c)): total[i] += v
            print(f'{"WRITE" if write else "WOULD CHANGE"}  {p}   target removed: {a}, window.open->same tab: {b}, link.target lines removed: {c}')
            if write:
                with open(p, 'wb') as f:
                    f.write(new.encode('utf-8'))
    print(f'\n{files} file(s), {total[0]} target attributes, {total[1]} window.open calls, {total[2]} link.target lines.'
          + ('' if write else '  (dry run - re-run with --write to apply)'))

if __name__ == '__main__':
    main()

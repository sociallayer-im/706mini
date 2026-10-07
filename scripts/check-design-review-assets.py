"""Check static local HTML/CSS references under the publish directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import re
root = Path(__file__).resolve().parents[1] / 'dist'
missing = []
checked = 0
class Parser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ('src', 'href') and value:
                urls.add(value)
for file in (root / 'design-review').rglob('*'):
    if file.suffix not in ('.html', '.css'):
        continue
    text = file.read_text()
    urls = set()
    if file.suffix == '.html':
        Parser().feed(text)
    urls.update(re.findall(r'url\([\"\']?([^\)\"\']+)', text))
    for url in urls:
        parsed = urlparse(url)
        if parsed.scheme or url.startswith(('#', '//')):
            continue
        target = root / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else file.parent / unquote(parsed.path)
        if target.is_dir():
            target = target / 'index.html'
        if not parsed.path:
            target = file
        checked += 1
        if not target.exists():
            missing.append((str(file.relative_to(root)), url))
for item in missing:
    print('MISSING:', *item)
print(f'{checked} local static references checked; {len(missing)} missing.')
raise SystemExit(bool(missing))

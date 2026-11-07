"""Rebuild the theme from the checked-in runtime, optionally refreshing a reference."""
import argparse
import json
from pathlib import Path
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'MemeSense' / 'dist'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--reference', type=Path, help='Optional BeautifyV2 dist folder to refresh the runtime from')
args = parser.parse_args()
if args.reference:
    shutil.copytree(args.reference, OUT, dirs_exist_ok=True)
if not (OUT / 'metadata.json').exists() and (ROOT / 'MemeSense.zip').exists():
    with zipfile.ZipFile(ROOT / 'MemeSense.zip') as archive:
        archive.extractall(OUT)
if not (OUT / 'metadata.json').exists():
    raise SystemExit('Missing bundled runtime. Restore MemeSense/dist or supply --reference PATH.')
metadata = json.loads((OUT / 'metadata.json').read_text())
metadata.update(id='memesense', name='MemeSense', version='1.0.1', authors=['MemeSense theme', 'asitnix (reference runtime)'])
metadata['colors'] = {'Accent': '#F32152', 'Tint': '#101112'}
(OUT / 'metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')
html = (OUT / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'\s*<link rel="stylesheet" href="\./assets/memesense\.css[^\"]*">', '', html)
html = re.sub(r'\s*<script defer src="\./assets/memesense\.js[^\"]*"></script>', '', html)
html = html.replace('<title>LiquidBounce UI</title>', '<title>MemeSense · LiquidBounce</title>')
html = html.replace('</head>', '  <link rel="stylesheet" href="./assets/memesense.css?v=1.0.1">\n  <script defer src="./assets/memesense.js?v=1.0.1"></script>\n</head>')
(OUT / 'index.html').write_text(html, encoding='utf-8')
for name in ['memesense.css', 'memesense.js']:
    shutil.copyfile(ROOT / 'src' / name, OUT / 'assets' / name)
with zipfile.ZipFile(ROOT / 'MemeSense.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(OUT.rglob('*')):
        if file.is_file():
            archive.write(file, file.relative_to(OUT))
print(f'Built {OUT} and MemeSense.zip')

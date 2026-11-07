"""Local-only preview with simulated modules; never connects to Minecraft."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import json

ROOT = Path(__file__).resolve().parent / 'MemeSense' / 'dist'
modules = [dict(name=name, category=category, enabled=enabled, description='Preview settings for ' + name, aliases=[], bind='None')
           for category, name, enabled in [('Combat', 'KillAura', True), ('Combat', 'AutoClicker', False), ('Combat', 'AimAssist', False), ('Player', 'AutoTool', True), ('Movement', 'Sprint', True), ('Render', 'ESP', False), ('Misc', 'AntiAFK', False), ('World', 'Scaffold', False), ('Client', 'ClickGUI', True)]]
def boolean(name, value):
    return dict(name=name, valueType='BOOLEAN', value=value)
def number(name, value, maximum, suffix=''):
    return dict(name=name, valueType='INT', value=value, range=dict(from_=0, to=maximum), suffix=suffix)
settings = {}
for module in modules:
    values = [boolean('Prefer head aim', True), boolean('Only visible', False), boolean('Auto block', True), boolean('Keep sprint', True), boolean('Ignore teammates', False), boolean('Draw target', True)]
    for name, value, maximum, suffix in [('Attack delay', 100, 500, 'ms'), ('Minimum range', 3, 6, 'blocks'), ('Field of view', 180, 360, '°'), ('Switch delay', 150, 1000, 'ms'), ('Minimum health', 4, 20, 'HP')]:
        item = number(name, value, maximum, suffix)
        item['range']['from'] = item['range'].pop('from_')
        values.append(item)
    settings[module['name']] = dict(name=module['name'], value=values)
settings['ClickGUI'] = dict(name='ClickGUI', value=[dict(name='Scale', valueType='FLOAT', value=1)])

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *args):
        pass
    def send_json(self, data):
        payload = json.dumps(data).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
    def do_GET(self):
        route = urlsplit(self.path)
        if not route.path.startswith('/api/v1/'):
            return super().do_GET()
        path = route.path.removeprefix('/api/v1/')
        if path == 'client/modules': data = modules
        elif path == 'client/modules/settings': data = settings.get(parse_qs(route.query).get('name', [''])[0], dict(value=[]))
        elif path == 'client/info': data = dict(os='Windows', version='Preview')
        elif path == 'client/window': data = dict(scaleFactor=2)
        elif path.startswith('client/theme/'): data = dict(colors=dict(accent=-843438, tint=-15724270))
        elif path == 'client/localStorage/all': data = dict(items=[])
        elif path == 'client/virtualScreen': data = dict(name='clickgui')
        elif path == 'client/global': data = dict(value=[])
        else: data = {}
        self.send_json(data)
    def do_POST(self):
        self.write_action()
    def do_PUT(self):
        self.write_action()
    def write_action(self):
        data = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))) or '{}')
        path = urlsplit(self.path)
        if path.path.endswith('/modules/toggle'):
            for module in modules:
                if module['name'] == data.get('name'): module['enabled'] = data['enabled']
        elif path.path.endswith('/modules/settings'):
            settings[parse_qs(path.query)['name'][0]] = data
        self.send_json({})

print('Preview: http://127.0.0.1:8765/#/clickgui?static', flush=True)
ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()

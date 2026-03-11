#!/usr/bin/env python3
"""
Hilyah Dev Server - Live Reload + LAN Access
"""

import os, sys, time, socket, hashlib, threading, mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

# Force UTF-8 output on Windows to avoid cp1256 encoding errors
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')


# ── Configuration ────────────────────────────────────────────────────────────
PORT         = 8080
WATCH_DIRS   = ['.']
WATCH_EXTS   = {'.html', '.css', '.js', '.json', '.ttf', '.png', '.jpg', '.svg', '.ico'}
POLL_INTERVAL = 0.8  # seconds between file-change checks

# ── Globals ───────────────────────────────────────────────────────────────────
_sse_clients = []          # list of (queue-like) response objects
_file_hashes = {}          # path → md5 hash
_reload_event = threading.Event()
_lock = threading.Lock()

# ── Live-reload client script (injected before </body>) ──────────────────────
LIVE_RELOAD_SCRIPT = b"""
<script>
(function(){
  var retry = 0;
  function connect(){
    var es = new EventSource('/__livereload_sse__');
    es.onmessage = function(e){
      if(e.data === 'reload'){
        console.log('[HilyahDev] Reloading...');
        location.reload(true);
      }
    };
    es.onerror = function(){
      es.close();
      retry = Math.min(retry + 1, 10);
      setTimeout(connect, retry * 500);
    };
    es.onopen = function(){ retry = 0; };
  }
  connect();
})();
</script>
</body>
"""

# ── Request Handler ───────────────────────────────────────────────────────────
class DevHandler(SimpleHTTPRequestHandler):

    def log_message(self, fmt, *args):
        # Cleaner logs — suppress SSE polling noise
        if '__livereload_sse__' not in (args[0] if args else ''):
            print(f"  {self.address_string()}  {fmt % args}")

    def do_GET(self):
        # SSE endpoint
        if self.path == '/__livereload_sse__':
            self._serve_sse()
            return
        super().do_GET()

    def end_headers(self):
        # Disable all caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma',        'no-cache')
        self.send_header('Expires',       '0')
        super().end_headers()

    def send_file_response(self, path):
        # Read file, inject live-reload into HTML
        try:
            with open(path, 'rb') as f:
                content = f.read()
            if path.endswith('.html'):
                content = content.replace(b'</body>', LIVE_RELOAD_SCRIPT)
            mime, _ = mimetypes.guess_type(path)
            self.send_response(200)
            self.send_header('Content-Type', mime or 'text/plain')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, str(e))

    def do_GET(self):
        if self.path == '/__livereload_sse__':
            self._serve_sse()
            return

        # Resolve path
        path = self.translate_path(self.path)

        # For SPA routing: serve index.html for unknown paths
        if not os.path.exists(path) or (os.path.isdir(path) and self.path not in ('/', '/index.html')):
            path = os.path.join(os.getcwd(), 'index.html')

        if os.path.isdir(path):
            path = os.path.join(path, 'index.html')

        if os.path.exists(path):
            self.send_file_response(path)
        else:
            self.send_error(404)

    def _serve_sse(self):
        self.send_response(200)
        self.send_header('Content-Type',  'text/event-stream')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Accel-Buffering', 'no')
        self.end_headers()

        # Keep connection alive; wait for reload signal
        client_event = threading.Event()
        with _lock:
            _sse_clients.append(client_event)
        try:
            self.wfile.write(b': connected\n\n')
            self.wfile.flush()
            while True:
                triggered = client_event.wait(timeout=25)
                if triggered:
                    self.wfile.write(b'data: reload\n\n')
                    self.wfile.flush()
                    client_event.clear()
                else:
                    # Heartbeat to keep connection alive
                    self.wfile.write(b': ping\n\n')
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass
        finally:
            with _lock:
                try: _sse_clients.remove(client_event)
                except ValueError: pass

# ── File Watcher ─────────────────────────────────────────────────────────────

def file_hash(path):
    try:
        with open(path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def build_hashes():
    hashes = {}
    for watch_dir in WATCH_DIRS:
        for root, dirs, files in os.walk(watch_dir):
            # Skip hidden dirs and __pycache__
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
            for fname in files:
                if Path(fname).suffix in WATCH_EXTS:
                    fpath = os.path.join(root, fname)
                    hashes[fpath] = file_hash(fpath)
    return hashes

def watcher_thread():
    global _file_hashes
    _file_hashes = build_hashes()
    print(f"  [WATCH] Watching {len(_file_hashes)} files for changes...\n")
    while True:
        time.sleep(POLL_INTERVAL)
        new_hashes = build_hashes()
        changed = [p for p, h in new_hashes.items() if _file_hashes.get(p) != h]
        changed += [p for p in _file_hashes if p not in new_hashes]
        if changed:
            for p in changed:
                rel = os.path.relpath(p)
                print(f"  [RELOAD] Changed: {rel}")
            _file_hashes = new_hashes
            # Notify all SSE clients
            with _lock:
                for client_event in _sse_clients:
                    client_event.set()


# ── Get LAN IP ────────────────────────────────────────────────────────────────

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    lan_ip = get_lan_ip()

    print()
    print("  +" + "-"*55 + "+")
    print("  |   Hilyah Dev Server  -  Live Reload + LAN Access    |")
    print("  +" + "-"*55 + "+")
    print(f"  |  PC  (this machine):   http://localhost:{PORT}              |")
    print(f"  |  Mobile (Wi-Fi):       http://{lan_ip}:{PORT}        |")
    print(f"  |  Live Reload:          ACTIVE                         |")
    print(f"  |  Press Ctrl+C to stop                                 |")
    print("  +" + "-"*55 + "+")
    print()


    # Start file watcher in background
    t = threading.Thread(target=watcher_thread, daemon=True)
    t.start()

    # Start HTTP server
    server = HTTPServer(('0.0.0.0', PORT), DevHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  ✋ Server stopped.")
        sys.exit(0)

if __name__ == '__main__':
    main()

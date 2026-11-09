"""Serve the public website locally with analytics disabled for preview."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRECTORIES = {
    "alcohol-unit-calculator", "assets", "blog", "de", "discover", "es",
    "fr", "id", "it", "ja", "pt", "science", "scripts", "shared",
}
PUBLIC_ROOT_FILES = {"CNAME", "robots.txt", "site.webmanifest", "sitemap.xml", "styles.css"}


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        super().end_headers()

    def public_path_allowed(self):
        path = unquote(urlsplit(self.path).path).lstrip("/")
        parts = Path(path).parts
        if any(part.startswith(".") or part == ".." for part in parts):
            return False
        return not path or path in PUBLIC_ROOT_FILES or (len(parts) == 1 and path.endswith(".html")) or bool(parts and parts[0] in PUBLIC_DIRECTORIES)

    def do_HEAD(self):
        if not self.public_path_allowed():
            self.send_error(404)
            return
        super().do_HEAD()

    def do_GET(self):
        if not self.public_path_allowed():
            self.send_error(404)
            return
        path = unquote(urlsplit(self.path).path).lstrip("/")
        if path == "scripts/analytics-config.js":
            payload = b"export const POSTHOG_CONFIG = Object.freeze({publicToken:'', apiHost:'https://eu.i.posthog.com'});\n"
            self.send_response(200)
            self.send_header("Content-Type", "text/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def list_directory(self, path):
        self.send_error(404)
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=0)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Local preview: http://127.0.0.1:{server.server_port}/", flush=True)
    server.serve_forever()

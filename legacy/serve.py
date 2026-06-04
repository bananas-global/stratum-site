#!/usr/bin/env python3
"""
Local dev server for the Stratum static site.

Behaves like `python3 -m http.server` but additionally:
- If the requested path doesn't match a file, tries appending `.html`.

This mirrors production clean URLs: /about → about/index.html,
/services/managed-it → services/managed-it.html, etc.

Usage: python3 serve.py [port]   (default port: 8000)
"""
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class HTMLFallbackHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        # If the path doesn't resolve to an existing file/dir, try adding .html
        if not os.path.exists(local) and not local.endswith(os.sep):
            html_candidate = local + ".html"
            if os.path.isfile(html_candidate):
                return html_candidate
            index_candidate = os.path.join(local, "index.html")
            if os.path.isfile(index_candidate):
                return index_candidate
        return local

    def send_error(self, code, message=None, explain=None):
        # Serve /404.html for 404s (mirrors typical production behavior)
        if code == 404:
            try:
                root = os.getcwd()
                custom_404 = os.path.join(root, "404.html")
                if os.path.isfile(custom_404):
                    self.send_response(404)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    with open(custom_404, "rb") as f:
                        body = f.read()
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
            except Exception:
                pass
        super().send_error(code, message, explain)


def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    addr = ("0.0.0.0", port)
    httpd = HTTPServer(addr, HTMLFallbackHandler)
    print(f"Serving on http://localhost:{port}/  (with .html extension fallback)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")


if __name__ == "__main__":
    main()

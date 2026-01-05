#!/usr/bin/env python3
"""
Development server with cache-busting headers
Prevents browser from caching CSS/JS files during development
"""
import http.server
import socketserver
import sys
from datetime import datetime

# Configuration
DEFAULT_PORT = 8000
HOST = "127.0.0.1"

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with cache-busting headers"""

    def end_headers(self):
        # Add cache control headers to prevent browser caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        """Custom log format with timestamp"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {args[0]} - {args[1]}")

def start_server(port=DEFAULT_PORT):
    """Start the development server with error handling"""
    try:
        # Allow address reuse to prevent "Address already in use" errors
        socketserver.TCPServer.allow_reuse_address = True

        with socketserver.TCPServer((HOST, port), NoCacheHTTPRequestHandler) as httpd:
            print(f"\n✓ Portfolio server running at http://localhost:{port}/")
            print(f"✓ Cache-busting enabled (no browser caching)")
            print(f"✓ Press Ctrl+C to stop\n")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n✓ Server stopped cleanly")
                return 0
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Address already in use
            print(f"\n✗ Port {port} is already in use")
            print(f"  Try a different port: python serve.py <port>")
            print(f"  Or stop the process using port {port}\n")
            return 1
        else:
            print(f"\n✗ Server error: {e}\n")
            return 1
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}\n")
        return 1

if __name__ == '__main__':
    # Allow custom port via command line argument
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    sys.exit(start_server(port))

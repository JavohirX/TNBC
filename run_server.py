import http.server
import socketserver
import webbrowser
import socket
import sys

PORT = 8080

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable caching for smooth local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    port = PORT
    while True:
        try:
            httpd = socketserver.TCPServer(("", port), Handler)
            break
        except OSError:
            port += 1

    local_ip = get_local_ip()
    local_url = f"http://localhost:{port}/player/"
    network_url = f"http://{local_ip}:{port}/player/"

    print("=" * 60)
    print("  The Nightmare Before Christmas - Mobile Web Player")
    print("=" * 60)
    print(f"  Local browser:   {local_url}")
    print(f"  Mobile phone:    {network_url}")
    print("=" * 60)
    print("  Press Ctrl+C to stop the server.\n")

    webbrowser.open(local_url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)

if __name__ == '__main__':
    main()

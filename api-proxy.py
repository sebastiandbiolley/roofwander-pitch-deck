#!/usr/bin/env python3
"""Tiny proxy that fetches Sharetribe user stats via the Integration API
and serves the static site from public 2/."""

import http.server
import json
import ssl
import urllib.request
import urllib.parse
from collections import Counter, defaultdict
from pathlib import Path

try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public 2"
ENV_FILE = ROOT / ".env"


def load_env():
    creds = {}
    if ENV_FILE.is_file():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            key, _, val = line.partition('=')
            creds[key.strip()] = val.strip().strip("';\"")
    return creds


ENV = load_env()
CLIENT_ID = ENV.get('CLIENT_ID', '')
CLIENT_SECRET = ENV.get('SHARETRIBE_CLIENT_SECRET', '')
BASE_URL = 'https://flex-api.sharetribe.com/v1'


def get_token():
    data = urllib.parse.urlencode({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'integ',
    }).encode()
    req = urllib.request.Request(BASE_URL + '/auth/token', data=data,
                                headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, context=SSL_CTX) as resp:
        return json.loads(resp.read())['access_token']


def fetch_user_stats():
    token = get_token()
    types = Counter()
    monthly = defaultdict(Counter)
    total = 0

    # Get total pages first
    req = urllib.request.Request(
        BASE_URL + '/integration_api/users/query?per_page=100&page=1',
        headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req, context=SSL_CTX) as resp:
        first = json.loads(resp.read())

    total_pages = first['meta']['totalPages']
    total_items = first['meta']['totalItems']

    # Process all pages
    pages_data = [first]
    for page in range(2, total_pages + 1):
        req = urllib.request.Request(
            BASE_URL + f'/integration_api/users/query?per_page=100&page={page}',
            headers={'Authorization': 'Bearer ' + token})
        with urllib.request.urlopen(req, context=SSL_CTX) as resp:
            pages_data.append(json.loads(resp.read()))

    for page_data in pages_data:
        for u in page_data['data']:
            total += 1
            ut = u['attributes']['profile'].get('publicData', {}).get('userType', 'unknown')
            types[ut] += 1
            created = u['attributes']['createdAt'][:7]  # YYYY-MM
            monthly[created][ut] += 1

    # Build monthly timeline sorted
    timeline = []
    for month in sorted(monthly):
        timeline.append({
            'month': month,
            'owner': monthly[month].get('owner', 0),
            'renter': monthly[month].get('renter', 0),
        })

    return {
        'totalUsers': total_items,
        'owners': types.get('owner', 0) + types.get('business', 0),
        'renters': types.get('renter', 0),
        'timeline': timeline,
    }


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC), **kwargs)

    def do_GET(self):
        if self.path == '/api/user-count':
            try:
                stats = fetch_user_stats()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(stats).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        super().do_GET()


if __name__ == '__main__':
    port = 3000
    print(f"Serving public 2/ on http://localhost:{port}")
    print(f"API endpoint: http://localhost:{port}/api/user-count")
    server = http.server.HTTPServer(('', port), Handler)
    server.serve_forever()

#!/usr/bin/env python3
"""Fetch Sharetribe user stats and write them to a static JSON file.

Reads credentials from environment variables (CI) or .env (local).
Writes output to public/data/user-stats.json so the static site can load it.

Usage:
    python scripts/fetch-sharetribe-stats.py
"""

import json
import os
import ssl
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = 'https://flex-api.sharetribe.com/v1'


def load_credentials():
    """Load credentials from env vars (CI) or .env file (local)."""
    client_id = os.environ.get('CLIENT_ID', '')
    client_secret = os.environ.get('SHARETRIBE_CLIENT_SECRET', '')

    if client_id and client_secret:
        return client_id, client_secret

    env_file = ROOT / '.env'
    if env_file.is_file():
        creds = {}
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            key, _, val = line.partition('=')
            creds[key.strip()] = val.strip().strip("';\"")
        return creds.get('CLIENT_ID', ''), creds.get('SHARETRIBE_CLIENT_SECRET', '')

    return '', ''


def get_token(client_id, client_secret):
    data = urllib.parse.urlencode({
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'client_credentials',
        'scope': 'integ',
    }).encode()
    req = urllib.request.Request(
        BASE_URL + '/auth/token', data=data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, context=SSL_CTX) as resp:
        return json.loads(resp.read())['access_token']


def fetch_user_stats(token):
    types = Counter()
    monthly = defaultdict(Counter)
    total = 0

    req = urllib.request.Request(
        BASE_URL + '/integration_api/users/query?per_page=100&page=1',
        headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req, context=SSL_CTX) as resp:
        first = json.loads(resp.read())

    total_pages = first['meta']['totalPages']
    total_items = first['meta']['totalItems']

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
            created = u['attributes']['createdAt'][:7]
            monthly[created][ut] += 1

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


def main():
    client_id, client_secret = load_credentials()
    if not client_id or not client_secret:
        raise SystemExit('Missing CLIENT_ID or SHARETRIBE_CLIENT_SECRET')

    print('Fetching Sharetribe token...')
    token = get_token(client_id, client_secret)

    print('Fetching user stats...')
    stats = fetch_user_stats(token)

    out_path = ROOT / 'public' / 'data' / 'user-stats.json'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(stats, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {out_path.relative_to(ROOT)} — {stats["totalUsers"]} users')


if __name__ == '__main__':
    main()

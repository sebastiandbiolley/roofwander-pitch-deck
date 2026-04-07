#!/usr/bin/env python3
"""Fetch Sharetribe + PostHog stats and write them to a static JSON file.

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
        _load_env_file(env_file)
        return (os.environ.get('CLIENT_ID', ''),
                os.environ.get('SHARETRIBE_CLIENT_SECRET', ''))

    return '', ''


def _load_env_file(env_file):
    """Load .env file into os.environ (only sets keys not already set)."""
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        key, _, val = line.partition('=')
        key = key.strip()
        val = val.strip().strip("';\"")
        if key not in os.environ:
            os.environ[key] = val


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


def _paginate(token, endpoint):
    """Fetch all pages from a Sharetribe Integration API query endpoint."""
    url = BASE_URL + endpoint + ('&' if '?' in endpoint else '?') + 'per_page=100&page=1'
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req, context=SSL_CTX) as resp:
        first = json.loads(resp.read())

    pages_data = [first]
    total_pages = first['meta']['totalPages']
    for page in range(2, total_pages + 1):
        purl = BASE_URL + endpoint + ('&' if '?' in endpoint else '?') + f'per_page=100&page={page}'
        req = urllib.request.Request(purl, headers={'Authorization': 'Bearer ' + token})
        with urllib.request.urlopen(req, context=SSL_CTX) as resp:
            pages_data.append(json.loads(resp.read()))

    return pages_data, first['meta']['totalItems']


def fetch_user_stats(token):
    types = Counter()
    monthly = defaultdict(Counter)
    total = 0

    pages_data, total_items = _paginate(token, '/integration_api/users/query')

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


def fetch_listing_stats(token):
    """Count published (active) listings."""
    pages_data, _ = _paginate(token, '/integration_api/listings/query')
    published = 0
    for page_data in pages_data:
        for listing in page_data['data']:
            if listing['attributes'].get('state') == 'published':
                published += 1
    return {'activeListings': published}


def fetch_transaction_stats(token):
    """Fetch transactions → accepted count + review stats."""
    pages_data, _ = _paginate(
        token, '/integration_api/transactions/query?include=reviews,customer,provider,listing')

    # Build lookup for included resources keyed by (type, id)
    included = {}
    for page_data in pages_data:
        for inc in page_data.get('included', []):
            included[(inc['type'], inc['id'])] = inc

    accepted_count = 0
    all_reviews = []
    rating_sum = 0
    rating_count = 0

    for page_data in pages_data:
        for tx in page_data['data']:
            # Count accepted transactions
            transitions = tx['attributes'].get('transitions', [])
            if any(t['transition'] == 'transition/accept' for t in transitions):
                accepted_count += 1

            # Extract reviews
            review_refs = tx.get('relationships', {}).get('reviews', {}).get('data', [])
            if not review_refs:
                continue

            prov_id = tx['relationships']['provider']['data']['id']
            cust_id = tx['relationships']['customer']['data']['id']
            list_id = tx['relationships']['listing']['data']['id']

            prov = included.get(('user', prov_id), {})
            cust = included.get(('user', cust_id), {})
            listing = included.get(('listing', list_id), {})
            listing_title = listing.get('attributes', {}).get('title', '')

            for rref in review_refs:
                review = included.get(('review', rref['id']), {})
                if not review:
                    continue
                attrs = review.get('attributes', {})
                if attrs.get('state') != 'public':
                    continue

                rating = attrs.get('rating', 0)
                if rating:
                    rating_sum += rating
                    rating_count += 1

                # ofProvider → author is the customer; ofCustomer → author is the provider
                if attrs.get('type') == 'ofProvider':
                    author = cust
                else:
                    author = prov
                display_name = author.get('attributes', {}).get('profile', {}).get('displayName', '')

                all_reviews.append({
                    'rating': rating,
                    'content': attrs.get('content', ''),
                    'author': display_name,
                    'listing': listing_title,
                    'date': attrs.get('createdAt', '')[:10],
                })

    # Highest rating first, then newest first
    all_reviews.sort(key=lambda rv: (-rv['rating'], rv['date']), reverse=True)

    # Keep top 5 that have content and rating >= 4
    best = [rv for rv in all_reviews if rv['content'] and rv['rating'] >= 4][:5]

    avg_rating = round(rating_sum / rating_count, 1) if rating_count else 0

    return {
        'acceptedTransactions': accepted_count,
        'totalReviews': len(all_reviews),
        'averageRating': avg_rating,
        'bestReviews': best,
    }


def fetch_posthog_stats():
    """Fetch pageview stats from PostHog API."""
    api_key = os.environ.get('POSTHOG_API_KEY', '')
    project_id = os.environ.get('POSTHOG_PROJECT_ID', '')
    if not api_key or not project_id:
        print('  Skipping PostHog (no POSTHOG_API_KEY or POSTHOG_PROJECT_ID)')
        return {}

    host = 'https://eu.posthog.com'
    url = f'{host}/api/projects/{project_id}/query/'
    headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}

    def _query(q):
        body = json.dumps({'query': q}).encode()
        req = urllib.request.Request(url, data=body, headers=headers)
        with urllib.request.urlopen(req, context=SSL_CTX) as resp:
            return json.loads(resp.read())

    # Total unique visitors
    r1 = _query({
        'kind': 'HogQLQuery',
        'query': "SELECT count(distinct person_id) FROM events WHERE event = '$pageview'",
    })
    total_unique = r1['results'][0][0] if r1.get('results') else 0

    # Weekly breakdown via HogQL
    r2 = _query({
        'kind': 'HogQLQuery',
        'query': (
            "SELECT toStartOfWeek(timestamp, 1) as week, "
            "count(distinct person_id) as unique_visitors "
            "FROM events "
            "WHERE event = '$pageview' "
            "GROUP BY week ORDER BY week"
        ),
    })
    weekly = []
    for row in r2.get('results', []):
        weekly.append({
            'week': row[0][:10],
            'uniqueVisitors': row[1],
        })

    # Channel breakdown via PostHog Web Analytics API (matches PostHog UI exactly)
    r3 = _query({
        'kind': 'WebStatsTableQuery',
        'properties': [],
        'breakdownBy': 'InitialChannelType',
        'dateRange': {'date_from': 'all'},
    })

    channel_list = []
    for row in r3.get('results', []):
        channel_list.append({
            'channel': row[0],
            'visitors': int(row[1][0]),
            'views': int(row[2][0]),
        })
    channel_list.sort(key=lambda c: -c['visitors'])

    return {
        'uniqueVisitors': total_unique,
        'weeklyTraffic': weekly,
        'channels': channel_list,
    }


def main():
    client_id, client_secret = load_credentials()
    if not client_id or not client_secret:
        raise SystemExit('Missing CLIENT_ID or SHARETRIBE_CLIENT_SECRET')

    print('Fetching Sharetribe token...')
    token = get_token(client_id, client_secret)

    print('Fetching user stats...')
    stats = fetch_user_stats(token)

    print('Fetching listing stats...')
    stats.update(fetch_listing_stats(token))

    print('Fetching transaction & review stats...')
    stats.update(fetch_transaction_stats(token))

    print('Fetching PostHog stats...')
    stats.update(fetch_posthog_stats())

    out_path = ROOT / 'public' / 'data' / 'user-stats.json'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(stats, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {out_path.relative_to(ROOT)} — {stats["totalUsers"]} users, '
          f'{stats["activeListings"]} active listings, '
          f'{stats["acceptedTransactions"]} accepted transactions, '
          f'{stats["totalReviews"]} reviews, '
          f'{stats.get("uniqueVisitors", 0)} unique visitors')


if __name__ == '__main__':
    main()

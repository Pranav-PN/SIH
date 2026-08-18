import json
import sys
import urllib.request

BASE = 'http://127.0.0.1:8003'


def fetch(path: str, method: str = 'GET', data: bytes | None = None):
    req = urllib.request.Request(BASE + path, data=data, method=method)
    if data is not None:
        req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode('utf-8')
        return resp.status, json.loads(body)


def main():
    checks = [
        ('/health', 'GET', None),
        ('/api/dashboard', 'GET', None),
        ('/api/reality-check', 'POST', b'{}'),
        ('/api/blind-spots', 'GET', None),
        ('/api/investigations', 'GET', None),
        ('/api/investigations/inv-1', 'GET', None),
        ('/api/evidence', 'GET', None),
        ('/api/impact-tracker', 'GET', None),
    ]

    results = []
    for path, method, payload in checks:
        try:
            status, body = fetch(path, method, payload)
            results.append((path, status, type(body).__name__, list(body.keys())[:5] if isinstance(body, dict) else len(body)))
        except Exception as exc:
            print(f'FAIL {path}: {exc}')
            return 1

    for path, status, kind, info in results:
        print(f'{path} -> {status} {kind} {info}')

    return 0


if __name__ == '__main__':
    sys.exit(main())

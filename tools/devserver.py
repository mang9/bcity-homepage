#!/usr/bin/env python3
"""로컬 개발 서버 — `python3 -m http.server` 와 같지만 **HTML 을 캐시하지 않는다.**

왜 필요한가
  `http.server` 는 `Last-Modified` 만 보내고 `Cache-Control` 을 보내지 않는다.
  그러면 브라우저가 휴리스틱 캐싱(보통 마지막 수정 이후 경과 시간의 10%)을 적용해
  **디스크가 바뀌어도 옛 HTML 을 그대로 보여 준다.**

  2026-08-18 에 실제로 사고가 났다 — 커밋 직전 배포 빌드(샘플 제외)를 잠깐 돌린 사이
  브라우저가 **빈 홍보센터 목록을 캐시에 잡았고**, 이후 샘플을 되살려도 화면은 계속
  비어 있었다. 사용자는 "샘플이 또 다 사라졌다"고 봤지만 서버는 정상이었다.

  HTML·JSON 은 `no-store`, 나머지 자산(영상·이미지·폰트)은 기존대로 둔다 —
  자산까지 끄면 78MB 영상을 매번 다시 받는다.

쓰는 곳
  `.claude/launch.json` 의 `bcity-homepage` 항목. `.claude/` 는 gitignore·rsync 제외라
  미러 전용이며, 이 파일 자체는 저장소에 있어 원본에서도 같은 명령을 쓸 수 있다.

  python3 tools/devserver.py 8893 /Users/lyj/bcity-homepage
"""
import os
import posixpath
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

NO_STORE = ('.html', '.json', '.webmanifest')


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?', 1)[0]
        if path.endswith('/') or path.endswith(NO_STORE):
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    # ── 404 를 우리 `404.html` 로 내준다 (2026-09-08) ─────────────────────
    #  왜: `http.server` 기본 404 는 텍스트 한 줄이라 **404 페이지를 로컬에서 확인할 수
    #  없었다.** GitHub Pages 는 루트의 `404.html` 을 자동으로 쓰고 nginx 는
    #  `error_page 404 /404.html;` 로 같은 동작을 하므로, 로컬도 그렇게 맞춘다.
    #
    #  ⚠ 요청 경로에서 **위로 올라가며** 찾는다. 서버 루트가 저장소일 때(`/a/b/c` →
    #    `/404.html`)와 GitHub Pages 구조를 흉내낼 때(`/bcity-homepage/a/b` →
    #    `/bcity-homepage/404.html`) 양쪽이 같은 코드로 처리된다.
    #  ⚠ 상태코드는 **404 를 유지한다.** 200 으로 바꾸면 실제 서버의 소프트 404 문제를
    #    로컬에서 재현하지 못한다(HANDOFF §10.12).
    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)

        rel = unquote(self.path.split('?', 1)[0].split('#', 1)[0])
        parts = [p for p in posixpath.normpath(rel).split('/') if p and p != '..']
        root = self.directory
        # 요청 경로의 디렉터리부터 루트까지 훑는다
        for i in range(len(parts), -1, -1):
            cand = os.path.join(root, *parts[:i], '404.html')
            if os.path.isfile(cand):
                with open(cand, 'rb') as f:
                    body = f.read()
                self.send_response(404, message)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                if self.command != 'HEAD':
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):          # 404 만 남긴다 — 200 로그는 소음이다
        if args and str(args[1]).startswith(('4', '5')):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8893
    root = sys.argv[2] if len(sys.argv) > 2 else '.'
    srv = ThreadingHTTPServer(('', port), partial(Handler, directory=root))
    print(f'  개발 서버 http://localhost:{port}  ({root})')
    print('  HTML·JSON 은 no-store — 디스크가 곧 화면이다')
    srv.serve_forever()


if __name__ == '__main__':
    main()

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
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

NO_STORE = ('.html', '.json', '.webmanifest')


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?', 1)[0]
        if path.endswith('/') or path.endswith(NO_STORE):
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

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

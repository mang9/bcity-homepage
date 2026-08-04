# assets/vendor — 오프라인 시연용 로컬 사본

외부 네트워크 없이 페이지가 완전히 동작하도록 CDN 의존성을 내려받아 둔 것이다.
`index.html` 의 `<head>` 가 이 파일들을 직접 참조한다.

| 파일 | 원본 출처 |
|---|---|
| `tailwind-browser-4.js` | `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4` |
| `paperlogy/Paperlogy-{6SemiBold,7Bold,8ExtraBold}.woff2` | `https://cdn.jsdelivr.net/gh/fonts-archive/Paperlogy/` |
| `paperlogy/paperlogy.local.css` | 위 CDN 의 `Paperlogy.css` 에서 **사용 굵기 3종만** 남기고 `src` 를 로컬 woff2 로 교체 |
| `pretendard/Pretendard-{Regular,Medium,SemiBold,Bold,ExtraBold}.woff2` | `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/` |
| `pretendard/pretendard.local.css` | 위 CDN 의 `pretendard.min.css` 에서 **사용 굵기 5종만** 남기고 `src` 를 로컬 woff2 로 교체 |
| `inter/*.woff2` | `https://fonts.gstatic.com/...` (Google Fonts) |
| `inter/inter.local.css` | `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap` 의 `gstatic` URL 을 로컬 파일명으로 교체 |

## Paperlogy — 3종만 받은 이유

원본 CSS 는 9종(100~900) × woff2/woff/otf/ttf 를 모두 선언하지만, `--font-display` 를 쓰는
규칙을 전수 조사한 결과 이 페이지가 쓰는 굵기는 **600 / 700 / 800** 세 개뿐이다.

| 굵기 | 쓰이는 곳 |
|---|---|
| 600 | `.cn-hub-txt span` (AI Living Lab 허브의 B-CITY) |
| 700 | 대부분 — 히어로 H1, 섹션 제목, `.lo-title`, `.ov-title`, `.za-name`, `.lo-pill b` 등 |
| 800 | `.cn-hub-txt b` / `i` (허브의 AI · Living Lab) |

woff2 는 굵기당 약 160KB 다(Pretendard 는 750KB — Paperlogy 파일이 이미 서브셋이다).
글리프 커버리지는 페이지가 실제로 쓰는 195자 전부 확인했다(누락 0).

## 굵기를 5종만 받은 이유

Pretendard 는 한글 글리프 때문에 woff2 한 벌이 약 750KB다. 9종 전부 받으면 약 7MB인데
페이지가 실제로 쓰는 것은 400/500/600/700/800 다섯 개뿐이라 그만 받았다(3.7MB).

`font-weight` 를 새로 쓰면(예: `font-black` = 900) 해당 굵기 woff2 를 추가로 내려받고
`pretendard.local.css` 에 `@font-face` 를 넣어야 한다. 넣지 않으면 브라우저가
가진 굵기를 합성해 렌더하므로 글자가 뭉개져 보인다.

## 갱신 방법

Tailwind 나 폰트 버전을 올릴 때는 위 URL 에서 다시 받아 같은 파일명으로 덮어쓴다.
`pretendard.local.css` / `inter.local.css` 는 `src` 경로가 로컬로 바뀐 파일이므로
CDN 원본으로 그대로 덮어쓰면 안 된다.

## 오프라인에서 여전히 동작하지 않는 것

- **문의하기 폼 전송** — `https://api.b-city.kr/inquiry` 로 POST 한다. 오프라인에서는
  전송이 실패하고 폼에 오류 메시지가 표시된다. 입력·검증·모달 동작 자체는 정상이다.
- **푸터의 YouTube / LinkedIn 링크** — 외부 사이트라 클릭하면 열리지 않는다.

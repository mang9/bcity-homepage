# 콘텐츠 데이터 (CLAUDE.md §11.3)

홍보센터 목록은 **화면에 하드코딩하지 않고 이 폴더의 JSON 에서 읽는다.**
`tools/build/pages.mjs` 의 `loadContent(kind)` 하나만 거치므로, 나중에 API 로 바꿀 때
그 함수 내부만 교체하면 된다(호출부·템플릿은 그대로).

## 공통 필드 — 다섯 파일 모두 동일

| 필드 | 필수 | 뜻 |
|---|---|---|
| `id` | O | 고유 ID. 한 번 정하면 바꾸지 않는다(앵커·통계가 물릴 수 있다) |
| `title` | O | 제목 |
| `date` | O | `YYYY-MM-DD`. 정렬 2순위이자 화면 표기 |
| `visible` | O | `false` 면 빌드에서 제외된다. **지우지 말고 이걸 내려라** |
| `order` | O | 정렬 1순위. 작을수록 위. 같으면 `date` 내림차순 |
| `summary` | | 한 줄 요약. 목록형(공지·언론)에서 제목 아래 보조로 쓴다 |
| `image` | | 썸네일 경로(`assets/...`). 카드형에서 쓰며 없으면 자리표시가 나온다 |

## 종류별 추가 필드

| 파일 | 추가 필드 |
|---|---|
| `notice.json` (공지사항) | — |
| `press.json` (언론보도) | `outlet` 매체명 · `url` 원문 링크(새 창) |
| `video.json` (홍보영상) | `url` 영상 링크(새 창) · `duration` 재생시간 |
| `gallery.json` (갤러리) | `category` — `event` \| `site` \| `render` \| `etc` (필터 탭 키) |
| `publication.json` (발행물) | `kind` — `catalog` \| `im` · `file` 다운로드 경로 · `url` 새 창 링크 |

## 지금 상태

**항목이 하나도 없다.** 확정 콘텐츠를 받지 못해서 각 파일에 스키마를 보여주는
예시 1건을 `visible: false` 로 넣어 뒀다 — 화면에는 "등록된 게시물이 없습니다"가 나온다.
콘텐츠가 오면 예시를 고쳐 `visible: true` 로 올리거나 항목을 추가하고 `npm run build:pages`.

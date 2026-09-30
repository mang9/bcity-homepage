# 홍보센터 → News & Media (5쪽)

목록 UI 문자열(`No posts yet.` · `Back to list` 등)은 **`_shell.md` 의 「빌더 UI 문자열」**
에 모여 있다. 여기서는 **페이지마다 다른 카피**만 다룬다.

---

## 01 공지사항 → Notices (`notice.html`)

| 한국어 | English |
|---|---|
| `NOTICE` / 공지사항 | `NOTICE`S |
| B-CITY의 **새로운 소식**을 전해드립니다 | **What’s new** at B-CITY |

> ⚠ 「전해드립니다」를 살리지 않았다. `We share the latest news from B-CITY` 는
> **57자**로 `.h2` 63자 예산에는 들어가지만, 목록 페이지 제목이 문장이 되면
> 아래 목록보다 무거워진다. 다른 네 쪽의 제목이 모두 명사구이므로 어법을 맞췄다.
> ⚠ `<em>` 은 **`What's new`** 에 걸린다 — 한국어에서 강조된 「새로운 소식」과 같은 자리다.

## 02 언론보도 → Press (`press.html`)

| 한국어 | English |
|---|---|
| `PRESS` / 언론보도 | `MEDIA COVERAGE` |
| 언론이 주목한 **B-CITY** | **B-CITY** in the news |

> ⚠ 어순이 뒤집혔다. `B-CITY, noticed by the press` 는 영어에서 어색하고
> `The press on B-CITY` 는 논평집처럼 읽힌다. `in the news` 가 보도 모음의 관용이다.
> ⚠ `<em>` 이 문장 **맨 앞**으로 옮겨진다 — 한국어에서는 맨 뒤였다.
> 강조 스타일(민트 띠)이 줄 시작에 오는 것은 `.h2 em` 에 문제가 없다(실측 필요 없음 —
> 인라인 배경이라 위치와 무관).

## 03 홍보영상 → Videos (`video.html`)

| 한국어 | English |
|---|---|
| `VIDEO` / 홍보영상 | `VIDEO`S |
| 영상으로 만나는 **B-CITY** | **B-CITY** on film |

> ⚠ `Meet B-CITY on video` 로 직역하면 화상 통화로 읽힌다.
> `on film` 은 영상물 모음을 가리키는 관용이고 짧다(15자).
> 대안으로 `B-CITY in motion` 도 검토했으나 모션그래픽 쪽 함의가 강하다.
> ⚠ 메뉴 이름은 **`Videos`** 다(복수). 제목의 `on film` 과 다른 말이지만,
> 메뉴는 무엇이 있는지 알려야 하고 제목은 그 성격을 말한다.

## 04 갤러리 → Gallery (`gallery.html`)

| 한국어 | English |
|---|---|
| `GALLERY` / 갤러리 | `GALLERY` |
| 조감도와 현장으로 보는 **B-CITY** | **B-CITY** in renderings and on site |

> ⚠ 「조감도」는 이 사이트에서 **완성 예상 이미지**를 뜻한다 → `renderings`.
> `bird's-eye view` 는 시점을 가리키는 말이라 분류 이름으로 쓸 수 없다
> (`GLOSSARY.md` §4). 「현장」은 `on site` — 분류 탭의 `On site` 와 같은 말로 맞췄다.
> ⚠ 제목이 분류 탭 이름(`Events` / `On site` / `Renderings` / `Other`)과 겹치는데,
> **의도한 것이다** — 제목이 탭의 예고가 된다.
> ⚠ 34자로 다섯 쪽 중 가장 길다. `.h2` 63자 예산 안이라 한 줄이다.

## 05 발행물 → Publications (`publication.html`)

| 한국어 | English |
|---|---|
| `PUBLICATION` / 발행물 | `PUBLICATION`S |
| 카달로그와 **사업 소개 자료** | Catalogs and **project materials** |

> ⚠ 「사업 소개 자료」를 `project materials` 로 옮겼다. `business introduction materials` 는
> 직역이고 영어에서 뜻이 흐리다. 실제 내용은 IM · 브로슈어 · 리포트 · 카달로그이므로
> 「사업(=이 개발사업)에 관한 자료」가 맞다.
> ⚠ **`Catalogs`** — 미국식 철자(`GLOSSARY.md` §10). 분류 배지의 `Catalog` 와 같은 말이다.
> ⚠ 아이브로우 `PUBLICATION` 은 소스 그대로 **단수**다. 메뉴는 `Publications` 다 —
> 아이브로우는 라벨(구역 이름), 메뉴는 목록 이름이라 수가 달라도 어긋나지 않는다.
> 통일하고 싶으면 **아이브로우를 복수로** 바꾼다(한국어 쪽도 함께 봐야 한다).

---

## 상세 페이지 (`notice-<id>.html` · `press-<id>.html`)

제목 · 본문 · 요약은 **콘텐츠**이므로 여기서 번역하지 않는다
(`src/sub/data/*.json` 이 정본 · 실제 게시물이 들어오면 영문 필드가 필요하다).
셸이 만드는 문자열만 옮긴다.

| 한국어 | English |
|---|---|
| `{{postTitle}} · 공지사항 · B-CITY 춘천기업혁신파크` *(title)* | `{{postTitle}} · Notices · B-CITY Chuncheon Enterprise Innovation Park` |
| `{{postTitle}} · 언론보도 · B-CITY 춘천기업혁신파크` *(title)* | `{{postTitle}} · Press · B-CITY Chuncheon Enterprise Innovation Park` |
| **보도일자** 2026.09.09 | **Published** September 9, 2026 |
| 원문 기사 보기 | **Read the original article** |
| 첨부파일 | **Attachments** |
| 이전 글 / 다음 글 | **Previous** / **Next** |
| 목록으로 | **Back to list** |

> ⚠ 「보도일자」를 `Published` 로 옮겼다. `Report date` 는 보고서 작성일로 읽힌다.
> 매체명(`{{postOutlet}}`)이 바로 앞에 오므로 `Chosun Ilbo · Published September 9, 2026`
> 로 읽힌다 — 자연스럽다.
> ⚠ **날짜 형식이 목록과 상세에서 갈린다.** 목록 카드는 `2026.09.09`(숫자)를 쓰고
> 상세는 `September 9, 2026`(문장체)이다. 한국어도 같은 구조이므로 그대로 뒀다 —
> 통일하려면 **빌더의 `fmtDate()` 한 곳**을 고친다.
> ⚠ `{{postDateISO}}`(`<time datetime>`)는 **번역 대상이 아니다** — 기계용 ISO 8601 이다.

---

## 이 페이지들의 조정 기록

| 자리 | 조정 | 이유 |
|---|---|---|
| 공지 제목 | 문장 → **명사구**(`What's new at B-CITY`) | 다섯 쪽 제목 어법을 맞췄다 |
| 언론 제목 | **어순 반전**(`B-CITY in the news`) | 직역이 영어에서 서지 않는다 |
| 영상 제목 | `on film` | `on video` 는 화상통화로 읽힌다 |
| 「조감도」 | `renderings` | 시점이 아니라 이미지 종류다. `GLOSSARY.md` §4 |
| 「사업 소개 자료」 | `project materials` | 직역이 뜻을 흐린다 |
| 「카달로그」 | `Catalogs` | 미국식 철자. `GLOSSARY.md` §10 |
| 「보도일자」 | `Published` | `Report date` 는 다른 뜻이다 |
| 아이브로우 단수/복수 | **소스 그대로** | 라벨과 메뉴는 역할이 다르다. 위 ⚠ 참조 |

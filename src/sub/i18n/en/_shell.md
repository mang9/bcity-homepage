# 공통 셸 — GNB · LNB · 브레드크럼 · 푸터 · 목록 UI · 404

이 파일의 문구는 **19개 페이지 전부에 나온다.** 여기를 고치면 사이트 전체가 바뀐다.

---

## 1. 대메뉴 (GNB) · 카테고리

| 한국어 | English | 메모 |
|---|---|---|
| 사업소개 | **The Project** | 아이브로우 `BUSINESS` 와 같은 말이므로 낱말은 그대로 두고 관사만 붙였다. **2026-09-16 변경** — 아래 「메뉴 라벨 폭」 참조 |
| 도시소개 | **City Overview** | **2026-09-17 변경**(사용자 지시). `City` 단독은 영어 내비게이션에서 「도시」라는 **범주**만 가리키고 「이 도시 소개」로 읽히지 않는다. 한 단계 거쳐 `The City` 를 썼다가 `Overview` 를 붙였다 — 「소개」를 낱말로 옮긴 형태이고, 옆 칸 `The Project` 와 어법이 갈리지만 **뜻이 분명한 쪽을 택했다** |
| 투자·입주 | **Invest & Locate** | 「입주」는 `Tenancy` 보다 `Locate` 가 투자유치 영어의 관용이다(`Invest & Locate in …`). ⚠ **확인 필요** — 발주처가 `Investment & Tenancy` 를 선호하면 그쪽으로 |
| 홍보센터 | **News & Media** | `nav.json` 의 `en` 값을 그대로 |
| 회사소개 | **About Us** | 푸터에서만 닿는 단일 페이지 |

카테고리 번호·아이브로우는 그대로 — `01 BUSINESS` · `02 CITY` · `03 INVEST` · `04 PR CENTER` · `COMPANY`.

#### ⚠⚠ 메뉴 라벨 폭 — 번역과 «간격이 일정하지 않다» 는 **같은 원인**이다

메가메뉴의 칸 폭은 **그 칸의 가장 넓은 하위 메뉴**가 정한다(`20-gnb.css:30`).
한국어는 대분류가 모두 4글자여서 라벨이 칸을 꽉 채웠고, 영문은 라벨이 칸보다 한참 짧아
라벨 사이 간격이 두 배씩 벌어졌다. 1440 실측:

| | 라벨 → 칸 폭 | 라벨 끝 ~ 다음 라벨 |
|---|---|---|
| 한국어 | 59→59 · 59→59 · 64→77 · 59→59 | 35 · 35 · 47 |
| 영문 `Project`/`City` | **59→106** · **35→56** · 122→128 · 114→114 | **82 · 55 · 40** |
| 영문 **현재**(`The Project`/`City Overview`) | `93→106` · **`113→113`** · 122→128 · 114→114 | **48 · 35 · 40** |

⚠ **칸 사이 간격(`gap`)은 둘 다 34~35px 로 이미 같다.** CSS 를 건드릴 문제가 아니라
  라벨이 칸을 채우지 못하는 문제다 — 그래서 라벨을 고쳤다.
⚠ **가운데 정렬로는 안 풀린다**(계산: 69 · 48.5 · 38). 칸 폭 자체가 다르기 때문이다.
⚠ 하위 메뉴를 `position: absolute` 로 떼어 내면 라벨만으로 간격이 정해지지만,
  펼칠 때 바 높이가 늘어나는 구조(§11.86)가 깨지고 **한국어판과 구조가 갈린다** — 하지 않았다.

## 2. 하위 메뉴 (LNB) — 한 줄에 들어가야 한다

| 한국어 | English | 글자 | 메모 |
|---|---|---|---|
| 사업개요 | **Overview** | 8 | |
| 입지 | **Location** | 8 | |
| 기대효과 | **Impact** | 6 | 직역 `Expected Effects` 는 영어 개발 문서에서 쓰지 않는다. IM 관용은 `Impact` |
| 추진일정 | **Timeline** | 8 | |
| 사업주체 | **Project Partners** | 16 | ⚠ 페이지 내용은 PFV 구조 + 파트너다. `Project Entity`(14) 도 가능하나 메뉴에 길다. **확인 필요** |
| 브랜드 | **Brand** | 5 | |
| 컨셉 | **Concept** | 7 | |
| 구역 소개 | **Districts** | 9 | |
| 정주환경 | **Living** | 6 | |
| 토지확보 요건 | **Land Requirements** | 17 | **2026-09-21 확정 · `Land Acquisition Requirements`(28)에서 줄였다.** 근거 둘 — ① 본문 h2 가 `land acquisition **threshold**`, 히어로 리드가 `land requirements` 라 **메뉴만 세 번째 표기**였다(`invest.md` 의 「직역을 쓰지 않는다」 결정을 메뉴가 안 따랐다) ② 메가메뉴 칸이 168px 고정인데 잉크 205px 로 **옆 칸을 37px 침범**해 잘렸다. 이제 데스크톱·모바일이 같은 값이라 축약 분기가 없다 |
| 투자 혜택 | **Incentives** | 10 | 투자유치 영어의 표준어. `Investment Benefits` 는 아이브로우에만 |
| 문의하기 | **Contact** | 7 | |
| 공지사항 | **Notices** | 7 | 복수형. `Notice` 는 게시물 한 건을 뜻한다 |
| 언론보도 | **Press** | 5 | |
| 홍보영상 | **Videos** | 6 | |
| 갤러리 | **Gallery** | 7 | |
| 발행물 | **Publications** | 12 | |

## 3. 히어로 · 브레드크럼

| 한국어 | English |
|---|---|
| HOME | **HOME** |
| 현재 위치 *(aria-label)* | **Breadcrumb** |
| `{{catEn}} · {{catLabel}}` 아이브로우 | `01 PROJECT` |
| `{{catLabel}} 하위 메뉴` *(aria-label)* | **{{catLabel}} submenu** |
| `{{catLabel}} · {{h1}}` *(감춘 h1)* | **{{catLabel}} — {{h1}}** |

## 4. 페이지 제목 · 설명 (`<title>` · `meta description`)

⚠ 접미사는 **`· B-CITY Chuncheon Enterprise Innovation Park`**(45자)로 통일한다.
⚠⚠ **`Corporate` → `Enterprise` 확정(2026-09-15)으로 전체 title 이 한 자씩 늘어 51~61자가 됐다.**
   ✅ **투자·입주 `<title>` 접두어만 `Invest` 로 줄였다**(2026-09-15 확정) — 61자 → **52자**.
   ⚠ **메뉴 라벨은 `Invest & Locate` 그대로다**(GNB · LNB · 404 본문). 줄인 것은 `<title>` 한 곳뿐이다.
⚠ 설명 상한은 한국어 80자가 아니라 **영문 155자**다(`README.md` «다음 단계» 3번).
⚠⚠ **404 설명에서 메뉴 이름을 열거하지 않는다.** 전에 `the Business, City, Invest & Locate
   or PR Center menus` 로 적어 두었더니 ① 아이브로우 낱말(`Business`·`PR Center`)과 메뉴
   라벨(`Invest & Locate`)이 섞였고 ② 라벨을 고칠 때마다 어긋났다 — 실제로 `City` 가
   `City Overview` 로 바뀌면서 **없는 메뉴를 가리키게 됐다**(2026-09-17). 「위 메뉴」로만 적는다
   (한국어 원문도 그렇다 — `위 메뉴에서 원하시는 내용을 찾아보세요`).

| 페이지 | English title | English description (자) |
|---|---|---|
| 사업개요 | Overview · B-CITY … | **A KRW 1.1 trillion, 3,632,899 m² urban development led by private enterprise under MOLIT, and a designated National High-Tech Strategic Industry Specialized Complex for bio.** (173) |
| 입지 | Location · B-CITY … | **Within an hour of Seoul and the surrounding metropolitan area — the GTX-B extension, 2nd Gyeongchun National Road, airports and ports all within reach.** (151) |
| 기대효과 | Impact · B-CITY … | **A self-sufficient city planned for approx. 16,000 residents in 6,366 households, with impact across the economy, industry, society, regions and the environment.** (160) |
| 추진일정 | Timeline · B-CITY … | **From the 2023 call for Enterprise Innovation Park proposals to full completion in 2033 — progress to date and the road ahead, year by year.** (139) |
| 사업주체 | Developer · B-CITY … | **A PFV structure selected by MOLIT, funded by Gangwon State and Chuncheon City, and anchored by Douzone Bizon. Meet the partners behind B-CITY.** (142) |
| 브랜드 | Brand · B-CITY … | **Where the city and biotechnology become one. The B-CITY brand name, symbol, logotype system and the three-color palette of Indigo, Mint and Azure.** (146) |
| 컨셉 | Concept · B-CITY … | **AI DATA · BIO INDUSTRY · PHYSICAL AI · FOOD CLUSTER — four axes that together form a hub for the industries of the future.** (122) |
| 구역 소개 | Districts · B-CITY … | **Four industrial clusters — AI, bio, food and MICE — and four living complexes. Land use and areas for all eight districts across 3.63 million m².** (145) |
| 정주환경 | Living · B-CITY … | **A self-contained neighborhood where work, home, schools and culture all sit within the same city, minutes apart.** (112) |
| 투자·입주 | Invest · B-CITY … | **The Special Act on the Development of Enterprise Cities lowers the land-control threshold to 50%, with fast-track permits and tax relief for tenants.** (149) |
| 회사소개 | About Us · B-CITY … | **Biotech Innovalley PFV Co., Ltd., the developer of B-CITY Chuncheon Enterprise Innovation Park — company profile, vision, structure and contacts.** (145) |
| 공지사항 | Notices · B-CITY … | **News from B-CITY — progress on the Integrated Development Plan, residents’ briefings, and guidance for prospective tenants and investors.** (137) |
| 언론보도 | Press · B-CITY … | **Press coverage of B-CITY Chuncheon Enterprise Innovation Park: project selection, progress, industry attraction and special-zone designations.** (142) |
| 홍보영상 | Videos · B-CITY … | **B-CITY on film: city renderings, district walkthroughs and project briefings, available to view in place.** (105) |
| 갤러리 | Gallery · B-CITY … | **Renderings and photographs of B-CITY — city views, district renderings, events and site records, all viewable full size by category.** (132) |
| 발행물 | Publications · B-CITY … | **Project materials for B-CITY: the information memorandum, brochures, reports and catalogs, viewable on screen or available to download.** (135) |
| 404 | Page not found · B-CITY … | **The page you requested does not exist. Please check the address, or use the menu above to find the page you need.** (113) |
| 문의하기(숨김) | Contact · B-CITY … | **Address, main phone number, website and directions for Biotech Innovalley PFV Co., Ltd., the developer of B-CITY.** (113) |

**h1**

| 한국어 | English |
|---|---|
| 사업개요 / 입지 / 기대효과 / 추진일정 / 사업주체 | Overview / Location / Impact / Timeline / Project Partners |
| 브랜드 / 컨셉 / 구역 소개 / 정주환경 | Brand / Concept / Districts / Living |
| 투자 · 입주 | **Invest & Locate** |
| 공지사항 / 언론보도 / 홍보영상 / 갤러리 / 발행물 | Notices / Press / Videos / Gallery / Publications |
| 회사소개 | **About Us** |
| 요청하신 페이지를 찾을 수 없습니다 | **We couldn’t find that page** |

## 5. 푸터

| 한국어 | English |
|---|---|
| 바이오테크 이노밸리 PFV | **Biotech Innovalley PFV** |
| 주소 : 서울특별시 광진구 자양로58 태림빌딩 3층 | **3F Taerim Bldg., 58 Jayang-ro, Gwangjin-gu, Seoul, Republic of Korea** |
| 사업자등록번호 : 883-81-03982 | **Business Registration No. 883-81-03982** |
| * 본 홈페이지에 사용된 영상, 사진 및 이미지 등은 소비자의 이해를 돕기 위한 것으로 변경될 수 있음 | \* Film, photographs and images on this site are for illustrative purposes and are subject to change. |
| * 본 홈페이지에서 제공되는 정보는 향후 사업추진 상황에 따라 변경될 수 있음 | \* Information on this site may change as the project progresses. |
| © 2026 B-CITY. All rights reserved. | © 2026 B-CITY. All rights reserved. |
| 푸터 메뉴 *(aria)* | **Footer menu** |
| 회사소개 / 개인정보처리방침 | **About Us** / **Privacy Policy** |

## 6. GNB 주변 · 접근성 라벨

| 한국어 | English |
|---|---|
| B·CITY 홈 *(로고 aria)* | **B-CITY home** |
| 주 메뉴 *(aria)* | **Main menu** |
| 전체 메뉴 *(aria)* | **All menus** |
| 메뉴 열기 / 메뉴 닫기 | **Open menu** / **Close menu** |
| KO \| EN | **KO \| EN** |
| (새 창) *(.sr)* | **(opens in a new window)** |
| 페이지 *(페이저 aria)* | **Pagination** |
| 이전 페이지 / 다음 페이지 | **Previous page** / **Next page** |
| N쪽 | **Page N** |
| TOP / 맨 위로 | **TOP** / **Back to top** |
| 본문으로 건너뛰기 *(.sr 스킵 링크)* | **Skip to content** |
| 목록 페이지 *(페이저 aria)* | **List pages** |
| B-CITY 춘천기업혁신파크 로고 *(alt)* | **B-CITY Chuncheon Enterprise Innovation Park logo** |
| 서울특별시 광진구 자양로58 태림빌딩 3층 | **3F Taerim Bldg., 58 Jayang-ro, Gwangjin-gu, Seoul, Republic of Korea** |
| 게시글 이동 *(상세 이전·다음 nav aria)* | **Post navigation** |

> ⚠ 위 네 줄은 **2026-09-16 에 영문 빌드를 실제로 돌려 보고** 빠진 것을 찾아 넣었다.
> 전부 화면에 보이거나 낭독되는 문구인데 대조표에 없었다 — 주소는 `주소 : …` 형태로만
> 있어서 문의 모달의 값 덩이(라벨이 다른 요소에 있다)와 맞지 않았다.
> **남은 목록은 빌드가 `en/_leftover.md` 로 만든다.** 거기 있는 문구를 이 표에 넣으면 사라진다.
| 문의하기 *(플로팅)* | **Contact** |

## 7. 목록 UI (빌더 `pages.mjs` 안의 문구)

| 한국어 | English | 메모 |
|---|---|---|
| 등록된 게시물이 없습니다. | **No posts yet.** | |
| 검색 결과가 없습니다. | **No results.** | |
| 본문이 등록되지 않았습니다. | **No content has been posted.** | |
| 이미지 준비 중 | **Image coming soon** | |
| 보도일자 | **Published** | `<time>` 앞 라벨 |
| 원문 기사 보기 | **Read the original article** | |
| 첨부파일 | **Attachments** | |
| 이전 글 / 다음 글 | **Previous** / **Next** | |
| 없습니다 *(이전·다음이 없을 때)* | **No previous post / No next post** |  |
| 목록으로 | **Back to list** | |
| 전체 | **All** | 분류 탭 |
| 행사 / 현장 / 조감도 / 기타 | **Events** / **Site photos** / **Renderings** / **Other** | 갤러리 분류 |
| 카달로그 / IM / 브로슈어 / 리포트 | **Catalog**s / Information Memoranda (**IM**) / **Brochure**s / **Report**s | 발행물 분류. ⚠ `IM` 은 첫 등장에서 `Information Memorandum (IM)` 으로 풀어 쓴다 |
| 갤러리 분류 / 발행물 분류 *(aria)* | **Gallery category** / **Publication type** | |
| 전체 / 언론사별 / 기간별 | **All** / **By outlet** / **By date** | 언론보도 컨트롤(현재 꺼져 있다) |
| 제목 · 내용 검색 | **Search titles and content** | |
| 검색 | **Search** | |
| N건 표시 중 | **Showing N items** | |
| 확대해서 보기 *(.sr)* | **View larger** |  |
| 재생 *(.sr)* | **Play** |  |
| 새 창으로 열기 / 새 창으로 보기 | **Open in a new window** / **View in a new window** |  |
| 내려받기 | **Download** |  |
| 보기 *(공문 버튼)* | **View** | ⚠ 공문 스캔은 한국어다 → 영문판 캡션에 **`(Korean original)`** 을 붙인다 |
| ※ [보기]를 누르면 공문 원본을 확대해 보실 수 있습니다. | \* Select **View** to open the original document at full size. **Documents are in Korean.** | |

## 8. 404 페이지

| 한국어 | English | 글자 |
|---|---|---|
| 요청하신 페이지를<br>찾을 수 없습니다 | **We couldn’t find<br>the page you requested** | 41 |
| 주소가 바뀌었거나 삭제된 페이지일 수 있습니다.<br>주소를 다시 확인해 주시거나, 위 메뉴에서 원하시는 내용을 찾아보세요. | **The address may have changed, or the page may have been removed.<br>Please check the address, or use the menu above to locate the page you require.** | 146 |
| 메인으로 돌아가기 | **Back to home** | 12 |

## 9. 표 · 각주에 반복되는 문구

| 한국어 | English |
|---|---|
| 구분 / 내용 *(표 머리)* | **Item** / **Details** |
| 합계 / 소계 | **Total** / **Subtotal** |
| ㎡ / 평 *(표 머리)* | **m²** / **pyeong** |
| 구역 | **Block** |
| — *(해당 없음)* | — |
| ※ 상기 구획은 인허가 또는 관계 기관 협의 등 사업 진행 과정에서 변경될 수 있음. | \* Block boundaries above may change through permitting and consultation with the authorities. |
| ※ 상기 계획(안)은 국토교통부 통합개발계획 접수(안) 기준으로 작성된 것으로, 추후 사업 주체 또는 관계 기관 사정, 인허가 과정 등에 따라 변경될 수 있습니다. | * The plan shown reflects the draft Integrated Development Plan submitted to MOLIT. It may change according to the developer, the authorities concerned, or the permitting process. |
| ※ 면적은 국토교통부 통합개발계획 접수(안) 기준이며, 총 사업면적 약 110만평은 하천 · 공원 · 녹지 등을 포함한 값입니다. | \* Areas reflect the Integrated Development Plan as submitted to MOLIT. The total project area of approx. 3.63 million m² includes rivers, parks and green space. |
| * 소요시간은 교통량 및 도로사정에 따라 차이가 발생할 수 있습니다. | \* Travel times vary with traffic and road conditions. |

---

## 조정 기록

### 대메뉴 라벨 — `City` → `The City` · `Project` → `The Project` (2026-09-16 지시)

> "메뉴명이 city 니까 도시로만 끝나는것 같은데 번역이 맞아? 프로젝트랑 시티가 메뉴명이
>  짧고 서브 메뉴 너비 때문인지 각 간격이 일정치 않아서 보기가 좋지 않아"

지적이 정확했고 **두 문제가 한 원인**이었다(§1 의 「메뉴 라벨 폭」 참조).

| 화면 | 전 (`Project`/`City`) | `The Project`/`The City` | **`The Project`/`City Overview`** | 한국어 |
|---|---|---|---|---|
| 1920 | — | — | **54 · 40 · 45** | |
| 1440 | 82 · 55 · 40 | 48 · 35 · 40 | **48 · 35 · 40** | 35 · 35 · 47 |
| 1280 | — | 44 · 31 · 36 | — | |
| 1100 | — | 40 · 26 · 32 | — | |
| 1024 | — | — | **38 · 25 · 30** | |

라벨 폭도 `59→106` · `35→56` 에서 **`93→106` · `113→113`** 으로 칸을 채운다.
전 구간 가로 넘침 0 · 하위 메뉴가 자기 칸을 넘는 것 0.

### 도시소개 — `The City` → `City Overview` (2026-09-17 지시)

**간격은 그대로다**(1440 에서 48 · 35 · 40). `City Overview`(113px)가 그 칸의 가장 넓은
하위 메뉴(`Districts` 69px)보다 넓어져 **이제 라벨 자신이 칸 폭을 정한다** — `The City` 때는
라벨과 하위 메뉴가 우연히 같은 69px 여서 역시 꽉 찼다. 즉 두 라벨 모두 이 칸을 채우므로
남은 편차 13px 은 여전히 첫 칸(`Project Partners` 106 > `The Project` 93) 탓이다.

⚠ **메뉴 행이 44px 넓어졌다.** 1024(데스크톱 최소폭)에서 마지막 라벨과 `KO/EN` 사이가
**94px** 남아 여유가 있다 — 라벨을 더 늘리려면 이 값을 다시 잰다.
⚠ 어법이 갈렸다 — `The Project`(관사) vs `City Overview`(명사구). 네 라벨을 한 어법으로
맞추려면 `Project Overview` / `City Overview` 쪽이 자연스럽지만 **사업소개는 지시 범위가 아니라
건드리지 않았다.**

⚠ **메인(`index.html`)은 원래 고르다** — `.gnb-item` 이 고정 168px 이라 라벨 길이와 무관하다
(§11.80). 이 문제는 서브페이지 셸(`gap` + 내용 폭)에서만 나타난다.

⚠ **남은 편차 13px 은 `Project Partners`(106px) 탓이다.** `The Project`(93) 보다 넓어
첫 칸만 48 이 된다. 완전히 맞추려면 그 하위 라벨을 `Partners` 로 줄여야 하는데,
`사업주체` 는 PFV·AMC 구조까지 담는 페이지라 뜻이 좁아진다 — **하지 않았다.**
(`_shell.md` §4 는 같은 페이지의 `<title>` 을 `Developer` 로 쓰고 있고, 그 표기는
`README.md` A4 에서 **확인 필요**로 열려 있다.)

⚠ 바뀌는 자리는 GNB · 모바일 메뉴 · 브레드크럼 · 푸터다 — 빌드가 `nav.json` 하나에서
모두 유도하므로 이 표 두 줄만 고치면 따라온다.

### 0916 수정본 후속 (2026-09-16)

- 추진일정 `description` — `Enterprise Innovation Park pilot proposals` → **`… Park proposals`**
  (「선도사업」을 서술문에서 옮기지 않는 확정 · `GLOSSARY.md` §1 · §9).
- ⚠⚠ **`(NNN)` 꼬리 자수 14건이 전부 낡아 있어 재계산했다.** 문면은 이 한 줄만 바꿨다.
  원인 — 지금까지의 자수 검사가 `**NN**` 형태의 칸만 봤고 `**문장** (NNN)` 형태는 검사 대상이 아니었다.
  값은 원시 글자수와 1:1로 다시 맞췄다(마크업·이중공백 없음을 함께 확인).

> ⚠⚠ **「준비중입니다」·「제1조 ~ 제12조 본문 전체」는 대조표 행이 아니다.**
> 2026-09-28 까지 두 문서의 표 안에 **값 칸에 설명문을 적은 행**으로 들어 있었고,
> `loadDict` 가 그것을 **번역 값으로 등록**하고 있었다 — 그 키가 화면에 매칭되면
> 한국어 설명문이 그대로 영문 페이지에 들어간다.
> · **「준비중입니다」** — EN 말풍선(§11.86)은 **번역 대상이 아니라 제거 대상**이다.
>   `EN_READY` 가 켜지면 `.gnb-en` 이 `<a>` 로 바뀌고 `common.js` 가 말풍선을
>   만들지 않는다(그 블록은 `.gnb-en` 이 없으면 스스로 빠져나간다).
> · **개인정보처리방침 제1조~제12조** — 한국어본 유지가 확정이다(G01).
>   준거 언어 한 줄은 `pages-en.mjs` 의 `enConventions` 가 넣는다.
> **규칙: 표의 값 칸에는 «화면에 나갈 영문»만 적는다.** 설명은 이렇게 산문으로 둔다.

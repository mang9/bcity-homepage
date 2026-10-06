# 메인 (`index.html`) → Home

> ⚠ **이 페이지는 손글씨다.** 서브페이지 18쪽은 `pages.mjs` 가 만들지만 메인은
> 마크업 · CSS · JS 가 한 파일에 있다. 영문판을 만들 때 **셸을 재사용할 수 없고**
> `index.html` 전체를 복제해 `en/index.html` 로 두는 방식이 된다
> (`README.md` 의 빌드 계획 5번 참조).
> ⚠ `<meta description>` · `og:description` 은 **같은 문장 두 줄**이다 — 한쪽만 고치면
> 검색 결과와 공유 카드가 갈린다(소스 주석에 그 경고가 있다).

---

## 0 문서 머리 (`<head>`)

| 한국어 | English | 자수 |
|---|---|---|
| `B-CITY · 춘천기업혁신파크` *(title · og:title)* | `B-CITY · Chuncheon Enterprise Innovation Park` | 45 |
| `B-CITY 춘천기업혁신파크` *(og:site_name)* | `B-CITY Chuncheon Enterprise Innovation Park` | 43 |
| 강원 춘천에 조성되는 기업혁신파크 선도사업 B-CITY(비시티). AI 데이터센터와 바이오·푸드·MICE 클러스터가 함께하는 자족도시입니다. *(78자)* | B-CITY, the Chuncheon Enterprise Innovation Park, is a planned self-sufficient city bringing together AI data centers, biotech, food tech and MICE. | **147** |

> ⚠ **`DESC_MAX = 80` 은 한국어 전용 규칙이다.** 네이버 검색 결과가 그 길이에서
> 잘리지 않기 때문이고, 영어는 같은 내용에 2.2배가 든다. 영문의 실질 상한은
> **155자**(구글 데스크톱 스니펫)다. ✅ 확정본 **147자**로 그 안에 들어왔다.
> ~~**줄이려면 이렇게 한다**(152자)~~ — 확정본이 147자라 **더 이상 필요하지 않다**:
> `B-CITY is the Chuncheon Enterprise Innovation Park pilot project in Gangwon, Korea — a self-sufficient city of AI data centers and bio, food and MICE.`
> ⚠ **이 축약안은 옛 것이다** — `pilot project` 와 `bio, food` 가 남아 있다. 쓰지 않는다.
> ⚠ **`(비시티)` 를 옮기지 않았다.** 한국어 독음 표기이므로 영문에서 불필요하다.
> ⚠ `noindex` · `canonical` · `og:image` 는 **번역 대상이 아니다.** 다만 영문 페이지가
> 생기면 `hreflang` 한 쌍(`ko` / `en` / `x-default`)을 양쪽에 넣어야 한다.

---

## 1 히어로 (`#hero`)

| 한국어 | English |
|---|---|
| B-CITY 춘천기업혁신파크 *(아이브로우)* | B-CITY Chuncheon Enterprise Innovation Park |
| 서부개척 시대의 골드러시가<br>**21세기 데이터 러시로** | From the Gold Rush<br>**to the 21st-century Data Rush** |
| AI 데이터를 중심으로 한 새로운 기회의 도시가 춘천에 탄생합니다 | A new city of opportunity powered by AI and data technology is taking shape in Chuncheon. |
| 도시 살펴보기 → | **Explore the city** → |

> ⚠ 「골드러시 → 데이터 러시」는 **이 사이트의 핵심 은유**다. `gold rush` 와 `data rush` 를
> 나란히 두는 대구를 반드시 살린다 — `Gold Rush` 는 미국 독자에게 즉시 통하는 고유
> 역사이므로 영문에서 오히려 더 강하게 읽힌다.
> ⚠ 「서부개척 시대」를 `Wild West` 로 옮기지 않았다 — 무법 · 총잡이 쪽 함의가 있다.
> `the frontier era` 가 중립적이고 골드러시와 시대가 맞는다.
> ⚠ **자수 주의** — `.hero h1` 은 최대 62px 이고 영문 첫 줄이 34자, 둘째 줄이 44자다.
> 한국어는 14 / 14 자였다. `LAYOUT-NOTES.md` §1 의 히어로 예산을 다시 재야 한다.
> **줄바꿈은 `가` 뒤가 아니라 `era,` 뒤**여야 대구가 보인다.

---

## 2 입지 (`#location`)

| 한국어 | English |
|---|---|
| `01` LOCATION · 입지 | `01` LOCATION |
| 자세히 보기 | **Learn more** |
| * 교통량 및 도로사정에 따라 차이가 발생할 수 있습니다 | \* Times may vary with traffic and road conditions |
| 입지 소개 단계 *(nav aria-label)* | Location highlights |

### 페이지 01 — 수도권 생활권

| 한국어 | English |
|---|---|
| 서울 잠실에서 40분, / 남춘천 IC 3분 | Jamsil, Seoul 40 min / Namchuncheon IC 3 min |
| 제2경춘국도와 GTX-B로 완성되는 수도권 생활권 | Enhanced Seoul metropolitan access via the planned 2nd Gyeongchun National Road and GTX-B extension |
| 양평고속도로(예정) 서울 **30분** | Yangpyeong Expwy (planned) · Seoul **30 min** |
| 잠실 · 서울양양고속도로 **40분** | Jamsil · Seoul–Yangyang Expressway **40 min** |
| 중랑IC · 제2경춘국도(예정) **45분** | Jungnang IC · 2nd Gyeongchun Rd. (planned) **45 min** |
| 서울역 · GTX-B(예정) **50분** | Seoul Station · GTX-B (planned) **50 min** |
| `01` 수도권 생활권 *(탭)* | `01` Seoul metro access |

### 페이지 02 — 초광역 경제권

| 한국어 | English |
|---|---|
| ‘강원형 바이오·헬스 / 초광역 경제권’ 구축 | A connected biohealth economy across Gangwon |
| 원주, 강릉, 평창의 인프라와 연계해 정밀의료 분야 융복합 기술개발<br>및 시너지 창출을 위한 거점화를 추진합니다 | B-CITY aims to connect infrastructure in Wonju, Gangneung and Pyeongchang to advance interdisciplinary R&D in precision medicine. |
| #춘천_AI바이오 | **#Chuncheon_AIBio** |
| #원주_의료기기 | **#Wonju_MedicalDevices** |
| #강릉_천연물바이오 | **#Gangneung_NaturalProducts** |
| #평창_그린바이오 | **#Pyeongchang_GreenBio** |
| `02` 초광역 경제권 *(탭)* | `02` Regional economy |

> ⚠ 「초광역 경제권」 → `mega-region`. 「광역」이 이 사이트에서 두 뜻으로 쓰인다 —
> 도시권(`metropolitan`)과 복수 시도를 묶는 권역(`mega-region`)이다. 여기는 후자다
> (`GLOSSARY.md` §1).
> ⚠ 해시태그는 밑줄을 유지하고 뒷말만 CamelCase 로 바꿨다 — 한글 부분이 지명이므로
> 로마자 지명 + 산업명 구조가 원문과 같다.
> ⚠ `#Gangneung_NaturalProducts` 는 「천연물바이오」의 `bio` 를 뺐다. 27자가 되면
> `.lo-pill` 이 두 줄이 된다. `natural-products bio` 는 영어에서 이미 바이오 분야를 뜻한다.

### 페이지 03 — 글로벌 게이트웨이

| 한국어 | English |
|---|---|
| 글로벌 비즈니스의 / 새로운 거점, B-CITY | B-CITY, a new hub for global business |
| 한국과 세계를 잇는 첨단 바이오 비즈니스의 글로벌 게이트웨이 | A global gateway connecting Korea’s biotechnology industry with the world |
| 양양국제공항 **60분** | Yangyang Int’l Airport **60 min** |
| 김포공항 **80분** | Gimpo Airport **80 min** |
| 속초항 **90분** | Sokcho Port **90 min** |
| 동해항 **120분** | Donghae Port **120 min** |
| `03` 글로벌 게이트웨이 *(탭)* | `03` Global gateway |

> ⚠⚠ **메인은 `김포공항`, 서브페이지(입지)는 `인천국제공항`이다.** §11.28 에서 서브만
> 바꿨고 메인의 3곳(칩 라벨 · 노선 데이터 `name` · 주석)은 김포로 남아 있다 —
> 영문판을 만들 때 **어느 쪽이 정본인지 먼저 확정**해야 한다. 위 표는 소스대로 옮겼다.
> **확인 필요.**
> ⚠ `Int’l` 로 줄인 것은 `.lo-pill` 폭 때문이다. 풀어 쓰면
> `Yangyang International Airport` 30자 + 값이라 두 줄이 된다.

---

## 3 사업개요 (`#business`)

| 한국어 | English |
|---|---|
| `02` OVERVIEW · 사업개요 | `02` OVERVIEW |
| 국토교통부 주관의 / **민간기업 중심 도시개발 사업** | **Private-sector-led urban development**<br>under the Ministry of Land, Infrastructure and Transport |
| 총 사업비 약 1.1조원의 대규모 국가도시개발 프로젝트로, 총 면적 약 110만평(여의도 면적 1.25배 규모)의 부지 위에 혁신 생태계가 만들어집니다 | A national urban development project of about KRW 1.1 trillion, building an innovation ecosystem on roughly 3.63 km² — 1.25 times the area of Yeouido |
| 2024년 바이오 분야 / **국가첨단전략산업 특화단지 지정** | Designated in 2024 as a National High-Tech Strategic Industry Specialized Complex **National High-Tech Strategic Industry Specialized Complex** for biotechnology |
| 정부가 보증하고 전폭적으로 지원하는 범국가적 프로젝트입니다. 인허가 패스트트랙부터 최대 규모 세제 혜택까지, 성공적 비즈니스를 위한 전방위적 특구 지원이 제공됩니다. | A national project backed by government support. From fast-track permitting to significant tax incentives, special-zone programs support key stages of business development. |

### 지표 4종 (`.ov-stat` · 카운트업)

| 한국어 | English |
|---|---|
| **1.1** 조원 / 총 사업비 | KRW **1.1** trillion / Total project cost |
| **110** 만평 / 총 사업 면적 · 여의도 1.25배 | **3.63** km² / Total site area · 1.25× Yeouido |
| **8** 개 권역 / 4대 클러스터 + 4대 콤플렉스 | **8** districts / 4 clusters + 4 complexes |
| **435** MW / AI 데이터센터 최대 용량 | **435** MW / Planned AI data center power capacity |

> ✅ **면적 단위는 `km²` 로 확정됐다**(2026-09-15 사용자 확인). 「110만평」은 영어권 독자에게
> 아무 감각을 주지 않는다(`1.1 million pyeong` 은 단위 자체를 모른다).
> `GLOSSARY.md` §7 은 「m² 를 앞에, 평을 괄호에」로 정했는데, **카운트업 지표는 값이
> 하나뿐이라 괄호를 쓸 자리가 없다.** 그래서 km² 로 바꿨다(3,632,899 m² = 3.63 km²).
> ⚠ **대가는 감수한다** — 「110만평」이라는 이 사업의 상징 숫자가 영문판에서 사라진다.
> 병기안(`1.1M pyeong (3.63 km²)`)은 **채택하지 않았다**(카운트업 칸이 짧다).
>
> **영문 빌드에서 고칠 곳 — 지표 칸**
>
> | 한국어판 | **영문판** |
> |---|---|
> | `<b data-count="110">0</b><span>만평</span>` | `<b data-count="3.63" data-dec="2">0</b><span>km²</span>` |
>
> ⚠ `data-dec="2"` 를 빠뜨리면 `countup.js` 가 정수로 세어 **`4 km²`** 로 끝난다(§11.13).
> ⚠ 「1.1조원」을 `1.1 trillion won` 으로 두고 `KRW` 를 붙이지 않은 것은 **카운트업의
> 단위 칸이 짧기 때문**이다. 본문에서는 `KRW 1.1 trillion` 로 쓴다(`GLOSSARY.md` §7).
> ⚠ **여의도 비교는 살렸다.** 한국 독자용 장치지만 영문 투자자 문서에서도
> 서울의 금융 중심지를 아는 독자가 많고, 그 자체가 축척 감각을 준다.
> 통하지 않는 독자를 위해 km² 가 앞에 있다.
> ⚠ 「국토교통부 주관의」를 `A Ministry of Land–led project` 로 줄였다 — 정식 명칭은
> `Ministry of Land, Infrastructure and Transport` 로 45자여서 제목에 들어가지 않는다.
> **첫 등장(사업개요 페이지 본문)에서는 풀어 쓰고 여기서는 줄인다**(`GLOSSARY.md` §6).

#### 빌드가 읽는 대조표 — 단위 칸 3개

숫자는 `data-count` 속성이 갖고 **단위만 별도 `<span>`** 이다. 그래서 위 표의 덩이
전체로는 잡히지 않는다(`<b>` 안이 `0` 이다) — 단위 낱말을 따로 둔다.

| 한국어 | English |
|---|---|
| 조원 | trillion won |
| 만평 | km² |
| 개 권역 | districts |

⚠ 「조원」은 **기대효과 페이지의 생산유발효과**(`0.9 조원`)에도 같은 형태로 있다 —
이 한 줄이 두 쪽을 함께 고친다. 단위 칸이 짧아 `KRW` 를 앞에 붙이지 않는다(바로 위 주석).
⚠ 「만평」은 값이 `3.63` 으로 바뀌어야 뜻이 맞는다 — 위 「지표 칸」 표의 속성 변경과
**한 벌이다.** 단위만 바꾸면 `110 km²` 가 된다.

---

## 4 도시 컨셉 (`#concept`)

| 한국어 | English |
|---|---|
| **AI를 기반으로 BIO‧로보틱스 산업이 성장하는** / **AI Platform, B-CITY** | **AI-driven growth in biotech and robotics** / **B-CITY, an AI Platform** |
| 데이터 · 바이오 · PHYSICAL AI · 식품이 연결된 미래산업 혁신 허브 | Connecting data, biotechnology, physical AI and food in one innovation hub |
| AI DATA / 최대 435MW 하이퍼스케일 데이터센터를<br>기반으로 한 컴퓨팅 인프라 | AI DATA / Computing infrastructure built around a planned hyperscale data center campus with up to 435 MW of power supply capacity |
| BIO INDUSTRY / BIT 융합·CDMO·정밀의료로 이어지는 첨단<br>바이오 산업 거점 | BIO INDUSTRY / A hub linking biotech–IT integration, CDMO services and precision medicine |
| PHYSICAL AI / 로보틱스 · 스마트 모빌리티 · AI자동화 실증<br>및 구현 | PHYSICAL AI / Demonstration and deployment of robotics, smart mobility and AI automation |
| FOOD CLUSTER / 콜드체인 물류 허브 기반 스마트팜·푸드테크<br>융합 식품 산업 거점 | FOOD CLUSTER / A hub connecting smart farming, food technology and cold-chain logistics |

> ⚠ 네 축 이름(`AI DATA` 등)은 **이미 영문이다.** 손대지 않는다.
> ⚠ 「AI를 기반으로 … 성장하는」을 `Where AI grows bio and robotics` 로 압축했다.
> 직역(`Where the bio and robotics industries grow on a foundation of AI`)은 62자로
> `.cn-*` 제목 자리에 들어가지 않는다.
> ⚠ 「BIT 융합」은 **Bio + IT** 융합이다. 약어를 그대로 두되 첫 등장에 풀이가 필요하다 —
> 컨셉 페이지 본문에 `BIT (bio + IT)` 로 한 번 적는다(`en/concept.md` 참조).
> ⚠ `<br>` 위치는 **한국어 폭으로 잡은 것**이다. 영문은 줄 수를 다시 재야 한다
> (`LAYOUT-NOTES.md` §7).

---

## 5 구역 개요 (`#zones`)

| 한국어 | English |
|---|---|
| **8개 권역이 하나의 도시 생태계를 완성합니다** | **Eight districts, one city ecosystem** |
| AI·BIO·FOOD·MICE 4대 클러스터 + 비즈니스·하우징·에듀·골프레저 4대 콤플렉스, 총 110만평 | Four clusters and four complexes across 3.63 km² |
| 권역별 면적 구성 | **Area by district** |
| 합계 | **Total** |
| 권역부지 **65만평** / 110만평 | District land **2.16 km²** / 3.63 km² |
| * 하천, 공원, 녹지 등 45만 평 제외 | \* Excludes 1.49 km² of rivers, parks and green space |
| ※ 상기 계획(안)은 국토교통부 통합개발계획 접수(안) 기준으로 작성된 것으로, 추후 사업 주체 또는 관계 기관 사정, 인허가 과정 등에 따라 변경될 수 있습니다. | \* The plan shown is based on the integrated development plan as filed with the Ministry of Land, Infrastructure and Transport. It may change with the circumstances of the developer or relevant authorities, or through the permitting process. |
| 구역 선택 *(dzDots aria-label)* | Select a district |
| 섹션 이동 *(dotNav aria-label)* | Jump to section |

### `areas` 배열 (카드 8장 · 카운트업)

| # | 한국어 | English | 면적 |
|---|---|---|---|
| 1 | AI 데이터 / 6.2만평 | AI Data | 0.21 km² |
| 2 | 바이오 / 8.2만평 | Bio | 0.27 km² |
| 3 | 푸드 / 4.2만평 | Food | 0.14 km² |
| 4 | 바이오 MICE / 3.9만평 | Bio MICE | 0.13 km² |
| 5 | 비즈니스 / 1.7만평 | Business | 0.06 km² |
| 6 | 하우징 / 9.7만평 | Housing | 0.32 km² |
| 7 | 에듀 / 2.7만평 | Education | 0.09 km² |
| 8 | 골프레저 / 28.5만평 | Golf & Leisure | 0.94 km² |

> ⚠⚠ **위 표의 「한국어」 칸은 두 값을 `/` 로 합쳐 적은 설명용이다.**
> 사전은 셀 전체를 키로 쓰므로 그대로는 리터럴과 맞지 않는다 — 실제 배열 값은
> 이름과 면적이 **따로 있는 두 리터럴**이다. 그래서 이름만 아래 표로 한 번 더 둔다.
> ⚠ 여섯은 다른 섹션의 키로 이미 바뀌고 있었고 **`바이오` · `푸드` 둘만 남아 있었다**
> (2026-09-28 실측 — 화면에 한국어로 나왔다).

| 한국어 | English |
|---|---|
| 바이오 | **Bio** |
| 푸드 | **Food** |

> ⚠⚠ **영문 빌드에서 고칠 곳 — 존 오버뷰 카드(`areas` 배열 렌더)**
>
> `index.html:1286` 이 배열 값에서 `parseFloat(area)` 로 숫자를 뽑아
> `<span class="cnt" data-to="…">0.0</span>만평` 을 만든다. **「만평」이 하드코딩**이다.
>
> | | 한국어판 | **영문판** |
> |---|---|---|
> | 배열 값 | `'6.2만평'` | `'0.21 km²'` |
> | 렌더 꼬리 | `>0.0</span>만평` | `>0.00</span> km²` |
>
> ⚠ 소수 자릿수를 `0.0` → **`0.00`** 으로 함께 고친다. 권역 면적이 0.06~0.94 라
> 한 자리로 두면 비즈니스(0.06)가 **`0.1`** 로 뭉개진다.
> ⚠ **§3 지표와 한 벌이다** — 한쪽만 고치면 같은 페이지에서 만평과 km² 가 섞인다.
> ⚠ 「골프레저」 → `Golf & Leisure`. `&` 는 짧은 카드 라벨에만 쓰고 본문에서는 `and` 다
> (`GLOSSARY.md` §10).

#### 빌드가 읽는 대조표 — 배열 값 8개

값이 `areas` 배열의 **문자열 리터럴 전체**라 그것을 그대로 키로 둔다(치환 단위가
「리터럴 전체」다). 위 표의 「면적」 칸과 같은 값이며, **여덟 개의 합이 2.16 km²** 로
아래 합계 행과 맞는다(정본 ㎡ 합 2,156,022㎡ · `districts.html` 부지 면적).

| 한국어 | English |
|---|---|
| 6.2만평 | 0.21 km² |
| 8.2만평 | 0.27 km² |
| 4.2만평 | 0.14 km² |
| 3.9만평 | 0.13 km² |
| 1.7만평 | 0.06 km² |
| 9.7만평 | 0.32 km² |
| 2.7만평 | 0.09 km² |
| 28.5만평 | 0.94 km² |

⚠ 만평 표기는 **절사값**이라 그대로 환산하면 안 된다 — 6.2만평은 204,959㎡ 지만 실제
부지는 206,959㎡ = 0.21 km² 다. km² 는 **㎡ 정본에서** 뽑았다(§11.65 의 절사 이력).

#### 합계 줄 — 세 조각이 서로 다른 `<span>` 에 있다

`권역부지 <span class="text-mint">65만평</span> <span class="text-white/50">/ 110만평</span>`
이라 덩이 하나로 잡히지 않는다. 조각별로도 넣어 둔다.

| 한국어 | English |
|---|---|
| 권역부지 | District land |
| 65만평 | 2.16 km² |
| / 110만평 | / 3.63 km² |

---

## 6 구역소개 (`#districts` · `zones` 배열)

| 한국어 | English |
|---|---|
| 구역소개 *(h2)* | **Districts** |
| 클러스터 *(탭)* | **Clusters** |
| 콤플렉스 *(탭)* | **Complexes** |
| 자세히 보기 | **Learn more** |
| `{권역명} 자세히 보기` *(aria-label)* | `See more about {district}` |
| 부지 개요 | **Site profile** |
| `{n}페이지로 이동` *(점 aria-label)* | `Go to item {n}` |

> ⚠ 8권역의 제목 · 헤드 · 설명 · 스펙은 **`en/districts.md` 와 같은 문면을 쓴다.**
> 메인과 서브페이지가 같은 값을 두 벌 갖고 있으므로(§7.2 — 마크업은 JS 가 만든다)
> **한쪽만 고치면 어긋난다.** 아래는 메인에만 있는 축약형만 적는다.

| 권역 | 한국어 | English |
|---|---|---|
| 01 AI데이터 클러스터 | 국가대표급 하이퍼스케일 | Hyperscale at national flagship scale |
| 02 첨단 바이오 클러스터 | AI 기반 신약 R&D 및 중소형 CDMO 거점 | A hub for AI-driven drug R&D and small-to-mid CDMO |
| 03 푸드 물류 클러스터 | AI 콜드체인 허브이자 군 급식 수요 대응 거점 | An AI cold-chain hub, and a base serving military catering demand |
| 04 바이오MICE 클러스터 | 지속가능한 바이오·헬스 산업 커뮤니티 조성 | Building a lasting bio-health industry community |
| 05 비즈니스 콤플렉스 | 상업‧업무‧문화가 융합된 강원 관문 | Gangwon’s gateway, where retail, offices and culture meet |
| 06 하우징 콤플렉스 | 첨단 기술과 자연을 누리는 하우징 / 시니어 | Housing and senior living with advanced technology and nature |
| 07 에듀 콤플렉스 | 생애 전주기 교육하는 ‘생각하는 도시’ 글로벌 에듀 콤플렉스 | A global Education Complex — a ‘thinking city’ with education across the whole life course |
| 08 골프레저 콤플렉스 | 바이오 스마트·피지컬 AI 기반 웰니스 | Wellness built on bio-smart and physical AI |
| 05 비즈니스 (desc · 메인에만 있다) | 도시를 넘어 광역 유동인구까지 흡수하는 직·주·락 중심 주민친화적 단핵 복합 상권 조성 | A single-core, mixed-use commercial district built around work, living and leisure — drawing visitors from across the wider region, not just the city |

### `zones` 배열의 스펙 — 메인 전용 형식

> ⚠⚠ **메인의 spec 보조값은 서브 구역소개에 없는 형식이다.** 서브는 표로 나누어 적는데
> 메인은 `['라벨','값','보조값']` 세 칸이라 문자열이 서로 다르다 — 그래서
> `en/districts.md` 를 그대로 물려받지 못하고 **여기에 따로 적어야 한다.**
> ⚠ 이 표가 없던 동안 05 비즈니스 · 06 하우징 · 07 에듀 · 08 골프레저의 스펙이
> **영문판에서 한국어로 나왔다**(2026-09-28 실측). JS 가 만드는 DOM 이라
> 빌드의 `남은 한국어` 집계에도 잡히지 않았다.
> ⚠ 면적은 `GLOSSARY.md` §7 대로 **m² 를 앞에 두고 평을 괄호에** 남긴다 —
> 국문이 `8,949평 (29,583㎡)` 처럼 평을 앞세운 자리도 영문에서는 뒤집는다.

| 한국어 | English |
|---|---|
| 건폐율 70% · 용적률 350% | **BCR 70% · FAR 350%** |
| 128,634㎡ (38,912평) | **128,634 m² (38,912 pyeong)** |
| 4개 구역 | **Four blocks** |
| MICE·의료시설 등 | **MICE, medical and related** |
| 55,703㎡ (16,850평) | **55,703 m² (16,850 pyeong)** |
| 핵심시설 | **Key facility** |
| 8,949평 (29,583㎡) | **29,583 m² (8,949 pyeong)** |
| 7,901평 (26,120㎡) | **26,120 m² (7,901 pyeong)** |
| 공동주택 4,000 · 시니어 2,000 | **4,000 apartments · 2,000 senior units** |
| 시니어하우징 | **Senior residences** |
| 유·초·중·고 | **K–12** |
| (시범사업) | **(pilot program)** |
| 942,976㎡ (285,250평) | **942,976 m² (285,250 pyeong)** |
| 코스 | **Course** |

> ⚠ 「유·초·중·고」는 유치원부터 고등학교까지라 `K–12` 와 정확히 대응한다. 값 칸이 좁아
> 서브페이지의 `Kindergarten / Elementary school / …` 를 그대로 쓸 수 없다.
> ⚠ 「시니어하우징」은 다른 자리에서 이미 `senior residences` 다 — `senior housing` 으로
> 쓰면 같은 시설이 두 이름으로 나온다.

> ✅ **07 의 한국어를 기획서 원문으로 되돌렸다**(2026-09-15 지시) —
> 「생애 전주기 교육하는 ‘생각하는 도시’ **글로벌 에듀 콤플렉스**」. 메인 · 구역소개 둘 다.
> ⚠ 바로 위 라벨이 「07 에듀 콤플렉스」라 **콤플렉스 이름이 한 화면에 두 번 나온다** — 의도된 것이다.
> ⚠ 영문도 구조를 맞춰 `A global Education Complex — …` 로 콤플렉스 이름을 앞세웠다.
> ⚠ 「국가대표급」을 `national flagship` 으로 옮겼다. `national team-level` 은 스포츠
> 비유가 그대로 남아 영어에서 우습게 읽힌다.
> ⚠ 「군 급식」 → `military catering`. `military food service` 도 쓰이지만 급식 조달
> 계약 맥락에서는 `catering` 이 관용이다.

---

## 7 홍보센터 (`#pr`)

| 한국어 | English |
|---|---|
| 홍보센터 *(h2)* | **News & Media** |
| 언론보도 / B-CITY의 최신 소식을 언론 기사로 만나보세요. | Media coverage / The latest news about B-CITY in the media. |
| 홍보영상 / 도시의 비전을 담은 영상 콘텐츠. | Videos / Discover the vision for B-CITY. |
| 갤러리 / B-CITY의 조감도와 현장 이미지. | Gallery / Renderings and site photography of B-CITY. |
| 바로가기 → | **View** → |
| 공지사항 → | **Notices** → |
| B-CITY 발행물 → | **B-CITY publications** → |

> ⚠ 「바로가기」를 `Go` 로 줄였다. 카드 세 장에 반복되는 링크이므로 짧아야 하고,
> 화살표가 이미 이동을 뜻한다. `View` · `Open` 도 후보였으나 대상이 목록 페이지여서
> `Go` 가 중립적이다.

---

## 8 푸터

| 한국어 | English |
|---|---|
| 대한민국 AI·바이오 산업의 중심에서<br>글로벌 경쟁력을 갖춘 혁신 생태계를 완성합니다 | Building a globally competitive innovation ecosystem<br>at the heart of Korea’s AI and biotechnology industries |
| 참여기관 & 파트너 | **Participating organizations & partners** |
| **바이오테크 이노밸리 PFV** | **Biotech Innovalley PFV** |
| 주소 : 서울특별시 광진구 자양로58 태림빌딩 3층 | Address: 3F Taerim Bldg., 58 Jayang-ro, Gwangjin-gu, Seoul, Republic of Korea |
| 사업자등록번호 : 883-81-03982 | Business registration no.: 883-81-03982 |
| * 본 홈페이지에 사용된 영상, 사진 및 이미지 등은 소비자의 이해를 돕기 위한 것으로 변경될 수 있음 | \* Video, photography and images on this site are provided to aid understanding and are subject to change |
| * 본 홈페이지에서 제공되는 정보는 향후 사업추진 상황에 따라 변경될 수 있음 | \* Information on this site may change as the project proceeds |
| 푸터 메뉴 *(nav aria-label)* | Footer menu |
| 회사소개 | **About Us** |
| 개인정보처리방침 | **Privacy Policy** |

### 파트너 로고 (`partners` 배열 · `alt`)

| 한국어 | English |
|---|---|
| 국토교통부 | Ministry of Land, Infrastructure and Transport |
| 강원특별자치도 | Gangwon State |
| 춘천시 | Chuncheon City |
| 더존비즈온 | Douzone Bizon |
| IBK투자증권 | IBK Investment & Securities |

> ⚠ 「참여기관 & 파트너」의 순서를 뒤집어 `Partners & authorities` 로 했다 —
> 영어에서 `Participating institutions` 는 학술 컨소시엄처럼 읽힌다.
> ⚠ 주소를 **역순**으로 바꿨다(작은 단위 → 큰 단위). `Republic of Korea` 를 더한 이유는
> `en/about.md` 와 같다.
> ⚠ **`Gangwon State`** — 강원특별자치도의 공식 영문 표기다(`GLOSSARY.md` §6).
> ⚠ 로고 `alt` 는 기관명 그대로 둔다. 「로고」라는 말을 붙이지 않는다 —
> 스크린리더가 이미 이미지임을 알린다.

### 섹션 점 내비 (`scenes` 배열 · aria-label)

| 한국어 | English |
|---|---|
| 메인 / 입지 / 사업개요 / 도시 컨셉 / 구역 개요 / 구역소개 / 홍보센터 / 회사정보 | Top / Location / Overview / Concept / Districts at a glance / Districts / News & Media / Company |

> ⚠ 「메인」은 이 페이지 자신이므로 `Home` 이 아니라 **`Top`** 이다(히어로로 돌아가는 점).
> ⚠ 「구역 개요」와 「구역소개」가 영어로는 둘 다 `Districts` 가 된다 —
> 앞을 `Districts at a glance` 로 구분했다.

---

## 9 플로팅 · GNB

| 한국어 | English |
|---|---|
| 문의하기 *(플로팅 독)* | **Contact** |
| 맨 위로 *(aria-label)* | Back to top |
| B·CITY 홈 *(로고 aria-label)* | B-CITY home |
| 메뉴 열기 / 메뉴 닫기 *(aria-label)* | Open menu / Close menu |
| 사업 문의 *(모바일 메뉴 버튼)* | **Contact us** |

> ⚠⚠ **`준비중입니다` 툴팁은 영문판에서 배선을 뒤집어야 한다.** 지금은 `EN` 에
> 「준비중입니다」가 붙어 있다(§11.86). 영문 페이지가 생기면
> ① `EN` 을 실제 링크로 바꾸고 ② 같은 툴팁을 **`KO` 쪽에 붙일 이유가 없다**(한국어 페이지는
> 이미 있다). 즉 이 문자열은 **번역 대상이 아니라 제거 대상**이다.
> `README.md` 의 빌드 계획 5번에 그 항목이 있다.
> ⚠ 「문의하기」가 세 자리에 나온다 — 플로팅 독(`Inquire`) · 모바일 메뉴 버튼
> (`Contact us`) · 모달 제목(`Contact us`). 같은 말로 통일하지 않았다:
> 독은 아이콘 옆 좁은 칸이라 한 낱말이어야 한다.
> ⚠ GNB · LNB 의 대분류와 하위 항목은 **`_shell.md` 가 정본**이다. 메인의 `siteMap` 과
> `nav.json` 이 두 벌이므로(§7.0.1) **양쪽을 함께 고친다.**

---

## 10 문의 모달 (`#contact`)

| 한국어 | English |
|---|---|
| 문의하기 *(h2)* | **Contact us** |
| 기업입주 · 투자 · 사업 문의를 남겨주시면 담당자가 순차적으로 연락드립니다. | For business location, investment or project inquiries, please submit your inquiry and a member of our team will respond in turn. |
| 닫기 *(aria-label)* | Close |
| 확대보기 *(aria-label · 라이트박스 대화상자 이름)* | Enlarged view |
| 관심분야 * | **Area of interest** \* |
| 기업입주문의 | Business location |
| 투자문의 | Investment |
| 사업문의 | Project inquiries |
| 관심분야를 1개 이상 선택해 주세요. | Please select at least one area of interest. |
| 회사명/이름 * | **Company / Name** \* |
| 예) 비시티(주) / 홍길동 *(placeholder)* | e.g. B-CITY Co., Ltd. / Jane Doe |
| 회사명 또는 이름을 입력해 주세요. | Please enter a company or personal name. |
| 휴대전화 * | **Mobile** \* |
| `010-0000-0000` *(placeholder)* | `+82 10 0000 0000` |
| 휴대전화번호를 정확히 입력해 주세요. | Please enter a valid mobile number. |
| 이메일 * | **Email** \* |
| `name@company.com` *(placeholder)* | name@company.com |
| 이메일 주소를 정확히 입력해 주세요. | Please enter a valid email address. |
| 문의 내용 * | **Your inquiry** \* |
| 문의하실 내용을 입력해 주세요. *(placeholder)* | Please describe your inquiry. |
| 문의 내용을 입력해 주세요. *(오류)* | Please enter your inquiry. |
| **필수** *(태그)* | **Required** |
| 개인정보 수집 · 이용에 모두 동의합니다 | I agree to the collection and use of my personal data |
| 처리방침 보기 | **Read the policy** |
| 필수 항목에 동의해 주세요. | Please agree to the required collection and use of personal data. |
| **선택** *(태그)* | **Optional** |
| 마케팅 활용 동의에 동의합니다 | I agree to the use of my data for marketing |
| 사업 주관 | **Project developer** |
| 처리 절차 | **What happens next** |
| 문의 접수 | We receive your inquiry |
| 담당자 배정 · 내용 검토 | We assign your inquiry to the relevant team for review |
| 유선 또는 이메일 회신 | We reply by phone or email |
| 수집한 개인정보는 ‘개인정보 보호법’ 등 관련 법령에 따라 안전하게 관리되며, 문의 처리 목적이 달성된 후 관련 법령 및 내부 방침에 따른 보유 기간 동안 보관된 뒤 지체 없이 파기됩니다. | Personal data collected is kept secure under the Personal Information Protection Act and other applicable law. Once the purpose of handling your inquiry has been met, it is retained for the period required by law and by our internal policy, and then destroyed without delay. |
| 등록하기 | **Submit** |
| 다시쓰기 | **Reset** |

### 전송 상태 문구 (`contact.js`)

| 한국어 | English |
|---|---|
| 입력하지 않은 필수 항목이 있습니다. | Some required fields are missing. |
| 전송 중입니다… | Sending… |
| 문의가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드립니다. | Your inquiry has been received. Our team will review it and respond in due course. |
| 전송에 실패했습니다. 잠시 후 다시 시도해 주세요. | Sending failed. Please try again shortly. |
| 메일 작성 창이 열립니다. 열리지 않으면 다시 시도해 주세요. | Your email app should open. If it does not, please try again. |
| `[B-CITY 문의] {이름} - {관심분야}` *(메일 제목)* | `[B-CITY inquiry] {name} — {interest}` |

> ⚠⚠ **메일 본문의 키 이름이 한국어다.** `contact.js` 가
> `{ 관심분야, '회사명/이름', 휴대전화, 이메일, 문의내용, 마케팅활용동의 }` 로 본문을 만든다.
> 영문 폼에서 한국어 키로 메일이 오면 **담당자는 읽을 수 있지만 문의자는 무엇이 전송됐는지
> 모른다.** 영문판에서는 키를 영문으로 바꾸되 — **담당자가 한국어 담당이므로
> `Interest (관심분야)` 처럼 병기하는 편이 안전하다. 확인 필요.**
> ⚠ 전화번호 placeholder 를 `+82 10 0000 0000` 로 바꿨다. `010-…` 은 국내 형식이라
> 해외 독자가 자기 번호를 어떻게 넣을지 알 수 없다.
> **⚠ 그러면 검증 정규식도 함께 고쳐야 한다** — 지금은 `maxlength="13"` 에
> 국내 형식 검사다. 국제번호는 13자를 넘는다.
> ⚠ 「문의하기」 모달 제목을 `Contact us` 로, 필드 라벨을 `Your inquiry` 로 갈랐다 —
> 같은 화면에 「문의」가 세 번 나오는데 영어에서 `Inquiry` 를 세 번 쓰면 어느 것이
> 무엇인지 흐려진다.
> ⚠ 철자는 **`inquiry` / `inquire`**(미국식)로 통일했다. 영국식 `enquiry` 는
> 이 폴더 전체에서 쓰지 않는다 — `GLOSSARY.md` §10 의 미국 영어 결정에 따른다.

---

## 11 개인정보처리방침 (`#privacy`)

✅ **확정(2026-09-15 사용자 확인) — 한국어본을 그대로 두고 머리에 준거 언어 한 줄을 붙인다.**
영문 본문은 만들지 않는다.

| 한국어 | English |
|---|---|
| *(원문에 없음 — 영문 페이지에만 추가)* | **This Privacy Policy is provided in Korean. The Korean version is the governing text.** |
| 개인정보처리방침 *(모달 제목)* | **Privacy Policy** |

> ⚠ **붙이는 자리는 모달 제목 바로 아래, 본문 첫 조항 앞**이다. 뒤에 붙이면 2,000자를
> 다 읽고 나서야 「한국어다」를 알게 된다.
> ⚠ 이 문장은 **원문에 없는 문장을 의도적으로 더하는 두 번째 자리**다(첫째는 공문 각주의
> `Documents are in Korean.` · `en/company.md`). 두 문장의 어법을 같은 계열로 맞췄다.

> ⚠⚠ **본문을 번역하지 않는 이유는 셋이다.**
>
> 1. **법률 문서다.** 「개인정보 보호법」 제30조에 따른 공개 의무 문서이고, 조문 번호
>    (제17 · 18 · 26 · 29조)와 「개인정보 처리 방법에 관한 고시」 별지 서식이 인용된다.
>    영문 번역에 오역이 있으면 **고지 의무를 다하지 못한 것이 된다.**
> 2. **준거 언어 조항이 필요하다.** 영문판을 내려면 맨 앞이나 뒤에
>    「본 방침의 해석에 다툼이 있는 경우 한국어본이 우선한다」에 해당하는 문장
>    (`In the event of any discrepancy, the Korean version prevails.`)을 반드시 넣어야 한다.
>    그 문장 없이 영문본만 올리면 **두 본이 대등한 효력을 갖는 것으로 읽힐 수 있다.**
> 3. **개인정보 보호책임자 이름이 들어 있다.** 실명이므로 로마자 표기를 임의로 정하지
>    않는다 — **본인이 쓰는 표기를 받아야 한다.**
>
> ✅ 위 세 가지가 **그대로 유효하다.** 정식 영문본이 필요해지면 **법무 검토를 거친 번역**을
> 별도로 받는다 — 그때는 이 한 줄을 「해석에 다툼이 있으면 한국어본이 우선한다」
> (`In the event of any discrepancy, the Korean version prevails.`)로 **바꿔야 한다.**
> 지금 문장은 **영문본이 없다는 전제**의 것이다.
>
> ⚠ 번역하기로 결정될 경우를 위해 **용어와 기관 공식 영문명은 미리 고정해 두었다** —
> `GLOSSARY.md` **§11**. 그 절은 번역 승인이 아니라 용어 고정일 뿐이다.
>
> ⚠ 제9조의 「쿠키를 사용하지 않으며」는 **영문판에서도 사실이어야 한다.** 영문 페이지에
> 분석 도구를 붙이면 이 조문이 거짓이 된다 — 붙일 계획이 있으면 방침을 먼저 고친다.

---

## 12. 입지 지도 라벨 (`locRoutes` 데이터)

⚠⚠ **이 34개는 카피가 아니라 데이터다** — `index.html` 의 `locRoutes` 배열에 있고 JS 가
SVG 로 그린다. 그래서 다른 절의 대조표에 없었고, 영문 빌드를 실제로 돌려 보니
**메인 히어로 바로 아래 지도가 통째로 한국어**였다(2026-09-16 실측).
표기는 이미 다른 절에 있는 형태를 그대로 따랐다(`Sokcho Port` · `Yangyang Int’l Airport` 등).

⚠ **`|` 는 줄바꿈이다**(렌더러가 `dy 26` 으로 내린다). 표에서는 `\|` 로 적는다.
⚠ **알약 폭은 코드가 `getBBox()` 로 재서 맞춘다**(§11.106). 영문은 1.8배 넓으므로
  **겹침을 반드시 다시 재야 한다** — 아래 「조정 기록」의 실측값 참조.
⚠ `남춘천IC` 는 `Namchuncheon IC` 로 통일했다. `en/districts.md` 에 `Nam-Chuncheon IC`
  가 두 곳 있어 **표기가 갈려 있다** — 확인 필요.

⚠⚠ **2026-09-17 지도 교체로 이 표가 바뀌었다**(index.html 의 `locRoutes` 01 스텝).
  ① 노선명 + 시간을 합친 알약 3개를 **다시 분리**했다 → `GTX-B(예정) 50분` ·
     `서울양양고속도로 40분` · `제2경춘국도(예정) 45분` 키가 사라지고 `40분` 이 생겼다.
     ⚠ **「50분」·「45분」은 지시서에서 빠진 값**이다. 되살아나면 키도 되살려야 한다.
  ② `감일JCT` · `양평JCT` 가 한 줄 라벨이 됐다(`|(예정)` 둘째 줄 제거).
  ③ ✅ **`제2경춘국도(예정)`** — 2026-09-17 에 전 사이트를 「국도」로 통일했다
     (사용자: 「그게 더 공식명칭이래」). 영문도 **`2nd Gyeongchun National Road`** 다 —
     1차 검토안의 제안으로 돌아온 것이다(`README.md` B6 · `GLOSSARY.md` 참조).

⚠⚠ **2026-09-18 — 지도가 Figma 프레임 `section2_01` 기준으로 다시 만들어졌다.**
  라벨 집합은 그대로지만 **영문만 배치가 다르다.** 영문은 같은 내용이 1.8배 넓어
  시안 좌표 그대로는 **6곳이 겹쳐 읽히지 않았다**(실측: `Cheongnyangni Sta.`↔`Maseok Sta.`
  50px · `Gapyeong Sta.`↔GTX-B 알약 50 · `Dangnim-ri`↔제2경춘 알약 129 ·
  `Gangchon IC`↔서울양양 알약 69 · `Namchuncheon IC`↔핀 79).
  → **국문 좌표는 시안 그대로 두고 영문만 옮긴다.** 그 override 는 사전이 아니라
  `tools/build/pages-en.mjs` 의 **`FIXUPS['index.html']`** 에 있다(사전은 글자만 바꾼다).
  옮긴 것 — 청량리역/마석역 좌우 25px씩 · GTX-B 알약 −48 · 제2경춘 알약 −29 ·
  서울양양 알약 −37 · 남춘천IC 라벨 +111. 남은 겹침 **2곳(1px · 5px)** 으로 둘 다 무시 가능.
  ⚠ **알약은 좁은 자리용 축약형을 쓴다**(`LAYOUT-NOTES.md`) — 지도에서만이고 본문은 긴 형태다:
  `2nd Gyeongchun National Road (planned)` → **`2nd Gyeongchun Nat’l Rd.`** ·
  `Seoul–Yangyang Expressway` → **`Seoul–Yangyang Expwy`**.
  ⚠ `FIXUPS` 의 `from` 은 **번역된 뒤의 문자열**이다 — 아래 표의 문면을 고치면 그쪽도 낡는다.
    1회 일치 assert 가 잡아 준다(빌드가 죽는다).

⚠⚠ **2026-09-18 — 아래 8개(02·03 씬 지점명)가 이제 실제로 번역된다.** 그전에는 배경
래스터에 구워져 있어 **표에 값이 있어도 화면에는 국문이 남았다** — 03 은 소요시간 배지만
코드라서 영문판이 「김포공항 + 80 min」처럼 두 언어가 섞였다. 디자이너가 글자 없는 배경을
다시 줘서 `showLabels` + 노드별 `label` 로 코드가 그린다(§11.111).
⚠ `B-CITY` 말풍선은 **여전히 배경 이미지**다 — 도형이고 두 언어가 같은 글자라 번역 대상이
아니다. 문면을 바꿔야 할 일이 생기면 배경을 다시 받아야 한다.

| 한국어 | English |
|---|---|
| 서울역 | **Seoul Sta.** |
| 청량리역 | **Cheongnyangni Sta.** |
| 마석역 | **Maseok Sta.** |
| 가평역 | **Gapyeong Sta.** |
| 춘천역 | **Chuncheon Sta.** |
| 잠실 | **Jamsil** |
| 화도IC | **Hwado IC** |
| 금남JCT | **Geumnam JCT** |
| 당림리 | **Dangnim-ri** |
| 강촌IC | **Gangchon IC** |
| 남춘천IC | **Namchuncheon IC** |
| 감일JCT | **Gamil JCT** |
| 양평JCT | **Yangpyeong JCT** |
| B-CITY\|춘천기업혁신파크 | **B-CITY\|Chuncheon EIP** |
| GTX-B(예정) | **GTX-B (planned)** |
| 서울양양고속도로 | **Seoul–Yangyang Expressway** |
| 40분 | **40 min** |
| 제2경춘국도(예정) | **2nd Gyeongchun National Road (planned)** |
| 서울~양평고속도로(예정) | **Seoul–Yangpyeong Expwy (planned)** |
| 3분 | **3 min** |
| 10분 | **10 min** |
| 15분 | **15 min** |
| 30분 | **30 min** |
| 45분 | **45 min** |
| 50분 | **50 min** |
| 60분 | **60 min** |
| 80분 | **80 min** |
| 90분 | **90 min** |
| 120분 | **120 min** |
| 춘천 | **Chuncheon** |
| 원주 | **Wonju** |
| 강릉 | **Gangneung** |
| 평창 | **Pyeongchang** |
| 김포공항 | **Gimpo Airport** |
| 양양국제공항 | **Yangyang Int’l Airport** |
| 속초항 | **Sokcho Port** |
| 동해항 | **Donghae Port** |

⚠ **`당림리` 는 지금 어느 화면에도 없다** — 메인 지도(§11.115)와 입지 종합 교통도(§11.125)에서
차례로 빠졌고 `index.html` 에는 **경위 주석으로만** 남아 있다(주석은 치환 대상이 아니다).
키를 지우지 않은 이유는 되살릴 때 그대로 쓰기 위한 것이다 — 쓰이지 않는 키는 무해하다.
⚠ 이 문단을 **표 안에 넣지 말 것.** 표 중간에 문단이 끼면 뒤쪽이 머리글 없는 표로 쪼개져
   그 행들이 **사전에서 통째로 빠진다**(§11.111 에서 02 지명 4개가 그렇게 번역되지 않았다).

---

## ⚠⚠ 강조(`**굵게**`) — 국문에 강조가 있는 자리에만 쓴다

`.md` 셀의 `**…**` 는 **실제 HTML 태그로 나간다**(`i18n.mjs` §9 ② · `lines()`).
메인 제목(`.lo-title` · `.ov-title`)에서는 **`<span class="ov-em">`** 이 되고
그 색은 `--color-light-blue`(#BBCCF0) — 본문색(#111)보다 훨씬 **연하다.**

그래서 **국문 소스에 강조가 없는 자리에 `**` 를 쓰면 영문만 글자색이 갈린다.**

| 2026-09-21 지적 | "영문버전 두번째 섹션 2,3씬 제목 글씨색이 연한 글씨가 섞여있어" |
|---|---|

원인은 이 파일의 두 행이었다 — `A connected **biohealth economy across Gangwon**` ·
`B-CITY, **a new hub for global business**`. 국문 제목
(`'강원형 바이오·헬스 / 초광역 경제권' 구축` · `글로벌 비즈니스의 / 새로운 거점, B-CITY`)에는
`ov-em` 이 없다. **`**` 를 걷어 두 언어를 한 색으로 맞췄다.**

**대조 방법** — 페이지마다 개수를 세면 바로 보인다(국문 2 · 영문 4 였다):

```bash
for f in index.html en/index.html; do
  echo "$f $(grep -c 'ov-em' $f)"; grep -o 'class="ov-em">[^<]*' $f; done
```

⚠ **메인에서 `ov-em` 이 정당한 자리는 두 곳뿐이다** — `민간기업 중심 도시개발 사업`(사업개요) ·
`국가첨단전략산업 특화단지 지정`(도시컨셉). 국문에 그 마크업이 실제로 있다.
⚠ 반대로 **영문이 강조를 잃는 경우도 있다**(서브페이지 3곳 · 아래 §미해결). 그쪽은
  `**` 를 더 넣는 문제가 아니라 치환기의 태그 재사용 규칙 문제다.

## 이 페이지의 조정 기록

| 자리 | 조정 | 이유 |
|---|---|---|
| meta description | 78자 → **175자**(권고 152자) | `DESC_MAX = 80` 은 한국어 전용. 위 §0 참조 |
| 「(비시티)」 | **삭제** | 한글 독음 표기다 |
| 「서부개척 시대」 | `the frontier era` | `Wild West` 는 무법 쪽 함의 |
| 히어로 줄바꿈 | `가` 뒤 → **`era,` 뒤** | 골드러시↔데이터 러시 대구를 보이게 |
| 「초광역 경제권」 | `mega-region` | 「광역」의 두 뜻을 가른다. `GLOSSARY.md` §1 |
| 해시태그 4종 | 밑줄 유지 + CamelCase | 지명 + 산업명 구조를 원문대로 |
| 「양양국제공항」 | `Yangyang Int’l Airport` | `.lo-pill` 폭 |
| **면적 단위** | 만평 → **km²**(평 병기 불가) | 카운트업 칸에 괄호를 쓸 수 없다. ✅ **확정**(2026-09-15) — IM 의 `Acres` 우선 표기는 따르지 않는다 · §3 참조 |
| 「1.1조원」 | 카운트업은 `trillion won`, 본문은 `KRW 1.1 trillion` | 단위 칸 길이 |
| 「국토교통부」 | 제목에서 `Ministry of Land`, 본문에서 풀어 쓴다 | 정식 명칭 45자 |
| 「국가대표급」 | `national flagship` | 스포츠 비유가 영어에 남지 않게 |
| 「구역 개요」 / 「구역소개」 | `Districts at a glance` / `Districts` | 영어로는 같은 말이 된다 |
| 「메인」(점 내비) | `Top` | 이 페이지 자신이라 `Home` 이 아니다 |
| 「바로가기」 | `Go` | 세 카드에 반복되는 링크 |
| 「참여기관 & 파트너」 | **순서 반전** `Partners & authorities` | `Participating institutions` 는 학술 함의 |
| 주소 | **역순** + `Republic of Korea` | 영문 주소 관례 |
| 「준비중입니다」 | **제거 대상**(번역 아님) | 영문판이 생기면 `EN` 이 실제 링크가 된다 |
| 「문의하기」 3곳 | `Inquire` / `Contact us` / `Your inquiry` | 같은 말 세 번은 영어에서 흐려진다 |
| 철자 | `inquiry` · `inquire`(미국식) | `enquiry` 는 쓰지 않는다. `GLOSSARY.md` §10 |
| 전화 placeholder | `+82 10 …` | **검증 정규식도 함께 고칠 것** |
| 개인정보처리방침 | **번역하지 않았다** | 법률 문서 · 준거 언어 조항 · 실명. 위 §11 참조 |

### 0916 수정본 반영 (2026-09-16)

`B-CITY_홈페이지_영문_번역본_20260916_수정.xlsx` 의 9건 중 이 페이지 몫 7건이다.
문면은 번역 담당자 값이며, 아래 두 줄만 다르게 넣었다.

| 자리 | 조정 | 이유 |
|---|---|---|
| 히어로 | `From the frontier’s gold rush / to the 21st-century data rush` → **`From the Gold Rush / to the 21st-century Data Rush`** | 담당자 확정. `<br>` 과 둘째 줄 강조는 국문 구조를 따랐다. **모바일 축약안 칸이 비워져** 모바일도 이 문면을 쓴다 |
| 초광역 경제권 | `Building a biohealth economic region…` → **`A connected biohealth economy across Gangwon`** | 기존 **모바일 축약안이 PC 문면으로 올라갔다**. ⚠ 2026-09-21 에 **강조를 걷었다** — 아래 §강조 참고 |
| AI DATA | `up to 435 MW of capacity` → **`of power supply capacity`** | 수전 용량임을 밝힌다. ✅ **2026-09-16 지시로 컨셉 · 구역 소개의 같은 표현 2곳도 함께 고쳐 세 곳이 같다** |
| BIO INDUSTRY | `A biotechnology hub linking…` → **`A hub linking…`** | 앞의 `BIO INDUSTRY` 라벨과 겹친다 |
| FOOD CLUSTER | `A food industry hub connecting…` → **`A hub connecting…`** | 같은 이유 |
| description | `pilot project … biotechnology, food and MICE` → `project … biotech, foodtech and MICE` → **`the Chuncheon Enterprise Innovation Park … biotech, food tech and MICE`** | 2026-09-17 검수 확정본. 「선도사업」을 옮기지 않고 정식명을 그대로 쓴다 |
| ~~⚠ `pilot` 삭제~~ | ✅ **확정 · 전 자리 적용**(2026-09-16 지시) | 서술문에서 「선도사업」을 옮기지 않는다 — 이 페이지 외 **6곳**(`company` 3 · `schedule` 1 · `_shell` 1 · `MOBILE-COPY` 2)도 함께 고쳤다. **정식명 `Chuncheon Enterprise Innovation Park Pilot Project`(대문자)는 그대로다.** `GLOSSARY.md` §1 · §9 |
| ~~⚠ `biotech,foodtech`~~ | ✅ **`biotech, food tech`**(2026-09-17 확정) | 엑셀 셀에 공백이 없어 2026-09-16 에 `biotech, foodtech` 로 고쳤는데, **2026-09-17 검수 기준이 「본문에서는 두 단어(`food tech`)」로 확정**해 다시 갈랐다. ⚠ `food-tech`(형용사) · `food technology` 는 그대로 쓴다 — 검수자가 그 행들을 확정했다 |
| ✅ description 길이 | **147자** (182 → 174 → **147**) | 2026-09-17 검수 확정본이 문면을 줄여 **권장 155자 안에 들어왔다.** 보류 항목 종결 |

> ⚠⚠ **입지 pill 두 개는 모바일에서 2줄이 되면 안 된다.** 390px 에서 pill 폭이 306px
> (334 − padding 28)인데 `Yangpyeong Expressway (planned) · Seoul 30 min` 과
> `Jungnang IC · 2nd Gyeongchun National Road (planned) 45 min` 이 각각 **61px(2줄)** 이라
> `#location` 스테이지(100vh · overflow hidden)를 넘겨 카피가 잘렸다(2026-09-28 실측).
> `Expwy` · `Rd.` 로 줄여 **39px(1줄)** 로 만들었다 — 회수 44px.
> ⚠ **지도 알약이 이미 `Expwy` 를 쓴다**(§11.113) — 같은 화면에서 표기가 어긋나지 않는다.
> ⚠ 도로 카드(`en/location.md`)는 **풀네임을 그대로 둔다** — 본문에는 자리가 있고
>   §11.113 이 「지도는 축약 · 카드는 풀네임」으로 정했다.
> ⚠ 문면을 다시 늘리면 **모바일 세로 예산이 44px 줄어** 좁은 폰에서 다시 잘린다.

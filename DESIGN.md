---
name: B-CITY Unified Digital
colors:
  # 2026-08-31 — 브랜드 정본 인디고로 통일했다. 예전 값 #344198 은 정본과
  #   ΔE 2.9 로 사람 눈에 구분되지 않는데 토큰만 둘이라 혼동을 낳았다.
  primary: "#2C3E91"
  primary-hover: "#253479"
  navy: "#002742"
  mint: "#3DBFA8"
  # 아이브로우 라벨 전용. 브랜드 심볼의 azure(brand-azure #0095D9)와 **역할도 값도**
  #   다르다 — 같은 이름이라 헷갈려 2026-08-31 에 역할 이름으로 바꿨다.
  label-blue: "#4E7AC7"
  light-blue: "#BBCCF0"
  bg: "#F4F8FE"
  surface: "#FFFFFF"
  text: "#111111"
  text-muted: "#5B6B82"
  line: "#D8E3F2"
  # 브랜드 정본 2색 — UI 토큰과 **다른 값**이다(§11.21).
  #   logo(Indigo) ≠ primary  ·  brand-azure ≠ azure(아이브로우용)
  #   코드에서는 --color-logo · --brand-azure 다(src/sub/css/00-tokens.css).
  # primary 와 **같은 값**이다(위 통일). 이름은 브랜드 규정 쪽 호칭으로 남긴다 —
  #   코드에서는 --color-logo: var(--color-primary) 별칭이라 갈라질 수 없다.
  logo: "#2C3E91"
  brand-azure: "#0095D9"
  district-ai: "#2C3E91"
  district-bio: "#288074"
  district-food: "#A1662B"
  district-mice: "#337AA3"
  district-housing: "#877240"
  district-edu: "#667D31"
  district-biz: "#7758AD"
  district-golf: "#378152"
  zone-ai: "#B6BDEC"
  zone-bio: "#B5EEE6"
  zone-food: "#F0D1B2"
  zone-mice: "#B5D9EE"
  zone-biz: "#CFC1E7"
  zone-housing: "#E8DCC0"
  zone-edu: "#DBEAB8"
  zone-golf: "#BAE8CB"
  zone-line-ai: "#22308C"
  zone-line-bio: "#197165"
  zone-line-food: "#93571A"
  zone-line-mice: "#216B97"
  zone-line-biz: "#653EA8"
  zone-line-housing: "#7D642C"
  zone-line-edu: "#576F1F"
  zone-line-golf: "#257442"
typography:
  # ⚠ 아래 scale 은 **설계된 램프가 아니라 현황 census** 다.
  #   2026-08-07 실측: index.html(src/css/app.css)과 서브페이지(src/sub/css)를 합쳐
  #   코드에 실제로 존재하는 font-size 단계가 **50개**다. 판정 허용오차 ±0.5px 로
  #   아래 43개 정수 앵커가 그 50개를 전부 덮는다(미덮개 0 확인).
  #
  #   왜 census 를 적어 두는가 —
  #   이전에는 이 블록이 7개 고정값(64/40/28/20/16/14/12)만 선언했고 코드와 전혀 맞지
  #   않아, lint·훅 경고가 전부 소음이 되어 **진짜 드리프트를 가려버렸다**(서브페이지
  #   리터럴 104개 중 78개가 램프 밖). 현황을 적어 두면 경고는 "새로 들어온 51번째 값"
  #   에서만 울린다 — 즉 이 목록은 **변경 감지기**이지 디자인 가이드가 아니다.
  #
  #   신규 작업에서 고를 목표 램프는 아래 산문(## Typography)에 따로 있다.
  #   50개를 그 목표 램프로 통합하는 것이 진짜 정리이며, 렌더가 바뀌므로 별건이다.
  scale:
    px-10:    10px
    px-11:    11px
    px-12:    12px
    px-13:    13px
    px-14:    14px
    px-15:    15px
    px-16:    16px
    px-17:    17px
    px-18:    18px
    px-19:    19px
    px-20:    20px
    px-21:    21px
    px-22:    22px
    px-24:    24px
    px-25:    25px
    px-26:    26px
    px-27:    27px
    px-30:    30px
    px-31:    31px
    px-32:    32px
    px-34:    34px
    px-38:    38px
    px-40:    40px
    px-41:    41px
    px-42:    42px
    px-44:    44px
    px-50:    50px
    px-52:    52px
    px-54:    54px
    px-56:    56px
    px-60:    60px
    px-62:    62px
    px-64:    64px
    px-68:    68px
    px-70:    70px
    px-72:    72px
    px-74:    74px
    px-80:    80px
    px-82:    82px
    px-84:    84px
    px-96:    96px
    px-116:   116px
    px-128:   128px
  # 역할별 **대표 단일값**. 유동 범위는 위 scale 과 아래 산문이 담당한다.
  # ⚠ 여기에 clamp() 를 쓰지 말 것 — impeccable 훅은 clamp 끝점을 읽지만
  #   design.md CLI 는 "not a valid dimension" 으로 거부한다(2026-08-07 실측).
  #   두 도구의 기대가 다르므로 교집합인 단일 px 로 적고, 값은 scale 안에서 고른다.
  hero-h1:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 68px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  section-h2:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 54px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  card-title:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
  kpi:
    fontFamily: "Inter, Pretendard, sans-serif"
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Inter, Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "'Avenir Next', Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Inter, Pretendard, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  2xl: 64px
---

## Overview

B-CITY 통합 디자털 디자인 시스템. 최종 IM(발표자료)의 시각 언어를 그대로 웹으로 확장한 것으로,
PPT·홈페이지·제안서·지도·아이콘이 하나의 토큰을 공유한다. 핵심 정서는 **메인 블루 중심의 신뢰감**,
**민트 포인트의 생명감**, **라이트 블루그레이 기반의 정제된 정보 구조**다. 여백을 넉넉히 두고
그림자는 최소화하며, 프리미엄 IM 톤을 유지한다.

## Colors

팔레트는 블루 계열을 중심으로 하고, 민트는 포인트로만 제한한다. 사용 비율은 Primary Blue 60~70%,
White/Blue White 20~30%, Point Mint 5~10%를 기준으로 한다.

- **primary (#2C3E91) — Primary / Indigo:** 메인 타이틀, 핵심 숫자, 표 헤더, 주요 아이콘, Primary CTA.
- **primary-hover (#253479):** Primary CTA·링크의 hover/active 상태. (웹 인터랙션용으로 추가)
- **navy (#002742):** 최종 IM 표지 톤. 다크 섹션·푸터 배경 등 강한 대비가 필요한 곳에 제한적으로 사용.
- **mint (#3DBFA8) — Point Mint:** 생명·바이오·순환·긍정 지표, 선택 상태 포인트. 넓은 배경 사용 금지.
- **label-blue (#4E7AC7) — Azure / Data Blue:** 데이터·교통·보조 그래프, 라인 강조.
- **light-blue (#BBCCF0):** 카드 라인, 비활성 단계, 지도 보조 영역.
- **bg (#F4F8FE) — Blue White BG:** 페이지 배경, 카드 내부 배경, 표 보조 행.
- **surface (#FFFFFF):** 카드 표면. 배경과 밝은 대비를 유지한다.
- **text (#111111):** 주요 본문, 표 텍스트.
- **text-muted (#5B6B82):** 서브카피, 단위, 캡션, 주석.
- **line (#D8E3F2):** 카드 경계, 표 라인, 구획선.

**District Map Colors** — 지도 8개 권역 구분 전용. 색상만으로 구분하지 않고 번호 마커·외곽선·라벨·범례를 함께 쓴다.
권역 색은 **권역당 색상(Hue) 하나에서 세 티어를 파생**시킨다. 티어마다 요구조건이 다르다.

| 티어 | 쓰임 | 요구조건 |
|---|---|---|
| `district-*` | 번호 배지 배경(흰 번호) · 평형 텍스트 · 카드 보더 | **흰색 대비 ≥ 4.5** (WCAG AA) — 최소 4.62 |
| `zone-*` | 토지이용계획도 면색 (`assets/landuse/zone-0N.svg`, fill-opacity 0.85) | 밝은 톤 L 82~83% 로 통일 |
| `zone-line-*` | 지도 외곽선 | 같은 Hue 의 짙은 톤 |

`district-ai` #2C3E91(AI 데이터), `district-bio` #288074(첨단바이오), `district-food` #A1662B(푸드물류),
`district-mice` #337AA3(바이오 MICE), `district-biz` #7758AD(비즈니스), `district-housing` #877240(하우징),
`district-edu` #667D31(에듀), `district-golf` #378152(골프레저).

> 이전 값(#21B9A5 · #E19A32 등)은 장식으로는 예뻤지만 흰 배경 위 13px 평형 텍스트로 쓰기에
> **8개 중 6개가 AA 미달**이었다(에듀 2.10 최악). 그래서 티어 전체를 어둡게 재설계했다.

## Typography

PPT에서는 한글 제목에 페이퍼로지(Paperlogy), 영문 헤드/라벨에 Avenir Next, 본문·수치에 Inter를 쓴다.
Web에서는 라이선스와 로딩 안정성을 고려해 동일 계열 대체 폰트(Pretendard, Noto Sans KR)를 병행한다.

- **hero-h1 (34~96px):** 페이지 첫 메시지. Paperlogy.
  메인은 `--text-hero` 68→82→96(뷰포트 1800·2300에서 단계 상승), 서브페이지는 `clamp(34px, 4.2vw, 62px)`.
- **section-h2 (26~74px):** 섹션 타이틀. 메인 `--text-h2` 54→64→74, 서브페이지 `clamp(26px, 2.5vw, 42px)`.
- **card-title (17~26px):** 카드·권역 제목.
- **kpi (30~74px):** 숫자를 가장 먼저 읽히게 하는 핵심 지표. Inter.
  기대효과 지표 `clamp(38px, 4.6vw, 74px)`, 수치 패널 `clamp(30px, 3.4vw, 52px)`.
- **body (14~18px):** 웹 본문 기본. Inter.
- **nav (14~16px):** GNB, LNB, 탭. Avenir Next 계열.
- **caption (12~14px):** 주석, 출처, 면책문구.

### 타입 스케일은 **유동(clamp)** 이다 — 고정 단계표가 아니다

이 사이트는 두 갈래로 크기를 정한다. 둘을 하나로 합치려 하지 말 것.

| 갈래 | 정의 위치 | 방식 |
|---|---|---|
| `index.html` | `src/css/app.css` `@theme` | `--text-hero` 등 **뷰포트 구간별 고정값**(1800·2300에서 단계 상승) |
| 서브페이지 5종 | `src/sub/css/*.css` | **`clamp(min, vw, max)` 연속 유동** |

### ⚠ 현황: 단계가 50개다 — `scale` 은 census, 아래가 목표 램프

front matter 의 `typography.scale` 은 **지금 코드에 있는 것을 그대로 적은 census** 다
(50개 값 → 43개 앵커). 디자인 가이드가 아니라 **"51번째 값이 새로 들어오면 알려주는 감지기"** 다.

**신규 작업에서는 아래 12단계 안에서 고른다.** 전부 이미 쓰이는 값이라 새 드리프트를 만들지 않는다.

| 역할 | px | 비고 |
|---|---|---|
| caption | **12** | 주석·출처·면책 |
| micro | **14** | 라벨·배지 |
| body | **16** | 본문 기본 |
| lede | **18** | 도입 문단 |
| card | **22** | 카드·권역 제목 |
| h4 | **26** | 소제목 |
| h3 | **34** | 블록 제목 |
| h2 | **42** | 섹션 타이틀 |
| display | **54** | 큰 수치 |
| hero-sm | **68** | 히어로 기준 |
| hero | **82** | 히어로 확대 1단 |
| hero-lg | **96** | 히어로 확대 2단 |

**정리 대상(별건 · 렌더가 바뀌므로 승인 필요).** 통합하면 50 → 12 단계가 된다.

- **0.5px 변종 7종** — `9.5 · 10.5 · 11.5 · 12.5 · 13.5 · 14.5 · 15.5`.
  판정 허용오차 ±0.5px 안이라 통과하지만 **의도된 단계가 아니다.** 정수로 흡수한다.
- **근접 중복 쌍** — `24/25` · `26/27` · `30/31/32` · `40/41/42` · `62/64` · `70/72/74` · `80/82/84`.
  같은 위계에 두세 값이 공존한다.
- **초대형 2종** — `116 · 128`. `src/css/app.css` 에서만 쓰이며 목표 램프 밖이다.

## Layout & Spacing

반응형 그리드는 Desktop 1440px 기준 12컬럼(max-width 1200~1320px), Tablet 8컬럼, Mobile 4컬럼이다.
간격은 8px를 base로 하는 스케일(16·24·32·48·64px)로 토큰화한다. 터치 타깃은 최소 44px 이상을 보장한다.

- **spacing 스케일:** xs 8 / sm 16 / md 24 / lg 32 / xl 48 / 2xl 64 (px)

## Shape & Surface

- **rounded.sm (8px), rounded.md (12px):** 부지개요·KPI·혜택 카드. 과한 라운드 금지.
- **rounded.lg (16px):** 지도·대형 이미지 패널.
- **rounded.full:** 탭, 상태 라벨, 번호 마커(Pill).
- **Line Weight:** Web 1px. 카드 외곽선과 표 라인은 `line`(#D8E3F2) 사용.
- **Shadow:** 최소 또는 없음. 입체감은 지도·이미지에서만 제한적으로.
- **Surface:** `surface`(#FFFFFF)와 `bg`(#F4F8FE)의 밝은 대비를 유지한다.

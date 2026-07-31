---
name: B-CITY Unified Digital
colors:
  primary: "#344198"
  primary-hover: "#2A3680"
  navy: "#002742"
  mint: "#3DBFA8"
  azure: "#4E7AC7"
  light-blue: "#BBCCF0"
  bg: "#F4F8FE"
  surface: "#FFFFFF"
  text: "#111111"
  text-muted: "#5B6B82"
  line: "#D8E3F2"
  district-ai: "#344198"
  district-bio: "#21B9A5"
  district-food: "#E19A32"
  district-mice: "#5AA6E8"
  district-housing: "#C9A56A"
  district-edu: "#A2BE52"
  district-biz: "#6D5FA8"
  district-golf: "#50A86F"
typography:
  hero-h1:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  section-h2:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  card-title:
    fontFamily: "Paperlogy, Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  kpi:
    fontFamily: "Inter, Pretendard, sans-serif"
    fontSize: 28px
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

- **primary (#344198) — Primary / Indigo:** 메인 타이틀, 핵심 숫자, 표 헤더, 주요 아이콘, Primary CTA.
- **primary-hover (#2A3680):** Primary CTA·링크의 hover/active 상태. (웹 인터랙션용으로 추가)
- **navy (#002742):** 최종 IM 표지 톤. 다크 섹션·푸터 배경 등 강한 대비가 필요한 곳에 제한적으로 사용.
- **mint (#3DBFA8) — Point Mint:** 생명·바이오·순환·긍정 지표, 선택 상태 포인트. 넓은 배경 사용 금지.
- **azure (#4E7AC7) — Azure / Data Blue:** 데이터·교통·보조 그래프, 라인 강조.
- **light-blue (#BBCCF0):** 카드 라인, 비활성 단계, 지도 보조 영역.
- **bg (#F4F8FE) — Blue White BG:** 페이지 배경, 카드 내부 배경, 표 보조 행.
- **surface (#FFFFFF):** 카드 표면. 배경과 밝은 대비를 유지한다.
- **text (#111111):** 주요 본문, 표 텍스트.
- **text-muted (#5B6B82):** 서브카피, 단위, 캡션, 주석.
- **line (#D8E3F2):** 카드 경계, 표 라인, 구획선.

**District Map Colors** — 지도 8개 권역 구분 전용. 색상만으로 구분하지 않고 번호 마커·외곽선·라벨·범례를 함께 쓴다.
`district-ai` #344198(AI 데이터), `district-bio` #21B9A5(첨단바이오), `district-food` #E19A32(푸드물류),
`district-mice` #5AA6E8(바이오 MICE), `district-housing` #C9A56A(하우징), `district-edu` #A2BE52(에듀),
`district-biz` #6D5FA8(비즈니스), `district-golf` #50A86F(골프·웰니스).

## Typography

PPT에서는 한글 제목에 페이퍼로지(Paperlogy), 영문 헤드/라벨에 Avenir Next, 본문·수치에 Inter를 쓴다.
Web에서는 라이선스와 로딩 안정성을 고려해 동일 계열 대체 폰트(Pretendard, Noto Sans KR)를 병행한다.

- **hero-h1 (56~72px, Mobile 34~42px):** 페이지 첫 메시지. Paperlogy.
- **section-h2 (36~48px, Mobile 26~32px):** 섹션 타이틀.
- **card-title (18~24px, Mobile 16~20px):** 카드·권역 제목.
- **kpi (18~28px):** 숫자를 가장 먼저 읽히게 하는 핵심 지표. Inter.
- **body (16~18px):** 웹 본문 기본. Inter.
- **nav (14~16px):** GNB, LNB, 탭. Avenir Next 계열.
- **caption (12~14px):** 주석, 출처, 면책문구.

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

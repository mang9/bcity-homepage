# 입지 → Location

## 01 교통환경 (`#transit`)

| 한국어 | English | 글자 |
|---|---|---|
| `TRANSPORT` / 교통환경 | `TRANSPORT` | |
| 서울 잠실에서 40분,<br>**수도권 생활 인프라로 편입** | 40 min from Jamsil, Seoul<br>**Connected to the Seoul metropolitan area** | 68 |
| 새로운 동부권 비즈니스 허브, B-CITY | **B-CITY: a new business hub east of Seoul** | 40 |

> ⚠ 「수도권 생활 인프라로 편입」은 직역하지 않았다(`GLOSSARY.md` §8). 「편입」의 실질은
> ‘서울 통근권에 들어온다’ 이며, `incorporated into the metropolitan living infrastructure` 는
> 영어에서 뜻을 만들지 못한다.
> ⚠ 「동부권」은 한국 내 방위이므로 `Korea's east` 로 국가를 밝혔다 — `the eastern region` 만으로는
> 어느 나라 동부인지 알 수 없다.

### 지도 alt

| 한국어 | English |
|---|---|
| B-CITY 를 중심으로 철도·도로·항공·항만이 이어지는 광역 교통망 지도. 아래 네 영역을 선택하면 해당 경로가 강조됩니다. | A regional transport map centered on B-CITY, showing rail, road, air and sea links. Select one of the four modes below to highlight its routes. |

### 교통 카드 4장

**⚠ 네 요약(`.tmode-sum`)의 길이를 94~97자로 맞췄다** — 줄 수가 다르면 카드의 구분선 y 가
어긋난다(§11.14-4 · `LAYOUT-NOTES.md` §2). **고칠 때는 ±4자 안에서.**

#### 철도 → Rail

| 한국어 | English |
|---|---|
| 철도 | **Rail** |
| **GTX-B** / 서울역 50분 / 추진 중 (2030년 개통 예정) | **GTX-B** / 50 min to Seoul Station / In progress (opening planned 2030) |
| **ITX-청춘** / 청량리역 55분 / 운영 중 | **ITX-Cheongchun** / 55 min to Cheongnyangni Station / In service |
| **경춘선** / 청량리 연결 / 운영 중 | **Gyeongchun Line** / Connections to Cheongnyangni / In service |
| GTX-B 춘천 연장 시 서울 핵심 업무지구까지 50분대 | With the planned GTX-B extension to Chuncheon, Seoul’s key business districts will be under an hour away. *(129)* |

#### 도로 → Road

| 한국어 | English |
|---|---|
| 도로 | **Road** |
| **제2경춘국도** / 서울 45분 / 추진 중 (4~6차로) | **2nd Gyeongchun National Road** / 45 min to Seoul / Planned (4–6 lanes) |
| **서울양양고속도로** / 서울 40분 / 운영 중 (4~6차로) | **Seoul–Yangyang Expressway** / 40 min to Seoul / In service (4–6 lanes) |
| **서울~양평고속도로(예정)** / 서울 30분 | **Seoul–Yangpyeong Expressway (planned)** / 30 min to Seoul |
| **중앙고속도로** / 원주 방면 / 운영 중 (4차로) | **Jungang Expressway** / Toward Wonju / In service (4 lanes) |
| **김유정로** / 도심 연결 | **Gimyujeong-ro** / To the city center |
| **충효로** / 도심 연결 | **Chunghyo-ro** / To the city center |
| 남춘천 IC 와 직접 연결 · 제2경춘국도 개통 시 수도권 접근성 강화 | Linked to Namchuncheon IC, with improved access to the Seoul metropolitan area planned via the 2nd Gyeongchun National Road. *(124)* |

#### 항공 → Air

| 한국어 | English |
|---|---|
| 항공 | **Air** |
| **양양국제공항** / 약 60분 / 국내 / 국제선 운항 | **Yangyang International Airport** / approx. 60 min / Domestic and international |
| **김포공항** / 약 80분 | **Gimpo Airport** / approx. 80 min |
| 국내선과 국제선 두 축으로 글로벌 비즈니스 연계 | Domestic and international air connections support global business. *(67)* |
| 약 60분 | approx. 60 min |
| 국내 / 국제선 운항 | Domestic and international |

> ⚠ 위 두 줄은 **칸을 따로 넣어야 했다.** 마크업이 `<b>양양국제공항</b><span>약 60분</span><i>국내 / 국제선 운항</i>`
> 세 칸인데, 셋째 칸 안에 `/` 가 **글자로** 들어 있어 빌드가 칸 경계로 오해한다
> (「국내」와 「국제선 운항」이 각각 한 칸으로 세어져 국문 4칸 vs 영문 3칸이 된다).
> ⚠ 「약 80분」은 김포 행이 2칸이라 저절로 풀린다 — 60분만 여기 필요하다.

#### 항만 → Sea

| 한국어 | English |
|---|---|
| 항만 | **Sea** |
| **속초항** / 약 90분 / 국제 크루즈 · 러시아 항로 | **Sokcho Port** / approx. 90 min / International cruise · Russia routes |
| **동해항** / 약 120분 / 종합 무역항 · 국제 무역 거점 | **Donghae Port** / approx. 120 min / Full-service trade port · international trade hub |
| 동해권 물류 거점 연계로 수출입 인프라 확보 | Connections to East Sea logistics hubs support imports and exports. *(67)* |

| 한국어 | English |
|---|---|
| * 소요시간은 교통량 및 도로사정에 따라 차이가 발생할 수 있습니다. | \* Travel times vary with traffic and road conditions. |

### 마무리 카피

| 한국어 | English |
|---|---|
| B-CITY는 서울·수도권 **1시간 생활권**은 물론,<br>국내를 넘어 글로벌 비즈니스 허브로 도약합니다 | B-CITY is within an hour of Seoul —<br>and reaches beyond Korea to become a **global business hub** |

> ⚠ 강조(`<em>`)를 **옮겼다.** 한국어는 「1시간 생활권」을 강조하지만, 영문에서 그 자리는
> 앞줄이라 띠가 첫 줄에만 걸린다. 「global business hub」에 강조를 옮기면 **문장의 결론**이
> 강조되고 띠가 마지막 줄에 온다 — 한국어 원문의 강조 의도(도약)와도 맞는다.
> **원문대로 앞줄 강조를 유지하려면** 위 셀의 `**` 를 그 구간으로 옮긴다.
> ⚠⚠ 강조는 **하나다.** 2026-09-21 까지 셀에 `**` 가 둘이었는데(`within an hour of Seoul`
> 까지) 그때는 조각 수가 국문과 달라 둘 다 `<b>` 로 나가 **띠가 아예 안 보였다.**
> 치환기가 태그를 되쓰게 고치자(§`i18n.mjs` ①) 띠가 두 줄에 걸쳐 그 문제가 드러났다.
> `.closer p em` 은 **민트 띠**라 두 곳에 걸면 문장이 분산된다 — 이 주석의 전제대로 하나만 둔다.

## 02 광역 인프라 (`#infra`)

| 한국어 | English |
|---|---|
| `INFRASTRUCTURE` / 광역 인프라 | `INFRASTRUCTURE` |
| B-CITY를 둘러싼 **완성된 인프라** | The **infrastructure around B-CITY is already built** |
| 대한민국 바이오 산업의 중심 춘천을 기반으로, 산업·교육·의료·관광 인프라가 유기적으로 연결된 미래 혁신도시의 최적 입지를 완성합니다 | Anchored in Chuncheon, the center of Korea’s bio industry, with industry, education, healthcare and tourism infrastructure already connected — the right site for a future innovation city |

> ⚠ 「완성된 인프라」를 `completed infrastructure` 로 직역하면 ‘공사가 끝난 기반시설’ 로 읽혀
> 이 섹션의 요지(= **이미 있는 시설**이라는 점 · §11.15)가 사라진다. `is already built` 로 옮겼다.

### 01 산업 인프라

| 한국어 | English |
|---|---|
| `01` 산업 인프라 | `01` Industry |
| 대한민국 바이오 혁신 생태계의 중심 | **At the center of Korea’s bio innovation ecosystem** |
| 춘천바이오산업진흥원과 강원연구개발특구를 비롯한<br>다양한 산업 인프라를 기반으로<br>기업과 연구기관, 인재가 함께 성장하는 혁신 생태계를 형성합니다. | Industrial infrastructure, including the Chuncheon Bioindustry Foundation<br>and Gangwon R&D Special Zone, supports an ecosystem where<br>companies, research institutes and talent grow together. |
| 춘천바이오산업진흥원 *(원)* | **Chuncheon Bioindustry Foundation** |
| 강원연구개발특구 *(원)* | **Gangwon R&D Special Zone** |
| 인근 산업단지 및 네트워크 *(원)* | **Nearby industrial complexes & networks** |

> ⚠ 교차 원(`.inf-orb`)의 라벨은 원 지름 안에 들어가야 한다(§11.15). 32자인
> `Chuncheon Bioindustry Foundation` 은 **두 줄**이 된다 — 허용하고 지름은 키우지 않는다.
> 세 번째 원은 「및 네트워크」를 뺐다(`Nearby industrial complexes`, 27자) — 원 안에서 세 줄이 되면
> 지름을 키워야 하고, 그러면 옆 텍스트 열이 좁아져 본문 3줄 고정이 깨진다.

### 02 학술 인프라

| 한국어 | English |
|---|---|
| `02` 학술 인프라 | `02` Academia |
| 미래 인재를 키우는 교육·연구 거점 | **A base for education and research that builds future talent** |
| 강원권 대학과 연구기관이 집적된 교육 환경을 바탕으로 산업과 연구, 인재 양성이 선순환하는 혁신 생태계를 구축합니다. | Gangwon’s universities and research institutes anchor an ecosystem in which industry, research and talent reinforce one another. *(128)* |
| 강원대학교 (춘천캠퍼스) | Kangwon National University (Chuncheon Campus) |
| 한림대학교 | Hallym University |
| ※ 사진 출처 — 공공누리 · 한림대학교 | \* Photos: KOGL · Hallym University |

### 03 의료 · 공공 인프라

| 한국어 | English |
|---|---|
| `03` 의료 · 공공 인프라 | `03` Healthcare & public services |
| 수준 높은 의료 서비스와 안정적인 행정 인프라 | **High-quality healthcare and a stable administrative base** |
| 대학병원 중심의 의료 인프라와 강원도·춘천시의 행정 지원 체계를 기반으로 안정적인 정주환경을 제공합니다. | University hospitals and administrative support from Gangwon State and Chuncheon City provide a stable foundation for everyday living. *(134)* |
| 강원대학교병원 | Kangwon National University Hospital |
| 한림대춘천성심병원 | Hallym University Chuncheon Sacred Heart Hospital |
| 강원도청 · 춘천시청 | Gangwon State Office · Chuncheon City Hall |
| ※ 사진 출처 — 강원대학교병원 · 한림대학교춘천성심병원 · 공공누리 | \* Photos: Kangwon National University Hospital · Hallym University Chuncheon Sacred Heart Hospital · KOGL |

### 04 관광 · 여가 인프라

| 한국어 | English |
|---|---|
| `04` 관광 · 여가 인프라 | `04` Tourism & leisure |
| 사계절 자연과 문화를 누리는 라이프 환경 | **Nature and culture in every season** |
| 남이섬, 강촌, 의암호, 소양강 등 춘천을 대표하는 관광·문화 자원을 가까이 누릴 수 있는 차별화된 정주환경을 제공합니다. | Nami Island, Gangchon, Lake Uiam and the Soyang River — Chuncheon’s best-known destinations, all close at hand. *(111)* |
| 남이섬 | Nami Island |
| 비발디파크 | Vivaldi Park |
| 강촌 (엘리시안 강촌) | Gangchon (Elysian Gangchon) |
| 의암호 | Lake Uiam |
| 소양강 | Soyang River |
| 레고랜드 | Legoland Korea |
| ※ 사진 출처 — 한국관광공사 | \* Photos: Korea Tourism Organization |

### 사진 alt

| 한국어 | English |
|---|---|
| 캠퍼스와 기숙사 건물이 보이는 강원대학교 춘천캠퍼스 항공 전경 | Aerial view of Kangwon National University’s Chuncheon campus and dormitories |
| 설경에 둘러싸인 한림대학교 캠퍼스 건물 | Hallym University campus buildings in snow |
| 산을 배경으로 한 강원대학교병원 전경 | Kangwon National University Hospital against the mountains |
| 한림대학교춘천성심병원 권역응급의료센터 입구 | Entrance to the regional emergency medical center at Hallym University Chuncheon Sacred Heart Hospital |
| 춘천시청 청사와 광장 | Chuncheon City Hall and its plaza |
| 남이섬으로 향하는 유람선과 강변 숲 | A ferry heading to Nami Island, with riverside woods |
| 설원 슬로프가 펼쳐진 비발디파크 전경 | Ski slopes at Vivaldi Park |
| 호수와 분수가 있는 엘리시안 강촌 정원 | The garden at Elysian Gangchon, with its lake and fountain |
| 산으로 둘러싸인 의암호 수면 | Lake Uiam, ringed by mountains |
| 소양강을 가로지르는 스카이워크와 다리 | The skywalk and bridge across the Soyang River |
| 레고랜드 코리아 정문 광장 | The entrance plaza at Legoland Korea |

### 마무리 카피

| 한국어 | English |
|---|---|
| 산업·학술·의료·관광, **도시 전체가 하나의 인프라**가 되는 곳 | Industry, education, healthcare and tourism — **connected across one city** |
| B-CITY는 춘천이 가진 모든 광역 인프라가 유기적으로 연결되는 최적의 입지에 자리합니다 | B-CITY sits where all of Chuncheon’s regional infrastructure comes together |

---

## 03 통합 교통망 지도 라벨 (`partials/transit-*.svg`)

배경 한 장 위에 SVG 네 겹을 얹은 구조다(§11.14). 라벨은 `<text class="tl-*">` 이므로
**낱말 하나가 곧 한 덩이**다 — 아래 표가 그 단위다.

| 한국어 | English |
|---|---|
| 강촌역 | Gangchon Sta. |
| 춘천 광판리 | Gwangpan-ri, Chuncheon |
| 춘천시청 · 강원도청 | Chuncheon City Hall · Gangwon State Office |
| GTX-B 연장선(예정) | GTX-B extension (planned) |

⚠ **나머지 지점명은 `en/index.md` §12(메인 지도 01)가 이미 갖고 있다** — 사전은 전역이라
같은 키를 두 번 적으면 값이 갈릴 위험만 생긴다. 이 지도가 쓰는 것 중 그쪽에 있는 것:
`서울역` · `청량리역` · `마석역` · `가평역` · `춘천역` · `잠실` · `화도IC` · `금남JCT` ·
`당림리` · `강촌IC` · `남춘천IC` · `감일JCT` · `양평JCT` · `제2경춘국도(예정)` ·
`서울~양평고속도로(예정)` · `서울양양고속도로` · `양양국제공항` · `속초항` · `동해항`.
**두 지도가 같은 표기를 쓰는 것이 전제다** — 한쪽 지점명을 고치면 그 표를 함께 본다.

⚠ **2026-09-22 에 지점 구성이 바뀌었다**(§11.117 · 첨부 참고 지도 기준).
사라진 라벨 — `강일JC` · `중랑IC` · `비발디파크` · `원주`. 그래서 `강일JC | Gangil JC` ·
`중랑IC | Jungnang IC` 행을 걷었다(어느 화면에도 그 낱말이 단독 덩이로 남지 않았다 —
`중랑IC` 는 메인 카피 pill 안에만 있고 그 덩이는 `en/index.md` 가 갖는다).
`비발디파크` · `원주` 는 **다른 자리에서 계속 쓰이므로 사전에 남아 있다**(광역 인프라 칩 ·
사진 캡션 · 메인 지도 02·03 지점명) — 지우지 말 것.
역 이름 네 개는 `청량리 → 청량리역` 처럼 **「역」이 붙은 표기로 바뀌었다**(새로 생긴
`강촌IC` 와 구별해야 한다). 옛 키(`청량리` · `마석` · `가평` · `강촌`)는 단독 덩이로
쓰이는 곳이 없어져 걷었다.

### 겹(레이어) 접근성 라벨

| 한국어 | English |
|---|---|
| 교통 경로 | Transport routes |
| 교통 거점 | Transport nodes |
| 교통 정보 | Transport labels |
| B-CITY 광역 교통망 경로 | B-CITY regional transport network — routes |
| B-CITY 광역 교통망 마커 | B-CITY regional transport network — markers |
| B-CITY 광역 교통망 텍스트 | B-CITY regional transport network — labels |

> ⚠ **알약(라벨) 폭은 코드가 `getBBox()` 로 재서 정한다**(§11.105). 영문은 국문보다 넓어
> 겹칠 수 있다 — 지도 라벨을 고치면 **화면에서 겹침을 다시 재야 한다.**
> ⚠ 역 이름은 **`Sta.`** 로 줄인다(`Station` 이 아니다). 국문이 「역」을 붙이게 바뀌어
> 이제 영문도 붙여야 하는데, `Station` 을 다 쓰면 폭이 1.5배가 되어 이웃 라벨과 부딪힌다.
> `IC` · `JCT` 는 약어를 그대로 둔다(`Interchange` · `Junction` 으로 풀지 않는다).

---

## 이 페이지의 조정 기록

| 자리 | 조정 | 이유 |
|---|---|---|
| `.tmode-sum` 4장 | 길이를 94~97자로 **일부러 맞췄다** | 줄 수가 다르면 카드 구분선이 어긋난다(§11.14-4) |
| 철도 요약 | 「50분대」 → `50 minutes away` | 「~대」에 대응하는 영어가 없다. `around 50 minutes` 는 길어져 예산을 넘긴다 |
| 도로 요약 | 「수도권 접근성 강화」 → `further improve access` | 「수도권」이 같은 문장 앞에 이미 나오지 않으므로 `access` 만으로 충분하고, 예산에 맞는다 |
| 항공/항만 노선명 | `2nd Gyeongchun National Road` 를 카드 목록에서는 그대로 두었다 | `.tmode-list li b` 는 폭이 가변이라 줄바꿈이 허용된다 |
| 02 서브카피 3개 | 각각 **122 / 134 / 114자** — 98자 예산을 넘긴다 | ⚠ **한 줄 유지를 포기했다.** 98자로 줄이면 기관명(`Gangwon State`, `Hallym University Chuncheon Sacred Heart Hospital`)을 잘라야 한다. 두 줄을 허용하는 대신 `.inf-head` 의 `max-width: 78ch` 를 영문에서 `92ch` 로 올리는 편이 낫다 — **확인 필요** |
| 교차 원 3번 | 「인근 산업단지 및 네트워크」 → `Nearby industrial complexes` | 원 안 3줄을 피하려고 「및 네트워크」를 뺐다. 뜻은 앞 두 원(기관·특구)과 함께 읽히면 유지된다 |
| 마무리 카피 | 강조 위치를 마지막 줄로 옮겼다 | 위 메모 참조 |

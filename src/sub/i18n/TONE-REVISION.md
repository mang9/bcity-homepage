# 영문 격식 톤 비교안 — 현재 문안 vs 제안

> 지시(2026-09-14): 「번역을 IM 기준 및 격식있는 톤으로 좀 더 수정」 · 「비교안으로 만들어줘」

✅ **2026-09-15 — 33건 전부 반영을 마쳤다.** 이 문서는 이제 **반영 기록**이다(대조표가 아니다).

| | |
|---|---|
| 자동 반영 | **25건** — 마크업 복원 후 평문으로 되벗겨 글자까지 일치 확인 |
| 손으로 반영 | **5건** — 아래 「검산이 잡은 것」 |
| 제안 = 현재(선택 · 유지) | **2건** — `Explore the city →` · `Learn more`(영문 관례라 유지) |
| C-2 법령명 | IM 기준 적용 대상이라 따로 처리(아래 §2) |

### ⚠⚠ 검산이 **내 제안의 결함 3건**을 잡았다

자동 반영이 6건에서 멈췄고, 그중 셋은 도구 문제가 아니라 **제안 자체가 틀린 것**이었다.

| 자리 | 무엇이 틀렸나 |
|---|---|
| `districts-1q8lf3k103` | 제안이 **셋째 줄을 통째로 잘라먹었다**(`— form **eight connected districts**.`). 콘솔 출력(`[:200]`)을 보고 옮겨 적은 탓이다 |
| `x-_shell-1t8ivqt24` | D 스윕이 **`Seoul and the Seoul metropolitan area`** 라는 중복을 만들었다 → `the surrounding metropolitan area` |
| `x-_shell-1cav31r26` · `xzrin225` | 셀 꼬리의 **자수 주석 `(106)` · `(126)` 을 빠뜨렸다** → 새 문장 길이로 다시 계산 |

**전수 치환은 반드시 되벗겨 대조한다** — 이 세 건은 눈으로는 통과했을 것이다.

---

## 0. ⚠⚠ 먼저 확인할 것 — 보내주신 「수정 내역 비교」표는 **이미 반영돼 있다**

보내주신 6건의 「수정 후 영문」을 현재 CSV 와 대조한 결과, 그 표는 **1차 검토안 → 2차(현재)** 의 기록이었다.
`기존 영문 (영어 구버전)` 으로 적힌 값들이 `B-CITY_홈페이지_영문_검토안_컨펌용.csv`(9-14 13:53)의 `영어(현재)` 열과 정확히 일치한다.

| ID | 보내주신 「기존」 | 1차 CSV 실제값 | 현재 상태 |
|---|---|---|---|
| `index-9fnz6715` | `01 Capital-region belt` | 동일 | ✅ 이미 `01 Seoul metro access` |
| `index-rl1ect26` | `advanced bio business global gateway` | `The global gateway for advanced bio business…` | ✅ 이미 반영 |
| `index-1dvjh421` | `435 MW / Peak AI data center capacity` | 동일 | ✅ 이미 `Maximum planned…` |
| `index-dubopd30` | `From the frontier’s gold rush / to the data rush of the 21st century` | 1차의 **수정안** 값 | ⚠ 아래 A-1 |

즉 **2026-09-14 §1차 반영 작업에서 이미 들어간 내용**이고, 다시 반영할 것은 없다. 그 표에서 **아직 반영되지 않은 진짜 차이는 4건**이며 아래 A 절에 있다.

✅ 규약 중 **이미 충족된 것** — 다시 손대지 않는다.

| 규약 | 현재 상태 |
|---|---|
| 강원특별자치도 → `Gangwon State` | 전수 일치 · 공식 영문 IM 과도 일치 |
| 제2경춘 → `Highway` · `National Road` 혼용 제거 | **0건** — 이미 `Expressway` 단일 |
| 금액은 `won` 대신 `KRW` | **`won` 0건 / `KRW` 15건** — 이미 통일 |
| 수도권 생활권 → `commuter belt` 배제 | **0건** — 이미 제거 |
| `reborn as` · `guaranteed` 류 제거 | **0건** |

---

## 1. 제안 33건

| 구분 | 건수 | 뜻 |
|---|---|---|
| 권장 | 30 | 근거가 분명해 그대로 반영하면 된다 |
| 선택 | 3 | 판단이 갈린다 — 사유를 보고 정한다 |

### A. 규약 중 아직 반영되지 않은 것 (4건)

**1. `index-dubopd30`** · 메인 · 1 히어로 (#hero) — **권장**

| | |
|---|---|
| 한국어 | 서부개척 시대의 골드러시가 / 21세기 데이터 러시로 |
| **현재** | From the frontier’s gold rush / to the data rush of the 21st century |
| **제안** | **From the frontier’s gold rush / to the 21st-century data rush** |
| 사유 | 규약 ①: `21st-century` 형용사 결합. `/` 는 줄바꿈 표시라 유지 |

**2. `index-1opl9eo28`** · 메인 · 1 히어로 (#hero) — **권장**

| | |
|---|---|
| 한국어 | AI 데이터를 중심으로 한 새로운 기회의 도시가 춘천에 탄생합니다 |
| **현재** | A new city of opportunity powered by AI and data is taking shape in Chuncheon. |
| **제안** | **A new city of opportunity powered by AI and data technology is taking shape in Chuncheon.** |
| 사유 | 규약 ①: `AI data` → `AI and data technology`. 학습데이터로 오독되는 것을 막는다 |

**3. `index-413yxf26`** · 메인 · 페이지 01 — 수도권 생활권 — **권장**

| | |
|---|---|
| 한국어 | 제2경춘국도와 GTX-B로 완성되는 수도권 생활권 |
| **현재** | Closer links to the Seoul metropolitan area through the planned Second Gyeongchun National Road and GTX-B extension. |
| **제안** | **Enhanced Seoul metropolitan access via the planned Second Gyeongchun National Road and GTX-B extension** |
| 사유 | 규약 ①: 「수도권 접근성」 관점으로. `Closer links to` 는 주체가 흐리다 |

**4. `index-1dvjh421`** · 메인 · 지표 4종 (.ov-stat · 카운트업) — **선택**

| | |
|---|---|
| 한국어 | 435 MW / AI 데이터센터 최대 용량 |
| **현재** | 435 MW / Maximum planned AI data center capacity |
| **제안** | **435 MW / Maximum planned AI Data Center capacity** |
| 사유 | `AI Data Center` 는 공식 영문 IM의 고유명칭이라 대문자. 다만 **전체 타이틀 케이스는 쓰지 않았다** — 형제 지표 3개가 `Total project cost` · `Total site area` 로 문장형이다(한쪽만 바꾸면 4칸이 어긋난다) |


### B. 격식 톤 — 구어 · 명령형 · 1·2인칭 · 과장 수식어 (18건)

**1. `index-fm1x9u34`** · 메인 · 10 문의 모달 (#contact) — **권장**

| | |
|---|---|
| 한국어 | 기업입주 · 투자 · 사업 문의를 남겨주시면 담당자가 순차적으로 연락드립니다. |
| **현재** | For business location, investment or project inquiries, leave a message and our team will get back to you. |
| **제안** | **For business location, investment or project inquiries, please submit your inquiry and a member of our team will respond in turn.** |
| 사유 | `get back to you`(구어) → `respond`. 「순차적으로」를 `in turn` 으로 살린다 |

**2. `index-1tvye4u29`** · 메인 · 10 문의 모달 (#contact) — **권장**

| | |
|---|---|
| 한국어 | 문의하실 내용을 입력해 주세요. (placeholder) |
| **현재** | Tell us what you would like to know. |
| **제안** | **Please describe your inquiry.** |
| 사유 | `Tell us what you would like to know.` 는 대화체. 입력 안내는 명령형 경어가 표준 |

**3. `index-1y6ihla30`** · 메인 · 전송 상태 문구 (contact.js) — **권장**

| | |
|---|---|
| 한국어 | 문의가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드립니다. |
| **현재** | Your inquiry has been received. Our team will review it and get in touch. |
| **제안** | **Your inquiry has been received. Our team will review it and respond in due course.** |
| 사유 | `get in touch`(구어) → `respond in due course` |

**4. `brand-l1ale340`** · 브랜드 · 01 브랜드 네임 (#name) — **권장**

| | |
|---|---|
| 한국어 | 도시와 바이오가 하나가 되는 곳, / 바이오와 도시 인프라가 만나 새로운 가치를 만듭니다 |
| **현재** | Where biotechnology and city life come together / creating new value through urban infrastructure |
| **제안** | **Where biotechnology and urban life converge / Creating new value where bio meets city infrastructure** |
| 사유 | `come together`(구동사) → `converge`. 브랜드 선언문이라 어휘 격을 올린다 |

**5. `concept-1dtnku660`** · 컨셉 · 02 BIO INDUSTRY (#bio) — **권장**

| | |
|---|---|
| 한국어 | 27~28년 美 생물보안법 효력 발생 시 글로벌 제약사의 中 의존 탈피 및 블록버스터 특허 만료 도래, 한국 CDMO · CRO에 역대급 수주 기회 |
| **현재** | As the U.S. BIOSECURE Act takes effect in 2027–28, global pharma shifts away from Chinese suppliers just as the blockbuster patent cliff arrives — an unprecedented opening for Korean CDMOs and CROs |
| **제안** | **As the U.S. BIOSECURE Act takes effect in 2027–28, global pharmaceutical companies are shifting away from Chinese suppliers, coinciding with the blockbuster patent cliff — an unprecedented opportunity for Korean CDMOs and CROs** |
| 사유 | `just as`(구어) → `coinciding with` · `global pharma`(약어) → `pharmaceutical companies` · `opening` → `opportunity` |

**6. `districts-1q8lf3k103`** · 구역 소개 · 도입부 — **권장**

| | |
|---|---|
| 한국어 | 산업 · 주거 · 상업 · 공공이 유기적으로 어우러지는 거대 융합도시 / AI · BIO · FOOD · MICE 4대 클러스터와 주거 · 교육 · 업무 · 레저 4대 콤플렉스로 / 구성된 8개 권역이 하나의 도시 생태계를 완성합니다 |
| **현재** | Industry, housing, commerce and public services come together in one integrated city. / Four clusters — AI, biotechnology, food and MICE — and four complexes — / housing, education, business and leisure — form eight connected districts. |
| **제안** | **Industry, housing, commerce and public services converge in a single integrated city. / Four clusters — AI, biotechnology, food and MICE — and four complexes — / housing, education, business and leisure** |
| 사유 | `come together in one` → `converge in a single` |

**7. `districts-t45c0727`** · 구역 소개 · 07 에듀 콤플렉스 → Education Complex — **권장**

| | |
|---|---|
| 한국어 | 도입시설 교육시설 / 유 · 초 · 중 · 고 · 외국교육기관 |
| **현재** | Educational facilities / Kindergarten, elementary, middle and high schools, plus foreign educational institutions |
| **제안** | **Educational facilities / Kindergarten, elementary, middle and high schools, as well as foreign educational institutions** |
| 사유 | `plus`(구어) → `as well as` |

**8. `districts-1nfflhn16`** · 구역 소개 · 08 골프레저 콤플렉스 → Golf & Leisure Complex — **권장**

| | |
|---|---|
| 한국어 | 임직원 복지 + 분양 · 회원권 수익 기반 |
| **현재** | Employee benefit, plus revenue from lot sales and memberships |
| **제안** | **Employee benefits, together with revenue from lot sales and memberships** |
| 사유 | `plus` → `together with`. `benefit` → 복수 |

**9. `living-1x63uf751`** · 정주환경 · 도입부 — **권장**

| | |
|---|---|
| 한국어 | 일과 삶이 조화롭게 어우러지는 곳 / 비즈니스 · 주거 · 교육 · 문화가 / 하나로 완성되는 자족도시 |
| **현재** | Where work and life come together / A self-sufficient city connecting business, housing, education and culture |
| **제안** | **Where work and life are in balance / A self-sufficient city connecting business, housing, education and culture** |
| 사유 | `come together` → `are in balance`. 국문 「조화롭게 어우러지는」에 더 가깝다 |

**10. `living-1s843y610`** · 정주환경 · 02 주거 환경 → Residential Environment — **권장**

| | |
|---|---|
| 한국어 | (본문 107자) |
| **현재** | Parks and green space make up 26% of the city, so nature is never far. Walk the waterfront, cross the green on the way to work, and head straight out into the countryside at the weekend. |
| **제안** | **Parks and green space account for 26% of the city, placing nature within easy reach — a waterfront path, a green crossing on the way to work, and open countryside at the weekend.** |
| 사유 | `make up`(구동사) → `account for`. 명령형 나열(`Walk … cross … head straight out`)을 명사구로 바꿔 권유체를 없앤다 |

**11. `living-1eq7rfo12`** · 정주환경 · 03 교육 환경 → Educational Environment — **권장**

| | |
|---|---|
| 한국어 | 세계 수준의 교육이 가까이에 |
| **현재** | World-class education, close by |
| **제안** | **Advanced education within the city** |
| 사유 | `World-class`(과장 수식어) 제거 — 규약 ①이 지양하는 어휘. 「가까이에」는 `within the city` 로 |

**12. `living-rv9pn510`** · 정주환경 · 04 문화시설 → Culture & Leisure — **권장**

| | |
|---|---|
| 한국어 | (본문 104자) |
| **현재** | Three minutes from Nam-Chuncheon IC, 50 minutes from Seoul: a 943,000 m² course inside B-CITY, close enough to play on an ordinary day. Golf you used to travel for is simply nearby. |
| **제안** | **Three minutes from Nam-Chuncheon IC and 50 minutes from Seoul: a 943,000 m² course within B-CITY, accessible on an ordinary weekday. A course of this scale, previously a destination trip, now lies inside the city.** |
| 사유 | `simply nearby` · `Golf you used to travel for`(2인칭 함의) 제거 |

**13. `about-1wndjgl122`** · 회사소개 · 비전 — **권장**

| | |
|---|---|
| 한국어 | 바이오테크이노밸리는 단순한 사업 시행사가 아닌, B-CITY의 비전 동반자입니다. / AI와 BIO가 융합되는 첨단산업 도시, 일과 삶이 어우러지는 자족형 도시, 자연과 첨단이 공존하는 지속가능한 도시를 만들어가며 대한민국 미래 도시의 새로운 기준을 제시하고자 합니다. |
| **현재** | Biotech Innovalley is not simply the developer — we are a partner in B-CITY’s vision. / An advanced-industry city where AI and bio converge; a self-sufficient city where work and life fit together; a sustainable city where nature and technology coexist. We intend to set a new standard for the Korean city of the future. |
| **제안** | **Biotech Innovalley is not merely the developer of B-CITY but a partner in its vision. / An advanced-industry city where AI and bio converge; a self-sufficient city where work and life fit together; a city where nature and technology coexist.** |
| 사유 | `not simply … — we are`(1인칭) → `not merely … but`. 시행사 소개문에서 `we` 를 뺀다 |

**14. `_shell-1wvrmb756`** · 공통 셸 · 8. 404 페이지 — **권장**

| | |
|---|---|
| 한국어 | 주소가 바뀌었거나 삭제된 페이지일 수 있습니다. / 주소를 다시 확인해 주시거나, 위 메뉴에서 원하시는 내용을 찾아보세요. |
| **현재** | The address may have changed, or the page may have been removed. / Check the URL, or use the menu above to find what you need. |
| **제안** | **The address may have changed, or the page may have been removed. / Please check the address, or use the menu above to locate the page you require.** |
| 사유 | `Check the URL` → 경어 명령형 · `what you need` → `the page you require` |

**15. `x-_shell-1cav31r26`** · 공통 셸 · 4. 페이지 제목 · 설명 (<title> · meta description) · English description (자) — **권장**

| | |
|---|---|
| 한국어 | 홍보영상 |
| **현재** | See B-CITY on film — city renderings, district walkthroughs and project briefings, all playable in place. (106) |
| **제안** | **B-CITY on film: city renderings, district walkthroughs and project briefings, available to view in place.** |
| 사유 | `See B-CITY on film`(명령형) → 명사구. `all playable in place` → `available to view in place` |

**16. `x-_shell-xzrin225`** · 공통 셸 · 4. 페이지 제목 · 설명 (<title> · meta description) · English description (자) — **권장**

| | |
|---|---|
| 한국어 | 404 |
| **현재** | The page you requested does not exist. Try Business, City, Invest & Locate or the PR Center to find what you are looking for. (126) |
| **제안** | **The page you requested does not exist. Please use the Business, City, Invest & Locate or PR Center menus to locate the page you require.** |
| 사유 | `Try …` (명령형 구어) → `Please use … menus` |

**17. `index-16yjzvd7`** · 메인 · 1 히어로 (#hero) — **선택**

| | |
|---|---|
| 한국어 | 도시 살펴보기 → |
| **현재** | Explore the city → |
| **제안** | **Explore the city →** |
| 사유 | 히어로 CTA. 명령형이지만 **버튼은 영문 관례상 명령형**이 표준이라 유지 권장. 기관 어투로 굳히려면 `City overview →` |

**18. `index-uc27175`** · 메인 · 2 입지 (#location) — **선택**

| | |
|---|---|
| 한국어 | 자세히 보기 |
| **현재** | Learn more |
| **제안** | **Learn more** |
| 사유 | B2B 사이트의 표준 표현이라 유지 권장. 굳히려면 `View details` (같은 라벨 2곳 · aria-label 1곳을 함께 바꿔야 한다) |


### C. 우리 번역 안의 용어 불일치 (2건)

**1. `living-1pgvmdp10`** · 정주환경 · 03 교육 환경 → Educational Environment — **권장**

| | |
|---|---|
| 한국어 | (본문 108자) |
| **현재** | Foreign education institutions, established under Article 38 of the Special Act on Enterprise Cities, bring a global learning environment into the city — and with it the making of an international city. |
| **제안** | **Foreign education institutions, established under Article 38 of the Special Act on the Development of Enterprise Cities, bring a global learning environment into the city — and with it the making of an international city.** |
| 사유 | 같은 법이 우리 파일 안에서 `Special Act on the Development of Enterprise Cities`(6곳)와 `Special Act on Enterprise Cities`(2곳)로 갈려 있다. 용어집 값으로 통일 |

**2. `x-_shell-8e3w0y27`** · 공통 셸 · 4. 페이지 제목 · 설명 (<title> · meta description) · English description (자) — **권장**

| | |
|---|---|
| 한국어 | 투자·입주 |
| **현재** | The Special Act on Enterprise Cities lowers the land-control threshold to 50%. Fast-track permits, infrastructure support and tax relief for relocating companies. (159 → 154 로 줄일 것) |
| **제안** | **The Special Act on the Development of Enterprise Cities lowers the land-control threshold to 50%. Fast-track permits, infrastructure support and tax relief for relocating companies. (159 → 154 로 줄일 것)** |
| 사유 | 위와 같은 건 |


### D. `capital region` → `Seoul metropolitan area` (7건)

**1. `effect-izulsk20`** · 기대효과 · 04 지역균형발전 기대효과 — **권장**

| | |
|---|---|
| 한국어 | 비수도권 첨단산업 거점으로 국토 균형발전 기여 |
| **현재** | An advanced-industry base outside the capital region, contributing to balanced national development |
| **제안** | **An advanced-industry base outside the Seoul metropolitan area, contributing to balanced national development** |
| 사유 | 규약 ①: `capital region` 은 외국 독자에게 모호하다. 공식 영문 IM도 `Seoul Metropolitan` · `metropolitan-area companies` 를 쓴다 |

**2. `concept-1ofhbch17`** · 컨셉 · 04 FOOD CLUSTER (#food) — **권장**

| | |
|---|---|
| 한국어 | 강원 · 수도권 · 전국 통합 물류 네트워크 |
| **현재** | An integrated network across Gangwon, the capital region and the country |
| **제안** | **An integrated network across Gangwon, the Seoul metropolitan area and the country** |
| 사유 | 위와 같은 건 |

**3. `concept-2x2st018`** · 컨셉 · 04 FOOD CLUSTER (#food) — **권장**

| | |
|---|---|
| 한국어 | 강원 · 수도권 · 전국을 잇는 광역 물류 거점 |
| **현재** | A regional logistics hub linking Gangwon, the capital region and the country |
| **제안** | **A regional logistics hub linking Gangwon, the Seoul metropolitan area and the country** |
| 사유 | 위와 같은 건 |

**4. `districts-1ofhbch17`** · 구역 소개 · 03 푸드 물류 클러스터 → Food & Logistics Cluster — **권장**

| | |
|---|---|
| 한국어 | 강원 · 수도권 · 전국 통합 물류 네트워크 |
| **현재** | An integrated network across Gangwon, the capital region and the country |
| **제안** | **An integrated network across Gangwon, the Seoul metropolitan area and the country** |
| 사유 | 위와 같은 건 |

**5. `living-1nsgrs10`** · 정주환경 · 01 비즈니스 환경 → Business Environment — **권장**

| | |
|---|---|
| 한국어 | (본문 134자) |
| **현재** | A meeting in Seoul or a flight abroad from Yangyang International Airport — both within an hour. On a regional network of GTX-B, ITX and expressways, B-CITY reaches every opportunity in the capital region, and the airport puts the rest of the world close. |
| **제안** | **A meeting in Seoul or a flight abroad from Yangyang International Airport — both within an hour. On a regional network of GTX-B, ITX and expressways, B-CITY reaches every opportunity in the Seoul metropolitan area, and the airport puts the rest of the world close.** |
| 사유 | 위와 같은 건 |

**6. `about-1efhk0221`** · 회사소개 · 비전 — **권장**

| | |
|---|---|
| 한국어 | 수도권의 한계를 넘어선 기업도시의 표준 |
| **현재** | Beyond the limits of the capital region — a new standard for the enterprise city |
| **제안** | **Beyond the limits of the Seoul metropolitan area — a new standard for the enterprise city** |
| 사유 | 위와 같은 건 |

**7. `x-_shell-1t8ivqt24`** · 공통 셸 · 4. 페이지 제목 · 설명 (<title> · meta description) · English description (자) — **권장**

| | |
|---|---|
| 한국어 | 입지 |
| **현재** | Within an hour of Seoul and the capital region, with the GTX-B extension, the Second Gyeongchun National Road, airports and ports all within reach. (140) |
| **제안** | **Within an hour of Seoul and the Seoul metropolitan area, with the GTX-B extension, the Second Gyeongchun National Road, airports and ports all within reach. (140)** |
| 사유 | 위와 같은 건 |


### E. `AI data` 표현 (2건)

**1. `effect-uvgrbu34`** · 기대효과 · 사진 alt — **권장**

| | |
|---|---|
| 한국어 | AI 데이터 인프라와 바이오 R&D·파일럿 생산설비가 이어지는 첨단 산업 현장 |
| **현재** | An advanced industrial site joining AI data infrastructure with bio R&D and pilot production |
| **제안** | **An advanced industrial site joining AI and data infrastructure with bio R&D and pilot production** |
| 사유 | 규약 ①: 일반 서술의 `AI data infrastructure` → `AI and data infrastructure` |

**2. `districts-1qtveek27`** · 구역 소개 · 06 하우징 콤플렉스 → Housing Complex — **권장**

| | |
|---|---|
| 한국어 | AI 데이터 클러스터 및 첨단산업 클러스터 밀착 배치로 직주근접 |
| **현재** | Placed next to the AI Data and advanced-industry clusters, so home and work are close |
| **제안** | **Placed next to the AI Data Cluster and the advanced-industry clusters, so home and work are close** |
| 사유 | `the AI Data and advanced-industry clusters` 는 `AI Data` 가 형용사로 읽힌다 → 고유명칭 `AI Data Cluster` 로 |


---

## 2. 공식 **영문 IM** 대조 — 8건 중 3건 반영 · 2건 보류 · 3건 **적용하지 않았다**

지시(2026-09-15): 「im 비교본은 통화 부분 제외하고 im 기준을 맞춰줘」.
**적용 전에 IM 두 문서를 서로 대조했더니 3건은 IM 자신이 일관되지 않았다.** 그대로 옮기면
IM 의 오기를 사이트로 퍼뜨리게 되므로 적용하지 않고 근거를 남긴다.

### ✅ 반영한 것

| 항목 | 반영 | 건 | 근거 |
|---|---|---|---|
| 춘천 기업혁신파크 | `Corporate` → **`Enterprise` Innovation Park** · `CIP`→`EIP` | 45 + 2 | IM **37회 일관** |
| 제2경춘국도 | `Second` → **`2nd` Gyeongchun …** | 21 | IM **2회 일관 · 반례 없음**. ⚠ 뒷말은 2026-09-17 에 `Expressway` → **`National Road`** 로 바뀌었다(국문 번복) — 서수 `2nd` 만 이 행의 근거다 |
| 강원특별법 | `Gangwon Special Act` → **`Gangwon Special State Act`** | 2 | IM bio 2회(State) · `Gangwon State` 관용과 한 계열 |

### ⛔ 적용하지 않은 것 — **IM 이 스스로 어긋난다**

| 항목 | 우리 값(유지) | IM 의 표기 | 왜 적용하지 않았나 |
|---|---|---|---|
| **기업도시개발특별법** | `Special Act on the Development of Enterprise Cities` | bio: `…on Enterprise City Development` **1회**<br>fei: `…on **Corporate** City Development` **7회** | **두 IM 이 정반대다.** 우리 값은 **법제처 공식 영문**이라 근거가 더 강하다. ⚠ 우리 안의 변형 `Special Act on Enterprise Cities`(11곳)는 이 값으로 **통일했다** — 이제 변형 0 |
| **기회발전특구** | `Opportunity Development Zone` | `Opportunity **&** Development Zone` **1회** | 그 1회는 `Opportunity & Development Zone / Gangwon R&D Zone` 이라는 **표 칸 압축 표기**다. 같은 IM 이 본문에서는 `Opportunity Zone` 을 쓴다. `&` 를 넣으면 「기회 그리고 발전」으로 뜻이 갈린다 |
| **강원연구개발특구** | `Gangwon R&D Special Zone (Innopolis)` | `Gangwon R&D Zone` **1회** | 같은 IM 본문이 **`R&D Special Zone` 을 4회** 쓴다 — 우리 값이 오히려 IM 본문과 맞는다. `Special` 을 빼면 일반 R&D 단지와 구분이 사라진다 |

### ⏸ 보류 — 단위 체계

| 항목 | 우리 값 | IM | |
|---|---|---|---|
| 총사업비 | `KRW 1.1 trillion` | `$780 Million (KRW 1.17 Trillion)` | **지시로 제외** |
| 부지 면적 | `3,632,899 m²` · `3.63 km²` | `897.71 Acres (3,632,899㎡)` | ✅ **유지 확정**(2026-09-15) |

✅ **면적도 유지로 확정됐다**(2026-09-15 사용자 확인). 근거는 그대로다 — IM 이 `Acres` 를 앞에 두는 것은 **미국 투자자용**이기
때문이고, 같은 IM 안에서도 `247,000㎡ (Approx. 61.0 Acres, 75,000 Pyeong)` 처럼 **㎡ 가 앞에 오는
자리가 있다** — 일관된 기준이 아니다. 게다가 `3.63 km²` 는 **1차 검토에서 담당자가 확정한 값**이다
(README C1). 통화만 빼고 면적을 바꾸면 **같은 표 안에서 금액은 KRW · 면적은 Acres** 가 되어
단위 체계가 반씩 갈린다. **통화 · 면적 모두 현재 표기를 유지한다.** IM 과 나란히 놓이면 숫자가 달라 보이는 것은 감수한다
(총사업비 1.1 vs 1.17조원 · 면적 km² vs Acres) — 웹은 국내외 독자를 함께 받기 때문이다.

## 3. 반영 결과 · 남은 것

✅ **33건 + IM 3항목 반영 완료**(2026-09-15). `en/*.md` 가 정본이고 `review-rows.csv` 의 `영어` 열은
거기서 다시 뽑아 동기화했다(31행 갱신). `tone-revision.csv` 는 **반영 기록**으로 남긴다.

⚠ **남은 확인 2건**

| | |
|---|---|
| ~~부지 면적 단위~~ | ✅ **`km²` 유지 확정**(2026-09-15) |
| ~~총사업비~~ | ✅ **`KRW 1.1 trillion` 유지 확정**(지시로 제외) |

**남은 확인 항목 없음.** 이 문서의 모든 결정이 닫혔다.

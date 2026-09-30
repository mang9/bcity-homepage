# 사업주체 → Developer

## 01 사업 구조 (`#structure`)

| 한국어 | English |
|---|---|
| `BUSINESS STRUCTURE` / 사업 구조 | `BUSINESS STRUCTURE` |
| 민·관이 함께 만드는, **가장 단단한 사업 구조** | **A robust project structure** built on public–private partnership |
| 국토교통부가 선정하고, 강원도와 춘천시가 투자하며, 대한민국 대표 ICT 기업이 앵커로 참여하는 B-CITY는 시작부터 다릅니다. | Selected by the Ministry of Land, Infrastructure and Transport, backed by equity investment from Gangwon State and Chuncheon City, and anchored by a leading Korean ICT company, B-CITY brings public and private partners together. |

> ⚠ 원문 리드가 「강원도」라고 쓰지만 같은 페이지의 파트너 카드는 「강원특별자치도」다.
> 영문은 **`Gangwon State` 로 통일**했다. 한국어 쪽도 통일이 필요하다 — **확인 필요.**

### PFV 구조도

| 한국어 | English | 글자 |
|---|---|---|
| 명목회사(PFV) 중심의 투명한 사업 운영 | **Transparent delivery through a special-purpose company (PFV)** | 60 |
| B-CITY는 PFV(Project Financing Vehicle) 구조로 운영됩니다. 자본금·대출·분양수익이 한 곳에 집중되어 투명하고 효율적으로 관리되는 검증된 개발사업 구조입니다. | B-CITY is delivered through a project financing vehicle (PFV), which brings together and manages paid-in capital, loans and sales proceeds in a single entity. |  |

**끝단 박스 (`.bs-node` — 220px · 20자 예산)**

| 한국어 | English | 글자 |
|---|---|---|
| 수분양자 | **Purchasers** | 10 |
| 토지소유주 | **Landowners** | 10 |
| 금융기관 | **Financial institutions** | 22 |

> ⚠ 「금융기관」을 `Financial institutions`(22자)로 옮기면 220px 박스를 넘고, 1024px 에서
> 박스가 154px 로 줄면(§11.26) 두 줄이 된다. 자금 흐름 도형에서 이 박스의 역할은 **대주**이므로
> `Lenders` 가 짧고 정확하다. 출자자 쪽 `FI · Finance` 와도 혼동되지 않는다.

**흐름 라벨 (`.bs-flow b`)**

| 한국어 | English | 글자 |
|---|---|---|
| 분양대금 | **Sales proceeds** | 14 |
| 용지분양 | **Land lot sales** | 14 |
| 토지 매매 | **Land purchase** | 13 |
| 토지 보상비 | **Land compensation** | 17 |
| PF대출약정 | **PF loan agreement** | 17 |
| PF대출원리금 상환 | **PF loan repayment** | 17 |

> ⚠ 「토지 매매」는 PFV 쪽으로 **들어오는** 흐름이라 PFV 관점에서 `Land purchase` 다.
> 한국어 「매매」는 주체가 모호하지만 화살표 방향이 이미 정하고 있다.
> ⚠ `PF loan repayment`(≈131px)는 한국어(105px)보다 넓어 **공백에서 두 줄로 접힌다** — 허용.
> `nowrap` 을 되살리면 넘친다(§11.26).

**코어**

| 한국어 | English |
|---|---|
| 바이오테크 이노밸리 PFV | **Biotech Innovalley PFV** |
| 명목회사 · 사업 시행 주체 | Special-purpose company · project developer |
| **출자금 납부** / 진행 중 | **Equity contribution** / in progress |

**출자자 (`.bs-holders`)**

| 한국어 | English | 글자 |
|---|---|---|
| PFV 출자자 | **PFV shareholders** | |
| 앵커기업 · AMC | **Anchor Company · AMC** | 20 |
| 더존비즈온 / 37.3% | Douzone Bizon / 37.3% | |
| 바이오테크이노밸리자산관리 *(AMC)* / 0.2% | **Biotech Innovalley AMC** / 0.2% | 29 |
| GI · 공공 | **GI · Public** | 11 |
| 강원특별자치도 / 4.9% | Gangwon State / 4.9% | |
| 춘천시 / 4.9% | Chuncheon City / 4.9% | |
| FI · 금융 | **FI · Finance** | 12 |
| IBK투자증권 / 5.0% | IBK Investment & Securities / 5.0% | 34 |
| CI · 시공 | **CI · Construction** | 17 |
| 부지조성공사 등 / TBD | Site development contractor / TBD |  |
| SI · 전략 | **SI · Strategic** | 14 |
| 중소형 CDMO *(제약 · 바이오기업)* / TBD | Small- and mid-sized CDMOs / Pharmaceutical and biotechnology companies / TBD |  |
| 중소형 CDMO | Small- and mid-sized CDMOs |  |
| 제약 · 바이오기업 | Pharmaceutical and biotech companies |  |
| 출자 37.3% | 37.3% equity |  |

> ⚠ 위 세 줄은 **칸을 따로 넣어야 했다.** 구조도의 출자자 카드는
> `<span class="bs-hn">중소형 CDMO</span><i>제약 · 바이오기업</i>` 두 칸이고, 바로 위 행은
> 기울임 주석(`*(…)*`)을 문서 표기로 보고 걷어내므로 그 칸과 맞지 않는다.
> ⚠ `<i>` 는 좁은 카드 안이라 `biotechnology` 대신 `biotech` 를 쓴다(§11.26 —
> `.bs-hn` 은 긴 낱말에서 칸을 넘친다).

> ⚠ `.bs-hn` 은 **186px · 25자 예산**이다.
> - `Biotech Innovalley Asset Management`(35자)는 넘친다 → **`Biotech Innovalley AM`**(21자).
>   바로 옆에 `AMC` 배지가 있어 무슨 회사인지 드러난다.
> - `IBK Investment & Securities`(26자)는 1자 초과다 → `overflow-wrap: anywhere` 가 걸려 있어
>   두 줄로 접힌다. 허용. 줄이려면 `IBK Securities`(14자) 지만 **정식 상호가 아니다.**

**구조도 캡션**

| 한국어 | English |
|---|---|
| **PFV** (바이오테크이노밸리피에프브이㈜) — 사업 시행 명목회사, 자본 · 대출 · 수익을 통합 관리 | **PFV** (Biotech Innovalley PFV Co., Ltd.) — the special-purpose company delivering the project; holds equity, debt and revenue in one place |
| **AMC** (바이오테크이노밸리자산관리㈜) — 자산관리 업무 전문 수탁자 | **AMC** (Biotech Innovalley Asset Management Co., Ltd.) — the appointed asset manager |

### 다섯 가지 강점 (`.mrt` — 270px · 27자 예산)

| 한국어 | English | 글자 |
|---|---|---|
| 이 구조가 만드는 다섯 가지 강점 | **Five strengths of the project structure** |  |
| `01` **민·관 합동** / 정부 · 지자체 · 민간 자본 결합 | `01` **Public–private** partnership / Central and local government and private capital combined | 14 / 57 |
| `02` **공신력 확보** / 국토교통부 선도사업 지정 | `02` **Institutional credibility** / Selected as a MOLIT project | 25 / 27 |
| `03` **추진 가속화** / 지자체 직접 출자로 인허가 연계 강화 | `03` **Faster delivery** / Local government equity participation strengthens permitting coordination | 15 / 73 |
| `04` **자산 분리** / PFV–AMC 분리 운영으로 투명성 확보 | `04` **Asset separation** / Separate PFV and AMC operations support transparency | 16 / 52 |
| `05` **다층 파트너십** / 앵커 · GI · FI · CI · SI 구조 | `05` **Multi-tier partnership** / Anchor company · GI · FI · CI · SI | 22 / 34 |

#### 칸 단위 — 라벨은 `<b class="mrt-t">` 하나가 한 덩이다

위 다섯 행은 영문에서 굵게가 라벨 **일부**에만 걸려 있어(`**Public–private** partnership`)
빌드가 라벨과 설명의 경계를 잡지 못한다. 라벨만 따로 둔다.

| 한국어 | English | 글자 |
|---|---|---|
| 민·관 합동 | Public–private partnership | 26 |
| 공신력 확보 | Institutional credibility | 25 |
| 추진 가속화 | Faster delivery | 15 |
| 자산 분리 | Asset separation | 16 |
| 다층 파트너십 | Multi-tier partnership | 22 |

⚠ 예산은 **27자**다(`.mrt` 270px). 위 다섯이 모두 그 안이며 `Public–private partnership`
26자가 가장 빡빡하다 — 라벨을 고치면 다시 센다.
⚠ 조정 기록에 「공신력 확보 → `Official mandate`」로 적힌 줄이 있는데 **낡았다.**
위 표의 `Institutional credibility` 가 현재 값이다.

### 관련 공식 문서

| 한국어 | English |
|---|---|
| 관련 공식 문서 | **Official documents** |
| 사업의 각 단계는 정부·지자체의 공식 문서로 확인됩니다. | Each stage of the project is evidenced by official government documents. |
| 국토교통부 기업혁신파크 선도사업 선정 공문 | MOLIT letter selecting the Enterprise Innovation Park project |
| 강원특별자치도 · 춘천시 출자지분 확정 공문 | Letter confirming the equity stakes of Gangwon State and Chuncheon City |
| 강원특별자치도 토지거래허가구역 지정 공고 | Gangwon State announcement designating the Land Transaction Permission Zone |
| 춘천시 개발행위허가 제한지역 지정 고시 | Chuncheon City notice designating the Development Activity Permit Restriction Area |
| 춘천 기업혁신파크 선도사업 개발구역 지정 공동제안 사항 공고 | Announcement of the joint proposal to designate the development district for the Chuncheon Enterprise Innovation Park Pilot Project |
| 보기 *(버튼)* | **View** |
| ※ [보기]를 누르면 공문 원본을 확대해 보실 수 있습니다. | \* Select **View** to open the original document at full size. **Documents are in Korean.** |

> ⚠ 공문 스캔(`assets/doc/*.avif`)은 **전부 한국어**다. 번역할 수 없으므로 각주에
> `Documents are in Korean.` 을 더했다 — 없으면 영문 독자가 열고 나서 당황한다.

## 02 파트너사 (`#partners`)

| 한국어 | English |
|---|---|
| `PARTNERS` / 파트너사 소개 | `PARTNERS` |
| 정부·지자체·기업·금융 등이 함께 만드는 B-CITY | B-CITY is built by government, local authorities, industry and finance together |
| 신뢰할 수 있는 파트너십이 사업의 가장 큰 힘입니다 | Dependable partnerships are the project’s greatest strength |

### 관계 기관

| 한국어 | English |
|---|---|
| **관계 기관** / `GOVERNMENT PARTNERS` / 사업 인가 · 지원의 핵심 주체 | **Authorities** / `GOVERNMENT PARTNERS` / The bodies that approve and support the project |
| **국토교통부** / 춘천기업혁신파크 선도사업 선정 기관<br>통합개발계획 승인 및 사업 전반의 인허가 주관 | **Ministry of Land, Infrastructure and Transport** / Selected the Chuncheon EIP project<br>Approves the Integrated Development Plan and oversees permitting |
| **강원특별자치도** / B-CITY 사업 PFV **출자 4.9%**<br>광역 행정 지원 및 첨단산업 정책 연계 | **Gangwon State** / **4.9% equity** in the B-CITY PFV<br>Regional administrative support and advanced-industry policy alignment |
| **춘천시** / B-CITY 사업 PFV **출자 4.9%**<br>사업 인허가 협력 및 지역 인프라 지원 | **Chuncheon City** / **4.9% equity** in the B-CITY PFV<br>Permitting cooperation and local infrastructure support |

### 앵커 기업 · 자산관리 · 금융 파트너

| 한국어 | English |
|---|---|
| **앵커 기업** / `ANCHOR PARTNER` / 사업의 중심에서 비전을 함께 그리는 핵심 파트너 | **Anchor Company** / `ANCHOR PARTNER` / The core partner shaping the vision from the center of the project |
| **더존비즈온** | **Douzone Bizon** |
| 앵커 파트너 / PFV **출자 37.3%**<br>대한민국 대표 ICT·SaaS 기업으로서 B-CITY의 AI·디지털 산업 생태계를 선도 | Anchor Partner / **37.3% equity** in the PFV<br>One of Korea’s leading ICT and SaaS companies, leading B-CITY’s AI and digital industry ecosystem |
| **자산관리** / `AMC` / PFV 자산의 전문 운용과 사업 실행을 관리하는 수탁자 | **Asset management** / `AMC` / The appointed manager of PFV assets and project delivery |
| **바이오테크이노밸리자산관리㈜** / 자산관리 수탁자(AMC)<br>PFV 자산의 전문 운용 및 사업 실행 관리 | **Biotech Innovalley Asset Management Co., Ltd.**<br>Appointed asset manager (AMC) / Professional management of PFV assets and project delivery |
| **금융 파트너** / `FINANCIAL INVESTORS` / 사업의 안정적 자금 조달을 지원하는 금융 파트너 | **Financial partners** / `FINANCIAL INVESTORS` / Partners securing stable funding for the project |
| **IBK투자증권** / 금융투자자(FI) / PFV 출자<br>사업자금 조달 및 금융 자문 | **IBK Investment & Securities** / Financial Investor (FI) / PFV shareholder<br>Project funding and financial advisory |

### 전략적 파트너

| 한국어 | English |
|---|---|
| **전략적 파트너** / `STRATEGIC PARTNERS` / MOU 체결을 통해 산업 협력을 이어가는 파트너 | **Strategic partners** / `STRATEGIC PARTNERS` / Partners advancing industrial cooperation under signed MOUs |
| **에스에너지** / MOU 체결 / 신재생에너지 협력 파트너<br>친환경 에너지 인프라 구축 협력 | **S-Energy** / MOU signed / Renewable energy partner<br>Cooperation on clean energy infrastructure |
| **프로티움사이언스** / MOU 체결 / 바이오 산업 협력 파트너<br>첨단 바이오 클러스터 산업 생태계 협력 | **Protium Science** / MOU signed / Bio industry partner<br>Cooperation on the advanced bio cluster ecosystem |
| 시공파트너(CI) · 전략적 투자자(SI)는 지속 확대 예정입니다. | We plan to expand participation by construction partners (CI) and strategic investors (SI). |

---

## 이 페이지의 조정 기록

| 자리 | 조정 | 이유 |
|---|---|---|
| 「금융기관」 | `Lenders` (7자) | 220px 박스 · 1024px 에서 154px. `Financial institutions` 는 두 줄이 된다. 도형상 역할이 대주다 |
| 「바이오테크이노밸리자산관리」(출자자 표) | `Biotech Innovalley AM` (21자) | 186px 예산. 옆의 `AMC` 배지가 뜻을 보전한다. **파트너 카드에서는 정식 상호를 그대로 쓴다** |
| 「시작부터 다릅니다」 | `stands on firmer ground from day one` | 직역 `is different from the start` 는 광고 상투구 |
| 「가장 단단한 사업 구조」 | `a structure built to hold` | `the strongest structure` 는 근거 없는 최상급으로 읽힌다. 「단단함」의 실질(= 버틴다)을 옮겼다 |
| 「공신력 확보」 | `Official mandate` (16자) | `Public credibility`(18자)도 예산 안이지만, 근거가 「국토교통부 지정」이므로 `mandate` 가 정확하다 |
| 「추진 가속화」 | `Faster delivery` | `Accelerated promotion` 은 한국어 「추진」의 직역이고 영어에서 홍보(promotion)로 읽힌다 |
| 「강원도」 → `Gangwon State` | 같은 페이지 안 표기 통일 | 한국어 원문이 「강원도」와 「강원특별자치도」를 섞어 쓴다 — **확인 필요** |
| 공문 각주 | `Documents are in Korean.` 추가 | 스캔이 한국어다. 원문에 없는 문장을 **의도적으로 더한 자리**(둘 중 하나 — 다른 하나는 개인정보처리방침 준거 언어 문장 · `en/index.md` §11) |

### 0916 수정본 후속 — `pilot` 삭제 (2026-09-16)

| 자리 | 조정 |
|---|---|
| 다섯 강점 `02` | `Selected as a MOLIT pilot project` → **`Selected as a MOLIT project`** |
| 공식 문서 | `… Enterprise Innovation Park pilot project` → **`… Park project`** |
| 관계 기관 | `Selected the Chuncheon EIP pilot project` → **`… EIP project`** |

⚠ **「선도사업」의 제도적 의미가 영문에서 사라진다** — 확정 사항이다(`GLOSSARY.md` §1 · §9).
⚠ **다섯 강점 `02` 가 가장 약하게 읽힌다** — 「국토교통부 선도사업 지정」이 `a MOLIT project` 가 된다.
  되살리려면 정식명처럼 대문자 `Pilot Project` 를 쓰거나 `Designated by MOLIT` 로 다시 쓴다.
⚠ 「글자」 칸 다섯 줄은 **제목(굵게) / 설명** 자수다(`LAYOUT-NOTES.md` §1 `.mrt`). 전부 낡아 있어 재계산했다.

/* 영문 페이지 빌더 — 이미 빌드된 한국어 HTML 을 읽어 `en/` 에 영문판을 만든다.
 *
 * ⚠⚠ **왜 pages.mjs 안에 넣지 않았나**
 *   pages.mjs 는 라이브 한국어 사이트를 만드는 유일한 경로다. 여기에 로케일 분기를
 *   심으면 영문 작업의 실수가 한국어 산출물로 새어 나갈 수 있다. 영문판은 아직
 *   컨펌 전이므로(번역 확정 전 · 미커밋) **읽기만 하는 별도 단계**로 뒀다.
 *   번역이 확정되면 pages.mjs 로 합치는 것을 고려한다.
 *
 * ⚠ 한국어 빌드가 최신이어야 한다 — `npm run build:en` 이 두 단계를 순서대로 돌린다.
 *
 * 경로 규칙: 산출물은 `en/<slug>.html` 이므로 한 단계 깊다.
 *   · 자산(`assets/…` · `site.webmanifest`) → `../` 를 붙인다 (13+1곳)
 *   · 페이지 링크(`overview.html`)는 **그대로 둔다** — `/en/` 안에서 영문판으로 풀린다
 *   그래서 고칠 것이 자산 쪽 14곳뿐이다. 반대로 루트에 `en-overview.html` 로 두면
 *   페이지 링크 44곳을 고쳐야 한다(실측) — 그래서 `/en/` 을 골랐다.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDict, loadMeta, translate, leftover, TITLE_SUFFIX_KO, TITLE_SUFFIX_EN } from './i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'en');
const SITE_URL = 'https://mang9.github.io/bcity-homepage';
const BANNER = '<!-- 생성물이다.';
const loose = (s) => s.replace(/[\s,'’‘"“”\-–—]/g, '');

const dict = loadDict(ROOT);
const meta = loadMeta(ROOT);

/* 루트의 생성물 HTML + 손글씨 메인. capture.html 같은 손글씨 파일은 배너가 없어 빠진다. */
const pages = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => f === 'index.html' || readFileSync(join(ROOT, f), 'utf8').startsWith(BANNER))
  .sort();

if (!pages.includes('index.html')) throw new Error('index.html 이 없다');
/* ⚠ 하한은 **배포 빌드(SHOW_SAMPLES=0) 기준**이다 — 본문 17 + 404 + 손글씨 index = 18.
     샘플 상세가 붙으면 34 가 되지만 그건 로컬 확인용이라 하한으로 삼으면 안 된다.
     19 로 두었더니 배포 빌드에서 **항상** 죽었다(2026-09-30 실측). */
if (pages.length < 18) throw new Error(`한국어 생성물이 ${pages.length}개뿐이다 — 먼저 npm run build:pages`);

mkdirSync(OUT, { recursive: true });

/* ── 자산 경로를 한 단계 올린다 ─────────────────────────────────────
   ⚠ 페이지 링크(`*.html`)는 건드리지 않는다. 건드리면 영문판이 한국어판으로 나간다.
 *
 * ⚠⚠ **속성 이름을 나열하지 않는다.** 전에 `href|src|srcset` 셋만 고쳤다가
 *   `poster=` · `data-clip=` · `data-clip-hevc=` 세 속성과 **JS 문자열 리터럴 41곳**
 *   (`zones` 의 img·vid·poster · `partners` 의 img · `locRoutes` 의 bg·pin.href)이
 *   그대로 남아 메인 영문판의 이미지·영상이 전부 404 였다(2026-09-16 실측 44건).
 *   자산 참조는 **언제나 따옴표 바로 뒤**에 오므로 `(["'])assets/` 하나로 전부 잡는다 —
 *   속성이든 리터럴이든 구분할 필요가 없고, 새 속성이 생겨도 저절로 따라온다.
 * ⚠ `../assets/` 는 앞 글자가 `/` 라 다시 잡히지 않는다(이중 상승이 없다).
 * ⚠ `toAvif()`(index.html)는 확장자만 바꾸므로 원본 문자열만 올리면 파생 경로도 따라온다.
 */
function liftAssets(html) {
  return html
    .replace(/(["'])assets\//g, (m, q) => `${q}../assets/`)
    .replace(/\s(href|src)="(site\.webmanifest)"/g, (m, a, v) => ` ${a}="../${v}"`)
    .replace(/url\(\s*assets\//g, 'url(../assets/');
}

/* ── 아이브로우는 **이중 언어 쌍**이다 — 영문판에서는 한쪽을 버린다 ───
 * 국문 마크업:
 *   섹션  <b>OVERVIEW</b><span>사업 개요</span>
 *   히어로 <b>01</b><span>BUSINESS · 사업소개</span>
 * 영어 낱말 + 한국어 뜻풀이 쌍이라, 한국어만 번역하면 `OVERVIEW Overview` ·
 * `BUSINESS · Project` 처럼 **같은 말이 두 번** 나온다(실측 — 전 페이지 상단).
 * `_shell.md` §1 이 「카테고리 번호 · 아이브로우는 그대로 — `01 BUSINESS`」라고
 * 못 박았으므로 **영문 낱말만 남긴다.**
 * ⚠ 치환 **전에** 돌린다. 번역 뒤에는 어느 쪽이 뜻풀이였는지 알 수 없다.
 * ⚠ `_shell.md` §3 은 같은 자리를 `01 PROJECT` 로 적어 두어 §1 과 어긋난다 — 확인 필요.
 */
/* 히어로 아이브로우의 라틴 라벨을 **대메뉴 라벨로 통일한다**(2026-10-06 지시).
   국문 마크업은 `BUSINESS · 사업소개` 인데 상단 메뉴 영문은 `The Project` 라 둘이 갈렸다.
   ⚠ 값은 `_shell.md` §1 의 대메뉴 라벨과 **같아야 한다** — 한쪽만 고치면 다시 갈린다.
   ⚠ 대문자로 적는다. `.hero-eyebrow span` 은 `letter-spacing: .2em` 이고 CSS 에
     `text-transform` 이 **없다** — 마크업 글자가 그대로 보인다.
   ⚠ `LOCATION` · `OVERVIEW` 는 **메인 안의 섹션** 이름이지 대메뉴가 아니다. 넣지 않는다. */
const EYEBROW_EN = {
  'BUSINESS': 'THE PROJECT',
  'INVEST': 'INVEST &amp; LOCATE',
  'PR CENTER': 'NEWS &amp; MEDIA',
  'COMPANY': 'ABOUT US',
};

function collapseEyebrow(html) {
  const CAPS = /^[A-Z0-9][A-Z0-9 &·.\-]*$/;
  const menu = (v) => EYEBROW_EN[v] || v;
  return html
    /* 섹션 아이브로우 — 두 꼴이 있다.
         ① `<b>BRAND NAME</b><span>브랜드 네임</span>` — 영문 이름이 <b> 에 있다 → <span> 을 버린다
         ② `<b>01</b><span>BUSINESS · 사업소개</span>`  — **번호**가 <b>, 이름이 <span> 에 있다
       ⚠⚠ ②를 ①과 같이 다루면 **섹션 이름이 통째로 사라진다** — 영문 히어로에 `01` 만
         남아 있었다(2026-10-06 발견 · 18쪽 중 17쪽). <b> 가 숫자뿐이면 <span> 의
         라틴 낱말을 남긴다. */
    .replace(/(<b>([^<]+)<\/b>)\s*<span>([^<]*[가-힣][^<]*)<\/span>/g, (m, b, txt, span) => {
      const t = txt.trim();
      if (/^\d+$/.test(t)) {
        const en = span.match(/^\s*([A-Z][A-Z0-9 &]*?)\s*·/);
        return en ? `${b}<span>${menu(en[1])}</span>` : m;
      }
      return CAPS.test(t) ? `<b>${menu(t)}</b>` : m;
    })
    /* 히어로 · 섹션 아이브로우 — `LOCATION · 입지` 에서 영문만 남긴다.
       ⚠⚠ **아이브로우 안으로 한정한다.** 조건 없이 걸면 똑같은 `<span>라틴 · 한글</span>`
         꼴인 **브랜드 레이어**(`AI · 데이터의 광채`)와 **구역 개요 값**
         (`MICE · 의료시설 등 · 건폐율 70%`)까지 라틴 낱말만 남기고 잘라 낸다 —
         그 두 자리가 실제로 `AI` · `MICE` 로 나가고 있었다(2026-10-06 발견).
         사전에는 올바른 번역이 **있었는데** 이 규칙이 뒤에서 덮었다. */
    .replace(/<p class="(?:hero|ov)-eyebrow[^"]*">[\s\S]*?<\/p>/g, (block) =>
      block.replace(/(<span>)([A-Z][A-Z0-9 &]*)\s*·\s*[^<]*[가-힣][^<]*(<\/span>)/,
        (m, a, en, z) => a + en.trim() + z))
    /* 브랜드 색 스와치 — `<b>Indigo</b><span>인디고</span>` 는 라틴 이름 + 한국어 음역이다.
       음역을 버린다(번역하면 `Indigo Indigo` 가 된다).
       ⚠⚠ **`.br-swatch-h` 안으로 한정한다.** 똑같은 `<b>+<span>` 꼴이 구역소개에서는
         «라벨 + 값»(`<b>전력</b><strong>435MW</strong><span>목표 PUE 1.2</span>`)이라
         조건 없이 걷으면 값이 사라진다. */
    .replace(/(class="br-swatch-h">\s*<b>[^<]*<\/b>)\s*<span>[^<]*[가-힣][^<]*<\/span>/g, '$1')
    /* 브랜드 소제목 — `기본 로고타입 <span>PRIMARY LOGOTYPE</span>` 은 한국어 제목 +
       영문 라벨이다. **영문 라벨을 버리고 한국어를 번역에 맡긴다** — 라벨을 제목 자리로
       올리면 24px 전부 대문자가 되어 다른 제목과 어긋난다. 번역문은 `brand.md` 가 정한다. */
    .replace(/(class="br-h3[^"]*">)([^<>]*[가-힣][^<>]*?)\s*<span>[^<]*<\/span>/g, '$1$2');
}

/* ── 사전으로 닿지 않는 자리 ─────────────────────────────────────────
 * 치환기는 «보이는 글자»만 다룬다(속성값 · 텍스트 덩이 · JS 리터럴). 그런데 카운트업은
 * **숫자가 속성**(`data-count`)이고 **자릿수가 JS 코드**(`toFixed(1)`)라 사전으로 닿지 않는다.
 * 그 자리만 여기서 손으로 고친다 — 사양은 `src/sub/i18n/en/index.md` §3 · §5 에 있다.
 *
 * ⚠ **반드시 1회 일치를 확인한다.** 마크업이 바뀌어 안 맞으면 조용히 지나가는 대신
 *   빌드를 죽인다 — 안 그러면 「110 km²」 같은 값이 화면에 그대로 나간다.
 * ⚠ `toFixed(1)` 은 이 파일에 9곳 있다. **면적 카운트업의 그 한 줄만** 잡는다.
 */
/* 사전으로는 닿지 않는 자리 — **페이지별**이다.
   ⚠ 각 항목은 그 페이지에서 **정확히 1곳** 일치해야 하고, 아니면 빌드가 죽는다.
     사전이 문구를 바꾸면 여기 `from` 도 함께 낡으므로 그 assert 가 유일한 방어선이다. */
const FIXUPS = {
  'index.html': [
    /* 입지 02·03 씬 지점명 — 영문 전용 위치. 2026-09-18.
       ⚠ 라벨은 이제 코드가 그린다(배경에서 글자가 빠졌다 · §11.111). 영문은 국문보다
         1.8배 넓어 **가운데 정렬 라벨 세 곳**이 소요시간 알약이나 받침대에 부딪힌다.
       ⚠ 측면 라벨(강릉 · 원주 · 속초항)은 여기에 없다 — `anchor: start/end` 로 바꿔
         **글자가 받침대 반대쪽으로만 자라므로** 두 언어가 같은 값을 쓴다.
         가운데 정렬로 되돌리면 이 표에 세 줄이 더 필요해진다.
       ⚠ `dy` 가 국문과 4씩 다른 이유는 **영문 하강부가 더 깊기 때문**이다
         (평창 3.59 → Pyeongchang 8.4). 받침대까지의 여백을 16 으로 맞춘 값이다. */
    ['label: { dx: 10,  dy: -129 }', "label: { dx: 10,  dy: -133 }"],          // 평창
    ['label: { dx: -4, dy: -104 },', "label: { dx: 32, dy: -108 },"],          // 양양국제공항 — 90분 알약을 피한다
    ['label: { dx: -45, dy: -100 },', "label: { dx: -29, dy: -104 },"],        // 동해항 — 120분 알약을 피한다
    /* 속초항 — **B-CITY 말풍선**을 피한다. 말풍선은 배경에 구운 도형이라 DOM 에 없고,
       영문 라벨이 국문보다 100 넓어 그 위로 2.7 올라탔다(실측). 오른쪽·아래로 물린다. */
    ["label: { dx: -88, dy: 25, anchor: 'end' },", "label: { dx: -75, dy: 53, anchor: 'end' },"],
    /* 총 사업 면적 지표 — 110만평 → 3.63 km². 단위 낱말은 사전이 바꾼다(`만평` → `km²`). */
    ['<b data-count="110">0</b>', '<b data-count="3.63" data-dec="2">0</b>'],
    /* 존 오버뷰 카드 — 렌더 꼬리의 「만평」이 하드코딩이고 소수 한 자리다.
       ⚠ 한 자리로 두면 비즈니스(0.06)가 `0.1` 로 뭉개진다. */
    ['>0.0</span>만평', '>0.00</span> km²'],
    ['el.textContent=(to*e).toFixed(1);', 'el.textContent=(to*e).toFixed(2);'],

  /* ⚠⚠ **입지 01 지도 — 영문 전용 배치·축약.** 영문 라벨은 같은 내용이 국문보다
       1.8배 넓어(`LAYOUT-NOTES.md`) 시안 좌표 그대로는 **6곳이 겹쳐 읽히지 않는다**
       (2026-09-18 실측: `Cheongnyangni Sta.`↔`Maseok Sta.` 50px · `Gapyeong Sta.`↔
       GTX-B 알약 50 · `Dangnim-ri`↔제2경춘 알약 129 · `Gangchon IC`↔서울양양 알약 69 ·
       `Namchuncheon IC`↔핀 79). 국문 좌표는 시안 그대로 두고 **영문만** 옮긴다.
     ⚠ 알약 문면은 `LAYOUT-NOTES.md` 가 좁은 자리용으로 정해 둔 **축약형**을 쓴다
       (`2nd Gyeongchun Nat'l Rd.` · `Seoul–Yangyang Expwy`). 긴 형태는 본문에 남는다.
     ⚠ `from` 은 **번역된 뒤의 문자열**이라 사전이 그 문면을 바꾸면 여기도 낡는다 —
       1회 일치 assert 가 유일한 방어선이다. */
    /* 서울역 ↔ 청량리역 — 2026-09-21. 국문에서 서울역 점을 한강 위로 올리면서
       (443 → 418) 라벨도 25 올라갔고, **영문 라벨이 국문의 1.8~2.7배**라 둘이 겹쳤다
       (실측 x 84.5 · y 24.6). 국문은 56px 떨어져 문제가 없다.
     ⚠ 세로로는 못 푼다 — 어느 쪽을 올려도 자기 점에서 64~83px 떨어져 소속이 흐려진다
       (다른 라벨은 30px 안쪽이다). 그래서 **문면을 줄이고 좌우로 벌렸다.**
     ⚠ `Cheongnyangni Sta.` → **`Cheongnyangni`**(270.6 → 195.4px). 서브페이지 교통도가
       이미 그 형태를 쓴다 — 새 어법이 아니다. `Seoul Sta.` 는 그쪽과 같게 그대로 둔다.
       ⚠ 그 뒤 x 를 서울 -28 · 청량리 +18 로 벌려 **여유 17.1px** 를 만들었다.
       ⚠ 청량리를 더 오른쪽으로는 못 보낸다 — `Maseok Sta.`(잉크 562.7~) 까지 13px 뿐이다.
       ⚠ 두 라벨 모두 **자기 점을 잉크 범위 안에 품는다**(서울 186.8~321.2 ∋ 282 ·
         청량리 338.3~549.7 ∋ 426) — 감일JCT 와 같은 어법이라 소속이 흐려지지 않는다.
       ⚠⚠ 문면이나 서울역 좌표가 바뀌면 **이 둘을 함께 다시 재라** — 잉크 폭으로 잰다. */
    ["[282,388,'Seoul Sta.']", "[254,388,'Seoul Sta.']"],
    ["[426,378,'Cheongnyangni Sta.']", "[444,378,'Cheongnyangni']"],
    /* 마석역 — 오른쪽 29 + **위로 12.** 위로 올리는 것은 아래 제2경춘 알약에게
       48px 높이를 내주기 위한 것이다(근거는 그 알약 주석). 그래서 이 라벨만
       자기 점과 24.4 떨어진다 — 나머지 13개는 8.5~19.5 다. 줄일 수 없다. */
    ["[616,376,'Maseok Sta.']", "[645,364,'Maseok Sta.']"],
    /* ⚠ 2026-09-21 — 국문에서 가평역 · 금남JCT · 당림리 · 화도IC 마커를 뺐으므로
       「그 마커를 피한다」가 근거였던 보정 둘을 손봤다.
         · `GTX-B (planned)` — 보정을 **걷었다.** 국문 좌표 그대로 겹침 0(실측).
         · 제2경춘 — **축약형을 버리고 전체 이름으로 되돌리되 오른쪽으로 물렸다**(879 → 922).
       ⚠⚠ 전체 이름 알약은 **554px**(국문 230px 의 2.4배)다. 국문 좌표 그대로 두면
         왼쪽 끝이 602 로 내려와 **마석역 마커(원반 597~635)를 19px 덮는다** — 실측으로
         잡았다. 922 면 645~1199 로 마커 침범 0 · 다른 알약·라벨 겹침 0 · 프레임 안이다.
       ⚠⚠ **알약↔마커 검사를 빼먹지 말 것.** 글자·알약면끼리만 재면 이 결함이 안 잡힌다
         (알약이 점을 덮는 것은 사각형↔원 판정이라야 보인다). 시간 알약 3개가 자기 마커를
         덮는 것은 **설계**이므로 그 셋은 제외한다.
       ⚠ `Maseok Sta.` · `Seoul–Yangyang Expwy` 보정은 **걷으면 안 된다** — 되돌려 보니
         `Cheongnyangni ↔ Maseok Sta.` -7.9 · `Gangchon IC ↔ 서울양양` -6.2 로 겹친다
         (그 둘의 근거는 지워진 마커가 아니라 **남아 있는 라벨**이다). */
    ["[928,436,'2nd Gyeongchun National Road (planned)'", "[928,436,'2nd Gyeongchun National Road (planned)'"],
    // 서울양양 — 축약형 + 왼쪽으로. 강촌IC 라벨과 떨어진다
    ["[828,582,'Seoul\u2013Yangyang Expressway'", "[791,582,'Seoul\u2013Yangyang Expwy'"],
    /* ⚠ 2026-09-21 — **당림리 · 금남JCT 항목을 걷었다.** 국문에서 그 두 지점명(과
       가평역 · 화도IC)을 뺐으므로(첫 씬이 복잡하다는 지시) 옮길 대상이 없다.
       1회 일치 assert 가 바로 잡아 준다 — `from` 이 사라지면 빌드가 죽는다.
       ⚠ 국문에 지점을 되살리면 여기도 함께 되살려야 한다. */
    /* 40분 알약 — 아래로 8. 위의 서울양양 노선명 알약과 벌린다(영문에서 둘 다 넓어졌다) */
    ["[828,520,'40 min'", "[828,528,'40 min'"],
    // 남춘천IC — 핀·B-CITY 라벨을 피해 오른쪽으로(그쪽은 빈 지형이다)
    ["[1289,630,'Namchuncheon IC']", "[1400,630,'Namchuncheon IC']"],
    /* 양평JCT — **x 를 영문 라벨 폭에 맞춰 다시 잡는다.** 이 라벨만 점 오른쪽에
       가운데 정렬로 놓이므로, 폭이 2.2배(104.7 → 228.6)면 중심도 그만큼 밀어야
       왼쪽 끝이 같은 자리에 온다. 국문 844 를 그대로 쓰면 마커를 49 파고든다.
       ⚠ 906 = 마커 오른쪽 끝(779) + 국문과 같은 간격 13 + 반폭 114.3.
       ⚠ 그 이상 밀 수 없다 — 영문 B-CITY 히어로(`B-CITY|Chuncheon EIP`, 38px)가
         바로 오른쪽이다. 935 로 옮겨 봤더니 16x17 로 부딪혔다(2026-09-21 실측).
       ⚠ y 는 국문과 같다(681) — 아래 노선명 알약을 J 하강부가 넘지 않는 값이다. */
    ["[812,650,'Yangpyeong JCT']", "[874,650,'Yangpyeong JCT']"],
    /* 화도IC — 국문은 마커 **위**(648,462)인데 영문 `Hwado IC` 는 폭이 **1.65배**
       (78.3 → 129.5)라 그 자리에서 `2nd Gyeongchun National Road (planned)` 알약과
       **26.5 겹친다**(실측). 왼쪽 아래로 옮기면 여유 18.7 이 나온다.
       ⚠ 국문 좌표를 고치면 이 `from` 도 함께 고친다 — 1회 일치 assert 가 잡아 준다. */
    ["[648,462,'Hwado IC']", "[568,474,'Hwado IC']"],
    /* 섹션 아이브로우 — 예전에는 여기서 이름을 손으로 되살렸다(2026-09-28).
       2026-10-06 에 `collapseEyebrow` 가 `<b>번호</b><span>LABEL · 한글</span>` 에서
       라틴 라벨을 **직접 남기도록** 고쳐 더 필요 없어졌다. */

    /* ⚠⚠ 아래 둘은 **사전에 값이 있는데도** 안 바뀐다 — 치환 단위가 «리터럴 전체»라서다
         (§11.110). `부지 개요` 는 `'<p class="…">부지 개요</p>'` 가 통째로 한 리터럴이고,
         페이저 라벨은 `'페이지로 이동"'` 처럼 앞에 `+(i+1)+` 가 붙어 조각나 있다.
       ⚠ 둘 다 **JS 가 런타임에 만드는 DOM** 이라 빌드의 `남은 한국어` 집계에도 안 잡힌다 —
         화면을 렌더해서 세야 드러난다(2026-09-28 실측). */
    [`'<p class="mt-4 mb-2.5 text-xs font-bold uppercase tracking-wider text-text">부지 개요</p>'`,
     `'<p class="mt-4 mb-2.5 text-xs font-bold uppercase tracking-wider text-text">Site overview</p>'`],
    [`'<i role="button" tabindex="0" aria-label="'+(i+1)+'페이지로 이동"'`,
     `'<i role="button" tabindex="0" aria-label="Go to item '+(i+1)+'"'`],
  ],
  'effect.html': [
    /* 카운트업 지표의 단위 칸. 사전 키는 `16,000여 명 / 6,366세대` 처럼 두 값을 합친
       형태인데 마크업에서는 **서로 다른 요소**에 흩어져 있어 덩이 단위로 맞지 않는다.
       ⚠ 「여 명」이 두 자리에 있고 뜻이 다르다(계획인구 residents / 취업유발 jobs) —
         사전은 키 하나에 값 하나라 여기서 갈라야 한다.
       ⚠ 「여」(어림수)는 영문에서 사라진다. `+` 를 붙이면 최소치로 읽히고(§11.102),
         `approx.` 는 카운터 숫자 앞이라 넣을 자리가 없다. 바로 아래 설명이 맥락을 준다. */
    ['<small>여 명</small><i><span data-count="6366">6,366</span>세대</i>',
     '<small>residents</small><i><span data-count="6366">6,366</span> households</i>'],
    ['<span data-count="5000">5,000</span><small>여 명</small>',
     '<span data-count="5000">5,000</span><small>jobs</small>'],
  ],
  'living.html': [
    /* 해시태그 `#Green & Blue` — **국문 마크업 자체가 영어**라(형제 셋은 한글)
       사전이 건너뛴다. `loadDict` 는 **한글이 없는 키를 등록하지 않는다**(§11.110).
       그 바람에 묶음 요약 줄(전체가 한 덩이라 치환된다)은 `#GreenAndBlue` 인데
       실제 태그만 `#Green & Blue` 로 남아 **같은 화면에서 표기가 갈렸다**(2026-09-28).
       ⚠ 국문은 그대로 둔다 — 라이브 카피이고 지시 범위 밖이다. 영문만 맞춘다. */
    ['#Green &amp; Blue', '#GreenAndBlue'],
  ],
  'location.html': [
    /* 도로 카드 — 서울~양평고속도로(예정). 2026-09-18.
       ⚠ 사전의 단독 키가 **지도 배지용 축약형**(`Seoul–Yangpyeong Expwy`)이라 카드에도
         그게 들어가 ① 형제 행(`Seoul–Yangyang Expressway`)과 어긋나고
         ② **`(planned)` 이 사라져 「예정」이라는 정보가 영문판에서 없어진다.**
       ⚠ 지도 라벨은 축약형이 맞다(좁은 자리) — 그래서 사전 값을 바꾸지 않고 여기만 되돌린다.
       ⚠ `from` 은 번역된 뒤의 문자열이다. 사전이 그 문면을 바꾸면 1회 일치 assert 가 잡는다. */
    ['<b>Seoul–Yangpyeong Expwy (planned)</b> <span>30 min to Seoul</span>',
     '<b>Seoul–Yangpyeong Expressway (planned)</b> <span>30 min to Seoul</span>'],

    /* ⚠⚠ **종합 교통도 라벨 — 영문 전용 위치.** 2026-09-22 에 전면 재배치했다.
       참고 지도 기준으로 지점이 늘어(§11.117 — 화도IC · 금남JCT · 당림리 · 강촌IC 신설)
       춘천 진입부에 라벨이 몰렸고, 영문은 같은 이름이 국문의 **2~2.5배** 폭이다:
         금남JCT 63.2 → Geumnam JCT 122.8 · 당림리 44.1 → Dangnim-ri 93.7 ·
         강촌IC 46.7 → Gangchon IC 106.9 · 서울양양고속도로 103.7 → …Expressway 214.7 ·
         제2경춘국도(예정) 111.5 → 2nd Gyeongchun National Road (planned) 305.6
       즉 그 구역에만 **170px 넘는 추가 폭**이 필요하다. 시안 좌표를 그대로 두면 영문에서
       라벨 5곳 · 마커 7곳이 겹친다(국문은 0).

     ⚠ **탐색으로 얻은 값이다.** 손으로 한 곳씩 밀면 반드시 막힌다 — 라벨 하나를 비키면
       옆 라벨이 막히는 연쇄가 생긴다. 전역 탐색(후보 생성 → 전진 검사 DFS)으로 12개를
       한꺼번에 풀었다. 하네스는 스크래치패드의 `tsolve5.mjs` 이고 절차는 §11.117 에 있다.
     ⚠ 제약 — ① 라벨↔라벨 · 라벨↔남의 마커 **≥10px**(국문 실측 최소 10.9 와 같은 수준)
       ② **자기 마커가 가장 가까운 마커**여야 한다(거리 문턱이 아니라 이 조건이 소속을 정한다)
       ③ 노선명은 자기 노선에서 26px 안 + **경쟁 도로보다 자기 도로가 더 가깝다**
       ④ 선을 가로지르는 것은 허용한다(흰 아웃라인이 글자를 지킨다 · 국문도 그렇다)
     ⚠ `9px` 로는 해가 없다. 10 에서만 나온다 — **간격을 더 벌릴 수 없다.**
     ⚠ 라벨 문면이나 마커 좌표가 바뀌면 이 값들이 **전부 무효**다. 다시 풀어야 한다.
       ⚠ 실제로 2026-09-28 에 그렇게 됐다 — 노선명 5개를 다시 풀었다(아래). */

    /* 청량리역 — 왼쪽 위로. ITX 회전 라벨(335~)이 오른쪽을 막아 마커(264,540) 위로 올렸다 */
    ['x="235.3" y="576.1">Cheongnyangni Sta.<', 'x="151.3" y="520.1">Cheongnyangni Sta.<'],
    /* 마석역 — 왼쪽 아래로. 원래 자리(437~539 · y 461~480)를 제2경춘 노선명이 쓴다 */
    ['x="436.8" y="474.9">Maseok Sta.<', 'x="340.8" y="502.9">Maseok Sta.<'],
    /* 가평역 · 강촌역 — 왼쪽으로. 폭이 2.8배라 오른쪽으로 두면 각각
       강촌역 마커(694,386) · 춘천시청 마커(780,355)를 덮는다 */
    ['x="562.2" y="383.2">Gapyeong Sta.<', 'x="466.2" y="391.2">Gapyeong Sta.<'],
    ['x="670.1" y="361.4">Gangchon Sta.<', 'x="598.1" y="365.4">Gangchon Sta.<'],
    // 화도IC — 오른쪽으로. 서울양양 노선명이 왼쪽으로 내려왔다
    ['x="362" y="612">Hwado IC<', 'x="427" y="612">Hwado IC<'],
    /* 금남JCT · 당림리 · 강촌IC — 세 마커가 130x45 안에 몰려 있는데 영문 라벨은 각 94~123 이다.
       셋을 위(당림리) · 가운데(금남JCT) · 아래(강촌IC)로 흩어 자기 마커가 가장 가깝게 둔다. */
    ['x="510" y="522">Geumnam JCT<', 'x="470" y="550">Geumnam JCT<'],
    /* 감일JCT — 위로 23px. 2026-09-28 에 추가했다.
       ⚠ 국문(63px)은 노선명(`서울~양평고속도로(예정)`)과 여유가 있지만 영문은 **85px** 라
         그 노선명과 **0.0~0.1px 접촉**한다(1440 에서 0.1 · 390 에서 0.0 — 실측).
         닿을 뿐이라 눈에 안 띄지만 라벨 두 개가 한 덩이로 읽힌다.
       ⚠ 이 라벨은 **마커 오른쪽에 가로로** 붙는다(마커 377,676 / 라벨 x1 391.4).
         그래서 「자기 마커와의 거리」는 세로로 어떻게 옮겨도 **가로 간격 2.4px 로 고정**이다
         — 국문도 같은 값이다. 세로 이동이 소속을 흐리지 않는다는 뜻이다.
       ⚠ 23 을 고른 이유는 그 값에서 **라벨 세로 중심이 마커 중심(676)과 정확히 같아져**
         가로 배치가 정돈되기 때문이다. 여유는 15.4(양평JCT).
       ⚠ 전역 탐색(dx −34~44 · dy −34~24)에서 **아래쪽·오른쪽은 전부 후보 0** 이다.
         위로 14 이상만 열린다 — 더 좁히려 하지 말 것. */
    ['x="391.4" y="705">Gamil JCT<', 'x="391.4" y="682">Gamil JCT<'],
    /* ⚠ 당림리 fixup 을 걷었다(2026-09-28) — Figma 수정본에서 **국문 라벨·마커가 삭제**돼
       옮길 대상이 없다. 1회 일치 assert 가 바로 잡아 줬다. 되살리면 여기도 함께 되살린다. */
    /* 강촌IC — 영문 폭 78px(국문 34)이라 국문 자리(마커 **아래**)에서 `Geumnam JCT` 와
       부딪혀 왼쪽 아래로 밀려 있었다. 그 자리는 자기 마커와 **23.1** 로 이 지도에서 가장
       멀었다(국문 2.6 · 지점명 중앙값 4.2) — 소속이 흐려 보인다.
       → **마커 위쪽**으로 옮긴다(2026-09-29 지시 「위쪽에 공간이 있으니」).
         여유 **2.9** 로 국문(2.6)과 같은 대이고, 위쪽은 `Geumnam JCT` 19.4 · 남의 마커 8.1 로 넉넉하다.
       ⚠ 가로는 마커 중심에서 8.5 왼쪽이 한계다 — 더 오른쪽은 남의 마커가 8 아래로 떨어진다.
         국문도 +5.4 오른쪽이라 치우침 크기는 같은 수준이다.
       ⚠ **위로 옮긴 것은 영문뿐이다.** 국문은 폭이 절반이라 아래 자리가 멀쩡하다 —
         국문까지 위로 올리면 `제2경춘국도(예정)` 알약 쪽이 빡빡해진다. */
    ['x="603" y="555">Gangchon IC<', 'x="554" y="503">Gangchon IC<'],
    /* ⚠ 남춘천IC 는 영문 전용 좌표가 **없다.** 2026-09-22 에 그 마커를 동해항 경로 위로
       옮기면서(`transit-markers.svg` 주석) 국문 좌표 (802,558)가 두 언어 모두에서
       성립하게 됐다 — 옛 자리(서울양양 스퍼 끝)에서는 영문이 B-CITY 핀과 부딪혀
       `[1289,630] → [1400,630]` 같은 보정이 필요했다. */
    /* ⚠⚠ 노선명 5개 — 2026-09-28 에 **전부 다시 풀었다.**
       국문이 Figma 수정본으로 바뀌면서(§11.125) 옛 값이 통째로 무효가 됐다.
       ⚠ **제2경춘은 국문 자리를 그대로 쓴다** — 전체 이름(305.6px)으로 겹침 0 ·
         자기선 35.9 / 같은 teal 남 56.3 으로 통과한다. §11.117 의 「어떤 문면으로도
         자리가 없다」가 국문 자리가 바뀌며 해소됐다 → FIXUP 이 필요 없다.
       ⚠ 서울양양의 **두 줄 분할도 걷었다** — 한 줄 전체 이름이 그대로 들어간다(아래). */
    /* GTX-B — 국문 자리에서 **아래로 40px**(x·회전 그대로).
       전체 이름 198.6px 는 `Cheongnyangni Sta.` 15.8 · `Maseok Sta.` 21.6 겹치고,
       자리를 옮기면 가평~춘천 구간(dx 300)뿐인데 거기는 선 기울기 **+24.6°** 와
       라벨 회전 **−14.13°** 가 38.7° 어긋나 **X 자로 교차한다**(실측).
       ⚠ 그래서 문면을 **`GTX-B ext.`(79.8px)** 로 줄였다 — 그것만 국문 자리 근처에서
         엄격 조건(라벨·마커 ≥10 · 자기선 ≤26)을 통과한다(이동 40 · 자기선 19.9).
       ⚠ `(planned)` 를 버리고 `ext.` 를 지킨 근거 — 「예정」은 **teal 점선 자체**가 말하고
         (형제 teal 둘도 예정이다), 철도 카드는 `GTX-B` 만 적어 **「연장선」은 이 라벨이
         유일하게 담는다**(실측). §11.117 의 제2경춘 축약과 같은 판단이다.
       ⚠ 다른 문면은 안 된다 — `GTX-B (planned)`(122.9px)는 국문 자리 근처가 간격 **8px** 로
         기준(10) 미달, `GTX-B ext. (planned)`(154.1px)는 **자기선 26 을 넘는다**(실측). */
    ['x="297.5" y="515.5" fill="#19AFA6" transform="rotate(-14.13 297.5 515.5)">GTX-B extension (planned)<',
     'x="297.5" y="555.5" fill="#19AFA6" transform="rotate(-14.13 297.5 555.5)">GTX-B ext.<'],
    /* ITX — **한 줄로는 이 노선 어디에도 들어가지 않는다.** 영문 92px(국문 42)인데 역이
       다섯이라 어느 역 사이도 그보다 짧다 — 선 전 구간을 훑어도 최선이 **마커 −2.1** 이고,
       국문 자리에서는 마석역 −2.1 · 가평역 −5.0 으로 **양쪽을 동시에** 파고든다(실측).
       회전을 0·−8·−14·−20·−26 으로 바꿔도 후보 0, 선을 따라 미끄러뜨려도 t=0 이 최적이다.
       → **두 줄**(69×26px)로 나누고 **아래 20**. 마커 6.5 · 라벨 7.2 · 자기선 6.5 로
         국문 여유대(마커 2.9~15.9 · 자기선 0.1~15.4) 안에 든다.
       ⚠ 참고 지도의 국문 노선명도 두 줄이다 — 새 어법이 아니다(§11.117).
       ⚠ 하이픈을 첫 줄 끝에 남긴다(`ITX-` / `Cheongchun`). 떼면 복합어가 끊긴 것으로 읽힌다.
       ⚠ `tspan` 의 `x` 는 `text` 의 `x` 와 **같아야** 한다. 다르면 둘째 줄만 어긋난다.
       ⚠ `transform` 의 회전 중심도 x·y 와 함께 옮긴다 — 안 옮기면 라벨이 호를 그리며 튄다. */
    ['x="492.5" y="452.9" fill="#1758B5" transform="rotate(-36.16 492.5 452.9)">ITX-Cheongchun<',
     'x="472.5" y="472.9" fill="#1758B5" transform="rotate(-36.16 472.5 472.9)">' +
       '<tspan x="472.5">ITX-</tspan><tspan x="472.5" dy="1.1em">Cheongchun</tspan><'],
    /* 서울양양 — 영문 폭 214.7px(국문 104)이라 국문 자리에서 `Gangchon IC` 9.0 ·
       `B-CITY` 6.8 겹친다. **잠실 쪽으로 284 왼쪽 · 아래 13**.
       ⚠ 라벨 겹침만 피한 자리(x256)는 **화도IC 마커를 12.4 파고들었다** — 라벨끼리의
         간격만 보면 마커 침범을 놓친다. 지금 자리는 마커 2.1 · 라벨 7.3 · 자기선 16.5. */
    ['x="472" y="571.5" fill="#527EA8">Seoul–Yangyang Expressway<',
     'x="188" y="584.5" fill="#527EA8">Seoul–Yangyang Expressway<'],
    /* 제2경춘 — 국문 자리(542,484.5)에서 **B-CITY 동심원을 파고든다**(흰 r38 17.9 ·
       남색 r28 7.9). 두 원은 **채움이 있는 면**이라 teal 글자가 남색 위에 얹혀 읽히지 않는다.
       **오른쪽 28 · 위 29**(마커 3.3 · 라벨 8.1 · 자기선 12.6 · 타teal 30.9).
       ⚠ 국문은 111.5px 라 같은 자리에서 마커 3.4 로 멀쩡하다 — 폭 305.6px 만의 문제다. */
    ['x="542" y="484.5" fill="#19AFA6">2nd Gyeongchun National Road (planned)<',
     'x="570" y="455.5" fill="#19AFA6">2nd Gyeongchun National Road (planned)<'],
    /* 서울~양평 — 국문 자리에서 `Hwado IC` 3.6 · `Gwangpan-ri, Chuncheon` 21.7 겹친다.
       **왼쪽 144 · 아래 86**(마커 4.5 · 라벨 8.7 · 자기선 23.1).
       ⚠ 앞선 자리(383,651.5)는 **양평JCT 마커를 14.6 파고들었다.**
       ⚠ 이 자리의 선 기울기는 −5° 라 회전 없는(0°) 라벨과 오히려 더 잘 맞는다
         — 옛 자리는 −35.9° 였다(실측). */
    ['x="431" y="627.5" fill="#19AFA6">Seoul–Yangpyeong Expwy (planned)<',
     'x="287" y="713.5" fill="#19AFA6">Seoul–Yangpyeong Expwy (planned)<'],
    /* 동해항 — 왼쪽으로 31. 프레임(1672)을 4 넘던 것이 여유 27.5 가 되고,
       글자 중심이 자기 마커(1588)와 맞아떨어진다.
       ⚠ `text-anchor="middle"` 로 풀지 않는다 — `.tl-place` 에 CSS 가 걸리면
         표현 속성이 밀린다. x 이동은 그 위험이 없고 결과가 같다. */
    ['x="1562.5" y="688.3">Donghae Port<', 'x="1531.5" y="688.3">Donghae Port<'],
  ],
  'about.html': [
    /* 회사개요 표 — 국문은 「회사명(국문) / 영문명」 두 행이다. 영문판도 같은 구조로
       **`Company (Korean)` / `Company (English)`** 로 가른다(2026-09-18 지시).
       ⚠ 사전은 단독 상호를 **영문명으로** 바꾼다 — 그 매핑은 다른 6곳(메인 · 사업개요 ·
         사업주체 · 추진일정)이 쓰고 있으므로 건드리면 안 된다. 그래서 여기서만 되돌린다.
       ⚠ 되돌리지 않으면 「Company (Korean)」 행에 **영문명이 들어가 라벨과 어긋난다** —
         검수자가 이 표를 지적한 원인이 정확히 그 어긋남이었다. */
    ['<th scope="row">Company (Korean)</th><td><b>Biotech Innovalley PFV Co., Ltd.</b></td>',
     '<th scope="row">Company (Korean)</th><td><b>바이오테크이노밸리피에프브이㈜</b></td>'],
  ],
};

function enFixups(html, f) {
  for (const [from, to] of (FIXUPS[f] || [])) {
    const n = html.split(from).length - 1;
    if (n !== 1) throw new Error(`en/${f}: 고칠 자리를 ${n}곳 찾았다(1이어야 한다) — ${from}`);
    html = html.replace(from, to);
  }
  return html;
}

/* ── 404 는 절대 주소를 쓴다(어느 깊이에서든 그려지므로) ─────────────
   자산은 그대로 두고 **페이지 링크만** `/en/` 으로 옮긴다. */
/* ── 영문판 표기 규약 — 사전으로 닿지 않는 전역 치환 ────────────────────
   ⚠ 사전(`loadDict`)은 **한글이 없는 키를 건너뛴다**. 그래서 단위 기호나
     한국어가 섞이지 않은 표기는 사전에 넣어도 수집되지 않는다 — 여기서 한다. */
function enConventions(html) {
  /* ① `㎡`(U+33A1 · 전각 합자) → `m²`.
        `GLOSSARY.md` §7 이 면적 단위를 `m²` / `km²` 로 확정했는데, 국문 소스의
        전각 문자가 그대로 넘어와 영문 표 머리글과 본문에 섞여 있었다.
        ⚠ 전각 합자는 영문 본문 서체에 글리프가 없어 폴백으로 그려진다 —
          같은 줄의 숫자와 서체가 갈린다(2026-09-28 실측 · 5개 페이지 19곳).
     ⚠ **숫자와 붙여 쓰면 안 된다.** 국문은 `3,632,899㎡` 처럼 붙여 쓰지만
       영문은 SI 규약대로 띄운다. 그냥 글자만 바꾸면 `3,632,899m²` 가 되어
       사전이 처리한 자리(`206,959 m²`)와 **표기가 갈린다**(2026-09-28 실측 4곳). */
  html = html.replace(/\s*\u33a1/g, ' m²');   /* ⚠ 앞 공백까지 묶어 바꿄다 — 아래 ⚠ */

  /* ①-2 전력 단위 — 영문은 숫자와 단위 사이를 띄운다(SI 규약).
        사전 값은 이미 `435 MW` 인데 **`435MW` 처럼 한글이 없는 값은 사전 키가 될 수 없다**
        (`loadDict` 의 한글 가드 · 위 ① 과 같은 이유). 그래서 구역 개요의 「전력」 칸과
        메인 `zones` 배열의 specs 두 자리만 붙은 채 남아 **같은 사이트에서 표기가 갈렸다**
        (2026-09-28 실측 · `435 MW` 6곳 ↔ `435MW` 2곳). */
  html = html.replace(/(\d)(MW|kW|GW|kV|MVA)\b/g, '$1 $2');

  /* ①-3 통화 코드 — `GLOSSARY.md` §7 이 **KRW** 로 확정했다.
        `won` 은 카운트업 단위 칸 두 자리에만 남아 다른 10곳과 갈렸다(2026-09-28 실측).
     ⚠ 태그가 서로 다르다 — 기대효과는 `<small>`, 메인은 `<span>` 이라
       FIXUPS 로 가르면 같은 결정이 두 벌로 갈린다. 여기서 한 번에 바꾸다.
     ⚠ 어순은 `KRW 0.9 trillion` 이 표준이지만 **숫자가 카운트업으로 세어지는
       연출**이라 앞에 둘 수 없다 — 통화 코드만 통일한다.
     ⚠ 동사 `won` 을 건드리지 않도록 단위어 뒤만 잡는다. */
  html = html.replace(/\b(trillion|billion|million|thousand) won\b/g, '$1 KRW');

  /* ② 개인정보처리방침 — 한국어본 유지가 확정이다(G01 · `GLOSSARY.md` §11).
        **제목 바로 아래**에 준거 언어를 한 줄 밝힌다. 뒤에 붙이면 2,000자를
        다 읽고 나서야 「한국어다」를 알게 된다(§11.104).
     ⚠ 이 문장은 «영문본이 없다»는 전제의 것이다. 법무 검토를 거친 영문본을
       올리면 반드시 `In the event of any discrepancy, the Korean version prevails.`
       로 바꾼다 — 지금 문장을 그대로 두면 두 본이 대등한 효력으로 읽힌다. */
  const mark = '<div class="pv-body">';
  if (html.includes(mark) && !html.includes('governing text')) {
    html = html.replace(mark, mark
      + '\n        <p class="pv-p">This Privacy Policy is provided in Korean.'
      + ' The Korean version is the governing text.</p>');
  }

  /* ③ 낭독 라벨 — **JS 가 만드는 것**은 사전 치환이 닿지 않는다.
        `pager.js` · `press-list.js` · `lightbox.js` 의 라벨이 그렇다.
        `_leftover.md` 는 정적 HTML 만 세므로 이것도 못 본다 —
        영문판 다섯 쪽에서 한국어로 남아 있었다(2026-09-28 렌더 실측).
     ⚠ **값을 여기 적지 않는다.** 사전에서 찾아 쓴다 — 두 벌로 두면
       사전 문면을 고쳤을 때 이쪽만 낡는다. */
  html = html.replace(/aria-label="([^"]*)"/g, (m, v) => {
    if (!/[가-힣]/.test(v)) return m;
    const hit = dict.find(r => r.ko === v);
    return hit ? `aria-label="${hit.en}"` : m;
  });

  /* `'쪽">'` 처럼 **문자열 결합으로 갈린 조각**은 사전 키가 될 수 없다.
     여기서만 «결합식 전체»를 통째로 바꾼다(§11.110 의 치환 단위 규칙). */
  html = html.replace(/aria-label="' \+ i \+ '쪽">/g, `aria-label="Page ' + i + '">`);

  /* 방어선 — 낭독 라벨에 한국어가 남으면 빌드를 죽인다.
     위 셋은 개수가 페이지마다 달라 1회 일치 assert 를 걸 수 없다(§11.111).
     그래서 «결과»를 검사한다 — 새 라벨이 늘어도 자동으로 걸린다. */
  const left = html.match(/aria-label="[^"]*[가-힣][^"]*"/g);
  if (left) throw new Error('낭독 라벨에 한국어가 남았다: ' + [...new Set(left)].join(' · '));

  return html;
}

function lift404(html) {
  const base = new URL(SITE_URL).pathname.replace(/\/+$/, '') + '/';
  return html.replace(new RegExp(`(\\s(?:href)=")${base}(?!en/)([\\w-]*\\.html)`, 'g'),
    (m, head, f) => head + base + 'en/' + f);
}

let missingMeta = [];
const report = [];

for (const f of pages) {
  const koSrc = readFileSync(join(ROOT, f), 'utf8');
  const koTitle = (koSrc.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const { out: translated, hit } = translate(collapseEyebrow(koSrc), dict);
  let html = translated;

  /* ① 문서 언어 */
  html = html.replace(/<html lang="ko">/, '<html lang="en">');

  /* ② 제목 · 설명 — 치환으로 안 되는 자리다(i18n.mjs 의 loadMeta 주석 참조).
        메인(index.html)은 `en/index.md` §0 에 한국어 원문이 그대로 있어 치환으로 된다. */
  if (f !== 'index.html') {
    const key = loose(koTitle.replace(TITLE_SUFFIX_KO, '').trim());
    const m = meta.get(key) || (f === '404.html' ? meta.get('404') : null);
    if (m) {
      const enTitle = m.prefix + TITLE_SUFFIX_EN;
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${enTitle}</title>`);
      html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${m.desc}$2`);
      html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${enTitle}$2`);
      html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${m.desc}$2`);
      html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${enTitle}$2`);
      html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${m.desc}$2`);
    } else if (!/^(?:notice|press|video|gallery|publication)-/.test(f)) {
      /* ⚠ 샘플 상세 15쪽은 여기 걸리지 않게 뺀다 — 그 제목·설명은 게시물에서 나오고
           **게시물은 국문 유지가 확정**이다(G02). 경고로 남기면 매 빌드마다 16줄이
           쏟아져 진짜 누락(본문 쪽)을 가린다. */
      missingMeta.push(`${f} (키 「${koTitle.replace(TITLE_SUFFIX_KO, '')}」)`);
    }
  }

  /* ③ 정본 주소 — `/en/` 을 넣고 언어 짝(hreflang)을 단다.
        ⚠ 404 에는 canonical·og 를 두지 않는다(오류 페이지는 정본이 아니다 · pages.mjs 참조). */
  if (f !== '404.html') {
    const abs = (p) => `${SITE_URL}/${p}`;
    const koUrl = abs(f === 'index.html' ? '' : f);
    const enUrl = abs('en/' + (f === 'index.html' ? '' : f));
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${enUrl}$2`);
    html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${enUrl}$2`);
    const alt = `  <link rel="alternate" hreflang="ko" href="${koUrl}" />\n`
      + `  <link rel="alternate" hreflang="en" href="${enUrl}" />\n`
      + `  <link rel="alternate" hreflang="x-default" href="${koUrl}" />\n`;
    html = html.replace(/(\s*<link rel="canonical"[^>]*>\n)/, (m0) => m0 + alt);
  }

  /* ④ 사전으로 닿지 않는 자리 · 경로 */
  html = enFixups(html, f);
  html = enConventions(html);
  html = f === '404.html' ? lift404(html) : liftAssets(html);

  /* ⑤ KO/EN 토글 — 국문 블록을 **요소 단위로 뒤집는다**(`is-on` ↔ 링크).
   *
   * 국문 꼴(데스크톱 · 모바일 둘 다 같다):
   *   <span class="is-on …">KO</span><span class="gnb-lang-sep" …>|</span><a class="… -en" href="en/x.html">EN</a>
   * 영문 꼴:
   *   <a class="…" href="../x.html">KO</a><span class="gnb-lang-sep" …>|</span><span class="is-on …">EN</span>
   *
   * ⚠⚠ **`<div class="gnb-lang">` 을 통째로 갈아 끼우지 않는다.** 메인은 그 div 에
   *   Tailwind 클래스가 붙어(`gnb-lang hidden items-center …`) 옛 정규식
   *   `/<div class="gnb-lang">/` 이 **아예 안 맞았다** — 그래서 영문 메인은 국문 토글과
   *   「준비중입니다」 말풍선을 그대로 달고 있었다(2026-09-21 발견). 안쪽 두 요소만 바꾸면
   *   메인의 유틸리티 클래스가 보존되고 서브와 같은 코드로 처리된다.
   * ⚠ 데스크톱 · 모바일 두 곳이 같은 꼴이라 **한 규칙이 둘을 함께** 잡는다.
   *   실측으로 페이지마다 2건이어야 한다 — 0건이면 국문 마크업이 바뀐 것이다.
   * ⚠ `../` 는 영문 산출물이 `en/` 한 단계 안에 있기 때문이다(`liftAssets` 와 같은 이유).
   */
  const drop = (cls, name) => cls.split(/\s+/).filter((c) => c && c !== name).join(' ');
  /* ⚠ `class` 는 **선택**이다. 메인 데스크톱은 Tailwind 유틸리티를 갖고 있지만
       모바일과 서브페이지는 클래스가 없다 — 요구하면 그쪽이 안 맞는다(실측 1/2건). */
  let langHit = 0;
  html = html.replace(
    /<span class="([^"]*\bis-on\b[^"]*)">KO<\/span>(\s*<span class="gnb-lang-sep"[^>]*>\|<\/span>\s*)<a(?:\s+class="([^"]*)")?\s+href="([^"]*)">EN<\/a>/g,
    (_m, koCls, sep, enCls, enHref) => {
      langHit += 1;
      /* 국문판 주소로 되돌린다.
         ⚠ 404 는 **절대 경로**다(§11.91 — 요청 주소 그대로 그려지므로 상대 경로가 통하지
           않는다). `/…/en/404.html` → `/…/404.html` 로 `en/` 한 겹만 걷는다.
         ⚠ 나머지는 상대 경로다 — 영문 산출물이 `en/` 안에 있으므로 `../` 를 붙인다. */
      const koHref = enHref.startsWith('/')
        ? enHref.replace(/\/en\//, '/')
        : '../' + enHref.replace(/^en\//, '');
      const koOut = drop(koCls, 'is-on');
      const enOut = (enCls || '').trim();
      return `<a${koOut ? ` class="${koOut}"` : ''} href="${koHref}">KO</a>`
        + sep
        + `<span class="${enOut ? enOut + ' ' : ''}is-on">EN</span>`;
    });
  /* ⚠⚠ 국문이 **준비중 꼴**일 때도 받는다(`pages.mjs` 의 `EN_READY` 가 꺼진 상태 ·
   *   메인 `index.html` 은 손글씨라 그 스위치가 닿지 않아 **항상** 이 꼴이다).
   *   `.gnb-en` 스팬을 그대로 두면 영문판에 「준비중입니다」가 달린 채 나간다 —
   *   2026-09-21 에 실제로 그 상태였다(옛 정규식이 안 맞아 0건이었다).
   * ⚠ 말풍선은 JS 가 넣으므로 마크업에 없다. 스팬을 `is-on` 으로 바꾸면 그 JS 의
   *   `.gnb-en` 조회가 빗나가 아무것도 안 붙는다 — 그게 맞는 동작이다. */
  html = html.replace(
    /<span class="([^"]*\bis-on\b[^"]*)">KO<\/span>(\s*<span class="gnb-lang-sep"[^>]*>\|<\/span>\s*)<span class="([^"]*\bgnb-en\b[^"]*)"[^>]*>EN<\/span>/g,
    (_m, koCls, sep, enCls) => {
      langHit += 1;
      const koOut = drop(koCls, 'is-on');
      const enOut = drop(enCls, 'gnb-en');
      /* 404 는 **절대 주소**다(§11.91 — 요청 주소 그대로 그려져 상대 경로가 안 통한다). */
      const koHref = f === '404.html'
        ? new URL(SITE_URL).pathname.replace(/\/+$/, '') + '/404.html'
        : '../' + f;
      return `<a${koOut ? ` class="${koOut}"` : ''} href="${koHref}">KO</a>`
        + sep
        + `<span class="${enOut ? enOut + ' ' : ''}is-on">EN</span>`;
    });

  /* ⚠⚠ 모바일 메뉴의 준비중 꼴(`.mnav-en`) — 데스크톱 `.gnb-en` 과 **꼴이 다르다.**
   *   좁은 화면에는 호버가 없어 말풍선을 못 쓰므로 안내를 `<i>준비중</i>` 으로 품는다.
   *   영문판에서는 그 안내가 사라져야 하니 **`<i>` 째 버리고** `is-on` 스팬으로 바꾼다.
   * ⚠ 메인 `index.html` 은 손글씨라 `EN_READY` 가 닿지 않아 **항상** 이 꼴이다.
   *   서브페이지는 `EN_READY=1` 로 빌드되므로 위 첫 갈래(링크 꼴)가 잡는다. */
  html = html.replace(
    /<span class="([^"]*\bis-on\b[^"]*)">KO<\/span>(\s*<span class="gnb-lang-sep"[^>]*>\|<\/span>\s*)<span class="([^"]*\bmnav-en\b[^"]*)"[^>]*>EN<i>[^<]*<\/i><\/span>/g,
    (_m, koCls, sep, enCls) => {
      langHit += 1;
      const koOut = drop(koCls, 'is-on');
      const enOut = drop(enCls, 'mnav-en');
      const koHref = f === '404.html'
        ? new URL(SITE_URL).pathname.replace(/\/+$/, '') + '/404.html'
        : '../' + f;
      return `<a${koOut ? ` class="${koOut}"` : ''} href="${koHref}">KO</a>`
        + sep
        + `<span class="${enOut ? enOut + ' ' : ''}is-on">EN</span>`;
    });

  /* ⚠ 건수는 **2** 다 — 데스크톱 `.gnb-lang` 한 벌 + 모바일 `.mnav-lang` 한 벌.
   *   0 건이면 국문 마크업이 바뀐 것이다(그때는 반드시 멈춘다). */
  if (langHit < 1) {
    throw new Error(`en/${f}: 언어 토글 치환 0건 — 국문 마크업이 바뀌었다`);
  }

  /* ⚠ 미상승 자산 검사 — 한 건이라도 남으면 그 자산이 404 다(조용히 깨진다).
       404.html 은 절대 주소를 쓰므로 제외한다. */
  if (f !== '404.html') {
    const bad = [...html.matchAll(/(["'])(assets\/[^"']*)/g)].map((m) => m[2]);
    if (bad.length) throw new Error(`en/${f}: 상승하지 않은 자산 ${bad.length}건 — ${bad.slice(0, 3).join(' · ')}`);
  }

  writeFileSync(join(OUT, f), html);
  report.push({ f, hit: hit.length, left: leftover(html) });
}

/* ── 고아 정리 — 한국어 쪽에서 사라진 페이지의 영문판을 남기지 않는다 ── */
for (const f of readdirSync(OUT).filter((x) => x.endsWith('.html'))) {
  if (!pages.includes(f)) { rmSync(join(OUT, f)); console.log(`  ✕ en/${f} (한국어 쪽에 없다 — 삭제)`); }
}

const tot = report.reduce((a, r) => a + r.left.length, 0);
const totKo = pages.reduce((a, f) => a + leftover(readFileSync(join(ROOT, f), 'utf8')).length, 0);
console.log(`\n  사전 ${dict.length}항목 · 메타 ${meta.size}쪽\n`);
for (const r of report.sort((a, b) => b.left.length - a.left.length)) {
  console.log(`  → en/${r.f.padEnd(18)} 적용 ${String(r.hit).padStart(3)} · 남은 한국어 덩이 ${String(r.left.length).padStart(3)}`);
}
console.log(`\n  영문 ${pages.length}쪽 · 보이는 한국어 ${totKo} → ${tot} (${(100 - tot / totKo * 100).toFixed(0)}% 치환)`);
if (missingMeta.length) {
  console.log('\n  ⚠ 메타(제목 · 설명)를 못 찾은 쪽 — `_shell.md` §4 의 「페이지」 칸과 맞는지 볼 것');
  missingMeta.forEach((m) => console.log('     · ' + m));
}

/* 남은 한국어를 파일로 남긴다 — 화면을 보며 고칠 목록이다. */
const lines = [];
for (const r of report) {
  if (!r.left.length) continue;
  lines.push(`\n## ${r.f}  (${r.left.length})`);
  for (const [k, n] of r.left) lines.push(`- (${n}) ${k}`);
}
writeFileSync(join(OUT, '_leftover.md'),
  `# 영문판에 남은 한국어\n\n빌드가 자동으로 만든다. \`en/\` 안에 있으므로 배포 대상이 아니다.\n`
  + `번역본(\`src/sub/i18n/en/*.md\`)에 그 문구를 넣으면 다음 빌드에서 사라진다.\n`
  + lines.join('\n') + '\n');
console.log(`  → en/_leftover.md (${tot}건)`);

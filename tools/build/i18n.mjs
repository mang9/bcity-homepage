/* 영문 페이지 치환기 — src/sub/i18n/en/*.md 의 대조표를 사전으로 쓴다.
 *
 * 왜 「치환」인가: 이 저장소의 카피는 src/sub/pages/*.html · partials · nav.json 에
 * 한국어로 박혀 있고, 번역본은 그 한국어를 키로 하는 대조표(.md)로 따로 만들었다.
 * 소스를 두 벌로 갈라 두면 카피를 고칠 때마다 두 곳을 맞춰야 하므로,
 * **한국어 소스 하나를 정본으로 두고 빌드가 영문으로 바꿔 내보낸다.**
 *
 * ⚠ 사전의 정본은 `.md` 다. CSV 는 파생물이므로 읽지 않는다.
 * ⚠ `.md` 셀의 `**굵게**` 는 두 가지다 —
 *     ① 셀 전체를 감싼 것 = 문서상의 강조(값이라는 표시). 벗겨서 쓴다.
 *     ② 문장 안의 것     = 실제 HTML 태그(<b>/<strong>/<em>). 태그를 잡아 안쪽만 바꾼다.
 *   그래서 치환을 두 번 시도한다(태그 인식 → 실패하면 평문).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* 같은 글자의 이형(印 따옴표 · 하이픈)을 서로 허용한다.
   `.md` 는 인쇄용 ’ 를 쓰고 소스 HTML 은 곧은 ' 를 쓰는 자리가 있다(§11.102). */
const VARIANT = { "'": "['’‘]", '’': "['’‘]", '"': '["“”]', '“': '["“”]', '”': '["“”]' };

/* ⚠⚠ 태그 **앞뒤의 공백**을 반드시 넣는다. 조각 정규식은 `.trim()` 을 거치므로
      경계 공백이 사라지는데, 마크업에는 `B-CITY의 <em>디지털 동력</em>입니다` 처럼
      공백이 있다. 이걸 빠뜨려 굵게를 품은 항목 182개가 거의 전부 실패했다(실측).
      `\s*` 이므로 공백이 없는 자리(`</em>입니다`)도 함께 맞는다. */
/* ⚠ `<span>` 도 포함한다. `.md` 의 `**…**` 는 「여기가 별도 요소」라는 표시이고,
      마크업에서 그 요소가 `<span>` 인 자리가 많다 —
      `<span class="tl-t">통합개발계획 국토교통부 승인 <span class="st st--plan">예정</span></span>`.
      앞뒤 글자가 정확히 맞아야 매칭되므로 넓혀도 오작동하지 않는다(실측으로 확인). */
/* ⚠⚠ **앞뒤 공백을 캡처해서 되돌린다.** 전에는 `\s*` 로 버렸는데, 그러면 매칭이
      먹은 공백이 치환 결과에 없어 **글자가 붙는다** — `2.16 km²</span> <span>/ 3.63`
      의 칸 사이 공백이 사라져 `2.16 km²/ 3.63 km²` 로 렌더됐다(실측).
      `<b>`·`<em>` 자리에도 늘 있던 결함이고, 닫는 태그 뒤에 공백이 오는 마크업에서만 드러난다. */
const BOLD_OPEN = '(\\s*)(<(?:b|strong|em|span)\\b[^>]*>)(\\s*)';
const BOLD_CLOSE = '(\\s*)(</(?:b|strong|em|span)>)(\\s*)';
const BR = '(\\s*)(<br\\s*/?>)(\\s*)';

/* 셀 → 조각 목록. `**`(굵게) · <br> 로 나누고 백틱은 문서 표기라 벗긴다.
   `*(세로 라벨)*` 같은 기울임 주석과 `~~취소선~~` 도 문서 표기이므로 걷는다. */
function pieces(cell) {
  /* ⚠ 마크다운 이스케이프를 푼다. 안 풀면 `\*` 가 화면에 그대로 나간다 —
        메인 각주가 `\* Times may vary …` 로 렌더됐다(실측). */
  const s = cell
    .replace(/\s*\*\([^)]*\)\*/g, '')
    /* ⚠ **한 겹 `*기울임*` 도 벗긴다.** `.md` 는 출처 표기를 기울임으로 적는데
     *   마크업에서 그것은 별도 요소다 — `<span class="tl-t">제목<small>국토부 공고 제2023-1077호</small></span>`.
     *   안 벗기면 키에 `*` 가 남아 `<small>` 안의 덩이와 영원히 안 맞는다
     *   (추진일정의 공고·고시 번호 8건 · 법인 역할 2건이 그 때문에 한국어로 남아 있었다).
     * ⚠ `**굵게**` 는 건드리지 않는다 — 여는 `*` 앞이 `*` 면 lookbehind 가 막는다.
     * ⚠ `\*`(이스케이프)도 막는다 — 각주 표시 `\* Excludes …` 가 기울임으로 오인되면
     *   짝이 되는 다른 `*` 까지 삼킨다. 그래서 **이스케이프 해제보다 먼저** 돌린다. */
    .replace(/(?<![*\w\\])\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/\\([*|])/g, '$1').replace(/`/g, '')
    .replace(/~~(.+?)~~/g, '$1')
    .trim();
  const out = [];
  const re = /\*\*(.+?)\*\*|<br\s*\/?>/g;
  let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) });
    out.push(m[1] !== undefined ? { t: 'bold', v: m[1] } : { t: 'br' });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) });
  return out;
}

/* 셀 전체가 하나의 굵게면 문서상의 강조다 — 벗긴다. */
function unwrap(cell) {
  const p = pieces(cell);
  return p.length === 1 && p[0].t === 'bold' ? [{ t: 'text', v: p[0].v }] : p;
}

const flatten = (ps) => ps.map((p) => (p.t === 'br' ? ' / ' : p.v)).join('')
  .replace(/\s+/g, ' ').trim();

/* 셀 → **줄 목록**. `<br>` 과 텍스트 안의 ` / ` 를 줄 경계로 본다.
 * 왜 필요한가: 메인 제목(`.ov-title` · `.lo-title`)은 줄마다 `<span class="ov-line">` 이
 * 따로 있고, 강조는 **줄 단위 클래스**(`ov-em`)다. 평탄화한 문자열만 갖고는
 * ① 몇 줄인지 ② 어느 줄이 강조인지 알 수 없어 `ov-line` 묶음을 다시 만들 수 없다.
 * ⚠ 국문과 영문의 줄 수·순서가 다를 수 있다 — 실제로 어긋난다.
 *   `국토교통부 주관의 / **민간기업 중심 도시개발 사업**`
 *   → `**Private-sector-led urban development**<br>under the Ministry …`
 *   국문은 강조가 2줄, 영문은 1줄이다. 그래서 **영문 줄 구조를 그대로 쓴다**(국문에 맞추지 않는다).
 * ⚠ 영문이 1줄이면 한 줄로 내보내 자연 줄바꿈에 맡긴다 — 영문은 국문보다 1.8배 넓어(§11.99)
 *   국문 줄 수를 강제하면 줄마다 두 번 접혀 네 줄이 된다.
 */
function lines(ps) {
  const out = [[]];
  const push = (p) => out[out.length - 1].push(p);
  for (const p of ps) {
    if (p.t === 'br') { out.push([]); continue; }
    if (p.t === 'text' && p.v.includes(' / ')) {
      p.v.split(' / ').forEach((s, i) => { if (i) out.push([]); if (s.trim()) push({ t: 'text', v: s }); });
      continue;
    }
    push(p);
  }
  return out.map((g) => ({
    text: flatten(g),
    /* 줄 전체가 굵게면 줄 단위 강조(`ov-em`)다. 줄 안의 일부만 굵으면 그 조각만 감싼다. */
    em: g.length > 0 && g.every((x) => x.t === 'bold'),
    html: g.map((x) => (x.t === 'bold' && !(g.length === 1) ? `<span class="ov-em">${x.v}</span>` : x.v))
      .join('').replace(/\s+/g, ' ').trim(),
  })).filter((l) => l.text);
}

/* 평문 조각 → 정규식. 공백은 유연하게, 따옴표류는 이형을 허용한다. */
const textRe = (v) => v.trim().split(/\s+/).map((w) =>
  [...w].map((ch) => VARIANT[ch] || reEsc(ch)).join('')).join('\\s+');

function compile(ko, en) {
  const kp = unwrap(ko), ep = unwrap(en);
  const kb = kp.filter((p) => p.t === 'bold').length;
  const kr = kp.filter((p) => p.t === 'br').length;

  const rules = [];

  /* ① 태그 인식 — 굵게·<br> 를 품은 덩이. 국문 태그를 그대로 되쓴다($1 …).
        그래야 `<em class="…">` 같은 스타일이 살아남는다.
        ⚠⚠ **조각 수가 달라도 되쓴다**(2026-09-21). 전에는 `kb===eb && kr===er` 일 때만
          되쓰고 아니면 `<b>`·`<br />` 로 단순화했는데, 번역이 국문 줄을 합치거나
          강조를 옮기는 자리가 많아 **영문만 강조를 잃었다** — `.h2 em` 은 프라이머리
          색이라 국문은 파랗고 영문은 본문색이 됐다(서브페이지 3곳 실측).
        ⚠ 그래서 캡처를 **종류별 큐**로 가른다. 순서대로 소비하면 안 된다 —
          국문 `[br, br, bold]` 의 캡처는 3+3+6 순인데 영문이 `[br, bold]` 면
          bold 가 **두 번째 br 의 캡처**를 먹어 태그가 뒤섞인다.
        ⚠ 영문 조각이 국문보다 많으면 **마지막 태그를 다시 쓴다**(`Math.min`).
          한 문장 안에서 강조 하나는 `<em>`, 하나는 `<b>` 가 되는 것보다 낫다.
        ⚠ 국문에 그 종류가 **아예 없으면** 그때만 `<b>`·`<br />` 로 만든다. */
  if (kb || kr) {
    let re = '', nGroups = 0;
    for (const p of kp) {
      if (p.t === 'text') re += textRe(p.v);
      else if (p.t === 'bold') { re += BOLD_OPEN + textRe(p.v) + BOLD_CLOSE; nGroups += 6; }
      else { re += BR; nGroups += 3; }
    }
    /* ⚠ 치환 문자열(`$1`) 대신 **함수로 조립한다.** 공백까지 캡처하게 되면서 그룹이
     *   굵게 하나에 6개가 되어 `$12` 같은 두 자리 참조가 생기는데, 바로 뒤에 오는 영문이
     *   숫자로 시작하면(`2.16 km²`) `$1`+`2` 인지 `$12` 인지 JS 가 갈라 볼 수 없다.
     *   함수는 그 해석을 아예 거치지 않는다. */
    const build = (inner) => {
      /* 국문 캡처를 **종류별로** 모은다 — 굵게 하나가 6그룹, `<br>` 하나가 3그룹이고
         순서는 `kp` 그대로다. 영문 조각 수와 무관하게 짝이 맞는다. */
      const bolds = [], brs = [];
      let gi = 0;
      for (const p of kp) {
        if (p.t === 'text') continue;
        if (p.t === 'bold') { bolds.push(inner.slice(gi, gi + 6).map((x) => x || '')); gi += 6; }
        else { brs.push(inner.slice(gi, gi + 3).map((x) => x || '')); gi += 3; }
      }
      let bi = 0, ri = 0;
      const nextBold = () => (bolds.length ? bolds[Math.min(bi++, bolds.length - 1)] : null);
      const nextBr = () => (brs.length ? brs[Math.min(ri++, brs.length - 1)] : null);
      let s2 = '';
      /* ⚠ 태그와 맞닿는 공백은 **캡처한 그룹이 공급한다** — 영문 조각까지 공백을 들고
         있으면 두 칸이 된다(`District land  <span>`). 국문 쪽 `textRe` 도 조각을 trim 하므로
         양쪽이 대칭이다. `!same` 은 캡처를 쓰지 않으니 원문 그대로 둔다.
         ⚠⚠ 다만 **국문이 붙여 쓰는 자리에서 캡처가 빈다.** 정주환경 리드가 그 경우다 —
           `<span class="nowrap">B-CITY</span>는 …` 는 공백이 없는데 영문은 낱말이 떨어져야
           한다(`</span> offers`). 붙여 쓰면 `</span>offers` 가 된다(2026-09-18 실제 결함).
           그래서 «캡처가 비었고 영문 `.md` 쪽에 공백이 있었으면 한 칸을 넣는다».
           캡처가 있으면 그대로 쓰므로 기존 자리는 한 글자도 바뀌지 않는다. */
      const pad = (cap, had) => cap || (had ? ' ' : '');
      for (let i = 0; i < ep.length; i++) {
        const p = ep[i];
        /* ⚠ 항상 trim 한다 — 태그와 맞닿는 공백은 위 `pad` 가 공급한다.
              전에는 `!same` 경로만 원문 공백을 그대로 썼는데 그 경로가 없어졌다. */
        if (p.t === 'text') { s2 += p.v.trim(); continue; }
        const prev = ep[i - 1], next = ep[i + 1];
        const hadL = !!(prev && prev.t === 'text' && /\s$/.test(prev.v));
        const hadR = !!(next && next.t === 'text' && /^\s/.test(next.v));
        if (p.t === 'bold') {
          const t = nextBold();             // [앞공백, 여는태그, 뒤공백, 앞공백, 닫는태그, 뒤공백]
          if (!t) { s2 += pad('', hadL) + `<b>${p.v}</b>` + pad('', hadR); continue; }
          s2 += pad(t[0], hadL) + t[1] + t[2] + p.v + t[3] + t[4] + pad(t[5], hadR);
        } else {
          const t = nextBr();               // [앞공백, <br>, 뒤공백]
          if (!t) { s2 += pad('', hadL) + '<br />' + pad('', hadR); continue; }
          s2 += pad(t[0], hadL) + t[1] + pad(t[2], hadR);
        }
      }
      return s2;
    };
    if (nGroups) rules.push({ re: new RegExp(re, 'g'), build, nGroups, kind: 'tag' });
  }

  /* ② 평문 — 굵게가 문서상의 강조였거나 개수가 어긋날 때. */
  const kf = flatten(kp), ef = flatten(ep);
  if (kf) rules.push({ re: new RegExp(textRe(kf), 'g'), rep: ef.replace(/\$/g, '$$$$'), kind: 'plain' });

  return { ko: kf, en: ef, rules, enLines: lines(ep) };
}

export function loadDict(root) {
  const dir = join(root, 'src', 'sub', 'i18n', 'en');
  const seen = new Map();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    let ki = null, ei = null;
    for (const ln of readFileSync(join(dir, f), 'utf8').split('\n')) {
      if (!ln.trimStart().startsWith('|')) { ki = ei = null; continue; }
      /* ⚠ **이스케이프된 `\|` 에서 쪼개지 않는다.** 지도 라벨은 `|` 가 줄바꿈 뜻이라
            셀에 `감일JCT\|(예정)` 처럼 들어 있는데, 그냥 split('|') 하면 칸이 하나 늘어
            그 행이 통째로 어긋난다(실측 — 지도 라벨 3개가 안 바뀌었다). */
      const c = ln.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((x) => x.trim());
      if ([...c.join('')].every((ch) => '-: '.includes(ch))) continue;
      if (c.includes('한국어') && (c.includes('English') || c.includes('영어'))) {
        ki = c.indexOf('한국어');
        ei = c.includes('English') ? c.indexOf('English') : c.indexOf('영어');
        continue;
      }
      if (ki === null || Math.max(ki, ei) >= c.length) continue;
      const ko = c[ki], en = c[ei];
      if (!ko || !en || ko === en) continue;
      if (!/[가-힣]/.test(ko)) continue;              // 라벨·코드 행은 건너뛴다
      const add = (a, b) => {
        const x = compile(a, b);
        if (x.ko && x.en && x.ko !== x.en && /[가-힣]/.test(x.ko) && !seen.has(x.ko)) {
          seen.set(x.ko, { ...x, src: f });
        }
      };
      add(ko, en);
      /* `<br>` 로 줄이 나뉜 셀은 **줄 단위로도** 넣는다 — 마크업에서 그 줄들이
         서로 다른 요소에 흩어져 있는 자리가 있어 덩이 전체로는 안 맞는다.
         ⚠ 줄 수가 같을 때만. 다르면 어느 줄이 어느 줄인지 알 수 없다. */
      /* 필수 표시 `*` 는 마크업에서 **다른 요소**에 있다 — `<label>이메일<i>*</i></label>`.
         그래서 `이메일 *` 로만 넣어 두면 라벨 텍스트 덩이(`이메일`)와 안 맞는다(실측 18쪽×5개). */
      const bare = (x) => x.replace(/\s*\\?\*\s*$/, '');
      if (bare(ko) !== ko) add(bare(ko), bare(en));
      /* 꼬리 화살표도 **다른 요소**에 있다 — `<a>도시 살펴보기 <span aria-hidden="true">→</span></a>`.
         그래서 `도시 살펴보기 →` 로만 넣어 두면 텍스트 덩이(`도시 살펴보기`)와 안 맞는다.
         메인에서만 5곳(도시 살펴보기 · 바로가기 ×3 · 공지사항 · B-CITY 발행물)이 이 때문에 안 바뀌었다. */
      const noArrow = (x) => x.replace(/\s*(?:→|➔|›|»|&rarr;)\s*$/, '');
      if (noArrow(ko) !== ko) add(noArrow(ko), noArrow(en));
      /* 번호 접두어를 뗀 형태도 넣는다 — 사전은 `01 AI 데이터 클러스터` 인데
         조합 문구의 슬롯에는 `AI 데이터 클러스터` 만 들어온다(`… 구역별 면적`). */
      const nonum = (x) => x.replace(/^\s*(?:`\d{1,2}`|\d{1,2})[.)]?\s+/, '');
      if (nonum(ko) !== ko && nonum(en) !== en) add(nonum(ko), nonum(en));
      /* 분기 접두어는 마크업에서 **다른 요소**다 —
         `<span class="tl-d">1Q</span><span class="tl-t">사업비 조달 (PF)</span>`.
         국문은 `1Q …`, 영문은 `Q1 — …` 로 꼴이 달라 `nonum` 으로는 잡히지 않는다. */
      const kq = ko.match(/^\s*(?:[1-4]Q|[1-2]H)\s+(.+)$/);
      const eq = en.match(/^\s*Q[1-4]\s*[\u2014\u2013-]\s*(.+)$/);
      if (kq && eq) add(kq[1], eq[1]);
      /* ⚠⚠ `**라벨** 값1 / 값2` 꼴은 마크업에서 **요소가 셋**이다 —
       *   `<li><b>부지 면적</b><strong>약 6.2만평</strong><span>207,486㎡ (62,765평)</span></li>`
       *   (구역소개 `.dz-ov` 32곳). 치환 단위가 «요소 하나의 내용»이므로 덩이 전체로는
       *   절대 맞지 않는다 — 실제로 `부지 면적`(8곳) · `준공업지역`(3곳) 같은 칸이
       *   전부 한국어로 남아 있었다. **라벨과 값을 칸마다 따로** 넣는다.
       * ⚠ 칸 수가 같을 때만. 다르면 어느 칸이 어느 칸인지 알 수 없다 —
       *   어긋난 행은 `.md` 쪽을 고쳐야 한다(영문 셀에서 칸이 빠진 자리가 실제로 있었다). */
      const sl = (x) => {
        const p = unwrap(x);
        if (!p.length || p[0].t !== 'bold') return null;
        return { label: p[0].v.trim(),
          rest: flatten(p.slice(1)).split(' / ').map((s) => s.trim()).filter(Boolean) };
      };
      const ka = sl(ko), ea = sl(en);
      if (ka && ea && ka.rest.length === ea.rest.length) {
        add(ka.label, ea.label);
        for (let i = 0; i < ka.rest.length; i++) add(ka.rest[i], ea.rest[i]);
      }
      for (const sep of [/<br\s*\/?>/, / \/ /, / : /]) {
        const ks = ko.split(sep), es = en.split(sep);
        if (ks.length > 1 && ks.length === es.length) {
          for (let i = 0; i < ks.length; i++) add(ks[i], es[i]);
        }
      }
    }
  }
  /* 긴 것부터 — 짧은 키가 긴 문장의 일부를 먼저 갈아먹는 것을 막는다. */
  return [...seen.values()].sort((a, b) => b.ko.length - a.ko.length);
}

/* ⚠⚠ 치환 단위는 **태그 경계로 끊긴 한 덩이**다 — 자유 문자열 치환을 쓰지 않는다.
 *
 * 처음에 「긴 키부터 문서 전체에 치환」으로 만들었더니 사전에 없는 문장 안에서
 * 짧은 키가 먹혀 **한글·영문 혼합**이 나왔다(실측) —
 *   `춘천시와 홍천군이 표시된 강원도` → `Chuncheon City와 홍천군이 표시된 강원도`
 *   `총 사업비 약 1.1조원, 총 면적 …`   → `총 Project cost approx. KRW 1.1 trillion, 총 …`
 * **번역이 덜 된 것보다 이게 나쁘다.** 그래서 갈래를 나누고 각각 경계를 못 박는다.
 *   ①  번역 대상 속성값 전체
 *   ②  `.ov-line` 묶음 전체 (줄마다 래퍼가 있는 제목 — 묶음이 곧 한 덩이다)
 *   ③  굵게·<br> 를 품은 덩이(앞이 `>` · 뒤가 `<` 여야 한다)
 *   ③′ `<br>` 만 품은 덩이 (국문용 강제 개행이 문장 가운데 있는 자리)
 *   ④  태그 사이 텍스트 덩이 전체
 *   ⑤  <script> 안의 **문자열 리터럴 전체** (사용자에게 보이는 문구가 JS 에 있다)
 * <style> · 주석 · <script> 는 먼저 빼내 두고 ①~④ 가 건드리지 못하게 한다.
 *
 * ⚠⚠ **순서가 규칙이다 — 넓은 덩이부터.** ②·③·③′ 는 여러 요소에 걸친 한 덩이를 다루고
 *   ④ 는 요소 하나의 내용을 다룬다. ④ 를 먼저 돌리면 넓은 덩이의 앞조각만 번역돼
 *   뒤조각이 한국어로 남고(`<b>40분</b>`), 넓은 규칙은 키가 사라져 영원히 안 맞는다.
 */
const ATTR = /(\s(?:alt|title|aria-label|placeholder|content)=")([^"]*)(")/g;
const TEXT = />([^<>]+)(?=<)/g;
const LIT = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;

/* ⚠⚠ HTML 엔티티를 먼저 푼다. 안 하면 조회가 조용히 빗나간다 — 실측으로
      `R&amp;D` · `Low &amp; Wide` · `&lsquo;개인정보 보호법&rsquo;` 이 전부 안 맞았다.
      ⚠ **목록은 낡는다 — 마크업에 새 엔티티가 들어오면 그 행이 조용히 번역되지 않는다.**
      2026-09-18 에 `&frac12;` 로 실제 사고가 났다(투자·입주 「토지소유자 총수의 ½ 이상 동의」).
      전수 확인:  grep -rho '&[a-zA-Z][a-zA-Z0-9]*;' *.html src/sub/pages/*.html | sort -u
      현재 마크업 전수 — rsquo 142 · lsquo 142 · amp 77 · copy 34 · quot 6 · frac12 2. */
const ENT = { amp: '&', lsquo: '\u2018', rsquo: '\u2019', quot: '"', copy: '\u00a9',
  lt: '<', gt: '>', nbsp: ' ', middot: '\u00b7', ldquo: '\u201c', rdquo: '\u201d',
  frac12: '\u00bd', frac13: '\u2153', frac14: '\u00bc', frac34: '\u00be',
  deg: '\u00b0', sup2: '\u00b2', sup3: '\u00b3', times: '\u00d7', ndash: '\u2013',
  mdash: '\u2014', hellip: '\u2026', rarr: '\u2192', bull: '\u2022' };
const decode = (s) => s
  // ⚠ 이름에 **숫자가 들어가는 엔티티**가 있다(`frac12` · `sup2`). `[a-zA-Z]+` 로 두면
  //   그 이름이 아예 매칭되지 않아 조용히 번역이 빠진다(2026-09-18 실제 사고).
  .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => (n in ENT ? ENT[n] : m))
  .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d));

const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();

/* [정규식, 영문 만들기, 슬롯이 안 풀려도 쓸까] — 새 조합 문구가 생기면 여기 한 줄을 더한다. */
const TEMPLATES = [
  [/^토지이용계획도에서 (.+?)이\(가\) 차지하는 위치$/, (x) => `Where ${x} sits in the land use plan`, false],
  [/^(.+?) 구역별 면적$/,      (x) => `Area by block — ${x}`,            false],
  [/^(.+?) 하위 메뉴$/,        (x) => `${x} submenu`,                    false],
  [/^(.+?) 새 창으로 열기$/,   (x) => `Open ${x} in a new window`,       true],
  [/^(.+?) 새 창으로 보기$/,   (x) => `View ${x} in a new window`,       true],
  [/^(.+?) 확대해서 보기$/,    (x) => `View ${x} enlarged`,              true],
  [/^(.+?) 재생$/,             (x) => `Play ${x}`,                       true],
  [/^(.+?) 내려받기$/,         (x) => `Download ${x}`,                   true],
  [/^(.+?(?:클러스터|콤플렉스)) 소개$/, (x) => `${x} overview`,          false],
  [/^(.+?) 로고$/,             (x) => `${x} logo`,                       false],
  /* 빌더가 라벨을 날짜에 붙여 한 덩이로 만든다 — `<time …>보도일자 2026.07.02</time>`.
     ⚠ 날짜 형식은 그대로 둔다. `2026.07.02` 는 Y.M.D 로 읽히고 `datetime` 속성이
       이미 ISO 라 기계 판독에도 문제가 없다. 영어식(`2 July 2026`)으로 바꾸려면
       12개 상세 · 목록 · 사이트맵을 함께 봐야 하므로 별건이다. */
  [/^보도일자\s*(.+)$/,        (x) => `Published ${x}`,                  true],
];

/* ── `.ov-line` 묶음 찾기 ─────────────────────────────────────────────
 * 메인 제목은 줄마다 래퍼가 하나씩이다(index.html 에만 10곳):
 *   <span class="ov-line"><span>글로벌 비즈니스의</span></span>
 *   <span class="ov-line"><span class="ov-em">새로운 거점, B-CITY</span></span>
 * 사전 키는 두 줄을 ` / ` 로 이은 한 덩이이므로 **묶음 전체**를 치환 단위로 삼아야 한다.
 * ⚠ 정규식으로 잘라내지 않는다 — 안쪽에 `<span>` 이 또 있어 비탐욕 매칭이 첫 `</span>` 에서
 *   끊긴다(§11.37 에서 같은 실수로 패널 6개가 열린 채 남았다). **깊이를 세서** 짝을 찾는다.
 */
const OVL = '<span class="ov-line">';
function ovLineGroups(html) {
  const groups = [];
  let i = 0;
  while ((i = html.indexOf(OVL, i)) !== -1) {
    const items = [];
    let p = i, tail = i;
    while (html.startsWith(OVL, p)) {
      const re = /<span\b|<\/span>/g;
      re.lastIndex = p;
      let d = 0, m, end = -1;
      while ((m = re.exec(html))) {
        d += m[0] === '</span>' ? -1 : 1;
        if (d === 0) { end = m.index + m[0].length; break; }
      }
      if (end === -1) break;
      items.push(html.slice(p, end));
      tail = end;
      p = end + html.slice(end).match(/^\s*/)[0].length;   // 형제 사이는 공백만 허용
    }
    if (!items.length) { i += OVL.length; continue; }
    groups.push({ start: i, end: tail, items });
    i = tail;
  }
  return groups;
}

const tight = (s) => s.replace(/\s+/g, '');
/* 공백 · 따옴표 · 붙임표 · 쉼표까지 걷은 형태. `.md` 와 마크업이 이 글자들에서 자주 어긋난다 —
   `'개인정보 보호법'`(곧은 따옴표) ↔ `‘개인정보 보호법’` · `자양로 58, 태림빌딩` ↔ `자양로58 태림빌딩`. */
const loose = (s) => s.replace(/[\s,'\u2019\u2018"\u201c\u201d\-\u2013\u2014]/g, '');

export function translate(html, dict) {
  const byFlat = new Map(), byTight = new Map(), byLoose = new Map();
  for (const e of dict) {
    if (!byFlat.has(e.ko)) byFlat.set(e.ko, e);
    if (!byTight.has(tight(e.ko))) byTight.set(tight(e.ko), e);
    if (!byLoose.has(loose(e.ko))) byLoose.set(loose(e.ko), e);
  }
  const hit = new Set();
  const take = (e) => { hit.add(e.ko); return e.en; };

  /* 조회는 세 겹이다 — 하나만 두면 다음 세 가지에서 조용히 빗나간다(전부 실측).
       · `투자 · 입주`(.md) vs `투자·입주`(마크업)   → 공백 제거 색인
       · `자양로 58`(.md)  vs `자양로58`(마크업)     → 같은 색인
       · `<h2>02 도시소개</h2>` — 번호가 붙은 덩이  → 접두어를 떼고 조회한 뒤 되붙인다 */
  const look = (raw) => {
    const v = norm(raw);
    let e = byFlat.get(v) || byTight.get(tight(v)) || byLoose.get(loose(v));
    if (e) return { e, pre: '' };
    const m = v.match(/^(\d{1,2}[.)]?\s+)(.+)$/);
    if (m) {
      e = byFlat.get(m[2]) || byTight.get(tight(m[2])) || byLoose.get(loose(m[2]));
      if (e) return { e, pre: m[1] };
    }
    /* 복합 — `PR CENTER · 홍보센터` 처럼 구분자로 이어 붙인 덩이.
       ⚠ **모든 조각이 풀릴 때만** 바꾼다. 하나라도 못 풀면 손대지 않는다 —
         그게 한글·영문 혼합을 만드는 자리다. */
    for (const sep of [' \u00b7 ', ' / ']) {
      if (!v.includes(sep)) continue;
      const parts = v.split(sep);
      const outs = parts.map((x) => {
        if (!/[\uac00-\ud7a3]/.test(x)) return x;                 // 이미 영문·코드
        const h = byFlat.get(x) || byTight.get(tight(x)) || byLoose.get(loose(x));
        return h ? h.en : null;
      });
      if (outs.every((x) => x !== null)) {
        return { e: { ko: v, en: outs.join(sep) }, pre: '' };
      }
    }

    /* 템플릿 — 빌더·페이지가 조합해 만든 문구(주로 alt · aria-label).
       ⚠ 슬롯이 풀리지 않으면 손대지 않는다. 다만 게시물 제목처럼 **국문 유지가 확정**된
         값이 슬롯에 오는 자리(재생 · 새 창으로 열기)는 그대로 두고 동사만 영문으로 둔다 —
         그건 혼합이 아니라 «영문 UI + 국문 콘텐츠» 로 의도된 상태다(G02). */
    for (const [pat, make, keepKo] of TEMPLATES) {
      const t = v.match(pat);
      if (!t) continue;
      const inner = t[1];
      const h = byFlat.get(inner) || byTight.get(tight(inner)) || byLoose.get(loose(inner));
      if (!h && !keepKo) continue;
      return { e: { ko: v, en: make(h ? h.en : inner) }, pre: '' };
    }
    return null;
  };

  /* <script> · <style> · 주석을 빼낸다 */
  const stash = [];
  let out = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi,
    (m) => '@@I18N-STASH:' + (stash.push(m) - 1) + '@@');

  // ① 속성값
  out = out.replace(ATTR, (m, a, v, z) => {
    const r = look(v);
    return r ? a + r.pre + take(r.e) + z : m;
  });

  /* ② `.ov-line` 묶음 — 줄마다 래퍼가 있는 제목. **텍스트 덩이 패스보다 먼저** 돌린다.
       뒤에 두면 각 줄이 따로 번역되거나(있으면) 그대로 남고, 묶음 키가 영원히 안 맞는다. */
  for (const g of ovLineGroups(out).reverse()) {       // 뒤에서부터 — 앞 인덱스가 살아 있다
    const texts = g.items.map((s) => norm(s.replace(/<[^>]*>/g, ' ')));
    if (!texts.some((t) => /[가-힣]/.test(t))) continue;
    const r = look(texts.join(' / '));
    if (!r) continue;
    const ls = (r.e.enLines && r.e.enLines.length ? r.e.enLines
      : [{ html: r.e.en, em: false }]);
    const rep = ls.map((l) => `${OVL}<span${l.em ? ' class="ov-em"' : ''}>${l.html || l.text}</span></span>`)
      .join('\n              ');
    out = out.slice(0, g.start) + r.pre + rep + out.slice(g.end);
    take(r.e);
  }

  // ③ 굵게·<br> 를 품은 덩이 — 앞뒤를 태그 경계로 고정한다
  /* ⚠⚠ **텍스트 덩이 패스(④)보다 먼저** 돌려야 한다. 뒤에 두면 앞쪽 조각이 ④에서
        먼저 번역돼 이 규칙의 한국어가 사라지고 굵게 안쪽만 한국어로 남는다 —
        `<span class="lo-pill">잠실 · 서울양양고속도로 <b>40분</b></span>` 에서
        앞부분은 「복합」 조회로 풀리고 `40분` 이 그대로 남았다(실측 2곳). */
  for (const e of dict) {
    if (hit.has(e.ko)) continue;
    const r = e.rules.find((x) => x.kind === 'tag');
    if (!r) continue;
    /* ⚠ 앵커의 `\s*` 도 캡처한다 — 안 그러면 덩이 앞뒤 공백이 사라진다(위 상수 주석과 같은 이유). */
    const anchored = new RegExp('(?<=>)(\\s*)' + r.re.source + '(\\s*)(?=<)', 'g');
    if (!anchored.test(out)) continue;
    anchored.lastIndex = 0;
    out = out.replace(anchored, (...a) => {
      const g = a.slice(1, 3 + r.nGroups);          // [앞공백, …내부…, 뒤공백]
      return (g[0] || '') + r.build(g.slice(1, -1)) + (g[g.length - 1] || '');
    });
    hit.add(e.ko);
  }

  /* ③′ `<br>` 만 품은 텍스트 덩이 — 국문용 강제 개행이 문장 가운데 있는 자리.
   *   `총 사업비 …의<br class="hidden md:inline" />부지 위에 …` 처럼 한 문장이 둘로 갈려
   *   어느 조각도 사전과 맞지 않는다. 이어 붙여 조회하고 **영문의 줄 구조로** 다시 만든다.
   * ⚠ 영문이 한 줄이면 `<br>` 을 **버린다** — 그 개행은 국문 글자폭에 맞춰 잡은 것이라
   *   영문에서는 엉뚱한 자리에서 끊긴다(사용자 지적). 영문 줄바꿈은 자연 줄바꿈에 맡긴다. */
  out = out.replace(/(?<=>)([^<>]*(?:<br\b[^>]*>[^<>]*)+)(?=<)/g, (m, body) => {
    if (!/[가-힣]/.test(body)) return m;
    /* ⚠⚠ **조각이 각자 사전에 있으면 합치지 않는다.** 이 패스는 「어느 조각도 사전과
         맞지 않는다」를 위한 것이고, 합치면 아래에서 `<br>` 을 버린다. 그래서 의미 있는
         줄바꿈까지 사라졌다 — 문의 카드의 `상호<br />주소` 가 한 줄로 붙었다(34쪽 · 실측).
       조각이 각자 풀리면 그냥 넘겨서 텍스트 덩이 패스(④)가 제자리에서 바꾸게 한다. */
    const segs = body.split(/<br\b[^>]*>/);
    if (segs.filter((x) => /[가-힣]/.test(x)).every((x) => !!look(x))) return m;
    const flat = body.replace(/<br\b[^>]*>/g, ' ');
    const r = look(flat) || look(body.replace(/<br\b[^>]*>/g, ' / '));
    if (!r) return m;
    const ls = r.e.enLines;
    take(r.e);
    return r.pre + (ls && ls.length > 1 ? ls.map((l) => l.html || l.text).join('<br />') : r.e.en);
  });

  // ④ 태그 사이 텍스트 덩이
  out = out.replace(TEXT, (m, t) => {
    const r = look(t);
    if (!r) return m;
    const lead = t.match(/^\s*/)[0], tail = t.match(/\s*$/)[0];
    return '>' + lead + r.pre + take(r.e) + tail;
  });

  // 되돌린 뒤 ⑤ <script> 안의 문자열 리터럴
  out = out.replace(/@@I18N-STASH:(\d+)@@/g, (_, i) => {
    const block = stash[+i];
    if (!/^<script/i.test(block)) return block;
    return block.replace(LIT, (m, q, body) => {
      if (!/[가-힣]/.test(body)) return m;
      const r = look(body.replace(/\\n/g, ' '));
      return r && !r.e.en.includes(q) ? q + r.pre + take(r.e) + q : m;
    });
  });

  return { out, hit: [...hit], miss: dict.filter((e) => !hit.has(e.ko)) };
}

/* 남은 한국어 — **화면에 보이는 글자만** 센다.
 * ⚠ 이 범위를 좁히는 것이 중요하다. 처음에는 문서 전체에서 한글을 세서 「남은 덩이 264」
 *   같은 값이 나왔는데, 그 대부분이 **번역 대상이 아닌 것**이었다 —
 *     · 개인정보처리방침 본문  → 한국어본 유지가 확정이다(G01 · `GLOSSARY.md` §11)
 *     · <script>/<style> 안의 개발 주석 → 화면에 나오지 않는다
 *   그대로 두면 「거의 안 됐다」로 잘못 읽힌다.
 */
const VISIBLE_ATTR = /\s(?:alt|title|aria-label|placeholder|content)="([^"]*)"/g;

export function strippedForCoverage(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    /* 개인정보처리방침 모달 — 한국어본 유지가 확정이다(G01).
       ⚠ 비탐욕(`*?`)으로 쓰면 **첫 `</div>`** 에서 끊겨 본문이 그대로 남는다(실측).
          위에서 <script>·<style> 을 이미 걷었으므로 뒤에 <div> 가 없다 — 탐욕이 안전하다. */
    .replace(/<div[^>]*id="privacy"[\s\S]*<\/div>/i, ' ');
}

/* ⚠ **치환과 같은 단위로 센다** — 텍스트 덩이 전체 · 속성값 전체.
   처음에는 한글 정규식(`[가-힣][가-힣0-9…]*`)으로 잡았는데 **라틴 글자에서 끊겨**
   `B-CITY 가까이에는 …` 이 `가까이에는 …` 으로 보고됐다. 그러면 사전 대조가 전부 빗나가
   멀쩡한 항목까지 「사전에 없다」로 분류된다(실측으로 이 착오를 겪었다). */
export function leftover(html) {
  const body = strippedForCoverage(html);
  const runs = [];
  let m;
  const T = />([^<>]+)(?=<)/g;
  while ((m = T.exec(body))) if (/[가-힣]/.test(m[1])) runs.push(m[1]);
  VISIBLE_ATTR.lastIndex = 0;
  while ((m = VISIBLE_ATTR.exec(body))) if (/[가-힣]/.test(m[1])) runs.push(m[1]);
  const count = new Map();
  for (const r of runs) {
    const k = norm(r);
    if (k.length < 2) continue;
    count.set(k, (count.get(k) || 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[0].length - a[0].length);
}

/* ── 페이지 메타 (`<title>` · `meta description`) ──────────────────────
 * ⚠ 이건 **치환으로 안 된다.** `_shell.md` §4 의 표는 「페이지 이름 → 영문 제목 · 설명」
 *   이고 한국어 원문을 담고 있지 않다(키가 `사업개요` 이고 실제 제목은
 *   `사업개요 · B-CITY 춘천기업혁신파크` 다). 그래서 slug 가 아니라
 *   **한국어 제목의 접두어**로 찾는다 — 표의 키와 같은 단위다.
 * ⚠ 접미사는 `_shell.md` §4 가 45자로 못 박은 하나뿐이다. 여기서만 정한다.
 */
export const TITLE_SUFFIX_KO = ' · B-CITY 춘천기업혁신파크';
export const TITLE_SUFFIX_EN = ' · B-CITY Chuncheon Enterprise Innovation Park';

export function loadMeta(root) {
  const src = readFileSync(join(root, 'src', 'sub', 'i18n', 'en', '_shell.md'), 'utf8');
  const out = new Map();
  let on = false;
  for (const ln of src.split('\n')) {
    if (!ln.trimStart().startsWith('|')) { on = false; continue; }
    const c = ln.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((x) => x.trim());
    if (c.includes('페이지') && c.some((x) => /English title/i.test(x))) { on = true; continue; }
    if (!on || c.length < 3) continue;
    if ([...c.join('')].every((ch) => '-: '.includes(ch))) continue;
    const prefix = c[1].replace(/\s*·\s*B-CITY.*$/, '').trim();
    const desc = c[2].replace(/\s*\(\d+\)\s*$/, '').replace(/^\*\*|\*\*$/g, '').trim();
    if (prefix && desc) out.set(loose(c[0]), { prefix, desc });
  }
  return out;
}

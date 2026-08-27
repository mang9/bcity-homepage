#!/usr/bin/env node
/**
 * 서브페이지 빌더 — 공통 셸(CSS · GNB · 히어로 · LNB · 푸터 · JS)을 한 벌만 두고
 * 루트의 서브페이지 HTML 을 생성한다.
 *
 *   node tools/build/pages.mjs            # 전체 빌드
 *   node tools/build/pages.mjs --check    # 생성물이 소스와 일치하는지만 확인 (쓰지 않음)
 *
 * 설계 제약 (CLAUDE.md §11.3 · §7.0)
 *   - 의존성 0. Node 내장 모듈만 쓴다. 번들러(Vite·Webpack)·프레임워크 도입 금지
 *   - 산출물은 저장소 루트의 평문 HTML → GitHub Pages 정적 배포 그대로
 *   - CSS 는 각 페이지에 **인라인**한다. 외부 파일로 빼면 요청이 하나 늘고
 *     캐스케이드 순서가 <link> 위치에 묶이는데, 서브페이지는 레이어를 쓰지 않는 것이
 *     §7.0 의 전제다. 인라인이면 순서가 이 파일 하나로 결정된다
 *   - IA(GNB·LNB·모바일 메뉴·브레드크럼)는 src/sub/nav.json 한 곳에서 나온다
 *
 * 템플릿 문법 (의도적으로 최소)
 *   {{key}}        치환. 값이 없으면 빌드를 실패시킨다(조용한 빈칸 방지)
 *   {{> partial}}  src/sub/partials/<partial>.html|svg 삽입 (1단 중첩까지)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SUB = join(ROOT, 'src', 'sub');
/** 메인(`index.html`)과 **함께 쓰는** 소스. 서브 전용 파일과 섞지 않으려고 폴더를 나눴다.
 *  CSS · JS · 파티셜 이름을 여기서 먼저 찾고, 없으면 `src/sub/` 로 떨어진다. */
const SHARED = join(ROOT, 'src', 'shared');
const CHECK = process.argv.includes('--check');

const read = (...p) => readFileSync(join(...p), 'utf8');

/** 공통 CSS — 이 순서가 곧 캐스케이드 순서다. 페이지 CSS 는 항상 뒤에 붙는다.
 *  overview.html 원본과 같은 순서를 유지하고 있다(리팩터 제로디프의 근거). */
const CSS_COMMON = ['00-tokens', '10-base', '20-gnb', 'gnb-en', '30-hero-lnb', '40-section', '80-footer', '90-motion'];

const nav = JSON.parse(read(SUB, 'nav.json'));
const layout = read(SUB, 'layout.html');

/** 공용(`src/shared/`) 을 먼저 보고 없으면 서브 전용에서 찾는다.
 *  ⚠ 같은 이름을 양쪽에 두지 않는다 — 공용이 조용히 이기므로 어느 쪽이 쓰였는지 알 수 없다.
 *    `assertNoShadow()` 가 빌드 때마다 검사한다. */
const pick = (kind, name, exts) => {
  for (const base of [SHARED, kind === 'partial' ? join(SUB, 'partials') : join(SUB, kind)])
    for (const ext of exts) {
      const f = join(base, name + ext);
      if (existsSync(f)) return f;
    }
  return null;
};

const partial = (name) => {
  const f = pick('partial', name, ['.html', '.svg']);
  if (!f) throw new Error(`파티셜 없음: ${name}`);
  return readFileSync(f, 'utf8').replace(/\n$/, '');
};

/** 같은 이름이 `src/shared/` 와 `src/sub/` 양쪽에 있으면 공용이 조용히 이긴다 —
 *  어느 파일이 쓰였는지 알 수 없어지므로 빌드를 죽인다. */
(function assertNoShadow() {
  if (!existsSync(SHARED)) return;
  const dup = [];
  for (const f of readdirSync(SHARED)) {
    for (const dir of ['css', 'js', 'partials']) {
      if (existsSync(join(SUB, dir, f))) dup.push(`src/shared/${f} ↔ src/sub/${dir}/${f}`);
    }
  }
  if (dup.length) throw new Error('공용과 서브 전용에 같은 이름이 있다 — 하나를 없앨 것:\n  ' + dup.join('\n  '));
})();

/** 파티셜 전개 → 치환. 남은 {{...}} 가 있으면 실패시킨다. */
function render(tpl, ctx, depth = 0) {
  if (depth > 2) throw new Error('파티셜 중첩이 2단을 넘었다');
  let out = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => render(partial(n), ctx, depth + 1));
  out = out.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (m, k) => {
    if (!(k in ctx)) throw new Error(`템플릿 값 누락: ${k}`);
    return ctx[k];
  });
  if (depth === 0 && /\{\{/.test(out)) throw new Error('전개되지 않은 {{ }} 가 남았다');
  return out;
}

/** 페이지 소스 = 선두의 JSON 주석 블록(front-matter) + 본문 */
function parsePage(src, file) {
  const m = src.match(/^<!--build\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: 선두 <!--build … --> 블록이 없다`);
  let fm;
  try { fm = JSON.parse(m[1]); } catch (e) { throw new Error(`${file}: front-matter JSON 오류 — ${e.message}`); }
  /* ⚠ `heroImg` 는 여기서 검사하지 않는다 — 히어로가 없는 카테고리(nav.json 의
       `hero: false`)는 아예 두지 않기 때문이다. 카테고리를 아는 자리에서 검사한다. */
  for (const k of ['slug', 'title', 'description', 'nav', 'h1']) {
    if (!fm[k]) throw new Error(`${file}: front-matter 에 ${k} 가 없다`);
  }
  return { fm, body: src.slice(m[0].length).replace(/\s*$/, '') };
}

/** nav.json 에서 현재 위치를 찾는다 */
function locate(key, file) {
  for (const cat of nav.categories) {
    const item = cat.items.find((i) => i.key === key);
    if (item) return { cat, item };
  }
  throw new Error(`${file}: nav "${key}" 를 nav.json 에서 찾을 수 없다`);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── 콘텐츠 데이터 접근 (CLAUDE.md §11.3) ─────────────────────────────
   **여기가 유일한 데이터 접근 지점이다.** 홍보센터 목록은 화면에 하드코딩하지 않고
   src/sub/data/<kind>.json 에서 읽는다. 나중에 API 로 바꿀 때 이 함수 내부만
   갈아끼우면 되고 호출부·템플릿은 그대로다.

   지금은 **빌드 시점**에 읽어 정적 HTML 로 굽는다. 런타임 fetch 로 하지 않는 이유:
     · JS 없이도 목록이 보이고 검색엔진에 잡힌다
     · fetch 실패 시 빈 페이지가 되는 위험이 없다
     · 항목 수가 적어 정적으로 구워도 부담이 없다
   API 로 옮길 때는 이 함수를 async 로 바꾸고 build() 를 await 하면 된다.

   정렬 규칙: order 오름차순 → 같으면 date 내림차순(최신 먼저).
   visible:false 는 여기서 걸러진다 — 템플릿은 노출 여부를 몰라도 된다. */
/* ── 목록 컨트롤(분류 탭 · 검색) 노출 스위치 ──────────────────────────
   2026-08-10 사용자 지시로 **끈다.** 언론보도의 분류/검색 바, 갤러리·발행물의 분류 탭이
   모두 사라진다. 게시물이 적어 거를 것이 없는 동안은 컨트롤이 화면만 차지한다.

   ⚠ 마크업·CSS·JS 를 지운 것이 아니라 **내보내지 않을 뿐**이다. 게시물이 늘면
     이 한 줄을 true 로 되돌리면 그대로 돌아온다. (JS 는 대상 요소가 없으면
     스스로 빠져나가므로 오류가 나지 않는다 — filter.js·press-list.js 확인함.)
   ⚠ 페이지네이션은 이 스위치와 무관하다. 언론보도 12건은 계속 2쪽으로 나뉜다. */
const SHOW_LIST_FILTERS = false;

/* ── 샘플 게시물 노출 스위치 ────────────────────────────────────────────
   `_sample: true` 인 항목은 **기본적으로 빌드에서 빠진다.** 배포본에 가짜 게시물이
   올라가는 것이 이 프로젝트에서 가장 위험한 사고이기 때문이다(실제 런칭 사이트).

     node tools/build/pages.mjs                 → 샘플 제외 (배포용 · 기본)
     SHOW_SAMPLES=1 node tools/build/pages.mjs  → 샘플 포함 (로컬 확인용)

   ⚠ **로컬 확인용 빌드는 저장소가 아니라 미러에서 돌린다.** 그래야 저장소의 산출물은
     깨끗한 상태로 남아 실수로 커밋되지 않는다(§7.3 · 아래 npm run preview:samples).
   ⚠ `visible: false` 와 혼동하지 말 것 — visible 은 '이 글을 내릴지'이고
     _sample 은 '이건 진짜 게시물이 아니다'라는 표시다. 둘은 독립이다.

   ── `.claude/SAMPLES` 표식 ──────────────────────────────────────────
   환경변수만으로는 **미러에서 무심코 기본 빌드를 돌리는 순간 샘플이 전부 사라진다.**
   실제로 두 번 발생했다(검증하느라 `node tools/build/pages.mjs` 를 돌린 뒤 복구를 잊음
   · 2026-08-14 사용자 신고 "홍보센터 샘플이 다 사라졌어").
   그래서 **그 사본이 로컬 확인용인지를 사본 자신이 들고 있게** 했다.

     touch .claude/SAMPLES     # 이 사본에서는 어떤 빌드든 샘플을 포함한다

   `.claude/` 는 `.gitignore` 에도 있고 §7.3 rsync 의 `--exclude` 대상이기도 하다.
   즉 이 표식은 **미러 밖으로 나갈 수 없다** — 저장소·배포본은 영향받지 않는다.

   ⚠ **표식이 있는 사본에서 커밋하려면 반드시 배포 빌드를 먼저 돌린다.**
     `SHOW_SAMPLES=0` 이 표식을 이긴다. 한 번에 하려면:

       npm run build:deploy   # SHOW_SAMPLES=0 으로 빌드 + 검사 (커밋 직전)
       …커밋·푸시…
       npm run build:pages    # 표식이 샘플을 되살린다

     Desktop 원본에 접근할 수 없어 **미러에서 커밋하는 동안**은 이 순서가 유일한 방어선이다. */
const SHOW_SAMPLES = process.env.SHOW_SAMPLES === '0' ? false
  : (process.env.SHOW_SAMPLES === '1' || existsSync(join(ROOT, '.claude', 'SAMPLES')));

const SAMPLE_WARNINGS = [];

function loadContent(kind) {
  const file = join(SUB, 'data', kind + '.json');
  if (!existsSync(file)) throw new Error(`콘텐츠 데이터 없음: src/sub/data/${kind}.json`);
  let rows;
  try { rows = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { throw new Error(`src/sub/data/${kind}.json 파싱 실패 — ${e.message}`); }
  if (!Array.isArray(rows)) throw new Error(`src/sub/data/${kind}.json 은 배열이어야 한다`);

  /* 값 검증 — 여기서 죽는 편이 낫다. 통과시키면 화면에서 조용히 사라지거나
     깨진 이미지로 나가는데, 둘 다 눈으로 찾기 어렵다. */
  const ENUM = {
    gallery: ['category', ['event', 'site', 'render', 'etc']],
    publication: ['kind', ['catalog', 'im', 'brochure', 'report']],
  };
  const seen = new Set();
  for (const r of rows) {
    const at = `${kind}.json[${r.id || '?'}]`;
    for (const k of ['id', 'title', 'date']) {
      if (!r[k]) throw new Error(`${at}: 필수 필드 ${k} 가 없다`);
    }
    if (seen.has(r.id)) throw new Error(`${at}: id 가 중복이다`);
    seen.add(r.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) throw new Error(`${at}: date 는 YYYY-MM-DD 형식이어야 한다 — "${r.date}"`);
    if (typeof r.visible !== 'boolean') throw new Error(`${at}: visible 은 true/false 여야 한다 — ${JSON.stringify(r.visible)}`);
    if (r.order !== undefined && typeof r.order !== 'number') throw new Error(`${at}: order 는 숫자여야 한다`);

    // enum — 오타 나면 필터에서 조용히 빠지므로 반드시 잡는다
    const e = ENUM[kind];
    if (e && r[e[0]] !== undefined && !e[1].includes(r[e[0]])) {
      throw new Error(`${at}: ${e[0]} 는 ${e[1].join(' | ')} 중 하나여야 한다 — "${r[e[0]]}"`);
    }
    // 로컬 이미지·파일은 실제로 있는지 본다(깨진 이미지가 배포되는 것을 막는다)
    for (const k of ['image', 'file']) {
      const v = r[k];
      if (!v || /^https?:/i.test(v)) continue;
      if (!existsSync(join(ROOT, v))) throw new Error(`${at}: ${k} 가 가리키는 파일이 없다 — ${v}`);
    }
    if (r.url && !/^https?:\/\//i.test(r.url)) throw new Error(`${at}: url 은 http(s):// 로 시작해야 한다 — "${r.url}"`);
  }

  const shown = rows
    .filter((r) => r.visible === true)
    .filter((r) => SHOW_SAMPLES || r._sample !== true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(b.date).localeCompare(String(a.date)));

  /* ⚠ 샘플 안전장치 — _sample:true 인 항목이 노출 상태로 남아 있으면 시끄럽게 알린다.
     실제 런칭 사이트라 가짜 게시물이 그대로 배포되는 것이 가장 위험하다. */
  const samples = shown.filter((r) => r._sample === true).length;
  // loadContent 는 목록·상세에서 각각 불린다 → 같은 kind 는 한 번만 센다
  if (samples && !SAMPLE_WARNINGS.some((w) => w.startsWith(kind + ':'))) {
    SAMPLE_WARNINGS.push(`${kind}: 샘플 ${samples}건`);
  }
  return shown;
}

const fmtDate = (d) => String(d).replace(/-/g, '.');

/** 목록형(공지사항·언론보도) */
function renderRows(rows, kind) {
  if (!rows.length) return emptyState();
  const listId = kind === 'press' ? ' id="pressList"' : '';
  return `        <ul class="pr-rows"${listId}>\n` + rows.map((r) => {
    const meta = kind === 'press' && r.outlet ? `<span class="pr-outlet">${esc(r.outlet)}</span>` : '';
    // 공지사항·언론보도 모두 자체 상세로 간다.
    // 원문 기사는 상세의 "원문 기사 보기" 버튼이 맡는다(사용자 지시, 2026-08-10).
    const title = (kind === 'notice' || kind === 'press')
      ? `<a href="${detailPath(kind, r.id)}">${esc(r.title)}</a>`
      : esc(r.title);
    if (kind === 'press') {
      // 검색·필터가 읽는 값을 data-* 로 실어 둔다(JS 가 DOM 텍스트를 파싱하지 않게)
      return `          <li class="pr-row pr-row--stack" data-outlet="${esc(r.outlet || '')}"` +
        ` data-year="${esc(String(r.date).slice(0, 4))}"` +
        ` data-q="${esc(((r.title || '') + ' ' + (r.outlet || '') + ' ' + (r.summary || '')).toLowerCase())}">\n` +
        `            <p class="pr-title">${title}</p>\n` +
        `            <p class="pr-row-meta">${meta}<time datetime="${esc(r.date)}">보도일자 ${fmtDate(r.date)}</time></p>\n` +
        '          </li>';
    }
    return '          <li class="pr-row">\n' +
      `            <div class="pr-row-main"><p class="pr-title">${title}</p>` +
      (r.summary ? `<p class="pr-sum">${esc(r.summary)}</p>` : '') + '</div>\n' +
      `            <div class="pr-row-meta">${meta}<time datetime="${esc(r.date)}">${fmtDate(r.date)}</time></div>\n` +
      '          </li>';
  }).join('\n') + '\n        </ul>';
}

/** 카드형(홍보영상·갤러리·발행물) */
/* 아이콘 — CLAUDE.md §5 관용구(인라인 SVG · currentColor · linecap round) */
const ICON = {
  eye: '<svg class="pr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
     + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
     + '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/>'
     + '<circle cx="12" cy="12" r="3"/></svg>',
  down: '<svg class="pr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<path d="M12 4v10m0 0 3.5-3.5M12 14l-3.5-3.5"/><path d="M5 17.5v1A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-1"/></svg>',
  play: '<svg class="pr-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<circle cx="12" cy="12" r="9.2"/><path d="M10 8.6 15.4 12 10 15.4V8.6Z" fill="currentColor"/></svg>',
  zoom: '<svg class="pr-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<circle cx="11" cy="11" r="7"/><path d="M11 8.4v5.2M8.4 11h5.2M16.2 16.2 20 20"/></svg>',
};

const thumbOf = (r) => r.image
  ? `<img src="${esc(r.image)}" alt="" loading="lazy" decoding="async" />`
  : '<span class="pr-noimg">이미지 준비 중</span>';

/** 갤러리(이미지 확대) · 홍보영상(재생) — 둘 다 **화면 안에서** 연다.
 *  트리거는 <a> 로 두고 JS 가 preventDefault 한다. JS 가 죽어도 원본으로는 갈 수 있다. */
function renderCards(rows, kind) {
  if (!rows.length) return emptyState();
  const CAT = { event: '행사', site: '현장', render: '조감도', etc: '기타' };
  return '        <ul class="pr-cards">\n' + rows.map((r) => {
    const badge = kind === 'gallery' ? CAT[r.category] : r.duration;
    let trigger = '';
    if (kind === 'gallery' && r.image) {
      trigger = `<a class="pr-cover" href="${esc(r.image)}" data-lb="image" data-src="${esc(r.image)}"`
        + ` data-title="${esc(r.title)}">${ICON.zoom}<span class="sr">${esc(r.title)} 확대해서 보기</span></a>`;
    } else if (kind === 'video' && (r.videoFile || r.youtubeId)) {
      const src = r.videoFile ? ` data-video-file="${esc(r.videoFile)}"` : ` data-youtube="${esc(r.youtubeId)}"`;
      const href = r.url ? esc(r.url) : (r.videoFile ? esc(r.videoFile) : '#');
      trigger = `<a class="pr-cover" href="${href}" data-lb="video"${src}`
        + ` data-title="${esc(r.title)}">${ICON.play}<span class="sr">${esc(r.title)} 재생</span></a>`;
    } else if (r.url) {
      // 재생·확대할 원본이 없으면 기존대로 새 창
      trigger = `<a class="pr-cover" href="${esc(r.url)}" target="_blank" rel="noopener">`
        + `<span class="sr">${esc(r.title)} 새 창으로 열기</span></a>`;
    }
    return `          <li class="pr-card"${kind === 'gallery' ? ` data-cat="${esc(r.category || 'etc')}"` : ''}>\n` +
      `            <span class="pr-thumb">${thumbOf(r)}${trigger}` +
      (badge ? `<span class="pr-badge">${esc(badge)}</span>` : '') + '</span>\n' +
      `            <p class="pr-title">${esc(r.title)}</p>\n` +
      `            <p class="pr-row-meta"><time datetime="${esc(r.date)}">${fmtDate(r.date)}</time></p>\n` +
      '          </li>';
  }).join('\n') + '\n        </ul>';
}

/** 발행물 — 썸네일 좌 / 텍스트 우 가로형. 액션은 미리보기 · 다운로드 두 개다(첨부 와이어프레임).
 *  ⚠ 미리보기는 **새 창**이다(스토리보드 slide100 "클릭 시, 새창으로 열림").
 *    갤러리·영상만 화면 안에서 열도록 바꿨다 — PDF 를 모달 iframe 에 넣으면
 *    모바일에서 스크롤·확대가 브라우저 기본 뷰어보다 나빠진다. */
/** 발행물 표지. 이미지가 없으면 **책자 표지**를 그린다.
 *  사진 자리표시("이미지 준비 중")는 발행물에 어울리지 않는다 — 인쇄물이라 표지가 비면
 *  목록 전체가 미완성으로 보인다. 그래서 로고를 얹은 표지를 만들어 자리표시가 아니라
 *  **기본 표지**로 쓴다(사용자 지시 2026-08-10). 왼쪽 세로 띠는 제본 등(spine) 느낌이다. */
function pubCover(r) {
  if (r.image) return `<img src="${esc(r.image)}" alt="" loading="lazy" decoding="async" />`;
  /* 로고를 **원톤**으로 바꿔 넣는다. 원본은 워드마크(currentColor) + 민트·블루 심볼의
     3색인데, 표지 위에서는 심볼만 튀어 로고가 아니라 스티커처럼 보인다.
     색 지정을 전부 currentColor 로 바꾸면 CSS 의 color 하나로 톤을 잡을 수 있다. */
  const mark = partial('logo')
    .replace('class="logo"', 'class="pub-logo"')
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"');
  return '<span class="pub-blank">' +
    '<span class="pub-spine" aria-hidden="true"></span>' +
    '<span class="pub-mark">' + mark + '</span>' +
    '</span>';
}

function renderPubs(rows) {
  if (!rows.length) return emptyState();
  const KIND = { catalog: '카달로그', im: 'IM', brochure: '브로슈어', report: '리포트' };
  const CAT = Object.entries(KIND);
  const filters = filterTabs(CAT, rows, (r) => r.kind || '', '발행물 분류') + '\n';

  /* 보기·다운로드는 **표지 위 오버레이**다(2026-08-14 지시).
     ⚠ 호버로만 나타나는 컨트롤은 키보드·터치에서 닿지 않는다. 두 가지로 막았다.
       · 키보드 — 버튼이 표지 안에 있으므로 CSS 의 `:focus-within` 으로 함께 뜬다
       · 터치   — `@media (hover: none)` 에서 **항상 보인다**(page-pr.css)
     ⚠ 아이콘만 두므로 이름은 `.sr` 로 낭독에 남긴다. `title` 은 마우스 툴팁용이다. */
  const ovBtn = (href, attrs, icon, label) =>
    `<a class="pub-ov-btn" href="${esc(href)}"${attrs} title="${esc(label)}">`
    + `${icon}<span class="sr">${esc(label)}</span></a>`;

  /* 분류는 **표지 왼쪽 위 배지**다(2026-08-18 지시 — 갤러리와 같은 형태).
     전에는 날짜 옆에 `2026.06.30 · 카달로그` 로 붙어 있었는데, 같은 홍보센터 안에서
     갤러리는 배지·발행물은 텍스트라 분류를 읽는 방법이 목록마다 달랐다.
     클래스도 갤러리와 **같은 `.pr-badge`** 를 쓴다 — 모양이 갈라지지 않게 하기 위함이다. */
  const cards = '        <ul class="pub-list">\n' + rows.map((r) => {
    const acts =
      (r.url ? ovBtn(r.url, ' target="_blank" rel="noopener"', ICON.eye, `${r.title} 새 창으로 보기`) : '') +
      (r.file ? ovBtn(r.file, ' download', ICON.down, `${r.title} 내려받기`) : '');
    const badge = KIND[r.kind] ? `<span class="pr-badge">${esc(KIND[r.kind])}</span>` : '';
    return `          <li class="pub-item" data-cat="${esc(r.kind || '')}">\n` +
      `            <span class="pub-thumb">${pubCover(r)}${badge}` +
      (acts ? `<span class="pub-ov">${acts}</span>` : '') + '</span>\n' +
      `            <p class="pr-title">${esc(r.title)}</p>\n` +
      `            <p class="pr-row-meta"><time datetime="${esc(r.date)}">${fmtDate(r.date)}</time></p>\n` +
      '          </li>';
  }).join('\n') + '\n        </ul>';

  return filters + cards;
}

function emptyState() {
  return '        <p class="pr-empty">등록된 게시물이 없습니다.</p>';
}

/** 상세 페이지 파일명. 목록·상세·이전다음이 모두 이 함수를 쓴다 —
 *  규칙을 바꾸려면 여기만 고치면 링크가 어긋나지 않는다.
 *  ⚠ 하위 폴더로 만들지 말 것. assets 경로가 전부 페이지 기준 상대경로라
 *    깊이가 달라지면 이미지·폰트가 전부 깨진다. */
const detailPath = (prefix, id) =>
  // id 가 이미 접두어로 시작하면 겹쳐 쓰지 않는다(notice-notice-… 방지)
  (String(id).startsWith(prefix + '-') ? `${id}.html` : `${prefix}-${id}.html`);

/** 본문 — 데이터의 body(문단 배열)를 문단으로 편다.
 *  ⚠ 리치 텍스트 에디터(slide108)가 들어오면 HTML 을 그대로 받게 되는데,
 *    그때는 반드시 서버/에디터 쪽에서 정제한 뒤 넣어야 한다. 지금은 평문만 받으므로
 *    esc() 로 이스케이프한다 — 데이터에 태그를 적어도 태그로 해석되지 않는다. */
function renderBody(r) {
  const paras = Array.isArray(r.body) ? r.body : (r.body ? [r.body] : []);
  if (!paras.length && r.summary) paras.push(r.summary);

  /* 등록된 이미지를 본문 안에 넣는다.
     `image` 는 한 장, `images` 는 여러 장([문자열] 또는 [{src,caption}]).
     ⚠ 목록 썸네일과 같은 필드를 쓰므로, 썸네일만 쓰고 본문에는 안 넣고 싶으면
       thumbOnly:true 를 준다. */
  const imgs = [];
  if (Array.isArray(r.images)) {
    for (const it of r.images) imgs.push(typeof it === 'string' ? { src: it } : it);
  } else if (r.image && !r.thumbOnly) {
    imgs.push({ src: r.image });
  }
  const figures = imgs.map((im) =>
    '            <figure class="post-fig">' +
    `<img src="${esc(im.src)}" alt="${esc(im.alt || '')}" loading="lazy" decoding="async" />` +
    (im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : '') +
    '</figure>').join('\n');

  if (!paras.length && !figures) return '          <p class="post-empty">본문이 등록되지 않았습니다.</p>';
  return '          <div class="post-body">\n' +
    paras.map((p) => `            <p>${esc(p)}</p>`).join('\n') +
    (figures ? (paras.length ? '\n' : '') + figures : '') +
    '\n          </div>';
}

/* 첨부파일 아이콘 — CLAUDE.md §5 관용구를 따른다(아이콘 라이브러리 없음, 인라인 SVG,
   viewBox 0 0 24 24 · fill none · stroke currentColor · linecap round).
   색은 currentColor 로 부모에서 상속받으므로 링크 색이 바뀌면 아이콘도 따라간다.
   모서리가 접힌 문서 모양 + 아래쪽 내려받기 화살표. */
const ICON_FILE =
  '<svg class="post-file-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M14.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5L14.5 3Z"/>' +
  '<path d="M14 3.2V8h4.8"/>' +
  '<path d="M12 11.5v5.2m0 0 2-2m-2 2-2-2"/>' +
  '</svg>';

/** 파일명 끝의 확장자 → 대문자 태그. 없으면 빈 문자열 */
const extOf = (p) => {
  const m = /\.([a-z0-9]{1,5})(?:\?.*)?$/i.exec(String(p || ''));
  return m ? m[1].toUpperCase() : '';
};

/** 원문 기사 보기 — 언론보도 상세에만 나온다. 원문이 없으면 아무것도 내보내지 않는다 */
function renderSource(r) {
  if (!r.url) return '';
  /* 본문 옆의 보조 동작이지 이 화면의 주행동이 아니다 —
     채운 원형 화살표 · 볼드 · 그림자를 걷고 외곽선 링크로 낮췄다(2026-08-10 지적).
     아이콘은 새 창으로 나간다는 뜻의 외부링크 표시다. */
  return '          <p class="post-source">' +
    `<a class="src-btn" href="${esc(r.url)}" target="_blank" rel="noopener">` +
    '<span>원문 기사 보기</span>' +
    '<span class="src-arrow" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M14 4h6v6M20 4 11 13"/>' +
    '<path d="M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10"/>' +
    '</svg></span></a></p>';
}

function renderFiles(r) {
  const files = Array.isArray(r.files) ? r.files : [];
  if (!files.length) return '';
  return '          <div class="post-files">\n' +
    '            <p class="post-files-h">첨부파일</p>\n' +
    '            <ul class="post-files-list">\n' + files.map((f) => {
      const ext = extOf(f.path);
      return `              <li><a href="${esc(f.path)}" download>${ICON_FILE}` +
        `<span class="post-file-name">${esc(f.name)}</span>` +
        (ext ? `<span class="post-file-ext">${esc(ext)}</span>` : '') + '</a></li>';
    }).join('\n') +
    '\n            </ul>\n          </div>';
}

/** 이전글 / 다음글 / 목록으로. 목록과 같은 정렬 순서를 그대로 쓴다 */
function renderPostNav(rows, i, prefix, listSlug) {
  const prev = rows[i - 1];   // 목록에서 위(더 앞 순서)
  const next = rows[i + 1];
  /* 카드 3장이 나란한 형태를 **표 형식 행 목록**으로 바꿨다(2026-08-10 지적).
     본문 끝에 카드가 또 오면 무게가 본문과 비슷해져 어디가 끝인지 흐려진다.
     행은 얇은 구분선으로만 나누고, 목록 버튼은 아래 가운데로 뺀다. */
  const ARROW = (up) => '<svg class="post-nav-ic" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    `aria-hidden="true"><path d="${up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'}"/></svg>`;
  const link = (r, label, up) => {
    const inner = `<span class="post-nav-label">${ARROW(up)}${label}</span>` +
      `<span class="post-nav-title">${r ? esc(r.title) : '없습니다'}</span>`;
    return r
      ? `          <a class="post-nav-item" href="${detailPath(prefix, r.id)}">${inner}</a>`
      : `          <span class="post-nav-item is-off">${inner}</span>`;
  };
  return '        <nav class="post-nav" aria-label="게시글 이동">\n' +
    link(prev, '이전 글', true) + '\n' + link(next, '다음 글', false) + '\n' +
    `          <a class="post-back" href="${listSlug}.html">` +
    '<svg class="post-back-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M4 6h16M4 12h16M4 18h16"/></svg>목록으로</a>\n' +
    '        </nav>';
}

/** 언론보도 목록 컨트롤(분류 3종 + 검색). SHOW_LIST_FILTERS 가 false 면 통째로 빠진다.
 *  press.html 의 {{controls}} 자리에 들어간다 — 마크업을 페이지에 두면 스위치가
 *  두 곳(빌더·페이지)으로 갈라져서 한쪽만 꺼지는 사고가 난다. */
function pressControls() {
  if (!SHOW_LIST_FILTERS) return '';
  return `        <div class="pl-bar rv">
          <nav class="pl-modes" aria-label="언론보도 분류">
            <button type="button" class="pl-mode is-on" data-mode="all" aria-pressed="true">전체</button>
            <button type="button" class="pl-mode" data-mode="outlet" aria-pressed="false">언론사별</button>
            <button type="button" class="pl-mode" data-mode="year" aria-pressed="false">기간별</button>
          </nav>
          <form class="pl-search" id="pressSearch" role="search">
            <label class="sr" for="pressQ">제목 · 내용 검색</label>
            <input type="search" id="pressQ" placeholder="제목 · 내용 검색" autocomplete="off" />
            <button type="submit" class="pl-go">검색</button>
          </form>
        </div>
        <div class="pl-chips" id="pressChips" hidden></div>
`;
}

/** 갤러리 카테고리 필터 탭 — 항목이 없으면 탭도 내보내지 않는다 */
function renderFilters(rows) {
  if (!rows.length) return '';
  const CAT = [['event', '행사'], ['site', '현장'], ['render', '조감도'], ['etc', '기타']];
  return filterTabs(CAT, rows, (r) => r.category || 'etc', '갤러리 분류');
}

/** 분류 탭 공통 — 갤러리·발행물이 같이 쓴다.
 *  ⚠ 항목이 0건인 분류도 **탭은 남긴다**(비활성). 탭이 데이터에 따라 나타났다 사라지면
 *    어떤 분류가 있는지 자체를 알 수 없다. 대신 건수를 함께 보여 준다 — 하나를 골라도
 *    나머지에 몇 건이 있는지 탭에서 바로 보인다(사용자 지시 2026-08-10).
 *  ⚠ class 속성을 템플릿 보간으로 쪼개지 말 것 — lint-classes 가 정규식으로 읽는다.
 *    세 갈래를 각각 완성된 문자열로 적는다. */
function filterTabs(CAT, rows, keyOf, label) {
  if (!SHOW_LIST_FILTERS) return '';
  const count = {};
  rows.forEach((r) => { const k = keyOf(r); count[k] = (count[k] || 0) + 1; });

  const tab = (cat, text, n, on) => {
    const cls = on ? 'class="pr-filter is-on"'
      : n ? 'class="pr-filter"'
      : 'class="pr-filter is-empty"';
    const dis = (n || cat === 'all') ? '' : ' disabled';
    return `          <button type="button" ${cls} data-cat="${cat}" aria-pressed="${on}"${dis}>` +
      `${text}<span class="pr-filter-n">${n}</span></button>`;
  };

  return '        <nav class="pr-filters" aria-label="' + label + '">\n' +
    [tab('all', '전체', rows.length, true)]
      .concat(CAT.map(([k, t]) => tab(k, t, count[k] || 0, false)))
      .join('\n') + '\n        </nav>';
}

/* ── 페이지 조립 공용 헬퍼 ─────────────────────────────────────────────
   목록 페이지(build)와 상세 페이지(buildDetails)가 **같은 함수를 쓴다.**
   따로 두면 한쪽만 고쳐져 GNB·LNB·CSS 번들이 어긋난다. */

/** GNB · 모바일 메뉴 · LNB · 푸터 — nav.json 에서 유도 */
function navBits(cat, navKey) {
  /* 대메뉴 — 호버하면 하위 메뉴가 펼쳐진다(2026-08-27 지시). 메인 `index.html` 과 같은
     **전체 폭 드롭**(§9-1 확정 사양)이며, 하위 항목은 같은 `nav.json` 에서 온다.
     ⚠ 카테고리 키로 짝지운다 — `gnb` 배열과 `categories` 배열이 따로라 순서에 기대면 어긋난다. */
  const gnbItems = nav.gnb.map((g) => {
    const on = g.key === cat.key;
    const c = nav.categories.find((x) => x.key === g.key);
    const subs = (c ? c.items : []).map((i) =>
      `            <a href="${i.href}"${i.key === navKey ? ' class="is-on"' : ''}>${esc(i.label)}</a>`
    ).join('\n');
    return `        <div class="gnb-item">
          <a class="gnb-link${on ? ' is-on' : ''}" href="${g.href}"${on ? ' aria-current="page"' : ''}>${esc(g.label)}</a>
          <div class="gnb-sub">
${subs}
          </div>
        </div>`;
  }).join('\n');

  /* ⚠ `menu: false` 카테고리는 대메뉴에도 모바일 메뉴에도 넣지 않는다 — 푸터에서만 닿는
       단일 페이지다(회사소개). 여기서 거르지 않으면 GNB 에는 없는데 모바일에만 나온다. */
  const mnavItems = nav.categories.filter((c) => c.menu !== false).map((c) => {
    const head = `      <h2>${c.no} ${esc(c.label)}</h2>`;
    const links = c.items.map((i) => {
      const on = i.key === navKey;
      return `      <a href="${i.href}"${on ? ' class="is-on"' : ''}>${esc(i.label)}</a>`;
    }).join('\n');
    return head + '\n' + links;
  }).join('\n');

  const lnbItems = cat.items.map((i) => {
    const on = i.key === navKey;
    return `        <a href="${i.href}"${on ? ' class="is-on" aria-current="page"' : ''}>${esc(i.label)}</a>`;
  }).join('\n');

  const footItems = nav.footer.map((f, idx) =>
    (idx ? '          <i aria-hidden="true"></i>\n' : '') +
    `          <a href="${f.href}">${esc(f.label)}</a>`
  ).join('\n');

  return { gnbItems, mnavItems, lnbItems, footItems };
}

/** 히어로 제목 아래 한 줄. front-matter 의 `heroLede` 가 있을 때만 문단을 만든다.
 *  ⚠ 값이 없을 때 빈 `<p>` 를 내보내면 히어로 아래에 여백만 남는다 — 빈 문자열을 준다.
 *  ⚠ `<br />` 를 쓸 수 있어야 하므로 이스케이프하지 않는다. 이 값은 우리가 쓴 것이고
 *    사용자 입력이 아니다. */
const heroLede = (fm) => fm.heroLede
  ? `        <p class="hero-lede">${fm.heroLede}</p>` : '';

/** 상단 블록 — 카테고리의 `hero` 가 false 면 [LNB 만], 아니면 [히어로 + LNB].
 *  ⚠ **미리 펼쳐서** 넘긴다. `render()` 는 ctx 값을 치환만 하고 그 안을 다시 훑지 않으므로
 *    (본문 `main` 과 같은 사정) 여기서 펼치지 않으면 `{{ }}` 가 남아 빌드가 죽는다. */
/* 문의 모달 — front-matter `contactModal: true` 인 페이지에만 넣는다.
   ⚠ 값으로 넣는다(파티셜 호출을 layout 에 직접 쓰지 않는다) — 안 쓰는 페이지에
     마크업·CSS·JS 22KB 를 붙이지 않기 위해서다.
   ⚠ 플래그를 켰으면 css · js 에 `contact` 도 함께 있어야 한다.
     하나만 켜면 스타일 없는 폼이 문서 흐름에 쏟아진다(§11.29 의 실제 사고).
   ⚠ 마크업 · CSS · JS 세 벌 모두 `src/shared/` 한 곳에서 온다 — 메인과 같은 파일이다. */
function contactModalBlock(fm, file) {
  if (!fm.contactModal) return '';
  const css = fm.css || [], js = fm.js || [];
  if (!css.includes('contact')) throw new Error(`${file}: contactModal 인데 css 에 contact 가 없다`);
  if (!js.includes('contact')) throw new Error(`${file}: contactModal 인데 js 에 contact 가 없다`);
  return partial('contact-modal');
}

function heroBlock(cat, fm, ctx, file) {
  const on = cat.hero !== false;
  if (on && !fm.heroImg) throw new Error(`${file}: ${cat.label} 은 히어로가 있는 카테고리다 — front-matter 에 heroImg 가 필요하다`);
  if (!on && fm.heroImg) throw new Error(`${file}: ${cat.label} 은 히어로가 없다 — 쓰이지 않는 heroImg 를 지울 것`);
  /* 세 갈래다 — [히어로 + LNB] · [LNB 만] · [히어로만].
     ⚠ 마지막은 대메뉴에 속하지 않는 단일 페이지용이다(`lnb: false`). LNB 를 그대로 두면
       항목이 자기 자신 하나뿐인 메뉴 줄이 남는다. */
  if (on && cat.lnb === false) return render(partial('hero-only'), ctx, 1);
  return render(partial(on ? 'hero' : 'hero-lnb'), ctx, 1);
}

/** CSS 번들 — 공통 순서 뒤에 페이지 CSS. 파일마다 구분 주석을 남긴다 */
function cssBundle(fm) {
  return [...CSS_COMMON, ...(fm.css || [])].map((n) => {
    const f = pick('css', n, ['.css']);
    if (!f) throw new Error(`CSS 없음: ${n}.css (src/shared · src/sub/css 둘 다 확인했다)`);
    const src = readFileSync(f, 'utf8').replace(/\s*$/, '');
    return `    /* ── ${n}.css ─────────────────────────────────────────── */\n` +
      src.split('\n').map((l) => (l ? '    ' + l : l)).join('\n');
  }).join('\n\n');
}

/** JS 번들 — common 은 항상 첫 번째 */
function jsBundle(fm) {
  return ['common', ...(fm.js || [])].map((n) => {
    const f = pick('js', n, ['.js']);
    if (!f) throw new Error(`JS 없음: ${n}.js (src/shared · src/sub/js 둘 다 확인했다)`);
    return readFileSync(f, 'utf8').replace(/\s*$/, '');
  }).join('\n\n');
}

const banner = (srcFile) =>
  '<!-- 생성물이다. 이 파일을 고치지 말 것.\n' +
  `     소스: src/sub/pages/${srcFile} + src/sub/{layout.html,partials,css,js,nav.json}\n` +
  '     빌드: npm run build:pages -->\n';

function build(file) {
  const { fm, body } = parsePage(read(SUB, 'pages', file), file);
  const { cat, item } = locate(fm.nav, file);

  /* front-matter 의 list 로 콘텐츠 목록을 굽는다.
     { "list": { "kind": "notice", "layout": "rows" } } → 본문의 {{list}} 자리에 들어간다.
     layout: rows(목록형) | cards(카드형). gallery 는 카드형 + 카테고리 필터. */
  let listHtml = '';
  if (fm.list) {
    const rows = loadContent(fm.list.kind);
    const inner = fm.list.layout === 'pubs' ? renderPubs(rows)
      : fm.list.layout === 'cards' ? renderCards(rows, fm.list.kind)
      : renderRows(rows, fm.list.kind);
    const filters = fm.list.kind === 'gallery' ? renderFilters(rows) : '';
    listHtml = (filters ? filters + '\n' : '') + inner;
    console.log(`    ${fm.slug}: ${fm.list.kind} 노출 ${rows.length}건`);
  }

  const heroCtx0 = {
    heroImg: fm.heroImg, h1: fm.h1, heroLede: heroLede(fm),
    catLabel: esc(cat.label), catNo: cat.no, catEn: cat.en,
    navLabel: esc(fm.crumb || item.label),
    ...navBits(cat, fm.nav),
  };
  const heroCtx = { ...heroCtx0,
    hero: heroBlock(cat, fm, heroCtx0, file),
    contactModal: contactModalBlock(fm, file),
    bodyAttr: cat.hero === false ? ' class="no-hero"' : '' };

  const html = render(layout, {
    title: esc(fm.title),
    description: esc(fm.description),
    css: cssBundle(fm), js: jsBundle(fm),
    /* ⚠ 본문 안의 {{> partial}} 은 여기서 먼저 펼친다.
       render() 는 ctx 값(main)을 **치환만** 하고 그 안을 다시 훑지 않으므로,
       미리 펼치지 않으면 "전개되지 않은 {{ }} 가 남았다" 로 빌드가 죽는다.
       페이지가 큰 SVG 를 파티셜로 나눠 쓸 수 있게 하는 것이 목적이다(입지 교통망 4겹). */
    main: body.replace('{{list}}', () => listHtml)
               .replace('{{controls}}', () => pressControls())
               .replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => partial(n)),
    ...heroCtx,
  });

  return { out: join(ROOT, fm.slug + '.html'), html: banner(file) + html, slug: fm.slug };
}

/* 상세 페이지 — 데이터 항목 하나당 한 파일.
   템플릿은 pages/_detail-<kind>.html 이며 `_` 로 시작해 일반 빌드 목록에서 빠진다. */
function buildDetails(file) {
  const src = read(SUB, 'pages', file);
  const m = src.match(/^<!--build\s*([\s\S]*?)-->\s*/);
  const fm = JSON.parse(m[1]);
  const body = src.slice(m[0].length).replace(/\s*$/, '');
  const kind = fm.template;
  const rows = loadContent(kind);
  const { cat, item } = locate(fm.nav, file);
  const out = [];

  const dHeroCtx0 = {
    heroImg: fm.heroImg, h1: fm.h1, heroLede: heroLede(fm),
    catLabel: esc(cat.label), catNo: cat.no, catEn: cat.en,
    navLabel: esc(item.label),
    ...navBits(cat, fm.nav),
  };
  const dHeroCtx = { ...dHeroCtx0,
    hero: heroBlock(cat, fm, dHeroCtx0, file),
    contactModal: contactModalBlock(fm, file),
    bodyAttr: cat.hero === false ? ' class="no-hero"' : '' };

  rows.forEach((r, i) => {
    const excerpt = (r.summary || (Array.isArray(r.body) ? r.body[0] : r.body) || r.title).slice(0, 150);
    const ctx = {
      postTitle: esc(r.title),
      postExcerpt: esc(excerpt),
      postDate: fmtDate(r.date),
      postDateISO: esc(r.date),
      postBody: renderBody(r),
      postFiles: renderFiles(r),
      postNav: renderPostNav(rows, i, fm.slugPrefix, kind),
      postSource: renderSource(r),
      postOutlet: r.outlet ? `<span class="post-outlet">${esc(r.outlet)}</span>` : '',
    };
    // front-matter 의 title/description 도 {{postTitle}} 등을 쓴다 → 먼저 채운다
    const fill = (s) => String(s).replace(/\{\{(postTitle|postExcerpt)\}\}/g, (_, k) => ctx[k]);

    const html = render(layout, {
      title: fill(fm.title), description: fill(fm.description),
      css: cssBundle(fm), js: jsBundle(fm),
      main: render(body, ctx, 1),
      ...dHeroCtx,
    });
    out.push({ out: join(ROOT, detailPath(fm.slugPrefix, r.id)), html: banner(file) + html,
               slug: detailPath(fm.slugPrefix, r.id).replace(/\.html$/, '') });
  });
  return out;
}

const files = readdirSync(join(SUB, 'pages'))
  .filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort();
const detailTemplates = readdirSync(join(SUB, 'pages'))
  .filter((f) => f.startsWith('_detail-') && f.endsWith('.html')).sort();
let stale = 0;
const jobs = files.map((f) => build(f));
for (const t of detailTemplates) jobs.push(...buildDetails(t));

/* ── 남겨진 상세 페이지(고아) 검출 ────────────────────────────────────
   빌더는 파일을 **만들기만 하고 지우지 않는다.** 그래서 샘플 빌드가 만든 상세 페이지가
   배포 빌드 뒤에도 디스크에 남고, 그대로 커밋되면 **목록에서는 안 보이는데 URL 로는
   열리는 페이지**가 된다. 2026-08-15 에 실제로 확인됐다 — 샘플 상세 16개가 저장소에
   커밋돼 라이브 사이트에 공개돼 있었다(§11.16 이 경고했던 바로 그 상태).

   ⚠ 목록이 비어 있으면 안전하다고 볼 수 없다. 링크가 없을 뿐 접근은 된다.

   지우는 대상은 **빌더가 만든 것이 확실한 파일뿐**이다 — 상세 접두어와 이름이 맞고,
   선두에 생성물 배너가 있는 파일. 손으로 만든 파일은 배너가 없어 절대 지워지지 않는다. */
const detailPrefixes = [...new Set(detailTemplates
  .map((t) => JSON.parse(read(SUB, 'pages', t).match(/^<!--build\s*([\s\S]*?)-->/)[1]).slugPrefix))];
const wanted = new Set(jobs.map((j) => basename(j.out)));
/* ⚠ 상세 페이지만 보면 안 된다. 2026-08-24 에 투자·입주 세 페이지를 한 장으로 합쳤을 때
     옛 `land.html` · `zone-benefit.html` · `benefit.html` 이 접두어와 맞지 않아 검사에서
     빠졌고, 그대로 두면 **목록에는 없는데 URL 로는 열리는 페이지**가 영구히 남는다.
     이제 **배너가 있는데 이번 빌드가 만들지 않은 루트 HTML 전부**를 고아로 본다.
     배너 없는 손글씨 파일(index.html · 리다이렉트 stub)은 여전히 건드리지 않는다. */
const orphans = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !wanted.has(f)
    && readFileSync(join(ROOT, f), 'utf8').startsWith('<!-- 생성물이다.'));

if (orphans.length) {
  if (CHECK) {
    stale += orphans.length;
    orphans.forEach((f) => console.log(`  ✗ ${f} — 이번 빌드가 만들지 않은 생성물이 남아 있다`));
  } else {
    orphans.forEach((f) => { rmSync(join(ROOT, f)); console.log(`  ✕ ${f} (남겨진 생성물 — 삭제)`); });
  }
}

for (const { out, html, slug } of jobs) {
  const prev = existsSync(out) ? readFileSync(out, 'utf8') : null;
  if (CHECK) {
    if (prev !== html) { stale++; console.log(`  ✗ ${slug}.html 이 소스와 다르다`); }
    continue;
  }
  if (prev === html) { console.log(`  = ${slug}.html (변화 없음)`); continue; }
  writeFileSync(out, html);
  console.log(`  → ${slug}.html (${(html.length / 1024).toFixed(1)} KB)`);
}
/* ── 공용 소스를 메인(`index.html`)에도 반영한다 ──────────────────────
   서브페이지는 위에서 파티셜·번들로 받았고, 메인은 손글씨 파일이라 여기서 맞춰 준다.
   ⚠ **`src/shared/` 가 정본이다.** `index.html` 의 마커 구간과 `assets/js/contact.js` 는
     생성물이므로 직접 고치면 다음 빌드에 덮어써진다.
   ⚠ 마커가 없으면 조용히 넘기지 않고 **빌드를 죽인다** — 한쪽만 갈라지는 것이
     이 정리로 없애려던 바로 그 상태다. */
function syncShared(write) {
  const changed = [];

  // ① index.html 의 마커 구간 = src/shared/contact-modal.html
  const idxPath = join(ROOT, 'index.html');
  const idx = readFileSync(idxPath, 'utf8');
  const re = /([ \t]*<!-- @shared:contact-modal[\s\S]*?-->\n)[\s\S]*?(\n[ \t]*<!-- \/@shared:contact-modal -->)/;
  if (!re.test(idx)) throw new Error('index.html 에 @shared:contact-modal 마커 한 쌍이 없다 — 지웠으면 되살릴 것');
  const body = readFileSync(join(SHARED, 'contact-modal.html'), 'utf8').replace(/\n$/, '');
  const next = idx.replace(re, (_, head, tail) => head + body + tail);
  if (next !== idx) { if (write) writeFileSync(idxPath, next); changed.push('index.html (문의 모달 마크업)'); }

  // ② assets/js/contact.js = src/shared/contact.js  (메인이 <script src> 로 받는다)
  const jsDir = join(ROOT, 'assets', 'js');
  const jsOut = join(jsDir, 'contact.js');
  const jsSrc = '/* 생성물이다. 이 파일을 고치지 말 것 — 소스는 src/shared/contact.js 다.\n'
    + '   서브페이지는 같은 소스를 인라인으로 받는다(tools/build/pages.mjs). */\n'
    + readFileSync(join(SHARED, 'contact.js'), 'utf8');
  if (!existsSync(jsOut) || readFileSync(jsOut, 'utf8') !== jsSrc) {
    if (write) { mkdirSync(jsDir, { recursive: true }); writeFileSync(jsOut, jsSrc); }
    changed.push('assets/js/contact.js');
  }
  return changed;
}

if (CHECK) {
  const drift = syncShared(false);
  if (drift.length) { stale += drift.length; drift.forEach((f) => console.log(`  ✗ ${f} 이 src/shared 와 다르다`)); }
  console.log(stale ? `  ${stale}개 생성물이 낡았다 — npm run build:pages 를 돌려라` : '  생성물 최신 상태');
  process.exit(stale ? 1 : 0);
}
syncShared(true).forEach((f) => console.log(`  → ${f}`));
console.log(`  서브페이지 ${jobs.length}개 빌드 완료 (목록 ${files.length} · 상세 ${jobs.length - files.length})`);

if (SAMPLE_WARNINGS.length) {
  console.log('\n  ' + '='.repeat(66));
  console.log('  ⚠  샘플 데이터가 노출 상태로 들어 있다 — ' + SAMPLE_WARNINGS.join(' · '));
  console.log('     화면 확인용이며 **실제 게시물이 아니다.** 배포 전에 반드시');
  console.log('     src/sub/data/*.json 에서 실제 콘텐츠로 바꾸거나 visible 을 false 로 내릴 것.');
  console.log('  ' + '='.repeat(66));
}

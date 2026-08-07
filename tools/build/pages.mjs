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
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SUB = join(ROOT, 'src', 'sub');
const CHECK = process.argv.includes('--check');

const read = (...p) => readFileSync(join(...p), 'utf8');

/** 공통 CSS — 이 순서가 곧 캐스케이드 순서다. 페이지 CSS 는 항상 뒤에 붙는다.
 *  overview.html 원본과 같은 순서를 유지하고 있다(리팩터 제로디프의 근거). */
const CSS_COMMON = ['00-tokens', '10-base', '20-gnb', '30-hero-lnb', '40-section', '80-footer', '90-motion'];

const nav = JSON.parse(read(SUB, 'nav.json'));
const layout = read(SUB, 'layout.html');

const partial = (name) => {
  for (const ext of ['.html', '.svg']) {
    const f = join(SUB, 'partials', name + ext);
    if (existsSync(f)) return readFileSync(f, 'utf8').replace(/\n$/, '');
  }
  throw new Error(`파티셜 없음: ${name}`);
};

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
  for (const k of ['slug', 'title', 'description', 'nav', 'heroImg', 'h1']) {
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

function build(file) {
  const { fm, body } = parsePage(read(SUB, 'pages', file), file);
  const { cat, item } = locate(fm.nav, file);

  // GNB — 현재 대분류만 is-on. href 는 그 대분류의 첫 항목으로 보낸다
  const gnbItems = nav.gnb.map((g) => {
    const on = g.key === cat.key;
    return `        <a href="${g.href}"${on ? ' class="is-on" aria-current="page"' : ''}>${esc(g.label)}</a>`;
  }).join('\n');

  // 모바일 메뉴 — 전체 사이트맵. 현재 항목만 is-on
  const mnavItems = nav.categories.map((c) => {
    const head = `      <h2>${c.no} ${esc(c.label)}</h2>`;
    const links = c.items.map((i) => {
      const on = i.key === fm.nav;
      return `      <a href="${i.href}"${on ? ' class="is-on"' : ''}>${esc(i.label)}</a>`;
    }).join('\n');
    return head + '\n' + links;
  }).join('\n');

  // LNB — 현재 대분류의 형제 항목
  const lnbItems = cat.items.map((i) => {
    const on = i.key === fm.nav;
    return `        <a href="${i.href}"${on ? ' class="is-on" aria-current="page"' : ''}>${esc(i.label)}</a>`;
  }).join('\n');

  const footItems = nav.footer.map((f, idx) =>
    (idx ? '          <i aria-hidden="true"></i>\n' : '') +
    `          <a href="${f.href}">${esc(f.label)}</a>`
  ).join('\n');

  // CSS · JS 조립
  const cssFiles = [...CSS_COMMON, ...(fm.css || [])];
  const css = cssFiles.map((n) => {
    const src = read(SUB, 'css', n + '.css').replace(/\s*$/, '');
    return `    /* ── ${n}.css ─────────────────────────────────────────── */\n` +
      src.split('\n').map((l) => (l ? '    ' + l : l)).join('\n');
  }).join('\n\n');

  const jsFiles = ['common', ...(fm.js || [])];
  const js = jsFiles.map((n) => read(SUB, 'js', n + '.js').replace(/\s*$/, '')).join('\n\n');

  const html = render(layout, {
    title: esc(fm.title),
    description: esc(fm.description),
    css, js,
    main: body,
    heroImg: fm.heroImg,
    h1: fm.h1,
    catLabel: esc(cat.label), catNo: cat.no, catEn: cat.en,
    navLabel: esc(fm.crumb || item.label),
    gnbItems, mnavItems, lnbItems, footItems,
  });

  const banner = '<!-- 생성물이다. 이 파일을 고치지 말 것.\n' +
    `     소스: src/sub/pages/${file} + src/sub/{layout.html,partials,css,js,nav.json}\n` +
    '     빌드: npm run build:pages -->\n';

  return { out: join(ROOT, fm.slug + '.html'), html: banner + html, slug: fm.slug };
}

const files = readdirSync(join(SUB, 'pages')).filter((f) => f.endsWith('.html')).sort();
let stale = 0;
for (const f of files) {
  const { out, html, slug } = build(f);
  const prev = existsSync(out) ? readFileSync(out, 'utf8') : null;
  if (CHECK) {
    if (prev !== html) { stale++; console.log(`  ✗ ${slug}.html 이 소스와 다르다`); }
    continue;
  }
  if (prev === html) { console.log(`  = ${slug}.html (변화 없음)`); continue; }
  writeFileSync(out, html);
  console.log(`  → ${slug}.html (${(html.length / 1024).toFixed(1)} KB)`);
}
if (CHECK) {
  console.log(stale ? `  ${stale}개 생성물이 낡았다 — npm run build:pages 를 돌려라` : '  생성물 최신 상태');
  process.exit(stale ? 1 : 0);
}
console.log(`  서브페이지 ${files.length}개 빌드 완료`);

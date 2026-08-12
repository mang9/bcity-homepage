#!/usr/bin/env node
/**
 * 서브페이지 클래스 정합성 검사 — 페이지마다 **그 페이지가 실제로 싣는 CSS 번들**과
 * 마크업을 대조한다.
 *
 *   node tools/build/lint-classes.mjs          # 문제 있으면 exit 1
 *   node tools/build/lint-classes.mjs --dead   # 죽은 CSS 까지 함께 보고(정보용, exit 0)
 *
 * 왜 필요한가 —
 *   2026-08-07 에 두 번 났다.
 *     · page-location.css 를 다시 쓰면서 `.tr-cat` 정의가 통째로 빠져 라벨이
 *       스타일 없는 맨 문단으로 나갔다(눈으로만 봐서는 "간격이 이상하다"로 보인다).
 *     · company.html 이 `.tr-block` 을 쓰는데 그 정의는 page-location.css 에 있었다.
 *       company 는 그 파일을 싣지 않으므로 처음부터 적용된 적이 없다.
 *   **전역 검사로는 두 번째를 못 잡는다.** 어딘가에 정의는 존재하기 때문이다.
 *   그래서 front-matter 의 css 배열을 그대로 재현해 페이지별로 본다.
 *
 * 한계 — 정적 검사다. JS 가 만들어 붙이는 클래스는 IGNORE 에 등록해야 한다.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SUB = join(ROOT, 'src', 'sub');
const SHOW_DEAD = process.argv.includes('--dead');

// pages.mjs 의 CSS_COMMON 과 같아야 한다. 바뀌면 여기도 고칠 것.
const CSS_COMMON = ['00-tokens', '10-base', '20-gnb', '30-hero-lnb', '40-section', '80-footer', '90-motion'];

/** JS 가 classList 로 붙였다 떼는 상태 클래스. 마크업·JS 문자열 어디에도 안 보여서
 *  자동 수집이 안 되므로 여기 적는다. */
const JS_STATE = new Set(['is-on', 'in', 'is-solid', 'is-open']);

/** 안 쓰여도 남겨 두는 것 — 이유를 반드시 함께 적는다.
 *  이유 없이 늘리지 말 것. 늘어나면 "죽은 CSS 없음" 이라는 신호가 무의미해진다. */
const KEEP_UNUSED = new Map([
  ['st--live', '.st--plan(추진 중)의 짝. 표에 "운영 중" 배지를 되살릴 때 함께 필요하다'],
]);

const read = (...p) => readFileSync(join(...p), 'utf8');
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** CSS 파일들에서 클래스 선택자를 모은다 */
function definedIn(files) {
  const out = new Set();
  for (const f of files) {
    const css = stripComments(read(SUB, 'css', f + '.css'));
    // 선언 블록 안(속성값)은 보지 않는다 — content:".foo" 같은 문자열 오탐 방지
    const selectors = css.replace(/\{[^}]*\}/g, '{}');
    for (const m of selectors.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) out.add(m[1]);
  }
  return out;
}

/** 문자열에서 클래스 이름을 모은다.
 *  마크업의 class="…" 뿐 아니라 JS 가 쓰는 세 가지 형태도 함께 읽는다 —
 *  이걸 빼면 런타임에만 붙는 클래스가 죽은 CSS 로 오인된다(.lb 가 그랬다). */
function harvest(text, into) {
  const add = (s) => { for (const c of String(s).split(/\s+/)) if (c) into.set(c, (into.get(c) || 0) + 1); };
  for (const m of text.matchAll(/class="([^"]*)"/g)) add(m[1]);
  for (const m of text.matchAll(/\.className\s*=\s*['"]([^'"]*)['"]/g)) add(m[1]);
  for (const m of text.matchAll(/classList\.(?:add|toggle|remove)\(\s*['"]([^'"]*)['"]/g)) add(m[1]);
  for (const m of text.matchAll(/querySelector(?:All)?\(\s*['"]\.([\w-]+)/g)) add(m[1]);
  return into;
}

/** 마크업이 정적 HTML 에만 있는 게 아니다. 두 곳을 더 '사용'으로 친다.
 *   1) src/sub/js/*.js — 런타임에 innerHTML 로 그리는 것(.tm-route 등)
 *   2) tools/build/pages.mjs — 빌드가 데이터로부터 찍어내는 것(.pr-card 등)
 *  이 둘을 빼면 데이터가 비어 있는 동안 해당 CSS 가 전부 죽은 것으로 오인된다. */
const jsClasses = (() => {
  const out = new Map();
  for (const f of readdirSync(join(SUB, 'js')).filter((f) => f.endsWith('.js'))) {
    harvest(read(SUB, 'js', f), out);
  }
  harvest(readFileSync(join(ROOT, 'tools', 'build', 'pages.mjs'), 'utf8'), out);
  return out;
})();

/** 생성된 HTML 의 body 마크업에서 쓰이는 클래스를 모은다(<style>·<script> 제외) */
function usedIn(slug) {
  const html = read(ROOT, slug + '.html')
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    .replace(/<script>[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  return harvest(html, new Map());
}

/** 페이지 front-matter 에서 CSS 번들과 검사 대상 slug 목록을 읽는다.
 *  일반 페이지는 slug 하나, 상세 템플릿(_detail-*)은 그 접두어로 생성된 파일 전부다. */
function bundleOf(file) {
  const src = read(SUB, 'pages', file);
  const m = src.match(/^<!--build\s*([\s\S]*?)-->/);
  const fm = JSON.parse(m[1]);
  const files = [...CSS_COMMON, ...(fm.css || [])];
  if (fm.slug) return { slugs: [fm.slug], files };

  // 상세 템플릿 — <slugPrefix>-*.html 로 생성된 것들을 모두 본다
  if (!fm.slugPrefix) throw new Error(`${file}: front-matter 에 slug 도 slugPrefix 도 없다`);
  const re = new RegExp(`^${fm.slugPrefix}-.+\\.html$`);
  const slugs = readdirSync(ROOT).filter((f) => re.test(f)).map((f) => f.replace(/\.html$/, ''));
  return { slugs, files };
}

let problems = 0;
const deadPerFile = new Map();

for (const file of readdirSync(join(SUB, 'pages')).filter((f) => f.endsWith('.html')).sort()) {
  const { slugs, files } = bundleOf(file);
  const def = definedIn(files);
  for (const slug of slugs) {
    const use = usedIn(slug);
    const undef = [...use.keys()].filter((c) => !def.has(c) && !JS_STATE.has(c)).sort();
    if (!undef.length) continue;
    problems += undef.length;
    console.log(`  ✗ ${slug}.html — 번들(${files.join(', ')})에 정의 없는 클래스 ${undef.length}개`);
    for (const c of undef) console.log(`      .${c}`);
  }

  // 죽은 CSS 는 페이지별로 판단할 수 없다(다른 페이지가 쓸 수 있다) → 전역 집계 후 마지막에 본다
  for (const f of files) {
    if (!deadPerFile.has(f)) deadPerFile.set(f, definedIn([f]));
  }
}

// 전역 사용 집합 = 마크업 + JS 가 만들어 내는 것
const allUsed = new Set(jsClasses.keys());
for (const file of readdirSync(join(SUB, 'pages')).filter((f) => f.endsWith('.html'))) {
  for (const slug of bundleOf(file).slugs) {
    for (const c of usedIn(slug).keys()) allUsed.add(c);
  }
}

if (SHOW_DEAD) {
  console.log('\n  — 어느 페이지에서도 쓰이지 않는 클래스(죽은 CSS) —');
  let n = 0;
  for (const [f, set] of deadPerFile) {
    const dead = [...set]
      .filter((c) => !allUsed.has(c) && !JS_STATE.has(c) && !KEEP_UNUSED.has(c))
      .sort();
    if (!dead.length) continue;
    n += dead.length;
    console.log(`    ${f}.css: ${dead.map((c) => '.' + c).join(' ')}`);
  }
  if (!n) console.log('    없음');
  if (KEEP_UNUSED.size) {
    console.log('\n  — 의도적으로 남겨 둔 미사용 클래스 —');
    for (const [c, why] of KEEP_UNUSED) console.log(`    .${c} — ${why}`);
  }
}

if (problems) {
  console.log(`\n  ${problems}건 — 마크업이 쓰는데 그 페이지 CSS 번들에 정의가 없다.`);
  process.exit(1);
}
console.log('  클래스 정합성 OK — 모든 페이지의 마크업 클래스가 자기 번들에 정의돼 있다');

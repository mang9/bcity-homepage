#!/usr/bin/env node
/* 개발 인계용 상태 스냅숏 — 라이트박스 · 모달 · 호버처럼 **클릭해야 보이는 화면**을
   HTML 하나로 열 수 있게 만든다.
     node tools/build/dev-states.mjs <빌드된_디렉터리>

   왜 필요한가 (2026-09-03)
     저장소에 커밋되는 것은 배포 빌드라 홍보센터 목록이 비어 있고 상세 페이지가 0개다.
     개발 쪽에서 그 화면을 볼 수 없어 임의로 진행한 일이 있었다. 목록·상세는 샘플 빌드로
     해결되지만, **확대보기 · 재생 · 공문 보기 · 문의 모달 · 발행물 호버 오버레이**는
     JS 가 DOM 을 만들어서 파일을 열어도 닫힌 상태만 보인다.

   ⚠ 마크업을 베껴 쓰지 않는다. **사이트의 실제 JS 가 열어 준 다음**을 보여 주므로
     lightbox.js · contact.js 가 바뀌면 이 페이지도 저절로 따라온다.
     열림 상태를 손으로 적어 두면 그 순간부터 진짜 화면과 갈라진다.

   ⚠ 산출물은 **컨펌용 사이트에만** 올린다(review-sync.sh 가 스테이지에서 부른다).
     샘플 게시물이 섞여 있어 운영 사이트에 들어가면 안 된다. */

import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
if (!DIR || !fs.existsSync(path.join(DIR, 'index.html'))) {
  console.error('✗ 빌드된 디렉터리를 넘겨 주세요 (index.html 이 있는 곳)');
  process.exit(1);
}
const OUT = path.join(DIR, 'dev-states');

/* 상태마다 「어느 페이지에서 · 무엇을 하면 그 화면이 되나」.
   run 은 그 페이지에서 실행할 코드다. 사이트 JS 가 붙은 뒤에 돌아야 하므로
   load 이벤트 다음에 한 번 더 쉬어 준다(아래 wrap 참고). */
const STATES = [
  { name: 'notice-list', from: 'notice.html', label: '공지사항 목록',
    desc: '샘플 4건. 제목을 누르면 상세로 갑니다.' },
  { name: 'press-list', from: 'press.html', label: '언론보도 목록',
    desc: '샘플 12건 · 2쪽으로 나뉩니다. 목록 컨트롤은 SHOW_LIST_FILTERS 로 꺼 둔 상태입니다.' },
  { name: 'video-lightbox', from: 'video.html', label: '홍보영상 — 재생 (라이트박스 열림)',
    desc: '카드의 재생 버튼을 누른 다음입니다. 닫기는 X · 배경 클릭 · ESC.',
    run: `document.querySelector('[data-lb="video"]').click();` },
  { name: 'gallery-lightbox', from: 'gallery.html', label: '갤러리 — 확대보기 (라이트박스 열림)',
    desc: '사진을 누른 다음입니다. 캡션은 data-title 이 들어갑니다.',
    run: `document.querySelector('[data-lb="image"]').click();` },
  { name: 'publication-hover', from: 'publication.html', label: '발행물 — 표지 호버 오버레이',
    desc: '표지에 마우스를 올렸을 때 나오는 보기 · 내려받기입니다. 터치 기기에서는 항상 보입니다.',
    css: '.pub-ov{opacity:1!important;pointer-events:auto!important}' },
  { name: 'company-doc-lightbox', from: 'company.html', label: '사업주체 — 공문 [보기] (라이트박스 열림)',
    desc: '관련 공식 문서의 [보기] 를 누른 다음입니다. 갤러리와 같은 컴포넌트를 씁니다.',
    run: `document.querySelector('[data-lb="image"]').click();` },
  { name: 'contact-modal', from: 'about.html', label: '문의하기 모달 (열림)',
    desc: '메인과 서브페이지가 같은 파일을 씁니다(src/shared/contact-modal.html). 검증은 실제로 동작합니다.',
    run: `location.hash = 'contact'; dispatchEvent(new HashChangeEvent('hashchange'));` },
  { name: 'privacy-modal', from: 'about.html', label: '개인정보 이용약관 모달 (열림)',
    desc: '푸터의 약관 링크가 여는 화면입니다.',
    run: `location.hash = 'privacy'; dispatchEvent(new HashChangeEvent('hashchange'));` },
];

/* 상세 페이지는 데이터 1건마다 1쪽이 생기므로 목록에서 **실제로 만들어진 것**을 찾아 링크한다.
   이름을 여기 적어 두면 데이터가 바뀔 때 죽은 링크가 된다. */
const details = fs.readdirSync(DIR)
  .filter((f) => /^(notice|press)-[^/]+\.html$/.test(f))
  .sort();

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ⚠ `<base href="../">` 를 <head> 맨 앞에 넣는다. 이 파일은 한 단계 아래에 있으므로
     그게 없으면 CSS·이미지·링크가 전부 깨진다. 그리고 **다른 상대 참조보다 먼저** 와야 한다. */
const inject = (html, st) => {
  let out = html.replace(/<head([^>]*)>/i, `<head$1>\n  <base href="../" />`);
  if (st.css) {
    out = out.replace(/<\/head>/i, `  <style>/* dev-states: 강제 상태 */\n${st.css}</style>\n</head>`);
  }
  const banner = `  <div style="position:fixed;left:0;right:0;bottom:0;z-index:9999;`
    + `padding:8px 14px;background:#111;color:#fff;font:12.5px/1.5 system-ui;`
    + `display:flex;gap:12px;align-items:center;justify-content:space-between">`
    + `<span><b>개발 확인용 상태 스냅숏</b> — ${esc(st.label)}</span>`
    + `<a href="dev-states/index.html" style="color:#8ec5ff">← 상태 목록</a></div>\n`;
  /* ⚠ 자동 열기는 load **다음**에 돈다. lightbox.js · contact.js 가 로드 시점에
       트리거를 모으므로, 그보다 먼저 클릭하면 아무 일도 일어나지 않는다. */
  const script = st.run
    ? `  <script>addEventListener('load', function () { setTimeout(function () {\n`
      + `    try { ${st.run} } catch (e) { console.error('dev-states:', e); }\n`
      + `  }, 120); });</script>\n`
    : '';
  return out.replace(/<\/body>/i, banner + script + '</body>');
};

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

let made = 0;
for (const st of STATES) {
  const src = path.join(DIR, st.from);
  if (!fs.existsSync(src)) { console.log(`  ? 없음: ${st.from}`); continue; }
  fs.writeFileSync(path.join(OUT, `${st.name}.html`), inject(fs.readFileSync(src, 'utf8'), st));
  made++;
}

const row = (href, label, desc) =>
  `      <tr><td><a href="${esc(href)}">${esc(label)}</a></td><td>${esc(desc)}</td></tr>`;

fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>개발 확인용 상태 목록 · B-CITY</title>
<style>
  body { margin: 0; padding: 32px 20px 60px; background: #f4f8fe; color: #111;
    font: 14px/1.6 system-ui, -apple-system, sans-serif; }
  .w { max-width: 900px; margin: 0 auto; }
  h1 { margin: 0 0 6px; font-size: 22px; letter-spacing: -.02em; }
  h2 { margin: 34px 0 10px; font-size: 15px; }
  p.lede { margin: 0 0 4px; color: #5b6b82; }
  table { width: 100%; border-collapse: collapse; background: #fff;
    border: 1px solid #d8e3f2; border-radius: 12px; overflow: hidden; }
  th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e7eefa;
    vertical-align: top; }
  th { background: rgba(52,65,152,.075); font-size: 12.5px; }
  tr:last-child td { border-bottom: 0; }
  td:first-child { white-space: nowrap; font-weight: 700; }
  a { color: #2c3e91; }
  .note { margin-top: 26px; padding: 14px 16px; background: #fff;
    border: 1px solid #d8e3f2; border-left: 4px solid #2c3e91; border-radius: 8px;
    color: #5b6b82; font-size: 13px; }
  code { background: #eef2fb; padding: 1px 5px; border-radius: 4px; font-size: 12.5px; }
</style>
</head>
<body>
<div class="w">
  <h1>개발 확인용 상태 스냅숏</h1>
  <p class="lede">클릭해야 보이는 화면을 파일 하나로 열 수 있게 모아 둔 것입니다.</p>
  <p class="lede">각 페이지는 <b>사이트의 실제 JS 가 열어 준 상태</b>입니다 — 마크업을 베낀 것이 아니라
    <code>lightbox.js</code> · <code>contact.js</code> 가 바뀌면 이 화면도 따라옵니다.</p>

  <h2>상태</h2>
  <table>
    <thead><tr><th>화면</th><th>무엇인가</th></tr></thead>
    <tbody>
${STATES.filter((s) => fs.existsSync(path.join(OUT, `${s.name}.html`)))
    .map((s) => row(`${s.name}.html`, s.label, s.desc)).join('\n')}
    </tbody>
  </table>

  <h2>상세 페이지 ${details.length}쪽 — 데이터 1건마다 1쪽</h2>
  <table>
    <thead><tr><th>주소</th><th>비고</th></tr></thead>
    <tbody>
${details.map((f) => row(`../${f}`, f,
      f.startsWith('notice-') ? '공지사항 상세' : '언론보도 상세 (안에 원문 기사 링크)')).join('\n')}
    </tbody>
  </table>

  <div class="note">
    <b>이 폴더는 컨펌용 사이트에만 있습니다.</b> 운영 저장소에는 커밋하지 않습니다 —
    샘플 게시물이 섞여 있어서입니다. 직접 만들려면 운영 저장소에서
    <code>SHOW_SAMPLES=1 npm run build:pages</code> 로 굽고
    <code>node tools/build/dev-states.mjs .</code> 를 돌리세요.
    상세 페이지는 <code>&lt;종류&gt;-&lt;id&gt;.html</code> 규칙으로 생성되며,
    상세가 있는 종류는 <b>공지사항 · 언론보도 둘뿐</b>입니다(나머지는 라이트박스).
  </div>
</div>
</body>
</html>
`);

console.log(`  상태 ${made}개 · 상세 링크 ${details.length}쪽 → ${path.relative(process.cwd(), OUT) || OUT}/`);

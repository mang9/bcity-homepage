#!/usr/bin/env node
/**
 * 관리자 화면 빌더 — **디자인 인계용 정적 HTML** (기획서 slide 105~115 + 로그인 + 파트너사)
 *
 *   node tools/build/admin.mjs        → admin/*.html 14개 생성
 *
 * ⚠ **기능은 구현하지 않는다.** 저장·인증·업로드·예약 게시는 전부 서버가 필요하고,
 *   이 저장소는 GitHub Pages 정적 배포다(CLAUDE.md §11.3). 여기서 만드는 것은
 *   개발 쪽에 그대로 넘길 **화면과 필드 명세**다.
 *
 * ⚠ **공개 배포에 포함되지 않는다.** 출력 폴더 `admin/` 은 .gitignore 에 있다.
 *   로그인처럼 보이는 화면이 실서비스 도메인에 올라가면, 막는 것이 없는데도
 *   막힌 것처럼 보여 오히려 위험하다. 개발 인계는 파일로 전달한다.
 *
 * 화면 명세는 이 파일 하나에 모여 있다(SCREENS). 필드 타입 배지(INPUT · TEXT EDITOR …)는
 * 기획서 표기를 그대로 화면에 남긴 것이다 — 개발자가 읽을 대상이 그것이기 때문이다.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'admin');
const read = (...p) => readFileSync(join(ROOT, ...p), 'utf8');

const TOKENS = read('src', 'sub', 'css', '00-tokens.css');
const ADMIN = read('src', 'admin', 'css', 'admin.css');

/* 브랜드 심볼 — 파비콘과 같은 정본에서 패스만 가져온다(assets/favicon/favicon.svg) */
const SYMBOL = (() => {
  const svg = read('assets', 'favicon', 'favicon.svg');
  const vb = svg.match(/viewBox="([^"]+)"/)[1];
  const paths = svg.match(/<path[^>]+\/>/g).join('');
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}</svg>`;
})();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── 좌측 메뉴 — 기획서 slide 105 의 5개 + 파트너사(사용자 추가) ───────── */
/* `desc` 는 대시보드 타일의 숫자 아래 문구다.
   ⚠ 전에는 '등록된 게시물' · '기획서 외 · 추가 요청' 이었는데, 뒤엣것은 기획 메모라
   화면에서 읽을 말이 아니었다(2026-08-18 지적). 담당자가 타일만 보고 **지금 무엇을
   손봐야 하는지** 알 수 있는 문구로 바꿨다 — 공개 수와 손볼 거리를 함께 보여 준다. */
const NAV = [
  { key: 'dashboard', label: '대시보드', file: 'index.html' },
  { key: 'notice', label: '공지사항', file: 'notice.html', n: 12, desc: '공개 11 · 예약 1' },
  { key: 'press', label: '언론보도', file: 'press.html', n: 34, desc: '공개 33 · 비공개 1' },
  { key: 'video', label: '홍보영상', file: 'video.html', n: 8, desc: '공개 6 · 메인 노출 4 / 4' },
  { key: 'gallery', label: '갤러리', file: 'gallery.html', n: 26, desc: '공개 25 · 예약 1' },
  { key: 'publication', label: '발행물', file: 'publication.html', n: 5, desc: '공개 4 · 다운로드 허용 3' },
  { key: 'partner', label: '파트너사', file: 'partner.html', n: 9, desc: '공개 7 · 확정 전 2' },
];

/* ⚠ 상단 "DESIGN ONLY" 띠는 2026-08-18 지시로 제거했다.
   인계용이라는 표시는 화면이 아니라 admin/README.md 와 meta robots noindex 가 담당한다. */
function shell({ title, navKey, crumb, h1, body, actions = '', modal = MODALS }) {
  const nav = NAV.map((n) => {
    const on = n.key === navKey ? ' class="is-on"' : '';
    const badge = n.n ? `<em>${n.n}</em>` : '';
    return `        <a href="${n.file}"${on}>${esc(n.label)}${badge}</a>`;
  }).join('\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${esc(title)} · B-CITY 관리자</title>
<link rel="icon" href="../assets/favicon/favicon.svg" type="image/svg+xml" />
<style>
${TOKENS.trim()}

${ADMIN.trim()}
</style>
</head>
<body>
  <div class="ad-shell">
    <aside class="ad-side">
      <div class="ad-brand">
        ${SYMBOL}
        <div><span>B-CITY</span><i>ADMIN</i></div>
      </div>
      <nav class="ad-nav">
        <p class="ad-nav-h">홍보센터</p>
${nav}
      </nav>
    </aside>
    <div class="ad-main">
      <header class="ad-top">
        <p class="ad-crumb">관리자 <span aria-hidden="true">›</span> <b>${esc(crumb)}</b></p>
        <div class="ad-me"><span>홍보담당자</span><a class="ad-btn ad-btn--sm" href="login.html">로그아웃</a></div>
      </header>
      <main class="ad-body">
        <div class="ad-head">
          <div>
            <h1 class="ad-h1">${esc(h1)}</h1>
          </div>
          <div style="display:flex;gap:8px">${actions}</div>
        </div>
${body}
      </main>
    </div>
  </div>
${modal}
  <script>
    /* 토글만 실제로 동작한다. 저장은 하지 않는다 — 값이 어디로도 가지 않는다. */
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.ad-toggle');
      if (!t) return;
      var on = t.classList.toggle('is-on');
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  </script>
</body>
</html>
`;
}


const MODALS = `  <dialog id="delDlg" class="ad-dlg">
    <h3>삭제할까요?</h3>
    <p>삭제한 게시물은 목록에서 사라집니다. 되돌릴 수 있는지는 개발 시 정책이 필요합니다.</p>
    <div class="ad-dlg-f">
      <button type="button" class="ad-btn" onclick="this.closest('dialog').close()">취소</button>
      <button type="button" class="ad-btn ad-btn--primary" onclick="this.closest('dialog').close()">삭제</button>
    </div>
  </dialog>
  <dialog id="saveDlg" class="ad-dlg">
    <h3>임시 저장했습니다</h3>
    <p>작성 중인 내용을 임시 보관합니다. 목록에는 노출되지 않습니다.</p>
    <div class="ad-dlg-f">
      <button type="button" class="ad-btn ad-btn--primary" onclick="this.closest('dialog').close()">확인</button>
    </div>
  </dialog>`;

/* ── 조각 ─────────────────────────────────────────────────────────── */
const state = (k) => ({
  on: '<span class="ad-state ad-state--on">공개</span>',
  off: '<span class="ad-state ad-state--off">비공개</span>',
  wait: '<span class="ad-state ad-state--wait">예약</span>',
}[k]);

/* 목록 행의 [수정] 은 폼 화면으로 실제 이동하고, [삭제] 는 확인 모달을 띄운다.
   ⚠ 기능은 없다(2026-08-18 지시) — 화면 전환만 확인할 수 있게 한 것이다.
   삭제는 실행하지 않고 모달 형태만 보여 준다. 개발 시 확인 문구·되돌리기 정책 협의 필요. */
const rowActs = (slug) => '<div class="ad-acts">'
  + `<a class="ad-btn ad-btn--sm" href="${slug}-form.html">수정</a>`
  + '<button type="button" class="ad-btn ad-btn--sm ad-btn--danger" '
  + 'onclick="document.getElementById(\'delDlg\').showModal()">삭제</button></div>';

const pager = (n = 5) => '        <div class="ad-page">'
  + '<button type="button">‹</button>'
  + Array.from({ length: n }, (_, i) => `<button type="button"${i === 0 ? ' class="is-on"' : ''}>${i + 1}</button>`).join('')
  + '<button type="button">›</button></div>';

const chips = (arr) => '<div class="ad-chips">'
  + arr.map((c, i) => `<button type="button" class="ad-chip${i === 0 ? ' is-on' : ''}">${esc(c)}</button>`).join('')
  + '</div>';

const search = (ph) => `<div class="ad-search"><input type="search" placeholder="${esc(ph)}" />`
  + '<button type="button" class="ad-btn">검색</button></div>';

function table({ cols, rows }) {
  const th = cols.map((c) => `<th${c.cls ? ` class="${c.cls}"` : ''}>${esc(c.t)}</th>`).join('');
  const tb = rows.map((r) => '<tr>' + r.map((c, i) => {
    const cls = cols[i].cls ? ` class="${cols[i].cls}"` : '';
    return `<td${cls}>${c}</td>`;
  }).join('') + '</tr>').join('\n            ');
  return `        <div class="ad-card">
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr>${th}</tr></thead>
              <tbody>
            ${tb}
              </tbody>
            </table>
          </div>
${pager()}
        </div>`;
}

/** 폼 한 줄.
 *  ⚠ 전에는 컨트롤 위에 회색 배지로 필드 타입(INPUT · TEXT EDITOR …)을 찍었는데
 *  2026-08-18 지시로 화면에서 뺐다. **`type` 인자는 그대로 받는다** — 값이 사라지면
 *  개발 쪽에 넘길 근거가 없어지므로, 빌드 시 `admin/README.md` 의 필드 명세표로 나간다.
 *  화면에서 지웠다고 명세를 지운 것은 아니다. */
const FIELD_SPEC = [];
function field({ label, req, type, control, hint }) {
  FIELD_SPEC.push({ label, req: !!req, type, hint: hint || '' });
  return `          <div class="ad-row">
            <p class="ad-lb">${esc(label)}${req ? '<i>*</i>' : ''}</p>
            <div class="ad-fd">
              ${control}
              ${hint ? `<p class="ad-hint">${hint}</p>` : ''}
            </div>
          </div>`;
}

const input = (ph) => `<input class="ad-in" type="text" placeholder="${esc(ph)}" />`;
const sel = (opts) => `<select class="ad-sel">${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`;
const date = () => '<input class="ad-in" type="date" style="max-width:220px" />';
/* 토글은 실제로 눌린다(2026-08-18 지시). `<div>` 가 아니라 `<button aria-pressed>` 로
   내야 키보드·스크린리더에서도 상태가 읽힌다 — 상태 전환은 셸의 인라인 스크립트가 맡는다. */
const toggle = (on, t) => `<button type="button" class="ad-toggle${on ? ' is-on' : ''}"`
  + ` aria-pressed="${on ? 'true' : 'false'}"><span class="ad-toggle-t"></span><b>${esc(t)}</b></button>`;
const radios = (arr, openIdx) => `<div class="ad-radios">${arr.map((a, i) =>
  `<label><input type="radio" name="st${openIdx ?? ''}"${i === 0 ? ' checked' : ''} />${esc(a)}</label>`).join('')}</div>
              <div class="ad-when is-open"><input class="ad-in" type="date" style="max-width:200px" />
                <input class="ad-in" type="time" style="max-width:150px" /></div>`;

const editor = () => `<div class="ad-editor">
                <div class="ad-editor-bar">
                  <span>B</span><span>I</span><span>U</span><span>H2</span><span>H3</span>
                  <span>≡</span><span>•</span><span>1.</span><span>🔗</span><span>🖼</span><span>⤺</span><span>⤻</span>
                </div>
                <div class="ad-editor-area">본문을 입력하세요. 이미지 삽입 · 링크 · 표 지원.</div>
              </div>`;

const drop = (t, s) => `<div class="ad-drop"><b>${esc(t)}</b><span>${esc(s)}</span>
                <button type="button" class="ad-btn ad-btn--sm">파일 선택</button></div>`;

/* 용량은 파일명 **바로 옆**에 붙인다(2026-08-18 지시).
   전에는 flex 로 양끝에 밀려 파일명과 용량이 멀찍이 떨어져 짝이 안 읽혔다. */
const fileList = (arr) => `<ul class="ad-files">${arr.map((f) =>
  `<li><span class="ad-file-n">${esc(f[0])} <i>${esc(f[1])}</i></span>
    <button type="button" class="ad-btn ad-btn--sm ad-btn--danger">삭제</button></li>`).join('')}</ul>`;

const thumbs = (n) => `<div class="ad-thumbs">${Array.from({ length: n }, (_, i) =>
  `<div class="ad-thumb"><b>${i + 1}</b><i>드래그</i></div>`).join('')}</div>`;

/* slug: 목록 화면으로 돌아갈 대상. preview: 공개 사이트에서 미리 볼 페이지(새 창). */
const SPEC_BY_SCREEN = {};
function formCard({ title, fields, note, slug, preview }) {
  SPEC_BY_SCREEN[slug] = FIELD_SPEC.splice(0);
  return `        <div class="ad-card">
          <div class="ad-card-h"><h2>${esc(title)}</h2>
            <a class="ad-btn ad-btn--sm" href="${slug}.html">‹ 목록으로</a></div>
          <div class="ad-form">
${fields.join('\n')}
          </div>
          <div class="ad-foot">
            ${note ? `<p class="ad-note">${note}</p>` : ''}
            <button type="button" class="ad-btn" onclick="document.getElementById('saveDlg').showModal()">임시 저장</button>
            <a class="ad-btn" href="${preview}" target="_blank" rel="noopener">미리 보기</a>
            <a class="ad-btn ad-btn--primary" href="${slug}.html">게시</a>
          </div>
        </div>`;
}

const NEW_BTN = (t, href) => `<a class="ad-btn ad-btn--primary" href="${href}">+ ${esc(t)}</a>`;

/* ── 화면 ─────────────────────────────────────────────────────────── */
const pages = {};

/* 로그인 — 기획서에 명세가 없어 새로 설계했다(사용자 요청). */
pages['login.html'] = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>로그인 · B-CITY 관리자</title>
<link rel="icon" href="../assets/favicon/favicon.svg" type="image/svg+xml" />
<style>
${TOKENS.trim()}

${ADMIN.trim()}
</style>
</head>
<body>
  <div class="ad-login">
    <div class="ad-login-box">
      <div class="ad-login-brand">
        ${SYMBOL}
        <b>B-CITY 관리자</b>
        <span>PR CENTER ADMIN</span>
      </div>
      <form class="ad-login-f" onsubmit="return false">
        <label>아이디
          <input class="ad-in" type="text" autocomplete="username" placeholder="관리자 아이디" />
        </label>
        <label>비밀번호
          <input class="ad-in" type="password" autocomplete="current-password" placeholder="비밀번호" />
        </label>
        <div class="ad-login-opt">
          <label style="display:flex;gap:6px;align-items:center;font-weight:600">
            <input type="checkbox" /> 아이디 기억하기</label>
          <a href="#">비밀번호를 잊으셨나요?</a>
        </div>
        <a class="ad-btn ad-btn--primary" href="index.html">로그인</a>
      </form>
      <p class="ad-login-note">
        <b>이 화면은 시안입니다.</b> 인증은 서버에서 처리해야 합니다 —
        정적 호스팅에서는 클라이언트 검증이 소스만 열면 우회되므로,
        로그인·세션·권한은 개발 단계에서 백엔드로 구현해 주세요.
        비밀번호 정책 · 실패 횟수 제한 · 2단계 인증 여부는 별도 협의가 필요합니다.
      </p>
    </div>
  </div>
</body>
</html>
`;

/* 대시보드 — 기획서 slide 105(관리자 페이지 목차)를 화면으로 옮긴 것 */
pages['index.html'] = shell({
  title: '대시보드', navKey: 'dashboard', crumb: '대시보드', h1: '대시보드',
  body: `        <div class="ad-tiles">
${NAV.filter((n) => n.n).map((n) => `          <a class="ad-tile" href="${n.file}">
            <b>${esc(n.label)}</b><strong>${n.n}</strong>
            <span>${esc(n.desc)}</span></a>`).join('\n')}
        </div>
        <div class="ad-card" style="margin-top:18px">
          <div class="ad-card-h"><h2>최근 등록</h2>
            <a class="ad-btn ad-btn--sm" href="notice.html">전체 보기</a></div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th>구분</th><th class="is-title">제목</th><th>작성자</th><th>등록일</th><th class="is-ctr">상태</th></tr></thead>
              <tbody>
                <tr><td>공지사항</td><td class="is-title">B-CITY 공식 홈페이지 오픈</td><td>홍보담당자</td><td>2026.05.02</td><td class="is-ctr">${state('on')}</td></tr>
                <tr><td>언론보도</td><td class="is-title">춘천 기업혁신파크, 국토부 선도사업 선정</td><td>홍보담당자</td><td>2026.04.18</td><td class="is-ctr">${state('on')}</td></tr>
                <tr><td>발행물</td><td class="is-title">B-CITY 사업 소개 IM</td><td>홍보담당자</td><td>2026.07.16</td><td class="is-ctr">${state('on')}</td></tr>
                <tr><td>갤러리</td><td class="is-title">AI 데이터 클러스터 조감도</td><td>홍보담당자</td><td>2026.06.11</td><td class="is-ctr">${state('wait')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>`,
});

/* 공지사항 — slide 106 / 107 */
pages['notice.html'] = shell({
  title: '공지사항', navKey: 'notice', crumb: '공지사항', h1: '공지사항 관리',
  actions: NEW_BTN('공지사항 등록', 'notice-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '공지', '일반'])}${search('제목 · 내용 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th class="is-title">제목</th><th>작성자</th><th>등록일</th>
                <th class="is-num">조회수</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">4</td><td class="is-title"><span class="ad-pin">공지</span> 통합개발계획 접수 안내</td><td>홍보담당자</td><td>2026.07.02</td><td class="is-num">1,284</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('notice')}</td></tr>
                <tr><td class="is-num">3</td><td class="is-title">B-CITY 공식 홈페이지 오픈</td><td>홍보담당자</td><td>2026.05.02</td><td class="is-num">932</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('notice')}</td></tr>
                <tr><td class="is-num">2</td><td class="is-title">바이오테크이노밸리피에프브이㈜ 설립 완료</td><td>홍보담당자</td><td>2026.04.03</td><td class="is-num">610</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('notice')}</td></tr>
                <tr><td class="is-num">1</td><td class="is-title">하반기 사업 설명회 일정</td><td>홍보담당자</td><td>2026.03.20</td><td class="is-num">0</td><td class="is-ctr">${state('wait')}</td><td class="is-ctr">${rowActs('notice')}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['notice-form.html'] = shell({
  title: '공지사항 등록', navKey: 'notice', crumb: '공지사항 › 등록 / 수정',
  h1: '공지사항 등록 / 수정',
  body: formCard({
    title: '공지사항 등록 / 수정',
    slug: 'notice', preview: '../notice.html',
    note: '※ 예약을 고르면 날짜 · 시간 선택이 나타납니다.',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('공지 제목'), hint: '필수 · 최대 100자' }),
      field({ label: '내용', req: true, type: 'TEXT EDITOR', control: editor(), hint: '리치 텍스트 에디터 · 이미지 삽입 가능' }),
      field({ label: '첨부파일', type: 'FILE UPLOAD', control: drop('파일을 끌어다 놓으세요', '다중 첨부 · 파일당 최대 20MB')
        + fileList([['통합개발계획_요약.pdf', '2.4MB'], ['설명회_안내.hwp', '380KB']]),
        hint: '다중 첨부 · 파일당 최대 20MB' }),
      field({ label: '상단 고정', type: 'TOGGLE', control: toggle(true, '메인 상단에 고정'), hint: '목록 최상단에 [공지] 배지와 함께 노출됩니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 1) }),
    ],
  }),
});

/* 언론보도 — slide 108 / 109 */
pages['press.html'] = shell({
  title: '언론보도', navKey: 'press', crumb: '언론보도', h1: '언론보도 관리',
  actions: NEW_BTN('언론보도 등록', 'press-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체'])}
            ${sel(['언론사 전체', '강원일보', '파이낸셜뉴스', '한국경제', '연합뉴스'])}
            ${sel(['기간 전체', '최근 1개월', '최근 3개월', '직접 입력'])}
            ${search('제목 · 내용 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th class="is-title">제목</th><th>매체명</th><th>보도일자</th>
                <th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">34</td><td class="is-title">춘천 기업혁신파크, 국토부 선도사업 최종 선정</td><td>강원일보</td><td>2026.04.18</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('press')}</td></tr>
                <tr><td class="is-num">33</td><td class="is-title">더존비즈온, 춘천 AI 데이터센터 앵커기업 참여</td><td>파이낸셜뉴스</td><td>2026.04.02</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('press')}</td></tr>
                <tr><td class="is-num">32</td><td class="is-title">강원 바이오·헬스 초광역 경제권 구축 본격화</td><td>한국경제</td><td>2026.03.11</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('press')}</td></tr>
                <tr><td class="is-num">31</td><td class="is-title">기업혁신파크 토지거래허가구역 지정</td><td>연합뉴스</td><td>2026.02.27</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs('press')}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['press-form.html'] = shell({
  title: '언론보도 등록', navKey: 'press', crumb: '언론보도 › 등록 / 수정',
  h1: '언론보도 등록 / 수정',
  body: formCard({
    title: '언론보도 등록 / 수정',
    slug: 'press', preview: '../press.html',
    note: '※ 링크를 클릭하면 해당 기사 URL 로 이동합니다(새 창).',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('언론사 원문 제목'), hint: '필수 · 최대 200자' }),
      field({ label: '매체명', req: true, type: 'INPUT', control: input('예: 강원일보 · 파이낸셜뉴스'), hint: '목록의 매체명 필터에 그대로 쓰입니다.' }),
      field({ label: '보도일자', req: true, type: 'DATE PICKER', control: date(), hint: '원 기사 게재일' }),
      field({ label: '기사 링크', req: true, type: 'URL INPUT', control: '<input class="ad-in" type="url" placeholder="https://" />', hint: '언론사 웹사이트 URL · http(s):// 로 시작' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 2) }),
    ],
  }),
});

/* 홍보영상 — slide 110 / 111 */
pages['video.html'] = shell({
  title: '홍보영상', navKey: 'video', crumb: '홍보영상', h1: '홍보영상 관리',
  actions: NEW_BTN('홍보영상 등록', 'video-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '메인 노출'])}${search('제목 검색')}</div>
          <div class="ad-card-b">
            <div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
${['B-CITY 브랜드 필름', 'AI 데이터 클러스터', '첨단 바이오 클러스터', '골프레저 콤플렉스', '사업 설명 영상', '조감도 투어']
  .map((t, i) => `              <div>
                <div class="ad-thumb" style="aspect-ratio:16/9"><b>▶</b>${i < 4 ? '<i>메인</i>' : ''}</div>
                <p style="margin:8px 0 2px;font-size:13px;font-weight:700">${esc(t)}</p>
                <p style="margin:0;font-size:12px;color:var(--color-text-muted)">2026.0${6 - (i % 5)}.1${i} · ${i < 4 ? state('on') : state('off')}</p>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <a class="ad-btn ad-btn--sm" href="video-form.html">수정</a>
                  <button type="button" class="ad-btn ad-btn--sm ad-btn--danger" onclick="document.getElementById('delDlg').showModal()">삭제</button></div>
              </div>`).join('\n')}
            </div>
          </div>
${pager(3)}
        </div>`,
});

pages['video-form.html'] = shell({
  title: '홍보영상 등록', navKey: 'video', crumb: '홍보영상 › 등록 / 수정',
  h1: '홍보영상 등록 / 수정',
  body: formCard({
    title: '홍보영상 등록 / 수정',
    slug: 'video', preview: '../video.html',
    note: '※ 메인 노출은 최대 4편까지 지정할 수 있습니다.',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('영상 대표 제목'), hint: '카드 썸네일 아래 노출' }),
      field({ label: '영상 소스', req: true, type: 'SELECT + URL',
        control: `<div style="display:flex;gap:8px;flex-wrap:wrap">${sel(['YouTube', '직접 업로드'])}
                <input class="ad-in" type="url" placeholder="https://www.youtube.com/watch?v=" style="flex:1;min-width:220px" /></div>`,
        hint: 'YouTube 링크 · 썸네일은 링크에서 자동 추출' }),
      field({ label: '메인 노출', type: 'TOGGLE', control: toggle(true, '홈페이지 메인 영상으로 지정'), hint: '4편까지 노출 · 초과 지정 시 경고' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 3) }),
    ],
  }),
});

/* 갤러리 — slide 112 / 113 */
pages['gallery.html'] = shell({
  title: '갤러리', navKey: 'gallery', crumb: '갤러리', h1: '갤러리 관리',
  actions: NEW_BTN('갤러리 등록', 'gallery-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '행사', '현장', '조감도', '기타'])}${search('제목 검색')}</div>
          <div class="ad-card-b">
            <div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
${[['AI 데이터 클러스터 조감도', '조감도'], ['착공식 현장', '행사'], ['부지 항공 촬영', '현장'],
   ['비즈니스 콤플렉스 조감도', '조감도'], ['업무협약 체결', '행사'], ['골프레저 조감도', '조감도']]
  .map(([t, c], i) => `              <div>
                <div class="ad-thumb"><b>${esc(c)}</b><i>${3 + i}장</i></div>
                <p style="margin:8px 0 2px;font-size:13px;font-weight:700">${esc(t)}</p>
                <p style="margin:0;font-size:12px;color:var(--color-text-muted)">2026.06.1${i} · ${i === 5 ? state('wait') : state('on')}</p>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <a class="ad-btn ad-btn--sm" href="gallery-form.html">수정</a>
                  <button type="button" class="ad-btn ad-btn--sm ad-btn--danger" onclick="document.getElementById('delDlg').showModal()">삭제</button></div>
              </div>`).join('\n')}
            </div>
          </div>
${pager(4)}
        </div>`,
});

pages['gallery-form.html'] = shell({
  title: '갤러리 등록', navKey: 'gallery', crumb: '갤러리 › 등록 / 수정',
  h1: '갤러리 등록 / 수정',
  body: formCard({
    title: '갤러리 등록 / 수정',
    slug: 'gallery', preview: '../gallery.html',
    note: '※ 다중 이미지 업로드 및 드래그로 순서를 조정합니다.',
    fields: [
      field({ label: '카테고리', req: true, type: 'SELECT', control: sel(['행사', '현장', '조감도', '기타']), hint: '행사 · 현장 · 조감도 · 기타 — 갤러리 분류 탭 기준' }),
      field({ label: '제목', req: true, type: 'INPUT', control: input('갤러리 앨범 제목'), hint: '앨범 단위 제목' }),
      field({ label: '대표 이미지', req: true, type: 'IMAGE UPLOAD',
        control: drop('썸네일 · 리스트 대표 이미지', '권장 1600×900 이상 · JPG · PNG · WebP')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))"><div class="ad-thumb"><b>대표</b></div></div>',
        hint: '권장 1600×900 이상 · JPG · PNG · WebP' }),
      field({ label: '이미지 업로드', req: true, type: 'MULTI UPLOAD',
        control: drop('여러 장을 한 번에 끌어다 놓으세요', '드래그 앤 드롭 · 순서 조정 가능') + thumbs(8),
        hint: '썸네일을 끌어 순서를 바꿉니다. 순서가 화면 노출 순서입니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 4) }),
    ],
  }),
});

/* 발행물 — slide 114 / 115 */
pages['publication.html'] = shell({
  title: '발행물', navKey: 'publication', crumb: '발행물', h1: '발행물 관리',
  actions: NEW_BTN('발행물 등록', 'publication-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', 'IM', '브로슈어', '리포트', '카달로그'])}${search('제목 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th>구분</th><th class="is-title">제목</th><th>파일</th>
                <th class="is-ctr">다운로드</th><th>등록일</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">5</td><td>IM</td><td class="is-title">B-CITY 사업 소개 IM</td><td>bcity-im.pdf · 12.4MB</td><td class="is-ctr">허용</td><td>2026.07.16</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('publication')}</td></tr>
                <tr><td class="is-num">4</td><td>카달로그</td><td class="is-title">춘천기업혁신파크 카달로그</td><td>catalog.pdf · 8.1MB</td><td class="is-ctr">허용</td><td>2026.06.30</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('publication')}</td></tr>
                <tr><td class="is-num">3</td><td>브로슈어</td><td class="is-title">투자 유치 브로슈어</td><td>brochure.pdf · 4.6MB</td><td class="is-ctr">미허용</td><td>2026.06.02</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('publication')}</td></tr>
                <tr><td class="is-num">2</td><td>리포트</td><td class="is-title">2026 상반기 사업 추진 리포트</td><td>report.pdf · 3.2MB</td><td class="is-ctr">허용</td><td>2026.05.20</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs('publication')}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['publication-form.html'] = shell({
  title: '발행물 등록', navKey: 'publication', crumb: '발행물 › 등록 / 수정',
  h1: '발행물 등록 / 수정',
  body: formCard({
    title: '발행물 등록 / 수정',
    slug: 'publication', preview: '../publication.html',
    note: '※ PDF 우선 · 파일당 최대 100MB.',
    fields: [
      field({ label: '발행물 구분', req: true, type: 'SELECT', control: sel(['IM', '브로슈어', '리포트', '카달로그']), hint: '표지 왼쪽 위 배지로 노출됩니다.' }),
      field({ label: '제목', req: true, type: 'INPUT', control: input('발행물 공식 제목'), hint: '목록에서 두 줄까지 노출됩니다.' }),
      field({ label: '표지 이미지', type: 'IMAGE UPLOAD',
        control: drop('발행물 표지 이미지', '권장 세로형 4:5 · 등록하지 않으면 기본 표지가 생성됩니다')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr))"><div class="ad-thumb" style="aspect-ratio:4/5"><b>표지</b></div></div>',
        hint: '권장 세로형 4:5 · 등록하지 않으면 기본 표지가 자동 생성됩니다.' }),
      field({ label: '파일 업로드', req: true, type: 'FILE UPLOAD',
        control: drop('PDF 파일을 끌어다 놓으세요', 'PDF 우선 · 최대 100MB')
          + fileList([['bcity-im.pdf', '12.4MB']]),
        hint: 'PDF 우선 · 파일당 최대 100MB' }),
      field({ label: '다운로드 허용', type: 'TOGGLE', control: toggle(true, '내려받기 허용'), hint: '끄면 [보기]만 노출되고 [다운로드] 버튼이 안 보입니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 5) }),
    ],
  }),
});

/* 파트너사 — **기획서에 없다.** 사용자 요청으로 추가(2026-08-18).
   현재 파트너 정보가 index.html 배열(푸터 5개)과 company.html 카드(13개)로 이원화돼 있어
   한쪽만 고치면 어긋난다. 관리 화면을 두면 단일 출처가 된다. */
pages['partner.html'] = shell({
  title: '파트너사', navKey: 'partner', crumb: '파트너사', h1: '파트너사 관리',
  actions: NEW_BTN('파트너사 등록', 'partner-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '앵커기업', '자산관리', '금융', '시공', '전략적 투자자', '공공'])}${search('상호 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-ctr">순서</th><th>분류</th><th class="is-title">상호</th><th>로고</th>
                <th class="is-num">지분율</th><th class="is-ctr">푸터 노출</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-ctr">⋮⋮ 1</td><td>앵커기업</td><td class="is-title">더존비즈온</td><td>partner-douzone.png</td><td class="is-num">37.3%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 2</td><td>자산관리</td><td class="is-title">바이오테크이노밸리자산관리 (AMC)</td><td>partner-amc.jpg</td><td class="is-num">0.2%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 3</td><td>공공</td><td class="is-title">강원특별자치도</td><td>partner-gangwon.svg</td><td class="is-num">4.9%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 4</td><td>공공</td><td class="is-title">춘천시</td><td>partner-chuncheon.svg</td><td class="is-num">4.9%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 5</td><td>금융</td><td class="is-title">IBK투자증권</td><td>partner-ibk.png</td><td class="is-num">5.0%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 6</td><td>시공</td><td class="is-title">부지조성공사 등 (TBD)</td><td>—</td><td class="is-num">—</td><td class="is-ctr">미노출</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 7</td><td>전략적 투자자</td><td class="is-title">에스에너지</td><td>partner-senergy.jpg</td><td class="is-num">—</td><td class="is-ctr">미노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('partner')}</td></tr>
              </tbody>
            </table>
          </div>
${pager(2)}
        </div>`,
});

pages['partner-form.html'] = shell({
  title: '파트너사 등록', navKey: 'partner', crumb: '파트너사 › 등록 / 수정',
  h1: '파트너사 등록 / 수정',
  body: formCard({
    title: '파트너사 등록 / 수정',
    slug: 'partner', preview: '../company.html',
    note: '※ 로고는 면적 기준으로 자동 정규화됩니다(높이만 맞추면 크기가 달라 보입니다).',
    fields: [
      field({ label: '분류', req: true, type: 'SELECT', control: sel(['앵커기업', '자산관리', '금융', '시공', '전략적 투자자', '공공']), hint: '사업주체 페이지의 파트너 그룹과 구조도 위치를 결정합니다.' }),
      field({ label: '상호', req: true, type: 'INPUT', control: input('정식 상호'), hint: '사업주체 페이지 카드와 구조도에 함께 쓰입니다.' }),
      field({ label: '영문 상호', type: 'INPUT', control: input('예: Douzone Bizon'), hint: 'EN 페이지 대비 · 선택 항목입니다.' }),
      field({ label: '로고', req: true, type: 'IMAGE UPLOAD',
        control: drop('로고 파일', '배경 투명 PNG · SVG 권장 · 여백은 자동 트리밍')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))"><div class="ad-thumb" style="aspect-ratio:16/9"><b>로고</b></div></div>',
        hint: '흰배경의 JPG 는 어두운 배경에서 흰 박스로 보입니다 — 투명 png 파일을 권장합니다.' }),
      field({ label: '지분율', type: 'INPUT', control: '<input class="ad-in" type="text" placeholder="예: 37.3" style="max-width:160px" />',
        hint: '비우면 구조도에 표기하지 않습니다. 확정 전이면 TBD 로 표시됩니다.' }),
      field({ label: '보조 설명', type: 'INPUT', control: input('예: 부지조성공사 등'), hint: '구조도 상호 아래 설명 부분입니다.' }),
      field({ label: '푸터 노출', type: 'TOGGLE', control: toggle(true, '메인 푸터 파트너 영역에 노출'), hint: '설정을 끄면 사업주체 페이지에만 노출됩니다.' }),
      field({ label: '정렬 순서', type: 'DRAG / NUMBER', control: '<input class="ad-in" type="number" value="1" style="max-width:120px" />',
        hint: '목록에서 행을 끌어 조정할 수도 있습니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.', control: radios(['공개', '비공개', '예약'], 6) }),
    ],
  }),
});

/* ── 출력 ─────────────────────────────────────────────────────────── */
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
let n = 0;
for (const [file, html] of Object.entries(pages)) {
  writeFileSync(join(OUT, file), html);
  console.log(`  → admin/${file} (${(html.length / 1024).toFixed(1)} KB)`);
  n++;
}
/* 필드 명세표 — 화면에서 뺀 타입 정보를 README 로 옮긴다(개발 인계용 근거) */
const LABEL = { notice: '공지사항', press: '언론보도', video: '홍보영상',
                gallery: '갤러리', publication: '발행물', partner: '파트너사' };
let spec = '\n## 필드 명세 (등록 / 수정 화면)\n\n'
  + '화면에는 컨트롤만 두고 타입 표기는 여기로 옮겼습니다. `*` 는 필수입니다.\n';
for (const [slug, rows] of Object.entries(SPEC_BY_SCREEN)) {
  spec += `\n### ${LABEL[slug] || slug} — \`${slug}-form.html\`\n\n`
    + '| 항목 | 타입 | 제약 · 비고 |\n|---|---|---|\n'
    + rows.map((r) => `| ${r.label}${r.req ? ' *' : ''} | \`${r.type}\` | ${r.hint.replace(/\|/g, '\\|') || '—'} |`).join('\n')
    + '\n';
}
const RM = join(OUT, 'README.md');
if (existsSync(RM)) {
  const cur = readFileSync(RM, 'utf8').split('\n## 필드 명세 (등록 / 수정 화면)')[0].replace(/\s*$/, '');
  writeFileSync(RM, cur + '\n' + spec);
  console.log('  → admin/README.md (필드 명세표 갱신)');
}

console.log(`\n  관리자 화면 ${n}개 생성 완료 — admin/login.html 부터 보세요.`);
console.log('  ⚠ 디자인 인계용입니다. 기능은 구현하지 않았고 admin/ 은 배포에서 제외됩니다.');

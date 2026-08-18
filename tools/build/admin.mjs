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
const NAV = [
  { key: 'dashboard', label: '대시보드', file: 'index.html' },
  { key: 'notice', label: '공지사항', file: 'notice.html', n: 12 },
  { key: 'press', label: '언론보도', file: 'press.html', n: 34 },
  { key: 'video', label: '홍보영상', file: 'video.html', n: 8 },
  { key: 'gallery', label: '갤러리', file: 'gallery.html', n: 26 },
  { key: 'publication', label: '발행물', file: 'publication.html', n: 5 },
  { key: 'partner', label: '파트너사', file: 'partner.html', n: 9, extra: true },
];

const FLAG = `  <div class="ad-flag">
    <b>DESIGN ONLY</b>
    <span>개발 인계용 화면 시안입니다. 저장 · 로그인 · 업로드는 동작하지 않습니다 (기획서 slide 105~115).</span>
  </div>`;

function shell({ title, navKey, crumb, h1, sub, body, actions = '' }) {
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
${FLAG}
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
        <div class="ad-me"><span>홍보담당자</span><button type="button" class="ad-btn ad-btn--sm">로그아웃</button></div>
      </header>
      <main class="ad-body">
        <div class="ad-head">
          <div>
            <h1 class="ad-h1">${esc(h1)}</h1>
            <p class="ad-sub">${sub}</p>
          </div>
          <div style="display:flex;gap:8px">${actions}</div>
        </div>
${body}
      </main>
    </div>
  </div>
</body>
</html>
`;
}

/* ── 조각 ─────────────────────────────────────────────────────────── */
const state = (k) => ({
  on: '<span class="ad-state ad-state--on">공개</span>',
  off: '<span class="ad-state ad-state--off">비공개</span>',
  wait: '<span class="ad-state ad-state--wait">예약</span>',
}[k]);

const rowActs = '<div class="ad-acts"><button type="button" class="ad-btn ad-btn--sm">수정</button>'
  + '<button type="button" class="ad-btn ad-btn--sm ad-btn--danger">삭제</button></div>';

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

/** 폼 한 줄 — 기획서의 필드 타입 표기를 배지로 그대로 남긴다 */
function field({ label, req, type, control, hint }) {
  return `          <div class="ad-row">
            <p class="ad-lb">${esc(label)}${req ? '<i>*</i>' : ''}</p>
            <div class="ad-fd">
              <span class="ad-type">${esc(type)}</span>
              ${control}
              ${hint ? `<p class="ad-hint">${hint}</p>` : ''}
            </div>
          </div>`;
}

const input = (ph) => `<input class="ad-in" type="text" placeholder="${esc(ph)}" />`;
const sel = (opts) => `<select class="ad-sel">${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`;
const date = () => '<input class="ad-in" type="date" style="max-width:220px" />';
const toggle = (on, t) => `<div class="ad-toggle${on ? ' is-on' : ''}"><span class="ad-toggle-t"></span><b>${esc(t)}</b></div>`;
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

const fileList = (arr) => `<ul class="ad-files">${arr.map((f) =>
  `<li><span>${esc(f[0])}</span><span style="color:var(--color-text-muted)">${esc(f[1])}</span>
    <button type="button" class="ad-btn ad-btn--sm ad-btn--danger">삭제</button></li>`).join('')}</ul>`;

const thumbs = (n) => `<div class="ad-thumbs">${Array.from({ length: n }, (_, i) =>
  `<div class="ad-thumb"><b>${i + 1}</b><i>드래그</i></div>`).join('')}</div>`;

function formCard({ title, fields, note }) {
  return `        <div class="ad-card">
          <div class="ad-card-h"><h2>${esc(title)}</h2>
            <button type="button" class="ad-btn ad-btn--sm">‹ 목록으로</button></div>
          <div class="ad-form">
${fields.join('\n')}
          </div>
          <div class="ad-foot">
            ${note ? `<p class="ad-note">${note}</p>` : ''}
            <button type="button" class="ad-btn">임시 저장</button>
            <button type="button" class="ad-btn">미리 보기</button>
            <button type="button" class="ad-btn ad-btn--primary">게시</button>
          </div>
        </div>`;
}

const NEW_BTN = (t) => `<button type="button" class="ad-btn ad-btn--primary">+ ${esc(t)}</button>`;

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
${FLAG}
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
        <button type="submit" class="ad-btn ad-btn--primary">로그인</button>
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
  sub: '홍보센터 콘텐츠를 등록 · 수정합니다.',
  body: `        <div class="ad-tiles">
${NAV.filter((n) => n.n).map((n) => `          <a class="ad-tile" href="${n.file}">
            <b>${esc(n.label)}</b><strong>${n.n}</strong>
            <span>${n.extra ? '기획서 외 · 추가 요청' : '등록된 게시물'}</span></a>`).join('\n')}
        </div>
        <div class="ad-card" style="margin-top:18px">
          <div class="ad-card-h"><h2>최근 등록</h2>
            <button type="button" class="ad-btn ad-btn--sm">전체 보기</button></div>
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
  sub: '기획서 slide 106 · 필터(전체 · 공지 · 일반) + 제목 · 내용 검색',
  actions: NEW_BTN('공지사항 등록'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '공지', '일반'])}${search('제목 · 내용 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th class="is-title">제목</th><th>작성자</th><th>등록일</th>
                <th class="is-num">조회수</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">4</td><td class="is-title"><span class="ad-pin">공지</span> 통합개발계획 접수 안내</td><td>홍보담당자</td><td>2026.07.02</td><td class="is-num">1,284</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">3</td><td class="is-title">B-CITY 공식 홈페이지 오픈</td><td>홍보담당자</td><td>2026.05.02</td><td class="is-num">932</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">2</td><td class="is-title">바이오테크이노밸리피에프브이㈜ 설립 완료</td><td>홍보담당자</td><td>2026.04.03</td><td class="is-num">610</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">1</td><td class="is-title">하반기 사업 설명회 일정</td><td>홍보담당자</td><td>2026.03.20</td><td class="is-num">0</td><td class="is-ctr">${state('wait')}</td><td class="is-ctr">${rowActs}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['notice-form.html'] = shell({
  title: '공지사항 등록', navKey: 'notice', crumb: '공지사항 › 등록 / 수정',
  h1: '공지사항 등록 / 수정', sub: '기획서 slide 107',
  body: formCard({
    title: '공지사항 등록 / 수정',
    note: '※ 예약을 고르면 날짜 · 시간 선택이 나타납니다.',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('공지 제목'), hint: '필수 · 최대 100자' }),
      field({ label: '내용', req: true, type: 'TEXT EDITOR', control: editor(), hint: '리치 텍스트 에디터 · 이미지 삽입 가능' }),
      field({ label: '첨부파일', type: 'FILE UPLOAD', control: drop('파일을 끌어다 놓으세요', '다중 첨부 · 파일당 최대 20MB')
        + fileList([['통합개발계획_요약.pdf', '2.4MB'], ['설명회_안내.hwp', '380KB']]) }),
      field({ label: '상단 고정', type: 'TOGGLE', control: toggle(true, '메인 상단에 고정'), hint: '목록 최상단에 [공지] 배지와 함께 노출됩니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 1) }),
    ],
  }),
});

/* 언론보도 — slide 108 / 109 */
pages['press.html'] = shell({
  title: '언론보도', navKey: 'press', crumb: '언론보도', h1: '언론보도 관리',
  sub: '기획서 slide 108 · 필터(전체 · 언론사별 · 기간별) + 제목 · 내용 검색',
  actions: NEW_BTN('언론보도 등록'),
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
                <tr><td class="is-num">34</td><td class="is-title">춘천 기업혁신파크, 국토부 선도사업 최종 선정</td><td>강원일보</td><td>2026.04.18</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">33</td><td class="is-title">더존비즈온, 춘천 AI 데이터센터 앵커기업 참여</td><td>파이낸셜뉴스</td><td>2026.04.02</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">32</td><td class="is-title">강원 바이오·헬스 초광역 경제권 구축 본격화</td><td>한국경제</td><td>2026.03.11</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">31</td><td class="is-title">기업혁신파크 토지거래허가구역 지정</td><td>연합뉴스</td><td>2026.02.27</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['press-form.html'] = shell({
  title: '언론보도 등록', navKey: 'press', crumb: '언론보도 › 등록 / 수정',
  h1: '언론보도 등록 / 수정', sub: '기획서 slide 109',
  body: formCard({
    title: '언론보도 등록 / 수정',
    note: '※ 링크를 클릭하면 해당 기사 URL 로 이동합니다(새 창).',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('언론사 원문 제목'), hint: '필수 · 최대 200자' }),
      field({ label: '매체명', req: true, type: 'INPUT', control: input('예: 강원일보 · 파이낸셜뉴스') }),
      field({ label: '보도일자', req: true, type: 'DATE PICKER', control: date(), hint: '원 기사 게재일' }),
      field({ label: '기사 링크', req: true, type: 'URL INPUT', control: '<input class="ad-in" type="url" placeholder="https://" />', hint: '언론사 웹사이트 URL · http(s):// 로 시작' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 2) }),
    ],
  }),
});

/* 홍보영상 — slide 110 / 111 */
pages['video.html'] = shell({
  title: '홍보영상', navKey: 'video', crumb: '홍보영상', h1: '홍보영상 관리',
  sub: '기획서 slide 110 · 썸네일 이미지로 노출',
  actions: NEW_BTN('홍보영상 등록'),
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
                  <button type="button" class="ad-btn ad-btn--sm">수정</button>
                  <button type="button" class="ad-btn ad-btn--sm ad-btn--danger">삭제</button></div>
              </div>`).join('\n')}
            </div>
          </div>
${pager(3)}
        </div>`,
});

pages['video-form.html'] = shell({
  title: '홍보영상 등록', navKey: 'video', crumb: '홍보영상 › 등록 / 수정',
  h1: '홍보영상 등록 / 수정', sub: '기획서 slide 111',
  body: formCard({
    title: '홍보영상 등록 / 수정',
    note: '※ 메인 노출은 최대 4편까지 지정할 수 있습니다.',
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('영상 대표 제목') }),
      field({ label: '영상 소스', req: true, type: 'SELECT + URL',
        control: `<div style="display:flex;gap:8px;flex-wrap:wrap">${sel(['YouTube', '직접 업로드'])}
                <input class="ad-in" type="url" placeholder="https://www.youtube.com/watch?v=" style="flex:1;min-width:220px" /></div>`,
        hint: 'YouTube 링크 · 썸네일은 링크에서 자동 추출' }),
      field({ label: '메인 노출', type: 'TOGGLE', control: toggle(true, '홈페이지 메인 영상으로 지정'), hint: '4편까지 노출 · 초과 지정 시 경고' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 3) }),
    ],
  }),
});

/* 갤러리 — slide 112 / 113 */
pages['gallery.html'] = shell({
  title: '갤러리', navKey: 'gallery', crumb: '갤러리', h1: '갤러리 관리',
  sub: '기획서 slide 112 · 카테고리별로 노출',
  actions: NEW_BTN('갤러리 등록'),
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
                  <button type="button" class="ad-btn ad-btn--sm">수정</button>
                  <button type="button" class="ad-btn ad-btn--sm ad-btn--danger">삭제</button></div>
              </div>`).join('\n')}
            </div>
          </div>
${pager(4)}
        </div>`,
});

pages['gallery-form.html'] = shell({
  title: '갤러리 등록', navKey: 'gallery', crumb: '갤러리 › 등록 / 수정',
  h1: '갤러리 등록 / 수정', sub: '기획서 slide 113',
  body: formCard({
    title: '갤러리 등록 / 수정',
    note: '※ 다중 이미지 업로드 및 드래그로 순서를 조정합니다.',
    fields: [
      field({ label: '카테고리', req: true, type: 'SELECT', control: sel(['행사', '현장', '조감도', '기타']) }),
      field({ label: '제목', req: true, type: 'INPUT', control: input('갤러리 앨범 제목') }),
      field({ label: '대표 이미지', req: true, type: 'IMAGE UPLOAD',
        control: drop('썸네일 · 리스트 대표 이미지', '권장 1600×900 이상 · JPG · PNG · WebP')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))"><div class="ad-thumb"><b>대표</b></div></div>' }),
      field({ label: '이미지 업로드', req: true, type: 'MULTI UPLOAD',
        control: drop('여러 장을 한 번에 끌어다 놓으세요', '드래그 앤 드롭 · 순서 조정 가능') + thumbs(8),
        hint: '썸네일을 끌어 순서를 바꿉니다. 순서가 화면 노출 순서입니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 4) }),
    ],
  }),
});

/* 발행물 — slide 114 / 115 */
pages['publication.html'] = shell({
  title: '발행물', navKey: 'publication', crumb: '발행물', h1: '발행물 관리',
  sub: '기획서 slide 114 · 구분 배지 + 표지 이미지로 노출',
  actions: NEW_BTN('발행물 등록'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', 'IM', '브로슈어', '리포트', '카달로그'])}${search('제목 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th>구분</th><th class="is-title">제목</th><th>파일</th>
                <th class="is-ctr">다운로드</th><th>등록일</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">5</td><td>IM</td><td class="is-title">B-CITY 사업 소개 IM</td><td>bcity-im.pdf · 12.4MB</td><td class="is-ctr">허용</td><td>2026.07.16</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">4</td><td>카달로그</td><td class="is-title">춘천기업혁신파크 카달로그</td><td>catalog.pdf · 8.1MB</td><td class="is-ctr">허용</td><td>2026.06.30</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">3</td><td>브로슈어</td><td class="is-title">투자 유치 브로슈어</td><td>brochure.pdf · 4.6MB</td><td class="is-ctr">미허용</td><td>2026.06.02</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-num">2</td><td>리포트</td><td class="is-title">2026 상반기 사업 추진 리포트</td><td>report.pdf · 3.2MB</td><td class="is-ctr">허용</td><td>2026.05.20</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs}</td></tr>
              </tbody>
            </table>
          </div>
${pager()}
        </div>`,
});

pages['publication-form.html'] = shell({
  title: '발행물 등록', navKey: 'publication', crumb: '발행물 › 등록 / 수정',
  h1: '발행물 등록 / 수정', sub: '기획서 slide 115',
  body: formCard({
    title: '발행물 등록 / 수정',
    note: '※ PDF 우선 · 파일당 최대 100MB.',
    fields: [
      field({ label: '발행물 구분', req: true, type: 'SELECT', control: sel(['IM', '브로슈어', '리포트', '카달로그']) }),
      field({ label: '제목', req: true, type: 'INPUT', control: input('발행물 공식 제목') }),
      field({ label: '표지 이미지', type: 'IMAGE UPLOAD',
        control: drop('발행물 표지 이미지', '권장 세로형 4:5 · 비우면 기본 표지가 생성됩니다')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr))"><div class="ad-thumb" style="aspect-ratio:4/5"><b>표지</b></div></div>' }),
      field({ label: '파일 업로드', req: true, type: 'FILE UPLOAD',
        control: drop('PDF 파일을 끌어다 놓으세요', 'PDF 우선 · 최대 100MB')
          + fileList([['bcity-im.pdf', '12.4MB']]) }),
      field({ label: '다운로드 허용', type: 'TOGGLE', control: toggle(true, '내려받기 허용'), hint: '끄면 [보기]만 노출되고 [다운로드] 버튼이 숨습니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 5) }),
    ],
  }),
});

/* 파트너사 — **기획서에 없다.** 사용자 요청으로 추가(2026-08-18).
   현재 파트너 정보가 index.html 배열(푸터 5개)과 company.html 카드(13개)로 이원화돼 있어
   한쪽만 고치면 어긋난다. 관리 화면을 두면 단일 출처가 된다. */
pages['partner.html'] = shell({
  title: '파트너사', navKey: 'partner', crumb: '파트너사', h1: '파트너사 관리',
  sub: '기획서 외 · 추가 요청 — 지금은 메인 푸터(5개)와 사업주체 카드(13개)로 이원화돼 있습니다',
  actions: NEW_BTN('파트너사 등록'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', '앵커기업', '자산관리', '금융', '시공', '전략적 투자자', '공공'])}${search('상호 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-ctr">순서</th><th>분류</th><th class="is-title">상호</th><th>로고</th>
                <th class="is-num">지분율</th><th class="is-ctr">푸터 노출</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-ctr">⋮⋮ 1</td><td>앵커기업</td><td class="is-title">더존비즈온</td><td>partner-douzone.png</td><td class="is-num">37.3%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 2</td><td>자산관리</td><td class="is-title">바이오테크이노밸리자산관리 (AMC)</td><td>partner-amc.jpg</td><td class="is-num">0.2%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 3</td><td>공공</td><td class="is-title">강원특별자치도</td><td>partner-gangwon.svg</td><td class="is-num">4.9%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 4</td><td>공공</td><td class="is-title">춘천시</td><td>partner-chuncheon.svg</td><td class="is-num">4.9%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 5</td><td>금융</td><td class="is-title">IBK투자증권</td><td>partner-ibk.png</td><td class="is-num">5.0%</td><td class="is-ctr">노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 6</td><td>시공</td><td class="is-title">부지조성공사 등 (TBD)</td><td>—</td><td class="is-num">—</td><td class="is-ctr">미노출</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs}</td></tr>
                <tr><td class="is-ctr">⋮⋮ 7</td><td>전략적 투자자</td><td class="is-title">에스에너지</td><td>partner-senergy.jpg</td><td class="is-num">—</td><td class="is-ctr">미노출</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs}</td></tr>
              </tbody>
            </table>
          </div>
${pager(2)}
        </div>`,
});

pages['partner-form.html'] = shell({
  title: '파트너사 등록', navKey: 'partner', crumb: '파트너사 › 등록 / 수정',
  h1: '파트너사 등록 / 수정', sub: '기획서 외 · 추가 요청',
  body: formCard({
    title: '파트너사 등록 / 수정',
    note: '※ 로고는 면적 기준으로 자동 정규화됩니다(높이만 맞추면 크기가 달라 보입니다).',
    fields: [
      field({ label: '분류', req: true, type: 'SELECT', control: sel(['앵커기업', '자산관리', '금융', '시공', '전략적 투자자', '공공']) }),
      field({ label: '상호', req: true, type: 'INPUT', control: input('정식 상호'), hint: '사업주체 페이지 카드와 구조도에 함께 쓰입니다.' }),
      field({ label: '영문 상호', type: 'INPUT', control: input('예: Douzone Bizon') }),
      field({ label: '로고', req: true, type: 'IMAGE UPLOAD',
        control: drop('로고 파일', '배경 투명 PNG · SVG 권장 · 여백은 자동 트리밍')
          + '<div class="ad-thumbs" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))"><div class="ad-thumb" style="aspect-ratio:16/9"><b>로고</b></div></div>',
        hint: '흰 배경이 박힌 JPG 는 어두운 면에서 흰 박스로 보입니다 — 알파 채널 파일을 권장합니다.' }),
      field({ label: '지분율', type: 'INPUT', control: '<input class="ad-in" type="text" placeholder="예: 37.3" style="max-width:160px" />',
        hint: '비우면 구조도에 표기하지 않습니다. 확정 전이면 TBD 로 표시됩니다.' }),
      field({ label: '보조 설명', type: 'INPUT', control: input('예: 부지조성공사 등'), hint: '구조도 노드에 상호 아래 작게 붙습니다.' }),
      field({ label: '푸터 노출', type: 'TOGGLE', control: toggle(true, '메인 푸터 파트너 띠에 노출'), hint: '끄면 사업주체 페이지에만 노출됩니다.' }),
      field({ label: '정렬 순서', type: 'DRAG / NUMBER', control: '<input class="ad-in" type="number" value="1" style="max-width:120px" />',
        hint: '목록에서 행을 끌어 조정할 수도 있습니다.' }),
      field({ label: '게시 상태', req: true, type: 'RADIO BUTTONS', control: radios(['공개', '비공개', '예약'], 6) }),
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
console.log(`\n  관리자 화면 ${n}개 생성 완료 — admin/login.html 부터 보세요.`);
console.log('  ⚠ 디자인 인계용입니다. 기능은 구현하지 않았고 admin/ 은 배포에서 제외됩니다.');

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

/* 로고 — **심볼만이 아니라 글자까지 있는 정본**을 쓴다(2026-08-18 지시).
   출처는 `assets/logo/bcity-logo.svg`(2518×421 · 패스 7개)이며, 사용자가 보내 준
   `B·CITY Logo.svg` 와 패스·색·viewBox 가 완전히 같아 파일을 새로 넣지 않았다.

   ⚠ **두 벌이 필요하다.** 워드마크 글자색 `#2C3E91` 은 네이비 사이드바(`#002742`) 위에서
     대비 **1.61** 로 사실상 보이지 않는다(실측). 사이드바에는 글자를 흰색으로 바꾼
     리버스 변형을 쓰고, 흰 면인 로그인 상자에는 원본 색을 그대로 쓴다.
     심볼 두 색(민트 6.73 · 애저 4.60)은 네이비 위에서도 충분하므로 건드리지 않는다. */
const LOGO_SRC = read('assets', 'logo', 'bcity-logo.svg');
const logo = (reverse) => {
  const vb = LOGO_SRC.match(/viewBox="([^"]+)"/)[1];
  let paths = LOGO_SRC.match(/<path[^>]+\/>/g).join('');
  if (reverse) paths = paths.replace(/fill="#2C3E91"/gi, 'fill="#ffffff"');
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" `
    + `aria-label="B-CITY">${paths}</svg>`;
};
const LOGO_DARK = logo(true);    // 네이비 사이드바용
const LOGO_LIGHT = logo(false);  // 흰 면(로그인)용

/* 개발 쪽에 확인·협의가 필요한 내용은 **화면에 쓰지 않는다**(2026-08-18 지시).
   운영자가 읽을 기능 설명과 섞이면 화면 문구인지 개발 메모인지 구분되지 않는다.
   대신 HTML 주석으로 남긴다 — 소스를 여는 개발자에게는 그대로 보인다.
   예외: 로그인 화면의 보안 권장안 패널은 화면에 그대로 둔다(지시). */
const dev = (t) => `<!-- DEV: ${String(t).replace(/--+>/g, '- ->')} -->`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── 좌측 메뉴 — 기획서 slide 105 의 5개 + 파트너사(사용자 추가) ───────── */
/* `desc` 는 대시보드 타일의 숫자 아래 문구다.
   ⚠ 전에는 '등록된 게시물' · '기획서 외 · 추가 요청' 이었는데, 뒤엣것은 기획 메모라
   화면에서 읽을 말이 아니었다(2026-08-18 지적). 담당자가 타일만 보고 **지금 무엇을
   손봐야 하는지** 알 수 있는 문구로 바꿨다 — 공개 수와 손볼 거리를 함께 보여 준다. */
/* `group` 으로 좌측 메뉴를 나눈다.
   ⚠ **파트너사는 홍보센터가 아니다**(2026-08-18 지적). 홍보센터는 게시물(공지·언론·영상·
     갤러리·발행물)이고, 파트너사는 **사업주체 페이지와 메인 푸터에 들어가는 사이트 콘텐츠**다.
     '사이트 콘텐츠' 그룹은 앞으로 관리로 옮길 항목(구조도 지분율 · 공식문서 목록 ·
     추진일정 · 권역 면적 · KPI)이 들어갈 자리이기도 하다.
   계정 관리도 콘텐츠가 아니라 설정이라 따로 둔다. */
const NAV = [
  { key: 'dashboard', label: '대시보드', file: 'index.html', group: '' },
  { key: 'notice', label: '공지사항', file: 'notice.html', n: 12, desc: '공개 11 · 예약 1', group: '홍보센터' },
  { key: 'press', label: '언론보도', file: 'press.html', n: 34, desc: '공개 33 · 비공개 1', group: '홍보센터' },
  { key: 'video', label: '홍보영상', file: 'video.html', n: 8, desc: '공개 6 · 메인 노출 4 / 4', group: '홍보센터' },
  { key: 'gallery', label: '갤러리', file: 'gallery.html', n: 26, desc: '공개 25 · 예약 1', group: '홍보센터' },
  { key: 'publication', label: '발행물', file: 'publication.html', n: 12, desc: '공개 11 · 다운로드 허용 9', group: '홍보센터' },
  { key: 'partner', label: '파트너사', file: 'partner.html', n: 9, desc: '공개 7 · 확정 전 2', group: '사이트 콘텐츠' },
  { key: 'account', label: '계정 관리', file: 'account.html', n: 4, desc: '활성 3 · 잠금 1', group: '설정' },
];

/* ⚠ 상단 "DESIGN ONLY" 띠는 2026-08-18 지시로 제거했다.
   인계용이라는 표시는 화면이 아니라 admin/README.md 와 meta robots noindex 가 담당한다. */
/* ⚠ 아래 반환값은 **템플릿 문자열**이다. 그 안의 <script> 를 쓸 때 이스케이프에 주의한다.
     · \d 는 출력에서 d 로 붕괴한다 — 비밀번호 '숫자 포함' 검사가 이 때문에 오작동했다
     · \1 은 8진 이스케이프로 취급돼 **빌드가 죽는다**
   실제로 둘 다 겪었다. 정규식은 이스케이프가 필요 없는 형태([0-9])로 쓰거나
   \\ 로 이중 이스케이프한다. 고친 뒤에는 반드시 **빌드 산출물**을 grep 해서 확인한다. */
function shell({ title, navKey, crumb, h1, body, actions = '', modal = MODALS }) {
  let last = null;
  const nav = NAV.map((n) => {
    const on = n.key === navKey ? ' class="is-on"' : '';
    const badge = n.n ? `<em>${n.n}</em>` : '';
    const head = n.group && n.group !== last ? `        <p class="ad-nav-h">${esc(n.group)}</p>\n` : '';
    last = n.group || last;
    return `${head}        <a href="${n.file}"${on}>${esc(n.label)}${badge}</a>`;
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
        <a class="ad-logo" href="index.html">${LOGO_DARK}</a>
        <span class="ad-tag">ADMIN</span>
      </div>
      <nav class="ad-nav">
${nav}
      </nav>
    </aside>
    <div class="ad-main">
      <header class="ad-top">
        <p class="ad-crumb">관리자 <span aria-hidden="true">›</span> <b>${esc(crumb)}</b></p>
        <div class="ad-me"><a class="ad-me-n" href="password.html">홍보담당자</a><a class="ad-btn ad-btn--sm" href="login.html">로그아웃</a></div>
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
${SCRIPTS}
</body>
</html>
`;
}


const MODALS = `  <dialog id="delDlg" class="ad-dlg">
    <h3>삭제할까요?</h3>
    <p>게시글과 목록에서 모두 삭제됩니다.</p>
    ${dev('삭제 정책 확인 — 소프트 삭제(휴지통) 여부 · 보관 기간 · 복구 권한 등급. 화면 문구는 복구 가능성을 단정하지 않는다.')}
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
  </dialog>
  <dialog id="pwDlg" class="ad-dlg">
    <h3>임시 비밀번호 발급</h3>
    <p>본인 메일로 보냈습니다. 첫 로그인에서 변경해야 합니다</p>
    ${dev('임시 비밀번호 확인 — 유효 기간(권장 24시간) · 발송 메일 문안 · 재발급 제한.')}
    <div class="ad-dlg-f">
      <button type="button" class="ad-btn ad-btn--primary" onclick="this.closest('dialog').close()">확인</button>
    </div>
  </dialog>`;

/* ── 화면 스크립트 ─────────────────────────────────────────────────────
   ⚠ **두 껍데기(shell · loginShell)가 함께 쓴다.** 전에는 shell() 안에만 있어서
     loginShell 로 만든 비밀번호 재설정 화면에서 규칙 검사가 돌지 않았다
     (2026-08-18 자체 검증에서 잡았다). 상수로 빼서 한 곳만 고치면 되게 한다.
   ⚠ 이 문자열은 **템플릿 리터럴 안**이다 — \d 는 d 로 붕괴하고 \1 은 빌드를 죽인다.
     정규식은 이스케이프가 필요 없는 형태([0-9])로 쓴다. */
const SCRIPTS = `  <script>
    /* 토글만 실제로 동작한다. 저장은 하지 않는다 — 값이 어디로도 가지 않는다. */
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.ad-toggle');
      if (!t) return;
      var on = t.classList.toggle('is-on');
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    /* 비밀번호 규칙·일치 검사 — 클라이언트만으로 되는 부분이라 실제로 동작시킨다.
       ⚠ **서버 검증을 대체하지 않는다.** 화면 검사는 개발자 도구로 우회할 수 있다. */
    (function () {
      var p1 = document.getElementById('pw1'), p2 = document.getElementById('pw2');
      if (!p1) return;
      var rules = document.getElementById('pwRules'), msg = document.getElementById('pwMatch');
      var check = {
        len: function (v) { return v.length >= 10; },
        mix: function (v) { return /[A-Za-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v); },
        seq: function (v) { return v.length > 0 && !/(.)\\1\\1/.test(v); }
      };
      function paint() {
        var v = p1.value;
        [].slice.call(rules.children).forEach(function (li) {
          var ok = check[li.dataset.rule](v);
          li.classList.toggle('is-ok', ok);
          li.classList.toggle('is-bad', !ok && v.length > 0);
        });
        if (!p2.value) { msg.textContent = '두 입력이 같아야 합니다.'; msg.className = 'ad-hint'; return; }
        var same = p1.value === p2.value;
        msg.textContent = same ? '두 입력이 같습니다.' : '두 입력이 다릅니다.';
        msg.className = 'ad-hint ' + (same ? 'is-ok' : 'is-bad');
      }
      p1.addEventListener('input', paint);
      p2.addEventListener('input', paint);
    })();

    /* 지분율 — '확정 전' 을 체크하면 숫자 입력을 잠근다.
       두 값이 동시에 채워지면 구조도에 무엇을 넣을지 정해지지 않는다. */
    (function () {
      var cb = document.getElementById('eqTbd'), eq = document.getElementById('eq');
      if (!cb || !eq) return;
      cb.addEventListener('change', function () {
        eq.disabled = cb.checked;
        if (cb.checked) eq.value = '';
        eq.placeholder = cb.checked ? 'TBD' : '37.3';
      });
    })();

    /* 파트너사 순서 재정렬 — 드래그앤드롭 + 키보드(위·아래 화살표).
       라이브러리 없이 HTML5 Drag and Drop 만 쓴다. 저장은 하지 않는다.
       ⚠ 드래그만 두면 키보드·터치 사용자가 순서를 못 바꾼다 → 화살표 이동을 함께 둔다.
       ⚠ 행을 옮긴 뒤 **순서 번호를 다시 매겨야** 한다. 안 하면 화면의 번호와 실제
         순서가 어긋나 어느 쪽이 맞는지 알 수 없다. */
    (function () {
      var tb = document.querySelector('[data-reorder] tbody');
      if (!tb) return;
      var dragging = null;

      function renumber() {
        [].slice.call(tb.rows).forEach(function (tr, i) {
          var b = tr.querySelector('.ad-ord');
          if (b) b.textContent = i + 1;
          var h = tr.querySelector('.ad-drag');
          if (h) h.setAttribute('aria-label',
            '순서 ' + (i + 1) + ' — 끌어서 옮기거나 위·아래 화살표를 누르세요');
        });
      }
      function flash(tr) {
        tr.classList.remove('is-moved');
        void tr.offsetWidth;              // 같은 행을 연속으로 옮길 때 애니메이션을 다시 걸기 위함
        tr.classList.add('is-moved');
      }

      tb.addEventListener('dragstart', function (e) {
        var h = e.target.closest('.ad-drag');
        if (!h) { e.preventDefault(); return; }
        dragging = h.closest('tr');
        dragging.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');   // Firefox 는 데이터가 없으면 드래그를 시작하지 않는다
      });
      tb.addEventListener('dragover', function (e) {
        if (!dragging) return;
        e.preventDefault();
        var tr = e.target.closest('tr');
        if (!tr || tr === dragging) return;
        [].slice.call(tb.rows).forEach(function (r) { r.classList.remove('is-over'); });
        tr.classList.add('is-over');
      });
      tb.addEventListener('drop', function (e) {
        if (!dragging) return;
        e.preventDefault();
        var tr = e.target.closest('tr');
        if (tr && tr !== dragging) {
          var rows = [].slice.call(tb.rows);
          // 아래로 옮길 때는 대상 **다음**에, 위로 옮길 때는 대상 **앞**에 넣는다
          tb.insertBefore(dragging, rows.indexOf(dragging) < rows.indexOf(tr) ? tr.nextSibling : tr);
          renumber(); flash(dragging);
        }
        [].slice.call(tb.rows).forEach(function (r) { r.classList.remove('is-over'); });
      });
      tb.addEventListener('dragend', function () {
        if (dragging) dragging.classList.remove('is-dragging');
        [].slice.call(tb.rows).forEach(function (r) { r.classList.remove('is-over'); });
        dragging = null;
      });

      tb.addEventListener('keydown', function (e) {
        var h = e.target.closest('.ad-drag');
        if (!h) return;
        var d = e.key === 'ArrowUp' ? -1 : (e.key === 'ArrowDown' ? 1 : 0);
        if (!d) return;
        e.preventDefault();
        var tr = h.closest('tr');
        var sib = d < 0 ? tr.previousElementSibling : tr.nextElementSibling;
        if (!sib) return;
        tb.insertBefore(d < 0 ? tr : sib, d < 0 ? sib : tr);
        renumber(); flash(tr);
        h.focus();                        // 옮긴 뒤에도 같은 손잡이에 초점을 유지한다
      });
    })();
  </script>`;

/* ── 조각 ─────────────────────────────────────────────────────────── */
const state = (k) => ({
  on: '<span class="ad-state ad-state--on">공개</span>',
  off: '<span class="ad-state ad-state--off">비공개</span>',
  wait: '<span class="ad-state ad-state--wait">예약</span>',
}[k]);

/* 표 본문 — 행을 손으로 쓰면 10행 × 5화면이 되어 읽기도 고치기도 어렵다(2026-08-18 감사).
   `cells` 배열과 열 정렬 클래스만 주면 헬퍼가 만든다. 목록 한 쪽은 **10행**이다(지시). */
const PAGE_ROWS = 10;

/* 파트너사 순서 셀 — 손잡이 + 순서 번호. 실제 재정렬은 셸의 스크립트가 한다(지시로 구현).
   ⚠ 손잡이를 `<button>` 으로 낸다. div 로 두면 키보드로 잡을 수 없어
     드래그밖에 방법이 없는 컨트롤이 된다(마우스 없이는 순서를 못 바꾼다). */
const drag = (n) => '<button type="button" class="ad-drag" draggable="true" '
  + `aria-label="순서 ${n} — 끌어서 옮기거나 위·아래 화살표를 누르세요">`
  + `<span aria-hidden="true">⋮⋮</span><b class="ad-ord">${n}</b></button>`;
const tbody = (rows, cls) => rows.map((r) =>
  '                <tr>' + r.map((c, i) => `<td${cls[i] ? ` class="${cls[i]}"` : ''}>${c}</td>`).join('') + '</tr>'
).join('\n');

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

/* ⚠ table({cols, rows}) 헬퍼가 있었지만 **한 번도 호출되지 않았다**(2026-08-18 감사).
   각 화면이 열 구성과 정렬이 달라 직접 만드는 편이 읽기 쉬웠다. 지웠다. */

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

/* 게시 상태 — 6개 폼이 **완전히 같은 필드**를 반복하고 있었다(2026-08-18 감사).
   문구를 한 번만 고치면 되도록 헬퍼로 묶는다. radios 의 name 만 화면마다 달라진다. */
const pubState = (i) => field({
  label: '게시 상태', req: true, type: 'RADIO BUTTONS',
  hint: '예약을 고르면 날짜 · 시간 선택이 나타납니다.',
  control: radios(['공개', '비공개', '예약'], i),
});

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
function formCard({ title, fields, note, slug, preview, dev: devNote }) {
  SPEC_BY_SCREEN[slug] = FIELD_SPEC.splice(0);
  return `        <div class="ad-card">
          <div class="ad-card-h"><h2>${esc(title)}</h2>
            <a class="ad-btn ad-btn--sm" href="${slug}.html">‹ 목록으로</a></div>
          <div class="ad-form">
${fields.join('\n')}
          </div>
          ${devNote ? dev(devNote) : ''}
          <div class="ad-foot">
            ${note ? `<p class="ad-note">${note}</p>` : ''}
            <button type="button" class="ad-btn" onclick="document.getElementById('saveDlg').showModal()">임시 저장</button>
            <a class="ad-btn" href="${preview}" target="_blank" rel="noopener">미리 보기</a>
            <a class="ad-btn ad-btn--primary" href="${slug}.html">게시</a>
          </div>
        </div>`;
}

const NEW_BTN = (t, href) => `<a class="ad-btn ad-btn--primary" href="${href}">+ ${esc(t)}</a>`;

/* 로그인 계열 화면(로그인 · 비밀번호 재설정)의 공통 껍데기.
   ⚠ 이전에는 로그인 화면 HTML 을 통째로 문자열로 갖고 있었다. 재설정 화면이 생기면서
     같은 <head>·배경·상자를 두 번 쓰게 되므로 헬퍼로 묶는다(중복 방지). */
function loginShell({ title, body, aside = '' }) {
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
  <div class="ad-login">
   <div class="ad-login-wrap${aside ? '' : ' is-single'}">
    <div class="ad-login-box">
      <div class="ad-login-brand">
        ${LOGO_LIGHT}
        <span>PR CENTER ADMIN</span>
      </div>
${body}
    </div>
${aside}
   </div>
  </div>
${SCRIPTS}
</body>
</html>
`;
}

/* ── 화면 ─────────────────────────────────────────────────────────── */
const pages = {};

/* 로그인 — 기획서에 명세가 없어 새로 설계했다(사용자 요청). */
pages['login.html'] = loginShell({
  title: '로그인',
  body: `      <form class="ad-login-f" onsubmit="return false">
        <label>아이디
          <input class="ad-in" type="text" autocomplete="username" placeholder="관리자 아이디" />
        </label>
        <label>비밀번호
          <input class="ad-in" type="password" autocomplete="current-password" placeholder="비밀번호" />
        </label>
        <div class="ad-login-opt">
          <label style="display:flex;gap:6px;align-items:center;font-weight:600">
            <input type="checkbox" /> 아이디 기억하기</label>
        </div>
        <a class="ad-btn ad-btn--primary" href="index.html">로그인</a>
      </form>
      <p class="ad-login-alt"><a href="password-reset.html">비밀번호를 잊으셨나요?</a></p>`,
  aside: `    <aside class="ad-login-note">
        <p class="ad-login-note-h">아래는 <b>권장안</b>입니다. 검토 후 확정해 주세요.</p>
        <dl class="ad-rec">
          <dt>비밀번호 정책</dt>
          <dd>10자 이상 · 영문 · 숫자 · 특수문자 조합 · 같은 문자 3회 반복 금지
            <i>비밀번호 변경 화면에 이 규칙으로 구현해 뒀습니다. 서버에서도 같은 규칙을 다시 검사해야 합니다.</i></dd>
          <dt>주기적 변경 강제</dt>
          <dd>두지 않음 <i>단, 비밀번호 유출 또는 계정 탈취 정황이 확인되면
            즉시 변경을 요구하고 기존 세션을 종료합니다.</i></dd>
          <dt>로그인 실패 제한</dt>
          <dd>5회 실패 시 10분 잠금 · 이후 시도마다 지연 증가
            <i>계정 잠금만 두면 남의 계정을 일부러 잠그는 공격이 가능하므로, IP 단위 지연을 함께 둡니다.</i></dd>
          <dt>2단계 인증</dt>
          <dd>최고관리자 <b>필수</b> · 편집자 선택 <i>인증 앱(TOTP) 기준. SMS 는 권장하지 않습니다.</i></dd>
          <dt>세션</dt>
          <dd>비활동 30분 만료 · 최대 12시간 <i>httpOnly · Secure · SameSite=Lax 쿠키.</i></dd>
          <dt>임시 비밀번호</dt>
          <dd>서버 생성 후 본인 메일 발송 · 24시간 유효 · 첫 로그인에서 변경 강제
            <i>화면에 표시하지 않습니다.</i></dd>
          <dt>감사 로그</dt>
          <dd>로그인 · 권한 변경 · 게시물 삭제 기록 <i>누가 · 언제 · 무엇을 · 어디서(IP).</i></dd>
      </dl>
    </aside>`,
});

/* 대시보드 — 기획서 slide 105(관리자 페이지 목차)를 화면으로 옮긴 것 */
pages['index.html'] = shell({
  title: '대시보드', navKey: 'dashboard', crumb: '대시보드', h1: '대시보드',
  /* 타일은 **한 줄에 6개**다(2026-08-18 지시 — 홍보센터 5 + 파트너사).
     그룹 머리글은 두지 않는다. 그룹 구분은 좌측 메뉴가 담당하고, 대시보드는 현황을
     한눈에 훑는 곳이라 줄을 나누면 오히려 보기 어렵다.
     ⚠ **설정(계정 관리)은 타일로 두지 않는다** — 콘텐츠 현황이 아니라 운영 설정이다. */
  body: `        <div class="ad-tiles" data-n="6">
${NAV.filter((n) => n.n && n.group !== '설정').map((n) => `          <a class="ad-tile" href="${n.file}">
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
${tbody([
                  ['12', '<span class="ad-pin">공지</span> 통합개발계획 접수 안내', '홍보담당자', '2026.07.02', '1,284', state('on'), rowActs('notice')],
                  ['11', '<span class="ad-pin">공지</span> 홈페이지 개편 안내', '홍보담당자', '2026.06.24', '842', state('on'), rowActs('notice')],
                  ['10', '국가첨단전략산업 특화단지 지정 관련 안내', '홍보담당자', '2026.06.11', '1,036', state('on'), rowActs('notice')],
                  ['9', '토지거래허가구역 지정 공고 안내', '홍보담당자', '2026.05.28', '774', state('on'), rowActs('notice')],
                  ['8', 'B-CITY 공식 홈페이지 오픈', '홍보담당자', '2026.05.02', '932', state('on'), rowActs('notice')],
                  ['7', '2026 상반기 사업 추진 현황 공유', '홍보담당자', '2026.04.22', '618', state('on'), rowActs('notice')],
                  ['6', '바이오테크이노밸리피에프브이㈜ 설립 완료', '홍보담당자', '2026.04.03', '610', state('on'), rowActs('notice')],
                  ['5', '개발행위허가 제한지역 지정 고시 안내', '홍보담당자', '2026.03.27', '405', state('on'), rowActs('notice')],
                  ['4', '하반기 사업 설명회 일정', '홍보담당자', '2026.03.20', '0', state('wait'), rowActs('notice')],
                  ['3', '입주 문의 접수 채널 안내', '홍보담당자', '2026.03.06', '289', state('off'), rowActs('notice')],
                ], ['is-num', 'is-title', '', '', 'is-num', 'is-ctr', 'is-ctr'])}
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
    fields: [
      field({ label: '제목', req: true, type: 'INPUT', control: input('공지 제목'), hint: '필수 · 최대 100자' }),
      field({ label: '내용', req: true, type: 'TEXT EDITOR', control: editor(), hint: '리치 텍스트 에디터 · 이미지 삽입 가능' }),
      field({ label: '첨부파일', type: 'FILE UPLOAD', control: drop('파일을 끌어다 놓으세요', '다중 첨부 · 파일당 최대 20MB')
        + fileList([['통합개발계획_요약.pdf', '2.4MB'], ['설명회_안내.hwp', '380KB']]),
        hint: '다중 첨부 · 파일당 최대 20MB' }),
      field({ label: '상단 고정', type: 'TOGGLE', control: toggle(true, '메인 상단에 고정'), hint: '목록 최상단에 [공지] 배지와 함께 노출됩니다.' }),
      pubState(1),
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
${tbody([
                  ['34', '춘천 기업혁신파크, 국토부 선도사업 최종 선정', '강원일보', '2026.04.18', state('on'), rowActs('press')],
                  ['33', '더존비즈온, 춘천 AI 데이터센터 앵커기업 참여', '파이낸셜뉴스', '2026.04.02', state('on'), rowActs('press')],
                  ['32', '강원 바이오·헬스 초광역 경제권 구축 본격화', '한국경제', '2026.03.11', state('on'), rowActs('press')],
                  ['31', '기업혁신파크 토지거래허가구역 지정', '연합뉴스', '2026.02.27', state('off'), rowActs('press')],
                  ['30', '춘천에 330MW 하이퍼스케일 데이터센터', '전자신문', '2026.02.14', state('on'), rowActs('press')],
                  ['29', '국가첨단전략산업 특화단지 강원 선정', '강원도민일보', '2026.01.30', state('on'), rowActs('press')],
                  ['28', 'GTX-B 연장 논의, 춘천 접근성 개선 기대', '매일경제', '2026.01.16', state('on'), rowActs('press')],
                  ['27', '중소형 CDMO 거점으로 주목받는 춘천', '히트뉴스', '2025.12.19', state('on'), rowActs('press')],
                  ['26', '기업도시개발특별법 적용 사업 현황', '건설경제', '2025.12.04', state('on'), rowActs('press')],
                  ['25', '춘천시·강원특별자치도 출자 지분 확정', 'MBC강원', '2025.11.21', state('on'), rowActs('press')],
                ], ['is-num', 'is-title', '', '', 'is-ctr', 'is-ctr'])}
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
      pubState(2),
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
      pubState(3),
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
      pubState(4),
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
${tbody([
                  ['12', 'IM', 'B-CITY 사업 소개 IM', 'bcity-im.pdf · 12.4MB', '허용', '2026.07.16', state('on'), rowActs('publication')],
                  ['11', '카달로그', '춘천기업혁신파크 카달로그', 'catalog.pdf · 8.1MB', '허용', '2026.06.30', state('on'), rowActs('publication')],
                  ['10', '브로슈어', '투자 유치 브로슈어', 'brochure.pdf · 4.6MB', '미허용', '2026.06.02', state('on'), rowActs('publication')],
                  ['9', '리포트', '2026 상반기 사업 추진 리포트', 'report.pdf · 3.2MB', '허용', '2026.05.20', state('off'), rowActs('publication')],
                  ['8', '카달로그', '8대 권역 안내 카달로그', 'zones.pdf · 6.8MB', '허용', '2026.04.11', state('on'), rowActs('publication')],
                  ['7', '리포트', 'AI 데이터센터 사업성 리포트', 'dc-report.pdf · 5.4MB', '허용', '2026.03.28', state('on'), rowActs('publication')],
                  ['6', '브로슈어', '특구별 혜택 안내 브로슈어', 'benefit.pdf · 2.9MB', '허용', '2026.03.05', state('on'), rowActs('publication')],
                  ['5', 'IM', '골프레저 콤플렉스 IM', 'golf-im.pdf · 9.7MB', '미허용', '2026.02.19', state('on'), rowActs('publication')],
                  ['4', '카달로그', '정주환경 안내 카달로그', 'living.pdf · 4.1MB', '허용', '2026.01.24', state('on'), rowActs('publication')],
                  ['3', '리포트', '2025 하반기 추진 리포트', 'report-2025h2.pdf · 3.0MB', '허용', '2025.12.12', state('wait'), rowActs('publication')],
                ], ['is-num', '', 'is-title', '', 'is-ctr', '', 'is-ctr', 'is-ctr'])}
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
      field({ label: '다운로드 허용', type: 'TOGGLE', control: toggle(true, '내려받기 허용'), hint: '비활성화하면 [보기]만 노출되고 [다운로드] 버튼이 안 보입니다.' }),
      pubState(5),
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
          <div class="ad-scroll" data-reorder>
            <table class="ad-tbl">
              <thead><tr><th class="is-ctr">순서</th><th>분류</th><th class="is-title">상호</th><th>로고</th>
                <th class="is-num">지분율</th><th class="is-ctr">푸터 노출</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
${tbody([
                  [drag(1), '앵커기업', '더존비즈온', 'partner-douzone.png', '37.3%', '노출', state('on'), rowActs('partner')],
                  [drag(2), '자산관리', '바이오테크이노밸리자산관리 (AMC)', 'partner-amc.jpg', '0.2%', '노출', state('on'), rowActs('partner')],
                  [drag(3), '공공', '강원특별자치도', 'partner-gangwon.svg', '4.9%', '노출', state('on'), rowActs('partner')],
                  [drag(4), '공공', '춘천시', 'partner-chuncheon.svg', '4.9%', '노출', state('on'), rowActs('partner')],
                  [drag(5), '금융', 'IBK투자증권', 'partner-ibk.png', '5.0%', '노출', state('on'), rowActs('partner')],
                  [drag(6), '시공', '부지조성공사 등 (TBD)', '—', '—', '미노출', state('off'), rowActs('partner')],
                  [drag(7), '전략적 투자자', '에스에너지', 'partner-senergy.jpg', '—', '미노출', state('on'), rowActs('partner')],
                  [drag(8), '전략적 투자자', '프로티움사이언스', 'partner-protium.png', '—', '미노출', state('on'), rowActs('partner')],
                  [drag(9), '공공', '국토교통부', 'partner-molit.svg', '—', '노출', state('on'), rowActs('partner')],
                ], ['is-ctr', '', 'is-title', '', 'is-num', 'is-ctr', 'is-ctr', 'is-ctr'])}
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
      /* 지분율은 상태가 **세 가지**다 — 확정된 값 / 확정 전(TBD) / 표기 안 함.
         텍스트 입력 하나로는 구분되지 않아 '확정 전' 체크박스를 함께 둔다.
         (2026-08-18 지적: 문구만 보면 입력칸에 '확정 전' 이라고 적는 것처럼 읽힌다) */
      field({ label: '지분율', type: 'INPUT + CHECKBOX',
        control: `<div class="ad-inline">
                <span class="ad-unit"><input class="ad-in" type="number" step="0.1" min="0" max="100"
                  placeholder="37.3" id="eq" /><i>%</i></span>
                <label class="ad-cb"><input type="checkbox" id="eqTbd" /> 확정 전 (TBD 로 표시)</label>
              </div>`,
        hint: '확정된 지분율만 숫자로 적습니다. 확정 전이면 체크하세요 — 구조도의 지분율 자리에 <b>TBD</b> 가 들어갑니다. 숫자도 비우고 체크도 하지 않으면 지분율을 표기하지 않습니다.' }),
      field({ label: '보조 설명', type: 'INPUT', control: input('예: 부지조성공사 등'), hint: '구조도 상호 아래 설명 부분입니다.' }),
      field({ label: '푸터 노출', type: 'TOGGLE', control: toggle(true, '메인 푸터 파트너 영역에 노출'), hint: '비활성화하면 사업주체 페이지에만 노출됩니다.' }),
      field({ label: '정렬 순서', type: 'DRAG / NUMBER', control: '<input class="ad-in" type="number" value="1" style="max-width:120px" />',
        hint: '목록에서 행을 끌어 조정할 수도 있습니다.' }),
      pubState(6),
    ],
  }),
});

/* ── 계정 관리 — **기획서에 없다.** 2026-08-18 요청으로 추가 ─────────────
   slide 105 는 홍보센터 5개 메뉴뿐이고 계정·권한 명세는 없다(slide 74 의 '회원권'은
   골프장 회원권으로 무관). 그래서 권한 등급과 정책은 **여기서 제안한 안**이며
   개발·운영과 확정이 필요하다.

   ⚠ 화면에서 동작하는 것과 서버가 해야 하는 것을 섞지 않는다.
     · 동작함(클라이언트만으로 가능) — 권한 체크 매트릭스, 상태 토글,
       비밀번호 규칙·일치 실시간 검사
     · 서버 몫 — 실제 인증, 세션, **권한 집행**, 비밀번호 해시·정책 강제,
       임시 비밀번호 발급·발송, 로그인 실패 잠금, 감사 로그
     화면의 권한 체크는 **표시**일 뿐이고, 서버에서 막지 않으면 아무 의미가 없다. */
const ROLES = ['최고관리자', '편집자', '열람전용'];
const MENUS = ['공지사항', '언론보도', '홍보영상', '갤러리', '발행물', '파트너사', '계정 관리'];

/* 권한 매트릭스 — 등급별 기본값. 개발 인계용 기준표이기도 하다. */
const ROLE_DEFAULT = {
  '최고관리자': MENUS.map(() => 'edit'),
  '편집자': ['edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'none'],
  '열람전용': MENUS.map(() => 'read'),
};

const permMatrix = (role) => `<div class="ad-scroll">
                <table class="ad-tbl ad-perm">
                  <thead><tr><th>메뉴</th><th class="is-ctr">열람</th><th class="is-ctr">등록 · 수정</th><th class="is-ctr">삭제</th></tr></thead>
                  <tbody>
${MENUS.map((m, i) => {
  const lv = ROLE_DEFAULT[role][i];
  const ck = (on) => `<input type="checkbox"${on ? ' checked' : ''} />`;
  return `                    <tr><td>${esc(m)}</td>`
    + `<td class="is-ctr">${ck(lv !== 'none')}</td>`
    + `<td class="is-ctr">${ck(lv === 'edit')}</td>`
    + `<td class="is-ctr">${ck(lv === 'edit' && m !== '계정 관리')}</td></tr>`;
}).join('\n')}
                  </tbody>
                </table>
              </div>`;

pages['account.html'] = shell({
  title: '계정 관리', navKey: 'account', crumb: '계정 관리', h1: '계정 관리',
  actions: NEW_BTN('계정 등록', 'account-form.html'),
  body: `        <div class="ad-card">
          <div class="ad-filter">${chips(['전체', ...ROLES, '잠금'])}${search('이름 · 아이디 검색')}</div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th class="is-num">No.</th><th class="is-title">이름</th><th>아이디</th><th>권한</th>
                <th>최근 로그인</th><th>등록일</th><th class="is-ctr">상태</th><th class="is-ctr">관리</th></tr></thead>
              <tbody>
                <tr><td class="is-num">4</td><td class="is-title">김담당</td><td>pr@biotech-iv.com</td><td>최고관리자</td><td>2026.08.18 09:12</td><td>2026.03.02</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('account')}</td></tr>
                <tr><td class="is-num">3</td><td class="is-title">이홍보</td><td>media@biotech-iv.com</td><td>편집자</td><td>2026.08.17 17:40</td><td>2026.04.11</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('account')}</td></tr>
                <tr><td class="is-num">2</td><td class="is-title">박대리</td><td>assist@biotech-iv.com</td><td>편집자</td><td>2026.08.11 11:05</td><td>2026.05.20</td><td class="is-ctr">${state('on')}</td><td class="is-ctr">${rowActs('account')}</td></tr>
                <tr><td class="is-num">1</td><td class="is-title">최열람</td><td>view@biotech-iv.com</td><td>열람전용</td><td>—</td><td>2026.06.02</td><td class="is-ctr">${state('off')}</td><td class="is-ctr">${rowActs('account')}</td></tr>
              </tbody>
            </table>
          </div>
${pager(2)}
        </div>
        <div class="ad-card">
          <div class="ad-card-h"><h2>권한 등급 기준</h2>
            <a class="ad-btn ad-btn--sm" href="account-form.html">등급별 권한 편집</a></div>
          <div class="ad-scroll">
            <table class="ad-tbl">
              <thead><tr><th>등급</th>${MENUS.map((m) => `<th class="is-ctr">${esc(m)}</th>`).join('')}</tr></thead>
              <tbody>
${ROLES.map((r) => `                <tr><td><b>${esc(r)}</b></td>`
  + ROLE_DEFAULT[r].map((lv) => `<td class="is-ctr">${lv === 'edit' ? '등록 · 수정' : (lv === 'read' ? '열람' : '—')}</td>`).join('')
  + '</tr>').join('\n')}
              </tbody>
            </table>
          </div>
          ${dev('권한 등급 확인 — 기획서에 계정·권한 명세가 없어 이 구성은 제안이다. 운영 정책과 함께 확정 필요.')}
        </div>`,
});

pages['account-form.html'] = shell({
  title: '계정 등록', navKey: 'account', crumb: '계정 관리 › 등록 / 수정',
  h1: '계정 등록 / 수정',
  body: formCard({
    title: '계정 등록 / 수정', slug: 'account', preview: 'account.html',
    note: '※ 등급을 바꾸면 메뉴 권한이 기본값으로 다시 채워집니다',
    dev: '권한 집행 확인 — 화면 체크는 표시일 뿐이다. 서버가 막지 않으면 URL 직접 입력으로 모두 접근된다.',
    fields: [
      field({ label: '이름', req: true, type: 'INPUT', control: input('담당자 이름'),
        hint: '목록과 게시물 작성자에 표시됩니다.' }),
      field({ label: '아이디', req: true, type: 'EMAIL INPUT',
        control: '<input class="ad-in" type="email" placeholder="name@biotech-iv.com" />',
        hint: '로그인 아이디로 사용됩니다' }),
      // DEV: 아이디 정책 확인 — 회사 메일(@biotech-iv.com) 도메인만 허용할지 결정 필요.
      field({ label: '임시 비밀번호', req: true, type: 'BUTTON',
        control: '<button type="button" class="ad-btn" onclick="document.getElementById(\'pwDlg\').showModal()">임시 비밀번호 발급</button>',
        hint: '서버가 생성해 본인 메일로 보내고, 첫 로그인에서 변경을 강제합니다.' }),
      // 힌트를 두지 않는다 — 같은 내용이 폼 하단 안내에 있어 한 화면에서 두 번 읽혔다(2026-08-18 감사).
      field({ label: '권한 등급', req: true, type: 'SELECT', control: sel(ROLES) }),
      field({ label: '메뉴 권한', type: 'CHECKBOX MATRIX', control: permMatrix('편집자'),
        hint: '등급 기본값에서 개별 조정할 수 있습니다. 계정 관리 삭제 권한은 최고관리자만 갖습니다.' }),
      field({ label: '계정 상태', type: 'TOGGLE', control: toggle(true, '활성'),
        hint: '비활성화하면 로그인할 수 없습니다. 삭제하지 않고 잠글 때 씁니다.' }),
    ],
  }),
});

pages['password.html'] = shell({
  title: '비밀번호 변경', navKey: 'account', crumb: '계정 관리 › 내 비밀번호',
  h1: '비밀번호 변경',
  body: `        <div class="ad-card" style="max-width:620px">
          <div class="ad-card-h"><h2>내 비밀번호</h2>
            <a class="ad-btn ad-btn--sm" href="account.html">‹ 목록으로</a></div>
          <div class="ad-form">
            <div class="ad-row">
              <p class="ad-lb">현재 비밀번호<i>*</i></p>
              <div class="ad-fd"><input class="ad-in" type="password" autocomplete="current-password" /></div>
            </div>
            <div class="ad-row">
              <p class="ad-lb">새 비밀번호<i>*</i></p>
              <div class="ad-fd">
                <input class="ad-in" type="password" id="pw1" autocomplete="new-password" />
                <ul class="ad-rules" id="pwRules">
                  <li data-rule="len">10자 이상</li>
                  <li data-rule="mix">영문 · 숫자 · 특수문자를 모두 포함</li>
                  <li data-rule="seq">같은 문자 3회 이상 반복 없음</li>
                </ul>
              </div>
            </div>
            <div class="ad-row">
              <p class="ad-lb">새 비밀번호 확인<i>*</i></p>
              <div class="ad-fd">
                <input class="ad-in" type="password" id="pw2" autocomplete="new-password" />
                <p class="ad-hint" id="pwMatch">두 입력이 같아야 합니다.</p>
              </div>
            </div>
          </div>
          <div class="ad-foot">
            <p class="ad-note">※ 변경하면 다른 기기에서는 다시 로그인해야 합니다</p>
            ${dev('비밀번호 검사 확인 — 화면 검사는 우회 가능하다. 서버에서 같은 규칙을 반드시 재검증할 것.')}
            <a class="ad-btn" href="account.html">취소</a>
            <button type="button" class="ad-btn ad-btn--primary" onclick="document.getElementById('saveDlg').showModal()">변경</button>
          </div>
        </div>`,
});

/* ── 비밀번호 재설정 — **기획서에 없다.** 로그인의 '비밀번호를 잊으셨나요?' 가
   `href="#"` 으로 아무 데도 가지 않던 것을 채운 화면이다(2026-08-18 질문).

   절차: ① 아이디 입력 → 재설정 메일 발송  ② 메일의 링크로 새 비밀번호 설정  ③ 로그인
   ⚠ ①의 응답은 계정이 있든 없든 **같아야 한다.** 다르면 어떤 메일이 관리자 계정인지
     알아낼 수 있다(계정 열거). 그래서 화면 문구도 '있으면 보냈다' 로 쓰지 않는다. */
pages['password-reset.html'] = loginShell({
  title: '비밀번호 재설정',
  body: `      <p class="ad-login-h">비밀번호 재설정</p>
      <p class="ad-login-d">가입한 아이디(메일)를 입력하면 재설정 링크를 보내 드립니다.</p>
      <form class="ad-login-f" onsubmit="return false">
        <label>아이디
          <input class="ad-in" type="email" autocomplete="username" placeholder="name@biotech-iv.com" />
        </label>
        <a class="ad-btn ad-btn--primary" href="password-reset-sent.html">재설정 링크 받기</a>
      </form>
      <p class="ad-login-alt"><a href="login.html">‹ 로그인으로 돌아가기</a></p>`
    + dev('계정 열거 방지 — 계정이 없어도 같은 응답을 보낼 것. 요청 횟수 제한(권장 5분에 3회)도 필요하다.'),
});

pages['password-reset-sent.html'] = loginShell({
  title: '재설정 메일 발송',
  body: `      <p class="ad-login-h">메일을 확인해 주세요</p>
      <p class="ad-login-d">입력한 주소로 재설정 링크를 보냈습니다. 링크는 30분 동안만 쓸 수 있습니다.
        메일이 오지 않으면 스팸함을 확인해 주세요.</p>
      <div class="ad-login-f">
        <a class="ad-btn ad-btn--primary" href="password-reset-new.html">링크를 눌렀을 때 화면 보기</a>
        <a class="ad-btn" href="password-reset.html">다시 보내기</a>
      </div>
      <p class="ad-login-alt"><a href="login.html">‹ 로그인으로 돌아가기</a></p>`
    + dev("'링크를 눌렀을 때 화면 보기' 는 시안 확인용 버튼이다. 실제로는 메일의 링크로만 다음 화면에 들어간다."),
});

pages['password-reset-new.html'] = loginShell({
  title: '새 비밀번호 설정',
  body: `      <p class="ad-login-h">새 비밀번호 설정</p>
      <p class="ad-login-d">앞으로 사용할 비밀번호를 입력해 주세요.</p>
      <form class="ad-login-f" onsubmit="return false">
        <label>새 비밀번호
          <input class="ad-in" type="password" id="pw1" autocomplete="new-password" />
        </label>
        <ul class="ad-rules" id="pwRules">
          <li data-rule="len">10자 이상</li>
          <li data-rule="mix">영문 · 숫자 · 특수문자를 모두 포함</li>
          <li data-rule="seq">같은 문자 3회 이상 반복 없음</li>
        </ul>
        <label>새 비밀번호 확인
          <input class="ad-in" type="password" id="pw2" autocomplete="new-password" />
        </label>
        <p class="ad-hint" id="pwMatch">두 입력이 같아야 합니다.</p>
        <a class="ad-btn ad-btn--primary" href="login.html">변경하고 로그인</a>
      </form>`
    + dev('토큰 검증 — 1회용 · 30분 유효 · 사용 후 즉시 폐기. 만료·재사용 시 별도 안내 화면이 필요하다.'),
});

/* ── 자가 점검 ─────────────────────────────────────────────────────────
   빌드마다 돈다(2026-08-18 지시 "소스에 문제가 없는지 계속 체크해야 해").
   운영·개발이 이어서 손볼 때 죽은 코드와 중복이 쌓이지 않게 하는 것이 목적이다.
   실제로 이 점검으로 table() 미사용 · .ad-flag/.ad-checks 죽은 CSS ·
   게시 상태 필드 6중복을 찾아냈다.

   ⚠ CSS 는 **주석을 벗기고 선택자에서만** 클래스를 뽑아야 한다. 주석에 적어 둔
     '.ad-type 은 제거했다' 같은 문구까지 정의로 세면 오탐이 난다(실제로 겪었다). */
function selfCheck(outputs) {
  const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '');
  const cssNc = strip(ADMIN);
  const selectors = (cssNc.match(/[^{}]+(?=\{)/g) || []).join(' ');
  const defined = new Set([...selectors.matchAll(/\.(ad-[\w-]+)/g)].map((m) => m[1]));

  const used = new Set();
  for (const html of outputs) {
    const body = html.split('</style>').pop();
    for (const m of body.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c.startsWith('ad-')) used.add(c);
    }
  }
  const dead = [...defined].filter((c) => !used.has(c)).sort();
  const undef = [...used].filter((c) => !defined.has(c)).sort();

  const dv = new Set([...cssNc.matchAll(/(--ad-[\w-]+)\s*:/g)].map((m) => m[1]));
  const uv = new Set([...cssNc.matchAll(/var\((--ad-[\w-]+)/g)].map((m) => m[1]));
  const deadVar = [...dv].filter((v) => !uv.has(v)).sort();

  /* 화면에 남은 개발자 문구 — 로그인의 보안 권장안 패널은 지시로 남긴다 */
  const DEVWORDS = ['개발 시', '협의가 필요', '서버에서 해야', '다시 검사해야',
                    '결정이 필요', '정책이 필요', '기획서에 없', '구현해 주세요'];
  const leaked = [];
  outputs.forEach((html, i) => {
    if (files[i] === 'login.html') return;
    const body = html.split('</style>').pop().replace(/<!--[\s\S]*?-->/g, '');
    const hit = DEVWORDS.filter((w) => body.includes(w));
    if (hit.length) leaked.push(`${files[i]} — ${hit.join(' · ')}`);
  });

  const rows = [
    ['죽은 CSS', dead], ['정의 없는 클래스', undef],
    ['안 쓰는 토큰', deadVar], ['화면에 남은 개발자 문구', leaked],
  ];
  const bad = rows.filter((r) => r[1].length);
  console.log('\n  ── 자가 점검 ──');
  for (const [label, list] of rows) {
    console.log(`  ${list.length ? '✗' : '·'} ${label}: ${list.length ? list.join(', ') : '없음'}`);
  }
  if (bad.length) {
    console.log('\n  ⚠ 위 항목을 정리하고 다시 빌드하세요.');
    process.exitCode = 1;
  }
}

/* ── 출력 ─────────────────────────────────────────────────────────── */
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
let n = 0;
const files = Object.keys(pages);
const outputs = [];
for (const [file, html] of Object.entries(pages)) {
  outputs.push(html);
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

selfCheck(outputs);

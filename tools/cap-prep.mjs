/* 피그마 캡처용 사본 생성기 — `_cap-<slug>.html`
 *
 *   node tools/cap-prep.mjs          만들기
 *   node tools/cap-prep.mjs --clean  지우기
 *
 * 왜 사본이 필요한가(CLAUDE.md §8.2)
 *   원본 그대로 캡처하면 (a) 등장 애니메이션이 걸린 요소가 `opacity: 0` 으로 잡혀
 *   **투명 레이어**가 되고 (b) 지연 이미지가 빈 칸으로 남는다.
 *
 * ⚠ 캡처는 DOM 을 복제하며 **인라인 스크립트를 다시 실행한다**(§8.3.2).
 *   그래서 스크립트를 지우지 않고 **CSS `!important` 로 최종 상태를 못 박는다** —
 *   스크립트가 다시 돌아도 화면은 최종 상태로 남는다. 인라인 `style="--p: …"` 처럼
 *   JS 가 넣는 값도 `!important` 가 이긴다(우선순위가 인라인보다 높다).
 *   탭처럼 `hidden` 을 붙이는 동작은 그대로 살려 둔다 — 실제 화면과 같아야 한다.
 *
 * ⚠ 이 파일들은 커밋하지 않는다. 작업이 끝나면 `--clean` 으로 지운다.
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const clean = process.argv.includes('--clean');

/* 루트의 서브페이지(상세 · 생성 사본 제외) + 메인 */
const SKIP = /^(_cap-|capture\.html$|notice-|press-)/;
const pages = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !SKIP.test(f))
  .sort();
const admin = existsSync(join(ROOT, 'admin'))
  /* ⚠ 루트의 SKIP 을 그대로 쓰면 안 된다 — `notice-` · `press-` 규칙이 관리자의
     `notice-form.html` · `press-form.html` 까지 거른다. 여기서는 사본만 뺀다. */
  ? readdirSync(join(ROOT, 'admin')).filter((f) => f.endsWith('.html') && !f.startsWith('_cap-')).sort()
  : [];

if (clean) {
  let n = 0;
  for (const f of readdirSync(ROOT)) if (f.startsWith('_cap-')) { unlinkSync(join(ROOT, f)); n++; }
  const ad = join(ROOT, 'admin');
  if (existsSync(ad)) for (const f of readdirSync(ad)) if (f.startsWith('_cap-')) { unlinkSync(join(ad, f)); n++; }
  console.log(`  캡처 사본 ${n}개 삭제`);
  process.exit(0);
}

const OVERRIDE = `
<!-- 피그마 캡처 스크립트. 이게 없으면 해시(#figmacapture=)를 줘도 아무 일도 일어나지 않는다. -->
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
<!-- ===== 피그마 캡처 전용 오버라이드 (tools/cap-prep.mjs 가 넣는다) =====
     원본에는 없다. 이 사본은 커밋하지 않는다. -->
<style>
  /* 전환·애니메이션을 멈춰 중간 프레임이 잡히지 않게 한다 */
  *, *::before, *::after { transition: none !important; animation: none !important; }

  /* 스크롤 등장(.rv) — 최종 상태로 */
  .rv, .rv-x, .rv-rise, .cp-el, .anim { opacity: 1 !important; transform: none !important; }

  /* ⚠⚠ 메인(index.html)은 등장 클래스 이름이 **서브페이지와 다르다**(.rv 가 아니다).
     이걸 빼면 8대 권역 카드(.az-card)와 홍보 카드(.reveal)가 통째로 투명해져
     캡처에 **빈 띠**로 남는다 — 2026-08-31 실측으로 투명 노드 59개가 잡혔고,
     화면에서는 #zones 가 어두운 빈 띠, #pr 이 백지로 나왔다.
     ⚠ 여기에 '.cine-page' 를 넣지 말 것. 스크럽 카피 페이지 2~3장이 절대배치로 겹쳐 있어
       전부 켜면 글자가 서로 위에 쌓인다 — 활성 장만 '.on' 으로 보이는 것이 맞다.
     ⚠ '.az-map-hl'(호버 하이라이트) · '.dz-fade'(영상 크로스페이드)도 빼 둔다.
       그 둘은 '지금 숨은 것이 정상'인 상태다. */
  .reveal, .az-card, .ov-stat { opacity: 1 !important; transform: none !important; }

  /* 정주환경 · 구역소개 도입부 — 스크롤 진행률로 그리는 화면을 끝 상태로 못 박는다.
     JS 가 인라인 style 로 넣는 값보다 !important 가 이긴다. */
  .lv-stage, .lv-ed, .lv-intro, .lv-split { --p: 1 !important; --pw: 1 !important; --pin: 1 !important; --pinl: 1 !important; }
  .lv-side > *, .lv-frame, .lv-thumbs li { opacity: 1 !important; transform: none !important; }
  /* ⚠⚠ 정주환경 **도입부는 --p: 0 이 시작 상태**다(다른 곳과 반대 · §11.58).
     위 줄이 1 을 주면 도입 무대가 translateX(-100%) 로 화면 밖으로 나가 그 자리가
     통째로 빈다 — 실측 x=-1920. 사용자가 '상단 화면 디자인이 없다'고 본 것이 이것이다.
     아래 줄이 뒤에 와야 이긴다(특이도가 같아 순서로 결정된다). */
  .lv-intro, .lv-stage--intro { --p: 0 !important; }
  /* 풀화면 상태 — 주소에 figfull=1 을 붙이면 오른쪽 칸을 접어 사진이 화면을 채운다.
     정주환경은 한 섹션이 [사진 전체] → [사진 | 본문] 두 상태를 지나므로 두 벌로 캡처한다. */
  html.cap-full .lv-ed, html.cap-full .lv-ed .lv-stage, html.cap-full .lv-ed .lv-split {
    --p: 0 !important; --pw: 0 !important; }

  /* 구역소개 도입부 — 스케치→실사 디졸브. 카피는 전환 뒤에만 보이므로 강제로 켠다 */
  .dz-intro-sketch { opacity: 0 !important; }
  .dz-intro-in, .dz-intro-in > * { opacity: 1 !important; transform: none !important; }

  /* 도시컨셉 다이어그램 — .in 이 없으면 아무것도 직렬화되지 않는다(§8.3-4) */
  .cn-card, .cn-hub, .cn-dot, .cn-ic, .cx-node, .cx-hub, .cx-ic { opacity: 1 !important; transform: none !important; }
  .cn-ring, .cn-conn, .cx-ring, .cx-conn { stroke-dashoffset: 0 !important; }
  .cx-dia, .cn-dia { opacity: 1 !important; }

  /* 스크럽 섹션 포스터 — 영상이 로드되면 JS 가 0 으로 만들어 캡처에서 빠진다(§8.3-5) */
  [data-poster] { opacity: 1 !important; }

  /* ── 메인(index.html) 전용 ────────────────────────────────
     스크럽 런웨이는 1.7만 px 의 빈 공간이 된다. 스테이지를 흐름으로 되돌려
     각 섹션을 한 번만 렌더한다(§8.2). 서브페이지에는 이 클래스들이 없어 무해하다. */
  .cine, .dz { height: 100vh !important; }
  .cine-stage, .dz-stage { position: relative !important; }
  .cine-page { opacity: 1 !important; }
  .lr .lr-inner { opacity: 1 !important; transform: none !important; }
  .dz-imgs .dz-vid { transition: none !important; }

  /* 특화단지 말풍선 · 확대보기 트리거 등 등장 지연 요소 */
  .bc-call, .bc-call-in, .pub-ov { opacity: 1 !important; transform: none !important; }
</style>
<script>
  /* 클래스로만 열리는 상태는 CSS 로 못 하므로 여기서 붙인다.
     ⚠ 캡처가 이 스크립트를 복제본에서 다시 실행하는데, 그래도 결과가 같도록
       **멱등**하게 쓴다(add/remove 만 · 토글 금지). */
  (function () {
    var apply = function () {
    var on = function (sel, cls) {
      [].slice.call(document.querySelectorAll(sel)).forEach(function (e) { e.classList.add(cls); });
    };
    if (location.search.indexOf('figfull=1') >= 0) document.documentElement.classList.add('cap-full');
    on('.rv, .cn-dia, .cx-dia, .bc-panel', 'in');
    /* 메인 전용 — '.in' 을 붙여야 켜지는 것들. 서브페이지에는 없어 무해하다. */
    on('.reveal, .ov, .az-card, .lr', 'in');
    [].slice.call(document.querySelectorAll('.dz-intro')).forEach(function (e) {
      e.classList.remove('is-armed'); e.classList.add('is-playing');
    });
    /* ⚠⚠ mask-image 로 그리는 아이콘은 캡처가 **단색 면**으로 가져간다.
       사이트는 'background: currentColor + mask: url(...svg)' 로 아이콘을 칠한다
       (외부 SVG 가 currentColor 를 상속하지 않아서 쓰는 방식 · page-invest.css 주석 참고).
       캡처 스크립트는 mask 를 이해하지 못해 배경색 사각형만 남긴다 —
       2026-08-31 실측: 투자·입주 6곳 · 브랜드 1곳이 색면으로 들어갔다.
       그래서 여기서 **SVG 를 받아 인라인으로 심고** 마스크를 걷는다.
       ⚠ currentColor 는 상속이라 캡처가 따라가지 못한다 → 계산된 배경색으로 굳힌다.
       ⚠ 이 apply() 는 세 번 돈다 — data 속성으로 한 번만 처리한다. */
    [].slice.call(document.querySelectorAll('*')).forEach(function (e) {
      if (e.dataset.capMask) return;
      var cs = getComputedStyle(e);
      var mi = cs.maskImage || cs.webkitMaskImage || '';
      var u = /url[(]["']?([^"')]+[.]svg[^"')]*)["']?[)]/.exec(mi);
      if (!u) return;
      e.dataset.capMask = '1';
      var color = cs.backgroundColor;
      fetch(u[1]).then(function (r) { return r.text(); }).then(function (txt) {
        var box = document.createElement('div');
        box.innerHTML = txt;
        var svg = box.querySelector('svg');
        if (!svg) return;
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.display = 'block';
        [].slice.call(svg.querySelectorAll('*')).concat([svg]).forEach(function (k) {
          ['fill', 'stroke'].forEach(function (a) {
            var v = k.getAttribute(a);
            if (!v || v === 'none') return;
            k.setAttribute(a, color);
          });
        });
        e.style.background = 'none';
        e.style.webkitMaskImage = 'none';
        e.style.maskImage = 'none';
        e.appendChild(svg);
      }).catch(function () {});
    });

    /* 지연 이미지를 즉시 받게 한다 — 안 하면 빈 칸으로 잡힌다 */
    [].slice.call(document.querySelectorAll('img[loading="lazy"]')).forEach(function (i) { i.loading = 'eager'; });
    /* ⚠⚠ 영상은 **포스터 이미지로 바꾼다**(§8.2). 소스를 주입하면 안 된다 —
       캡처가 직렬화를 끝내지 못하고 pending 에 갇힌다(2026-08-28 실측: 영상 4개를 가진
       컨셉 페이지만 2분 넘게 pending, 나머지 6개는 30초 안에 완료).
       어차피 video 요소는 캡처되지 않으므로(§4.5) 포스터가 그 자리를 채워야 한다.
       ⚠ 이 자리는 템플릿 문자열 안이다 — 주석에도 백틱을 쓰면 문자열이 끊긴다(§11.35). */
    [].slice.call(document.querySelectorAll('video')).forEach(function (v) {
      var src = v.getAttribute('poster') || v.getAttribute('data-poster');
      if (src) {
        var i = document.createElement('img');
        i.src = src; i.className = v.className; i.setAttribute('alt', '');
        i.style.cssText = v.style.cssText;
        v.parentNode.replaceChild(i, v);
      } else {
        /* 포스터가 없으면 **지운다**(§8.2). 남겨 두면 직렬화가 끝나지 않는 것으로 보인다 —
           컨셉 페이지가 두 번 연속 pending 에 갇혔고, 그 페이지에만 포스터 없는 video 가 있었다. */
        v.remove();
      }
    });
    };
    /* 한 번만 돌리면 안 된다. 이 스크립트는 head 에서 실행되는데, 메인의 구역 카드
       영상(.dz-vid)은 페이지 JS 가 나중에 innerHTML 로 만든다 — 그때 만들어진 video 6개가
       그대로 남아 캡처가 멈춘다. 파싱 직후 · DOM 완성 후 · 로드 완료 후 세 번 돌린다.
       모든 동작이 멱등이라 여러 번 돌아도 결과가 같다. */
    apply();
    document.addEventListener('DOMContentLoaded', apply);
    window.addEventListener('load', function () { apply(); setTimeout(apply, 1200); });
  })();
</script>
`;

let n = 0;
const make = (dir, file) => {
  const src = join(ROOT, dir, file);
  const html = readFileSync(src, 'utf8');
  const i = html.indexOf('</head>');
  if (i < 0) { console.log(`  ? head 없음: ${file}`); return; }
  writeFileSync(join(ROOT, dir, '_cap-' + file), html.slice(0, i) + OVERRIDE + html.slice(i), 'utf8');
  n++;
};
pages.forEach((f) => make('.', f));
admin.forEach((f) => make('admin', f));
console.log(`  캡처 사본 ${n}개 (페이지 ${pages.length} · 관리자 ${admin.length})`);

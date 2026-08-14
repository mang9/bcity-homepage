    /* 탭 — 한 번에 한 묶음만 보여 준다. 구역소개(권역 8개)와 정주환경(환경 4개)이 함께 쓴다.

       마크업 규약
         · 탭과 패널을 **함께 감싸는 요소**에 `data-tabs="이름"` 을 준다(범위 한정용)
         · 탭 버튼   : `[data-tab="키"]`  · `role="tab"`      · `aria-controls`
         · 패널      : `[data-group="키"]` · `role="tabpanel"` · `aria-labelledby`
         · 탭 목록이 여러 개면 각각 `role="tablist"` — 화살표 이동은 자기 목록 안에서만 돈다

       ⚠ **마크업에는 패널이 모두 펼쳐져 있다.** JS 가 없거나 실패해도 전부 보인다.
         여기서는 '한 번에 하나만' 이라는 동작만 얹는다(§11.13 카운트업과 같은 원칙).

       ⚠ 컨트롤과 데이터에 **같은 data-* 이름을 쓰지 않는다** — 탭은 `data-tab`, 패널은 `data-group`.
         이름이 같으면 셀렉터가 탭 자신까지 잡아 숨긴다(2026-08-10 홍보센터 필터의 실제 사고 · §11.10).

       ⚠ **범위를 반드시 한정한다.** 한 페이지에 탭 묶음이 둘 이상 생기면 전역 셀렉터는
         서로의 패널을 감춘다. 그래서 `[data-tabs]` 안에서만 찾는다. */
    (function () {
      [].slice.call(document.querySelectorAll('[data-tabs]')).forEach(function (root) {
        var tabs = [].slice.call(root.querySelectorAll('[data-tab]'));
        var panels = [].slice.call(root.querySelectorAll('[data-group]'));
        if (tabs.length < 2 || panels.length < 2) return;

        var apply = function (name, focus) {
          panels.forEach(function (p) { p.hidden = p.dataset.group !== name; });
          tabs.forEach(function (t) {
            var on = t.dataset.tab === name;
            t.classList.toggle('is-on', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            /* 선택된 탭만 탭 순서에 남긴다 — 탭 목록 안에서는 화살표로 이동하는 것이 표준이다 */
            t.tabIndex = on ? 0 : -1;
            if (on && focus) t.focus();
          });
        };

        tabs.forEach(function (t) {
          t.addEventListener('click', function () { apply(t.dataset.tab, false); });
          t.addEventListener('keydown', function (e) {
            var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                  : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
            if (!d) return;
            e.preventDefault();
            var list = [].slice.call(
              (t.closest('[role="tablist"]') || root).querySelectorAll('[data-tab]'));
            var i = list.indexOf(t);
            apply(list[(i + d + list.length) % list.length].dataset.tab, true);
          });
        });

        apply(tabs[0].dataset.tab, false);
      });
    })();

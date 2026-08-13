    /* 구역소개 — 8개 권역 탭. 한 번에 한 권역만 보여 준다.

       ⚠ **마크업에는 8개 패널이 모두 펼쳐져 있다.** JS 가 없거나 실패해도 전부 보인다.
         여기서는 '한 번에 하나만' 이라는 동작만 얹는다(§11.13 카운트업과 같은 원칙).

       ⚠ 컨트롤과 데이터에 **같은 data-* 이름을 쓰지 않는다** — 탭은 `data-tab`,
         패널은 `data-group` 이다. 이름이 같으면 셀렉터가 탭 자신까지 잡아 숨긴다
         (2026-08-10 홍보센터 분류 필터에서 실제로 났던 사고 · §11.10).

       ⚠ 탭 목록이 **둘**이다(클러스터 / 콤플렉스). 화살표 이동은 자기 목록 안에서만 돈다 —
         두 묶음을 가로지르면 어느 묶음에 있는지 감각을 잃는다. */
    (function () {
      var tabs = [].slice.call(document.querySelectorAll('.dz-tab'));
      var panels = [].slice.call(document.querySelectorAll('.dz-panel'));
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
          var list = [].slice.call(t.closest('[role="tablist"]').querySelectorAll('.dz-tab'));
          var i = list.indexOf(t);
          apply(list[(i + d + list.length) % list.length].dataset.tab, true);
        });
      });

      apply(tabs[0].dataset.tab, false);
    })();

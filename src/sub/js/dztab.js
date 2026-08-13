    /* 구역소개 — 클러스터 / 콤플렉스 분류 탭.

       ⚠ **마크업에는 두 묶음이 모두 펼쳐져 있다.** JS 가 없거나 실패해도 8개 권역이 전부 보인다.
         여기서는 '한 번에 한 묶음만 보여 주는' 동작만 얹는다(§11.13 카운트업과 같은 원칙).

       ⚠ 컨트롤과 데이터에 **같은 data-* 이름을 쓰지 않는다** — 탭은 `data-tab`,
         묶음은 `data-group` 이다. 이름이 같으면 셀렉터가 탭 자신까지 잡아 숨긴다
         (2026-08-10 홍보센터 분류 필터에서 실제로 났던 사고 · §11.10). */
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

      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { apply(t.dataset.tab, false); });
        t.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          apply(tabs[(i + d + tabs.length) % tabs.length].dataset.tab, true);
        });
      });

      apply(tabs[0].dataset.tab, false);
    })();

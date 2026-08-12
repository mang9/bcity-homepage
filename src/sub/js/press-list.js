    /* 언론보도 목록 — 검색 · 분류(언론사별/기간별) · 페이지네이션.
       모두 **이미 그려진 행**을 걸러 내는 방식이다. 정적 사이트라 서버 질의가 없다.
       JS 가 죽으면 필터·검색 UI 는 동작하지 않지만 **목록 전체는 그대로 보인다** —
       사라지는 것이 없도록 처음부터 전부 렌더해 두고 감추기만 한다.

       행이 들고 있는 값(빌더가 data-* 로 심어 둔 것):
         data-outlet · data-year · data-q(제목+매체+요약 소문자) */
    (function () {
      var list = document.getElementById('pressList');
      if (!list) return;
      var rows = [].slice.call(list.querySelectorAll('.pr-row'));
      var modes = [].slice.call(document.querySelectorAll('.pl-mode'));
      var chipBar = document.getElementById('pressChips');
      var input = document.getElementById('pressQ');
      var form = document.getElementById('pressSearch');
      var pager = document.getElementById('pressPager');
      var empty = document.getElementById('pressEmpty');
      var PER = 10;

      var state = { mode: 'all', chip: '', q: '', page: 1 };

      var uniq = function (key) {
        var seen = [];
        rows.forEach(function (r) {
          var v = r.dataset[key];
          if (v && seen.indexOf(v) < 0) seen.push(v);
        });
        return seen;
      };

      var match = function (r) {
        if (state.q && r.dataset.q.indexOf(state.q) < 0) return false;
        if (state.mode === 'outlet' && state.chip && r.dataset.outlet !== state.chip) return false;
        if (state.mode === 'year' && state.chip && r.dataset.year !== state.chip) return false;
        return true;
      };

      var renderPager = function (total) {
        if (!pager) return;
        var pages = Math.ceil(total / PER);
        if (pages <= 1) { pager.innerHTML = ''; pager.hidden = true; return; }
        pager.hidden = false;
        var h = '<button type="button" class="pl-pg" data-go="prev"' +
                (state.page === 1 ? ' disabled' : '') + ' aria-label="이전 페이지">‹</button>';
        for (var i = 1; i <= pages; i++) {
          h += '<button type="button" class="pl-pg' + (i === state.page ? ' is-on' : '') +
               '" data-go="' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
        }
        h += '<button type="button" class="pl-pg" data-go="next"' +
             (state.page === pages ? ' disabled' : '') + ' aria-label="다음 페이지">›</button>';
        pager.innerHTML = h;
      };

      var apply = function () {
        var hit = rows.filter(match);
        var pages = Math.max(1, Math.ceil(hit.length / PER));
        if (state.page > pages) state.page = pages;
        var from = (state.page - 1) * PER, to = from + PER;

        rows.forEach(function (r) { r.hidden = true; });
        hit.slice(from, to).forEach(function (r) { r.hidden = false; });

        if (empty) empty.hidden = hit.length > 0;
        list.hidden = hit.length === 0;
        renderPager(hit.length);
      };

      var renderChips = function () {
        if (!chipBar) return;
        if (state.mode === 'all') { chipBar.innerHTML = ''; chipBar.hidden = true; return; }
        var vals = state.mode === 'outlet' ? uniq('outlet') : uniq('year').sort().reverse();
        chipBar.hidden = false;
        // ⚠ class 속성을 보간으로 쪼개지 말 것 — lint-classes 가 class="…" 를 정규식으로
        //   읽으므로 이름을 못 찾아 죽은 CSS 로 오인한다(CLAUDE.md §11.11).
        chipBar.innerHTML = vals.map(function (v) {
          var on = state.chip === v;
          var cls = on ? 'class="pl-chip is-on"' : 'class="pl-chip"';
          var label = state.mode === 'year' ? v + '년' : v;
          return '<button type="button" ' + cls + ' data-chip="' + v +
                 '" aria-pressed="' + on + '">' + label + '</button>';
        }).join('');
      };

      modes.forEach(function (b) {
        b.addEventListener('click', function () {
          state.mode = b.dataset.mode; state.chip = ''; state.page = 1;
          modes.forEach(function (x) {
            var on = x === b;
            x.classList.toggle('is-on', on);
            x.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          renderChips(); apply();
        });
      });

      if (chipBar) chipBar.addEventListener('click', function (e) {
        var b = e.target.closest('.pl-chip'); if (!b) return;
        state.chip = state.chip === b.dataset.chip ? '' : b.dataset.chip;
        state.page = 1; renderChips(); apply();
      });

      if (pager) pager.addEventListener('click', function (e) {
        var b = e.target.closest('.pl-pg'); if (!b || b.disabled) return;
        var g = b.dataset.go;
        state.page = g === 'prev' ? state.page - 1 : g === 'next' ? state.page + 1 : parseInt(g, 10);
        apply();
        list.scrollIntoView({ block: 'start' });
      });

      if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        state.q = (input.value || '').trim().toLowerCase();
        state.page = 1; apply();
      });
      // 지웠을 때 바로 복구되게 — 제출을 기다리면 답답하다
      if (input) input.addEventListener('input', function () {
        if (input.value === '') { state.q = ''; state.page = 1; apply(); }
      });

      apply();
    })();

    /* 목록 페이저 — 공지사항 · 홍보영상 · 갤러리 · 발행물이 함께 쓴다.
       ⚠ 언론보도는 **쓰지 않는다.** 그쪽은 검색·분류와 한 덩이인 press-list.js 가
         자기 페이저를 갖고 있다. 둘을 같은 목록에 얹으면 서로 다른 page 상태를 갖는다.

       구조 — 빌더가 목록을 이렇게 감싼다:
         <div class="pg" data-per="12"> <ul>…항목…</ul> <nav class="pg-nav" hidden></nav> </div>

       ⚠⚠ **다시 렌더하지 않는다. 감추기만 한다.** lightbox.js 는 로드 시점에
         [data-lb] 를 한 번 모으므로, 항목을 다시 그리면 갤러리·홍보영상의
         확대보기가 조용히 죽는다(§11.29 에서 실제로 겪은 형태다).
       ⚠⚠ **hidden 을 쓰는 주인은 이 스크립트 하나다.** filter.js 는 data-off 만 세우고
         보이기는 CSS 가 정한다 — 두 스크립트가 같은 hidden 을 쓰면 서로 덮어
         "분류를 고르면 다른 분류로 돌아갈 수 없다" 가 재현된다(§11.10 의 실제 사고).
       ⚠ 마크업에는 항목이 **전부** 들어 있다. JS 가 없거나 죽으면 전부 보인다 —
         목록에서 사라지는 것이 없어야 한다(§11.13 과 같은 원칙). */
    (function () {
      var boxes = [].slice.call(document.querySelectorAll('.pg[data-per]'));
      if (!boxes.length) return;

      boxes.forEach(function (box) {
        var per = parseInt(box.dataset.per, 10);
        if (!(per > 0)) return;
        var listEl = box.querySelector('ul, ol');
        if (!listEl) return;
        var items = [].slice.call(listEl.children);
        var pager = box.querySelector('.pg-nav');
        var page = 1;

        /* 분류 필터가 걸러 낸 것(data-off)은 쪽 수 계산에서도 빠진다.
           안 그러면 '3쪽' 이라고 적어 놓고 3쪽이 텅 비는 일이 생긴다. */
        var live = function () {
          return items.filter(function (it) { return !it.hasAttribute('data-off'); });
        };

        var pagesOf = function (n) { return Math.max(1, Math.ceil(n / per)); };

        var draw = function () {
          var hit = live();
          var pages = pagesOf(hit.length);
          if (page > pages) page = pages;
          var from = (page - 1) * per;

          items.forEach(function (it) { it.hidden = true; });
          hit.slice(from, from + per).forEach(function (it) { it.hidden = false; });

          if (!pager) return;
          /* 한 쪽이면 페이저 자체를 내린다. 그래서 콘텐츠가 적은 동안은
             아무것도 보이지 않고, 쌓이면 저절로 나타난다. */
          if (pages <= 1) { pager.innerHTML = ''; pager.hidden = true; return; }
          pager.hidden = false;
          var h = '<button type="button" class="pg-btn" data-go="prev"'
                + (page === 1 ? ' disabled' : '') + ' aria-label="이전 페이지">‹</button>';
          for (var i = 1; i <= pages; i++) {
            h += '<button type="button" class="pg-btn' + (i === page ? ' is-on' : '') + '"'
               + ' data-go="' + i + '"' + (i === page ? ' aria-current="page"' : '')
               + ' aria-label="' + i + '쪽">' + i + '</button>';
          }
          h += '<button type="button" class="pg-btn" data-go="next"'
             + (page === pages ? ' disabled' : '') + ' aria-label="다음 페이지">›</button>';
          pager.innerHTML = h;
        };

        if (pager) {
          pager.addEventListener('click', function (e) {
            /* ⚠ e.target 으로 판정하지 않는다 — 숫자 글자를 눌러도 버튼이 잡히게
               closest 로 올라간다(§11.10 의 닫기 버튼과 같은 이유). */
            var b = e.target.closest ? e.target.closest('[data-go]') : null;
            if (!b || b.disabled) return;
            var g = b.dataset.go;
            var pages = pagesOf(live().length);
            page = g === 'prev' ? page - 1 : g === 'next' ? page + 1 : parseInt(g, 10);
            page = Math.min(Math.max(1, page), pages);
            draw();
            /* 쪽을 넘기면 목록 맨 위로 돌아간다 — 아래쪽 페이저를 누른 뒤
               그 자리에 남으면 바뀐 첫 항목을 못 본다.
               위를 덮는 GNB·LNB 만큼은 CSS 의 scroll-margin-top 이 비켜 준다. */
            if (box.scrollIntoView) box.scrollIntoView({ block: 'start' });
          });
        }

        /* filter.js 가 분류를 바꾸면 1쪽으로 되돌린다. 3쪽을 보던 중 분류를 좁히면
           그 분류에는 3쪽이 없을 수 있다. */
        box.addEventListener('bcity:filtered', function () { page = 1; draw(); });

        draw();
      });
    })();

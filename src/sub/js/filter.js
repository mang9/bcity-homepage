    /* 분류 필터 — 갤러리(행사·현장·조감도·기타)와 발행물(카달로그·IM·브로슈어·리포트)이
       같은 코드를 쓴다. 걸러 낸 카드에 **data-off** 를 세우고 보이기는 CSS 가 정한다
       (`page-pr.css` 의 `[data-off] { display: none }`).
       ⚠⚠ **hidden 을 쓰지 않는다.** hidden 은 pager.js 가 쪽을 나누는 데 쓰는 속성이라,
         여기서도 쓰면 두 스크립트가 서로를 덮어 "분류를 고르면 다른 분류로 돌아갈 수
         없다" 가 재현된다(§11.10 의 실제 사고와 같은 형태). 속성을 갈라 둔다.
       ⚠ style.display 를 직접 건드리지 말 것. data-off 로 display:none 이 되면
         접근성 트리에서도 빠지므로 스크린리더가 감춰진 카드를 읽지 않는다. */
    (function () {
      var btns = [].slice.call(document.querySelectorAll('.pr-filter'));
      if (!btns.length) return;
      /* ⚠ 반드시 목록 컨테이너 안으로 한정한다. 예전에는 `[data-cat]` 전역이었는데
         **분류 탭 자신도 data-cat 을 들고 있어서** 탭을 고르면 나머지 탭이 함께
         hidden 이 됐다 — 한 번 고르면 다른 분류로 갈 수 없었다(2026-08-10 신고). */
      var cards = [].slice.call(
        document.querySelectorAll('.pr-cards [data-cat], .pub-list [data-cat]'));
      var live = document.getElementById('filterCount');
      /* 이 카드들이 속한 페이저 컨테이너 — 중복 없이 한 번만 모아 둔다. */
      var boxes = cards.reduce(function (acc, c) {
        var box = c.closest && c.closest('.pg');
        if (box && acc.indexOf(box) === -1) acc.push(box);
        return acc;
      }, []);

      var apply = function (cat) {
        var n = 0;
        cards.forEach(function (c) {
          var on = cat === 'all' || c.dataset.cat === cat;
          if (on) { c.removeAttribute('data-off'); n++; }
          else c.setAttribute('data-off', '1');
        });
        /* 쪽 나누기를 다시 계산하게 알린다. 페이저가 없는 목록이면 듣는 쪽이 없어
           아무 일도 일어나지 않는다. */
        boxes.forEach(function (box) {
          box.dispatchEvent(new CustomEvent('bcity:filtered'));
        });
        btns.forEach(function (b) {
          var on = b.dataset.cat === cat;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (live) live.textContent = n + '건 표시 중';
      };

      btns.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.dataset.cat); });
      });
    })();

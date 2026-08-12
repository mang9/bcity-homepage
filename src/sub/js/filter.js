    /* 분류 필터 — 갤러리(행사·현장·조감도·기타)와 발행물(카달로그·IM·브로슈어·리포트)이
       같은 코드를 쓴다. 카드에 hidden 을 세우고 보이기는 CSS 가 정한다.
       ⚠ style.display 를 직접 건드리지 말 것. hidden 은 접근성 트리에서도 빠지므로
         스크린리더가 감춰진 카드를 읽지 않는다. */
    (function () {
      var btns = [].slice.call(document.querySelectorAll('.pr-filter'));
      if (!btns.length) return;
      /* ⚠ 반드시 목록 컨테이너 안으로 한정한다. 예전에는 `[data-cat]` 전역이었는데
         **분류 탭 자신도 data-cat 을 들고 있어서** 탭을 고르면 나머지 탭이 함께
         hidden 이 됐다 — 한 번 고르면 다른 분류로 갈 수 없었다(2026-08-10 신고). */
      var cards = [].slice.call(
        document.querySelectorAll('.pr-cards [data-cat], .pub-list [data-cat]'));
      var live = document.getElementById('filterCount');

      var apply = function (cat) {
        var n = 0;
        cards.forEach(function (c) {
          var on = cat === 'all' || c.dataset.cat === cat;
          c.hidden = !on;
          if (on) n++;
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

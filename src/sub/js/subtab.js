    /* 서브탭 — 현재 보이는 섹션에 활성 표시를 맞춘다.
       스크롤 이동 자체는 앵커 + html{scroll-behavior:smooth} 가 처리하므로
       여기서는 클릭을 가로채지 않는다(주소창 해시가 남아 새로고침·공유가 그대로 동작한다). */
    (function () {
      var tabs = [].slice.call(document.querySelectorAll('.subtab a'));
      if (!tabs.length) return;

      var targets = tabs.map(function (a) {
        return document.getElementById(a.getAttribute('href').slice(1));
      });
      if (targets.some(function (t) { return !t; })) return;

      var setOn = function (i) {
        tabs.forEach(function (a, n) {
          var on = n === i;
          a.classList.toggle('is-on', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };

      if (!('IntersectionObserver' in window)) return;

      /* 뷰포트 상단 1/3 지점을 지나는 섹션을 '현재'로 본다.
         rootMargin 하단을 크게 깎아 두 섹션이 동시에 걸리는 구간을 없앤다. */
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          setOn(targets.indexOf(e.target));
        });
      }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

      targets.forEach(function (t) { io.observe(t); });
    })();
